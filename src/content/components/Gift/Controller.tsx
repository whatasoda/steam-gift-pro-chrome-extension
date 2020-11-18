import React, { useMemo, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { openDownload, takeScreenshot } from '../../../apis/screenshot';
import { SteamButton } from '../../../fragments/Button';
import { THUMBNAIL_SELECTOR } from './Observer';

export const Controller = ({ container, title, link }: GiftItem) => {
  const [SSS, setSSS] = useState({ loading: false, canceled: false });
  const SSSRef = useRef(SSS);
  SSSRef.current = SSS;

  const portalContainer = useMemo(() => document.createElement('div'), []);
  useEffect(() => {
    portalContainer.style.position = 'absolute';
    portalContainer.style.top = '0';
    portalContainer.style.right = '-30px';
    container.style.position = 'relative';
    container.appendChild(portalContainer);
    const thumbnail = container.querySelector<HTMLHeadingElement>(THUMBNAIL_SELECTOR);
    if (thumbnail) {
      thumbnail.style.cursor = 'pointer';
      thumbnail.addEventListener('click', onStorePageOpen);
    }
  }, []);

  const onScreenshotStart = async () => {
    setSSS({ canceled: false, loading: true });
    portalContainer.setAttribute('data-screenshot-ignore', 'true');
    const thumbnail = container.querySelector<HTMLImageElement>(THUMBNAIL_SELECTOR);
    if (thumbnail) {
      thumbnail.src = thumbnail.src.replace(/(?<=\d+x\d+)(?<!\.jpg)$/, '.jpg');
    }
    const dataUrl = await takeScreenshot(container, '.pending_gift');

    await new Promise((resolve) => setTimeout(resolve, 200));

    if (SSSRef.current.canceled) return;
    openDownload(dataUrl, title, 'png');
    setSSS({ canceled: false, loading: false });
  };

  const onScreenshotCancel = () => {
    setSSS({ canceled: true, loading: false });
  };

  const onStorePageOpen = () => window.open(link, '_blank');

  const children = (
    <div style={{ position: 'absolute', top: '0', left: '0', width: '190px' }}>
      <SteamButton text="ストアページ" onClick={onStorePageOpen} />
      {SSS.loading ? (
        <SteamButton text="キャンセル" onClick={onScreenshotCancel} />
      ) : (
        <SteamButton text="スクリーンショット" onClick={onScreenshotStart} />
      )}
    </div>
  );

  return createPortal(children, portalContainer);
};
