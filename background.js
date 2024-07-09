chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

class CommentGroup {
    constructor(comments) {
        this.comments = comments;
        this.text = comments.map(c => c.commentSpan.innerText).join('\n');
    }

    applyTranslation(translatedText) {
        const translatedLines = translatedText.split('\n');
        this.comments.forEach((comment, index) => {
            comment.commentSpan.innerText = translatedLines[index] || '';
        });
    }
}

async function addCommentData() {
    async function postData(url = "", data = {}) {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        });
        return response.json();
    }


    const codeLines = document.querySelectorAll('.react-code-text.react-code-line-contents-no-virtualization');
    let commentGroups = [];
    let currentGroup = [];
    let lastLineNumber = -1;

    codeLines.forEach(line => {
        const lineNumber = parseInt(line.id.substring(2)); // "LC1" -> 1
        const commentSpan = line.querySelector('span.pl-c');
        if (commentSpan) {
            if (lineNumber !== lastLineNumber + 1) {
                if (currentGroup.length > 0) {
                    commentGroups.push(new CommentGroup(currentGroup));
                    currentGroup = [];
                }
            }
            currentGroup.push({ line, commentSpan });
            lastLineNumber = lineNumber;
        } else if (currentGroup.length > 0) {
            commentGroups.push(new CommentGroup(currentGroup));
            currentGroup = [];
            lastLineNumber = -1;
        }
    });

    if (currentGroup.length > 0) {
        commentGroups.push(new CommentGroup(currentGroup));
    }

    console.log("commemtGroups = ", commentGroups);
    for (let group of commentGroups) {
        try {
            console.log("group = ", group);
            // let translatedCommentJson = await postData("http://localhost:8080/translate/", { "text": group.text });
            // group.applyTranslation(translatedCommentJson["translatedComment"]);
        } catch (error) {
            console.error("Translation error:", error);
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