import { createMessageHandler } from '../utils/message';
import { fetchBypass } from './api/fetch-bypass';
import * as games from './api/games';

export const handleBackgroundMessage = createMessageHandler({
  'fetch-bypass': fetchBypass,
  ...games,
});
