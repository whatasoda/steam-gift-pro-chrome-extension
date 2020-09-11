import { Manifest } from './types/decls';
import { version } from '../package.json';

const JSONFile = <T>(cacheable: boolean, gen: () => Promise<T>) => async () => ({
  cacheable,
  code: JSON.stringify(await gen()),
});

const key = [
  // -----BEGIN PUBLIC KEY-----
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArAaRsTkyGgAicD8Z3nh2',
  'oX0kzAwNpO21vnGQfrcmbbFGvRvHxuEU5F2Su8/ar4FvdTkPxmesomSquyCTr10B',
  'tX19M4IJ58LKWA/V9/kSYBKLS1zXy7RFjAmWRavepQz1kH2soTGW+QXsRMIum4ku',
  'MgeAIkDFtveg4u+Iemrz97/5bhx7SkuxLJLIJqqHI5fAJjhfscg5/YbHj4h3QgBC',
  'shDdMdUDdTfWkKdP4oVRaKgS8/TJuh5fzFZs/0eh45LdGVB+GsVHu29fEQ4zf8rr',
  'ynWoUkY3v/6VxwMyebr2six0bE9hY3CKmowPB1KghRuPGO9GChtxQbiEPgMNcRMk',
  'gQIDAQAB',
  // -----END PUBLIC KEY-----
];

export = JSONFile<Manifest>(true, async () => ({
  key: key.join(''),
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
