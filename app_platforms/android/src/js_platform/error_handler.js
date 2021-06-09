////Required code (needs to be set on each platform)

////Optional code (app works without it)
window.addEventListener("error", function(e) {window.setTimeout(function(){var msg = "ERROR: "; Object.keys(e).forEach(function(key){ if(typeof(e[key]) == "string" || typeof(e[key]) == "number") {msg += key + ": " + e[key] + " / ";}}); AnimationJSInterface.throwError(msg);});});