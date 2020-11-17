import { toPng } from 'html-to-image';

interface ScreenshotContext {
  title: string;
  stylesheets: string[];
  content: string;
  targetSelector: string;
}

const replaceCDNOrigin = (raw: string) => {
  return raw
    .replace(/https:\/\/community\.cloudflare\.steamstatic\.com\//g, 'https://steamcommunity-a.akamaihd.net/')
    .replace(/https:\/\/cdn\.cloudflare\.steamstatic\.com\//g, 'https://steamcdn-a.akamaihd.net/');
};

export const takeScreenshot = async (_: any, context: ScreenshotContext) => {
  const container = document.createElement('div');
  const styles = document.createElement('div');
  styles.innerHTML = replaceCDNOrigin(context.stylesheets.join('\n'));
  container.appendChild(styles);

  const targetWrapper = document.createElement('div');
  targetWrapper.innerHTML = replaceCDNOrigin(context.content);

  container.appendChild(targetWrapper);
  const target = container.querySelector<HTMLElement>(context.targetSelector);

  if (!target) return '';

  await Promise.all(
    Array.from(container.querySelectorAll('link')).map(async (link) => {
      const res = await fetch(link.href);
      const cssText = await res.text();
      const style = document.createElement('style');
      style.innerHTML = replaceCDNOrigin(cssText);
      link.parentElement!.appendChild(style);
      link.remove();
    }),
  );

  document.body.appendChild(container);
  container.querySelectorAll('[data-screenshot-ignore]').forEach((elem) => {
    elem.remove();
  });

  await Promise.all(
    Array.from(container.querySelectorAll('img')).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        const timeout = setTimeout(resolve, 3000);
        img.addEventListener('load', () => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }),
  );

  const result = await toPng(target);
  container.remove();

  return result;
};
