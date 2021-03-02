// ==UserScript==
// @name         youtube_livechat_emitter
// @namespace    https://github.com/kenjiuno/YoutubeLiveChatHelper
// @version      0.4
// @description  try to take over the world!
// @author       kenjiuno
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// ==/UserScript==

// document.addEventListener("livechat", (e) => console.info(e.data));

// e.data.timestamp : "8:38 AM", "1:59:48"
// e.data.message : "text :emoji: :_memberEmoji:"
// e.data.authorName : "handleName"
// e.data.authorType : "", "member", "moderator"

function messageToText(message) {
    let text = "";
    if (message) {
        let element = message.firstChild;
        while (element) {
            if (element.nodeType === 3) {
                text += element.textContent;
            }
            else if (element.nodeType === 1 && element.tagName === "IMG") {
                const sharedTooltipText = element.getAttribute("shared-tooltip-text");
                if (sharedTooltipText) {
                    text += sharedTooltipText;
                }
            }
            element = element.nextSibling;
        }
    }
    return text;
}

function isInstalled() {
    return (typeof window.youtubeLiveChatEmitter) === "object" && window.youtubeLiveChatEmitter.installed === true;
}

function hookNow() {
    if (isInstalled()) {
        return;
    }
    const chatframe = document.getElementById("chatframe");
    if (chatframe) {
        const target = chatframe.contentDocument.querySelector("div#items.yt-live-chat-item-list-renderer");
        if (target) {
            console.info("YouTube live chat hook has been installed.");
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.tagName === "YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER") {
                            const authorType = node.getAttribute("author-type");
                            const authorName = node.querySelector("span#author-name");
                            const timestamp = node.querySelector("span#timestamp");
                            const message = node.querySelector("span#message");
                            if (authorName && timestamp && message) {
                                //console.info(timestamp.textContent, message.textContent, authorName.textContent, authorType);
                                const evt = new Event("livechat", { "bubbles": false, "cancelable": false });
                                evt.data = {
                                    timestamp: timestamp.textContent,
                                    message: messageToText(message),
                                    authorName: authorName.textContent,
                                    authorType: authorType,
                                };
                                document.dispatchEvent(evt);
                            }
                        }
                    });
                });
            });
            const config = { childList: true, };
            observer.observe(target, config);
            window.youtubeLiveChatEmitter = { installed: true };
            return;
        }
    }
    setTimeout(hookNow, 1000);
}

(function () {
    'use strict';

    hookNow();
})();