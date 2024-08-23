// ==UserScript==
// @name         youtube_livechat_router
// @namespace    https://github.com/kenjiuno/YoutubeLiveChatHelper
// @version      0.7
// @description  try to take over the world!
// @author       kenjiuno
// @match        https://www.youtube.com/watch?v=*
// @match        https://studio.youtube.com/video/*/livestreaming
// @match        https://www.youtube.com/live/*
// @grant        none
// ==/UserScript==

const app = "youtubeLiveChatRouter";

function isInstalled() {
    return (typeof window[app]) === "object" && window[app].installed === true;
}

(function () {
    'use strict';

    // See: https://stackoverflow.com/a/12034334

    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
        });
    }

    document.addEventListener("livechat", e => {
        if (e.data && e.data.authorType === "moderator") {
            const message = [
                `<span style="color:#999;">[${escapeHtml(e.data.timestamp)}]</span>`,
                `<span style="">${(e.data.getHtml())}</span>`,
                `<span style="color:#999;">@${escapeHtml(e.data.authorName)}</span>`,
            ].join(" ");

            const evt = new Event("toaster", { "bubbles": false, "cancelable": false });
            evt.data = { message, isHTML: true };
            document.dispatchEvent(evt);
        }
    });

    window[app] = { installed: true };
})();