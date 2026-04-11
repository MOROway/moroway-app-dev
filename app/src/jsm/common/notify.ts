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
    hide(elem: HTMLElementNotify, stopFollowing: boolean): void;
    queue: NotificationObject[];
    active: boolean;
    show(elem: HTMLElementNotify): void;
    showTimeout?: number;
}

//NOTIFICATIONS
export function notify(selector: string, message: string, prio: NotificationPriority, timeout: number, actionHandler: () => void | null = null, actionText: string | null = null, minHeight: number = -1, channel: NotificationChannel = NotificationChannel.Default) {
    function sameChannelNo(elem: HTMLElementNotify, ch: NotificationChannel, pr: NotificationPriority): number | false {
        for (var i = elem.queue.length - 1; i >= 0; i--) {
            if (elem.queue[i].channel == ch && elem.queue[i].prio <= pr) {
                return i;
            }
        }
        return false;
    }
    const notificationContainer: HTMLElementNotify = document.querySelector(selector);
    if (notificationContainer == undefined || notificationContainer == null) {
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
        notificationContainer.show = function (elem) {
            elem.active = true;
            elem.style.visibility = "";
            elem.querySelector("button").style.display = "none";
            if (elem.queue.length > 0) {
                var obj = elem.queue[0];
                elem.querySelector("span").textContent = obj.message;
                elem.style.visibility = "visible";
                if (obj.actionHandler && obj.actionText) {
                    elem.querySelector("button").textContent = obj.actionText;
                    elem.querySelector("button").onclick = obj.actionHandler;
                    elem.querySelector("button").style.display = "";
                }
                elem.queue.shift();
                elem.showTimeout = window.setTimeout(function () {
                    delete elem.showTimeout;
                    elem.show(elem);
                }, obj.timeout);
            } else {
                elem.active = false;
            }
        };
    }
    if (notificationContainer.hide == undefined) {
        notificationContainer.hide = function (elem, stopFollowing) {
            elem.active = false;
            elem.style.visibility = "";
            if (elem.showTimeout !== undefined) {
                window.clearTimeout(elem.showTimeout);
                delete elem.showTimeout;
                if (!stopFollowing) {
                    elem.show(elem);
                }
            }
        };
    }
    if (prio > NotificationPriority.Low || (notificationContainer.queue.length == 0 && !notificationContainer.active)) {
        var obj: NotificationObject = {message: message, timeout: timeout, prio: prio, channel: channel, actionHandler: actionHandler, actionText: actionText};
        if (prio === NotificationPriority.High || minHeight == -1 || (minHeight >= notificationContainer.offsetHeight - 15 && getSetting("showNotifications"))) {
            var chNo = sameChannelNo(notificationContainer, channel, prio);
            if (channel != NotificationChannel.Default && chNo !== false) {
                notificationContainer.queue[chNo] = obj;
            } else {
                notificationContainer.queue.push(obj);
            }
            if (!notificationContainer.active) {
                notificationContainer.show(notificationContainer);
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
