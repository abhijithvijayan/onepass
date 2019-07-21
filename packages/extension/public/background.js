const jsLocation = 'static/js/bundle.js';

// use the React file as the content script, with the executeScript API.

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && jsLocation !== null) {
        chrome.tabs.executeScript(tabId, {
            file: jsLocation,
            runAt: 'document_end',
        });
    }
});
