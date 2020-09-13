import { escapeGameTitle } from '../escape-game-title';

describe('escapeGameTitle', () => {
  it('escapes game title like Steam does', () => {
    expect(escapeGameTitle('Ittle Dew 2+')).toBe('Ittle_Dew_2');
  });
});
