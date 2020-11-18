import { sendBackgroundMessage } from '../utils/send-message';

export const takeScreenshot = (target: HTMLElement, targetSelector: string) => {
  const stylesheets = Array.from(document.styleSheets).map(({ ownerNode }) => {
    return (ownerNode as HTMLElement).outerHTML;
  });
  Array.from(target.querySelectorAll('script')).forEach((script) => {
    script.remove();
  });

  let content = target.outerHTML;
  let parent = target.parentElement;
  while (parent && parent !== document.documentElement) {
    const attributes = Array.from(parent.attributes).map((node) => {
      return `${node.name}="${node.textContent}"`;
    });
    const tagName = parent === document.body ? 'div' : parent.tagName.toLowerCase();
    content = `<${tagName} ${attributes.join(' ')}>${content}</${tagName}>`;
    parent = parent.parentElement;
  }

  return sendBackgroundMessage('takeScreenshot', {
    content,
    stylesheets,
    targetSelector,
  });
};

export const openDownload = (dataUrl: string, title: string, ext?: string) => {
  const downloader = document.createElement('a');
  downloader.href = dataUrl;
  downloader.download = ext ? `${title}.${ext}` : title;
  downloader.click();
};
