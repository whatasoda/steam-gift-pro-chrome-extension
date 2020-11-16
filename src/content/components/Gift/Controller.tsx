import React, { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { takeScreenshot } from '../../../apis/screenshot';
import { searchSteamStore } from '../../../apis/search-steam-store';
import { SteamButton } from '../../../fragments/Button';
import { GameList } from './GameList';
import { THUMBNAIL_SELECTOR } from './Observer';

export const Controller = ({ container, title }: GiftItem) => {
  const [list, setList] = useState<{
    closed: boolean;
    loading: boolean;
    games: GameItem[];
    nextSearchParams: SetamSearchPrams | null;
  }>(() => ({
    closed: true,
    loading: false,
    games: [],
    nextSearchParams: {
      term: title!,
      start: 0,
      count: 5,
    },
  }));

  const portalContainer = useMemo(() => document.createElement('div'), []);
  useEffect(() => {
    portalContainer.style.position = 'absolute';
    portalContainer.style.top = '0';
    portalContainer.style.right = '-30px';
    container.style.position = 'relative';
    container.appendChild(portalContainer);
  }, []);

  const onScreenshot = async () => {
    portalContainer.setAttribute('data-screenshot-ignore', 'true');
    const thumbnail = container.querySelector<HTMLImageElement>(THUMBNAIL_SELECTOR);
    if (thumbnail) {
      thumbnail.src = thumbnail.src.replace(/(?<=\d+x\d+)(?<!\.jpg)$/, '.jpg');
    }
    takeScreenshot(container, title || 'unknown', '.pending_gift');
  };

  const onNextSearch = async () => {
    if (!list.nextSearchParams) return;
    setList((curr) => ({ ...curr, loading: true }));
    return searchSteamStore(list.nextSearchParams).then((result) => {
      if (!result) return;
      setList(({ games }) => ({
        closed: false,
        loading: false,
        games: [...games, ...result.games],
        nextSearchParams: result.next,
      }));
    });
  };

  const children = (
    <div style={{ position: 'absolute', top: '0', left: '0', width: '190px' }}>
      <div>
        <SteamButton text="スクリーンショット" onClick={onScreenshot} />
        {list.games.length ? (
          <SteamButton
            text={list.closed ? '開く' : '閉じる'}
            onClick={() => setList((curr) => ({ ...curr, closed: !curr.closed }))}
          />
        ) : (
          <SteamButton text="ストアを検索" disabled={list.loading} onClick={onNextSearch} />
        )}
      </div>
      <GameList
        listClosed={list.closed}
        ended={!list.nextSearchParams}
        games={list.games}
        onNextSearch={onNextSearch}
        checkExactMatch={(t) => t === title}
      />
      {list.loading ? 'Loading...' : null}
    </div>
  );

  return createPortal(children, portalContainer);
};
