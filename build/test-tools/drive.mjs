// Drive the app in headless Chromium via the DevTools protocol with a list of steps.
// usage: node drive.mjs <devtools-port> <url> <shot-prefix> '<steps-json>'
// Steps (see README.md): wait, click, hold, holdshot, cmd, until, nav, reload, shot.
// Screenshots are written to <shot-prefix>-<name>.png. Closes the browser at the end.
import {writeFileSync} from "node:fs";

const [port, url, prefix, stepsJson] = process.argv.slice(2);
const steps = JSON.parse(stepsJson);
const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const pending = new Map();
const logs = [];
const lastDbg = [];
ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
        pending.get(m.id)(m);
        pending.delete(m.id);
    } else if (m.method === "Runtime.exceptionThrown") {
        logs.push("EXC " + JSON.stringify(m.params.exceptionDetails).slice(0, 600));
    } else if (m.method === "Runtime.consoleAPICalled" && m.params.type === "log" && String(m.params.args[0]?.value).startsWith("DBG")) {
        // temporary measurement logs added to the code start with "DBG"
        logs.push(m.params.args[0].value);
        lastDbg.push(m.params.args[0].value);
        if (lastDbg.length > 50) lastDbg.shift();
    } else if (m.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(m.params.type)) {
        logs.push(m.params.type + " " + m.params.args.map((a) => a.value ?? a.description).join(" ").slice(0, 600));
    }
});
const send = (method, params = {}) =>
    new Promise((r) => {
        pending.set(++id, r);
        ws.send(JSON.stringify({id, method, params}));
    });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const screenshot = async (name) => {
    const shot = await send("Page.captureScreenshot", {format: "png"});
    writeFileSync(`${prefix}-${name}.png`, Buffer.from(shot.result.data, "base64"));
};
const mouse = (type, x, y) => send("Input.dispatchMouseEvent", {type, x, y, button: "left", clickCount: 1});
const middle = (type, x, y, buttons) =>
    send("Input.dispatchMouseEvent", {type, x, y, button: "middle", buttons, clickCount: 1});
const key = (k, code, keyCode) =>
    Promise.all([
        send("Input.dispatchKeyEvent", {type: "keyDown", key: k, code, windowsVirtualKeyCode: keyCode, text: k === "Enter" ? "\r" : k}),
        send("Input.dispatchKeyEvent", {type: "keyUp", key: k, code, windowsVirtualKeyCode: keyCode})
    ]);

await send("Runtime.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {width: 1600, height: 800, deviceScaleFactor: 1, mobile: false});
await send("Page.navigate", {url});
for (const [op, ...a] of steps) {
    if (op === "wait") {
        await sleep(a[0]);
    } else if (op === "click" || op === "hold") {
        const [x, y, ms] = [a[0], a[1], op === "hold" ? a[2] : 50];
        await mouse("mouseMoved", x, y);
        await mouse("mousePressed", x, y);
        await sleep(ms);
        await mouse("mouseReleased", x, y);
    } else if (op === "holdshot") {
        // press, wait, screenshot while held (shows all switches), release
        const [x, y, ms, name] = a;
        await mouse("mouseMoved", x, y);
        await mouse("mousePressed", x, y);
        await sleep(ms);
        await screenshot(name);
        await mouse("mouseReleased", x, y);
    } else if (op === "cmd") {
        // open the text control with "/", type a command, press Enter, log the output
        await key("/", "Slash", 191);
        await sleep(300);
        await send("Runtime.evaluate", {expression: 'document.querySelector("#text-control-input input").value=""'});
        await send("Input.insertText", {text: a[0]});
        await key("Enter", "Enter", 13);
        await sleep(300);
        const out = await send("Runtime.evaluate", {expression: 'document.querySelector("#text-control-output").textContent', returnByValue: true});
        logs.push(`cmd "${a[0]}" -> ${out.result.result.value}`);
    } else if (op === "until") {
        // wait until a DBG log line matches the regex, or the timeout (ms) passes
        const re = new RegExp(a[0]);
        const t0 = Date.now();
        let hit = false;
        while (Date.now() - t0 < a[1]) {
            if (lastDbg.some((l) => re.test(l))) {
                hit = true;
                break;
            }
            await sleep(20);
        }
        logs.push(`until ${a[0]} -> ${hit ? "hit" : "TIMEOUT"} after ${Date.now() - t0} ms`);
        lastDbg.length = 0;
    } else if (op === "nav") {
        logs.push("--- nav " + a[0] + " ---");
        await send("Page.navigate", {url: a[0]});
    } else if (op === "reload") {
        logs.push("--- reload ---");
        await send("Page.reload", {ignoreCache: false});
    } else if (op === "middrag") {
        // drag with the middle button held (tilts the 3D view): from x, y by dx, dy in n steps
        const [x, y, dx, dy, n] = a;
        await mouse("mouseMoved", x, y);
        await middle("mousePressed", x, y, 4);
        for (let k = 1; k <= n; k++) {
            await middle("mouseMoved", x + (dx * k) / n, y + (dy * k) / n, 4);
            await sleep(30);
        }
        await middle("mouseReleased", x + dx, y + dy, 0);
    } else if (op === "eval") {
        // evaluate an expression in the page (awaits promises), log the result
        const options = {expression: a[0], awaitPromise: true, returnByValue: true};
        const out = await send("Runtime.evaluate", options);
        logs.push(`eval -> ${JSON.stringify(out.result.result.value)}`);
    } else if (op === "shot") {
        await screenshot(a[0]);
    }
}
console.log(logs.length ? logs.join("\n") : "no page errors");
ws.send(JSON.stringify({id: ++id, method: "Browser.close"}));
await sleep(300);
ws.close();
