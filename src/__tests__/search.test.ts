import { handleBackgroundMessage } from '../message-handlers';

jest.mock('../utils/background-fetch', () => ({
  sendSteamSearchMessage: (gameTitle: string) => {
    return new Promise((resolve) => {
      handleBackgroundMessage({ type: 'steam-search', gameTitle }, resolve);
    });
  },
}));

import { steamSearch } from '../search';

describe('steamSearch', () => {
  it('succeeds without error', async () => {
    // eslint-disable-next-line no-console
    console.log(await steamSearch('Ittle Dew 2+'));
  });
});
