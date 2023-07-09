import { handleBackgroundMessage } from '../background/handle-message';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (handleBackgroundMessage.isMessage(message)) {
    return handleBackgroundMessage(message, sender, sendResponse);
  } else {
    sendResponse(void 0);
    return null;
  }
});
