import React, { useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SteamButton } from '../Button';
import { THUMBNAIL_SELECTOR } from './Observer';

export const Controller = ({ container, title, link }: GiftItem) => {
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

  const onStorePageOpen = useCallback(() => {
    window.open(link, '_blank');
  }, [link]);

  const onDownloadThumbnail = useCallback(async () => {
    const [, appId] = link.match(/\/app\/(\d+)\//) ?? [];
    const res = await fetch(`https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`);
    const blob = await res.blob();
    const downloader = document.createElement('a');
    downloader.href = URL.createObjectURL(blob);
    downloader.download = `${title}.jpg`;
    downloader.click();
  }, [link]);

  const children = (
    <div style={{ position: 'absolute', top: '0', left: '0', width: '190px' }}>
      <SteamButton text="ストアページ" onClick={onStorePageOpen} />
      <SteamButton text="サムネ保存" onClick={onDownloadThumbnail} />
    </div>
  );

  return createPortal(children, portalContainer);
};
