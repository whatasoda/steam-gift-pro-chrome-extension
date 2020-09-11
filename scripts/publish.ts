/* eslint-disable no-console */
import { publish } from 'gh-pages';
import archiver from 'archiver';
import path from 'path';
import { createWriteStream } from 'fs';
import mkdirp from 'mkdirp';
import { version } from '../package.json';

export const main = async (source: string, dist: string) => {
  mkdirp.sync(dist);
  const output = createWriteStream(path.resolve(dist, `v${version}.zip`));
  const archive = archiver('zip');
  archive.pipe(output);
  archive.directory(source, false);

  archive.on('warning', (err) => console.warn(err));
  archive.on('error', (err) => {
    throw err;
  });

  await new Promise((resolve) => {
    output.on('close', () => {
      console.log(`${archive.pointer()} total bytes`);
      console.log('archiver has been finalized and the output file descriptor has closed.');
      resolve();
    });
    archive.finalize();
  });

  publish(dist, { branch: 'archives', add: true }, (err) => {
    if (err) console.error(err);
    else console.log('Published');
  });
};

if (require.main === module) {
  main(path.resolve(__dirname, '../dist'), path.resolve(__dirname, '../zip'));
}
