const concurrently = require('concurrently');

concurrently([{ name: 'ext', command: 'npm run dev:ext', prefixColor: 'cyan' }]);
