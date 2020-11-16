import { toPng } from 'html-to-image';

interface ScreenshotContext {
  title: string;
  stylesheets: string[];
  content: string;
  targetSelector: string;
}

export const takeScreenshot = async (_: any, context: ScreenshotContext) => {
  const container = document.createElement('div');
  const styles = document.createElement('div');
  styles.innerHTML = context.stylesheets.join('\n');
  container.appendChild(styles);

  const targetWrapper = document.createElement('div');
  targetWrapper.innerHTML = context.content;

  container.appendChild(targetWrapper);
  const target = container.querySelector<HTMLElement>(context.targetSelector);

  if (!target) return '';

  document.body.appendChild(container);
  container.querySelectorAll('[data-screenshot-ignore]').forEach((elem) => {
    elem.remove();
  });
  const result = await new Promise<string>((resolve, reject) => {
    setTimeout(() => toPng(target).then(resolve).catch(reject), 100);
  });

  container.remove();
  return result;
};
