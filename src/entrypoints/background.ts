import { handleBackgroundMessage } from '../message-handlers';

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (!message || typeof message !== 'object') return null;
  return handleBackgroundMessage(message, sendResponse);
});
