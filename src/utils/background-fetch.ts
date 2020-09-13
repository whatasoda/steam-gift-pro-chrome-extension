export const sendSteamSearchMessage = (gameTitle: string) => {
  return sendBackgroundMessage({ type: 'steam-search', gameTitle });
};

const sendBackgroundMessage = (message: BackgroundMessage) => {
  return new Promise<string>((resolve, reject) => {
    chrome.runtime.sendMessage(message, (res) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(res);
      }
    });
  });
};
