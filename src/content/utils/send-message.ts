import type { handleBackgroundMessage } from '../../background/handle-message';
import { MessageSender } from '../../utils/message';

export const sendBackgroundMessage: MessageSender<typeof handleBackgroundMessage.handlers> = (type, ...payload) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type, payload }, (res) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(res);
      }
    });
  });
};
