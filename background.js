chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

function addCommentData() {
    const lines = document.querySelectorAll('span.pl-c');
    if (lines) {
        const data = {};
        for (let line of lines) {
            const dataCodeText = line.getAttribute('data-code-text');
            const parent = line.parentElement;
            const parentId = parent ? parent.getAttribute('id') : null;
            data[`${parentId}`] = `${dataCodeText}`
        }
        for (let id in data) {
            let p = document.createElement('p');
            p.textContent = data[id];
            let el = document.querySelector(`#${id}`);
            el.appendChild(p);
        }
    }
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
            // 구현중...
            // chrome.scripting.executeScript({
            //     target: { tabId: tab.id },
            //     func: deleteCommentData,
            // });
        }
    }
});
