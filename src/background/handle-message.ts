import { createMessageHandler } from '../lib/message';
import { fetchBypass } from './api/fetch-bypass';

export const handleBackgroundMessage = createMessageHandler({
  'fetch-bypass': fetchBypass,
});
