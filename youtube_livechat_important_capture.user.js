// ==UserScript==
// @name         youtube_livechat_important_capture
// @namespace    https://github.com/kenjiuno/YoutubeLiveChatHelper
// @version      0.1
// @description  try to take over the world!
// @author       kenjiuno
// @match        https://www.youtube.com/watch?v=*
// @match        https://studio.youtube.com/video/*/livestreaming
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

(function () {
    'use strict';

    const app = "youtubeLiveChatImportantCapture";

    function isInstalled() {
        return (typeof window[app]) === "object" && window[app].installed === true;
    }

    if (isInstalled()) {
        return;
    }

    const lines = [];

    function report() {
        alert(lines.join("\n"));
    }

    let reportMenuId = undefined;
    function updateMenu() {
        if (reportMenuId !== undefined) {
            GM_unregisterMenuCommand(reportMenuId);
        }

        reportMenuId = GM_registerMenuCommand(`Report (${lines.length} messages)`, report);
    }

    document.addEventListener("livechat", e => {
        const { data } = e;
        if (data && data.authorType === "moderator") {
            const line = `${data.timestamp} 【${data.authorName}🔧】 ${data.message}`;
            lines.unshift(line);
            updateMenu();
        }
    });

    updateMenu();

    window[app] = { installed: true };
})();
