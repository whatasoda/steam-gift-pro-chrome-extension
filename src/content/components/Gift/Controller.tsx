import React, { useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SteamButton } from '../Button';
import { THUMBNAIL_SELECTOR } from './Observer';

export const Controller = ({ id, container, title, link }: GiftItem) => {
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

  const onStorePageOpen = () => window.open(link, '_blank');

  const children = (
    <div style={{ position: 'absolute', top: '0', left: '0', width: '190px' }}>
      <SteamButton text="ストアページ" onClick={onStorePageOpen} />
      <SteamButton
        text="サムネ保存"
        download={{ name: `${title}.jpg`, url: `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg` }}
      />
    </div>
  );

  return createPortal(children, portalContainer);
};
