import { createMessageHandler } from '../utils/message';
import { fetchBypass } from './api/fetch-bypass';

export const handleBackgroundMessage = createMessageHandler({
  'fetch-bypass': fetchBypass,
});
