const concurrently = require('concurrently');

concurrently([
  { name: 'ext', command: 'npm run dev:ext', prefixColor: 'cyan' },
  { name: 'app', command: 'npm run dev:app', prefixColor: 'green' },
]);
