import { toPng } from 'html-to-image';

export const takeScreenshot = (target: HTMLElement, title: string) => {
  prepare().then(() => {
    toPng(target).then((dataUrl) => {
      const downloader = document.createElement('a');
      downloader.href = dataUrl;
      downloader.download = title;
      downloader.click();
    });
  });
};

let isPrepared = false;
const prepare = async () => {
  if (isPrepared) return Promise.resolve();

  isPrepared = true;
  const pseudoStyleSheetsPromises = Array.from(document.styleSheets).map(async (styleSheet) => {
    if (styleSheet.href) {
      const res = await fetch(styleSheet.href);
      const style = document.createElement('style');
      style.innerHTML = await res.text();
      return style.sheet!;
    } else {
      styleSheet;
    }
  });

  Object.defineProperty(document, 'styleSheets', { value: Promise.all(pseudoStyleSheetsPromises) });
};
