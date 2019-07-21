// Sample placeholders
const jsLocation = 'static/js/bundle.js';
const cssLocation = null;

// use the React file as the content script, with the executeScript API.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        if (jsLocation !== null) {
            chrome.tabs.executeScript(tabId, {
                file: jsLocation,
                runAt: 'document_end',
            });
        }

        if (cssLocation !== null) {
            chrome.tabs.executeScript(tabId, {
                file: cssLocation,
                runAt: 'document_end',
            });
        }
    }
});
