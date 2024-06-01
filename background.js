chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});


async function addCommentData() {
    // POST 메서드 구현 예제
    async function postData(url = "", data = {}) {
        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE 등
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
        });
        return response.json(); // JSON 응답을 네이티브 JavaScript 객체로 파싱
    }

    const lines = document.querySelectorAll('span.pl-c');
    if (lines) {
        for (let line of lines) {
            // todo: 한줄 한줄 번역하니깐 느림. 파싱이 필요해 보임
            let translatedCommentJson = await postData("http://localhost:8080/translate/", { text: `${line.innerText}` });
            line.innerHTML = translatedCommentJson["translatedComment"];
            // line.setAttribute('data-code-text', "test!!!");
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
