import { SEARCH_URL } from './utils/constants';

export const handleBackgroundMessage = (message: BackgroundMessage, sendResponse: (value: any) => void) => {
  switch (message.type) {
    case 'steam-search': {
      fetch(`${SEARCH_URL}?term=${message.gameTitle}`, { mode: 'cors' }).then(async (res) => {
        sendResponse(await res.text());
      });
      return true;
    }
    default:
      return null;
  }
};
