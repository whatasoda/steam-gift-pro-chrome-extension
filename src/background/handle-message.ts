import { createMessageHandler } from '../utils/message';
import { fetchBypass } from './api/fetch-bypass';
import { takeScreenshot } from './api/screenshot';
import * as games from './api/games';

export const handleBackgroundMessage = createMessageHandler({
  'fetch-bypass': fetchBypass,
  takeScreenshot,
  ...games,
});
