import { handleBackgroundMessage } from '../../background/handle-message';
import { SEARCH_URL } from '../../utils/constants';

jest.mock('../utils/background-fetch', () => ({
  sendSteamSearchMessage: (gameTitle: string) => {
    return new Promise((resolve) => {
      handleBackgroundMessage(
        { type: 'fetch-bypass', payload: [SEARCH_URL, `?term=${encodeURIComponent(gameTitle)}`] },
        {},
        resolve,
      );
    });
  },
}));

import { searchSteamStore } from '../search-steam-store';

describe('steamSearch', () => {
  it('succeeds without error', async () => {
    // eslint-disable-next-line no-console
    console.log(await searchSteamStore('Ittle Dew 2+'));
  });
});
