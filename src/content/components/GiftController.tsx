import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { takeScreenshot } from '../screenshot';
import { searchSteamStore } from '../search-steam-store';

export const GiftController = ({ container, title }: GiftItem) => {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const portalContainer = useMemo(() => document.createElement('div'), []);
  useEffect(() => {
    portalContainer.style.position = 'absolute';
    portalContainer.style.top = '0';
    portalContainer.style.right = '-30px';
    container.style.position = 'relative';
    container.appendChild(portalContainer);
  }, []);

  const onScreenshot = async () => {
    portalContainer.style.display = 'none';
    await takeScreenshot(container, title || 'unknown');
    portalContainer.style.display = 'block';
  };

  const children = (
    <div style={{ position: 'absolute', top: '0', left: '0', width: '170px' }}>
      <div>
        <a
          href="#"
          className="btn_darkblue_white_innerfade btn_medium"
          children={<span children="スクリーンショット" />}
          onClick={(event) => {
            event.preventDefault();
            onScreenshot();
          }}
        />
      </div>
      <div style={{ marginTop: '8px' }}>
        {searchResult ? (
          <div style={{ height: '400px', overflow: 'auto' }}>
            {searchResult.gameList.map(({ title, href, thumbnail }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                style={{
                  display: 'block',
                  width: '170px',
                  color: '#c7d5e0',
                  background: 'rgba(0,0,0,0.2)',
                  marginBottom: '8px',
                }}
              >
                <img {...thumbnail} />
                <br />
                {title}
              </a>
            ))}
          </div>
        ) : (
          <a
            href="#"
            className="btn_darkblue_white_innerfade btn_medium"
            children={<span children="ストアを検索" />}
            onClick={(event) => {
              event.preventDefault();
              if (title) {
                searchSteamStore(title).then(setSearchResult);
              }
            }}
          />
        )}
      </div>
    </div>
  );

  return createPortal(children, portalContainer);
};
