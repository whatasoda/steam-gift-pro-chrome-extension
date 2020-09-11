import { Manifest } from './types/decls';
import { version } from '../package.json';

const JSONFile = <T>(cacheable: boolean, gen: () => Promise<T>) => async () => ({
  cacheable,
  code: JSON.stringify(await gen()),
});

export = JSONFile<Manifest>(true, async () => ({
  // key: '',
  manifest_version: 2,
  version,
  name: 'Steam Gift Pro',
  description: 'A Chrome Extension that enhance thumbnails on Steam Gift Page, to add anchor link to store page',
  author: 'whatasoda <git@whatasoda.me>',
  content_scripts: [
    {
      matches: ['https://store.steampowered.com/*', 'https://steamcommunity.com/*'],
      js: ['content.js'],
    },
  ],
}));
