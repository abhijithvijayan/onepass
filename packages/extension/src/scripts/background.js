/* eslint-disable no-console */
import browser from 'webextension-polyfill';

browser.runtime.onInstalled.addListener(() => {
    console.log('onInstalled....');
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Do something with the message!
    alert(request.greeting);

    // And respond back to the sender.
    sendResponse('got your message, thanks!');
});
