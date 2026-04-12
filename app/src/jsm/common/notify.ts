"use strict";
import { APP_DATA } from "./app_data.js";
import { getSetting } from "./settings.js";

interface NotificationObject {
    message: string;
    timeout: number;
    prio: NotificationPriority;
    channel: NotificationChannel;
    actionHandler?(): void;
    actionText?: string;
}

export interface HTMLElementNotify extends HTMLElement {
    hide(stopFollowing: boolean): void;
    queue: NotificationObject[];
    active: boolean;
    show(): void;
    showTimeout?: number;
}

//NOTIFICATIONS
export function notify(selector: string, message: string, prio: NotificationPriority, timeout: number, actionHandler: (() => void) | null = null, actionText: string | null = null, minHeight: number = -1, channel: NotificationChannel = NotificationChannel.Default) {
    function sameChannelNo(ch: NotificationChannel, pr: NotificationPriority): number | false {
        for (var i = notificationContainer.queue.length - 1; i >= 0; i--) {
            if (notificationContainer.queue[i].channel == ch && notificationContainer.queue[i].prio <= pr) {
                return i;
            }
        }
        return false;
    }
    const notificationContainer: HTMLElementNotify | null = document.querySelector(selector);
    if (!notificationContainer) {
        return false;
    }
    if (prio == undefined || prio == null) {
        prio = NotificationPriority.Default;
    }
    if (channel == undefined || channel == null) {
        channel = NotificationChannel.Default;
    }
    if (notificationContainer.queue == undefined) {
        notificationContainer.queue = [];
    }
    if (notificationContainer.active == undefined) {
        notificationContainer.active = false;
    }
    if (notificationContainer.show == undefined) {
        notificationContainer.show = function () {
            notificationContainer.active = true;
            notificationContainer.style.visibility = "";
            const button = notificationContainer.querySelector("button");
            if (button) {
                button.style.display = "none";
            }
            if (notificationContainer.queue.length > 0) {
                var obj = notificationContainer.queue[0];
                const text = notificationContainer.querySelector("span");
                if (text) {
                    text.textContent = obj.message;
                }
                notificationContainer.style.visibility = "visible";
                if (obj.actionHandler && obj.actionText && button) {
                    button.textContent = obj.actionText;
                    button.onclick = obj.actionHandler;
                    button.style.display = "";
                }
                notificationContainer.queue.shift();
                notificationContainer.showTimeout = window.setTimeout(function () {
                    delete notificationContainer.showTimeout;
                    notificationContainer.show();
                }, obj.timeout);
            } else {
                notificationContainer.active = false;
            }
        };
    }
    if (notificationContainer.hide == undefined) {
        notificationContainer.hide = function (stopFollowing) {
            notificationContainer.active = false;
            notificationContainer.style.visibility = "";
            if (notificationContainer.showTimeout !== undefined) {
                window.clearTimeout(notificationContainer.showTimeout);
                delete notificationContainer.showTimeout;
                if (!stopFollowing) {
                    notificationContainer.show();
                }
            }
        };
    }
    if (prio > NotificationPriority.Low || (notificationContainer.queue.length == 0 && !notificationContainer.active)) {
        var obj: NotificationObject = actionHandler && actionText ? {message: message, timeout: timeout, prio: prio, channel: channel, actionHandler: actionHandler, actionText: actionText} : {message: message, timeout: timeout, prio: prio, channel: channel};
        if (prio === NotificationPriority.High || minHeight == -1 || (minHeight >= notificationContainer.offsetHeight - 15 && getSetting("showNotifications"))) {
            var chNo = sameChannelNo(channel, prio);
            if (channel != NotificationChannel.Default && chNo !== false) {
                notificationContainer.queue[chNo] = obj;
            } else {
                notificationContainer.queue.push(obj);
            }
            if (!notificationContainer.active) {
                notificationContainer.show();
            }
        } else if (APP_DATA.debug) {
            console.debug(message);
        }
    }
}

export enum NotificationPriority {
    Low,
    Default,
    High
}

export enum NotificationChannel {
    Default,
    TrainSwitches,
    ClassicUiTrainSwitch,
    MultiplayerChat,
    Camera3D
}
