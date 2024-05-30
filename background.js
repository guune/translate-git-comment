chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

function addCommentData() {
    const lines = document.querySelectorAll('span.pl-c');
    if (lines) {
        for (let line of lines) {
            // let originalComment = line.getAttribute('data-code-text');
            // let translatedComment = 이걸 구현해야함
            // line.setAttribute('data-code-text', translatedComment);
            line.setAttribute('data-code-text', "test!!!");
        }
    }
}

function reloadPage() {
    window.location.reload(true);
}

const github = 'https://github.com/';
chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith(github)) {
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        const nextState = prevState === 'ON' ? 'OFF' : 'ON';

        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState
        });

        if (nextState === 'ON') {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: addCommentData,
            });
        } else if (nextState === 'OFF') {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: reloadPage,
            });
        }
    }
});
