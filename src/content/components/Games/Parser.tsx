import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../../fragments/Button';
import { sendBackgroundMessage } from '../../../utils/send-message';

export const GamesParser = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [status, setStatus] = useState<'ready' | 'processing' | 'done'>('ready');

  useEffect(() => {
    const listContainer = document.querySelector('#games_list_row_container');
    if (!listContainer) return;

    const container = document.createElement('div');
    listContainer.parentElement!.insertBefore(container, listContainer);
    setContainer(container);
    extractPageData().then(setPageData);
  }, []);

  if (!container) return null;

  const children = (
    <>
      <Button
        text={
          status === 'ready'
            ? '読み込む'
            : status === 'processing'
            ? '追加中'
            : status === 'done'
            ? '読み込み済み'
            : 'エラー'
        }
        disabled={status !== 'ready'}
        onClick={() => {
          if (pageData) {
            const { userId, userName, profileLink, games } = pageData;
            setStatus('processing');
            sendBackgroundMessage('pushGameList', userId, userName, profileLink, games).finally(() => {
              setStatus('done');
            });
          }
        }}
      />
    </>
  );

  return createPortal(children, container);
};

const MESSAGE_ID = 'SteamGiftProGameListData';
const SteamGiftProGameListDataScript = `
window.postMessage({
  type: ${JSON.stringify(MESSAGE_ID)},
  payload: { rgGames, g_steamID, profileLink, personaName },
});
`.trim();
interface SteamGiftProGameListData {
  rgGames: RgGame[];
  g_steamID: string;
  profileLink: string;
  personaName: string;
}
interface RgGame {
  appid: number;
  logo: string;
  name: string;
  availStatLinks: {} /* unnecessary  */;
}

const getRawPageData = () => {
  return new Promise<SteamGiftProGameListData>((resolve, reject) => {
    const onMessage = (event: MessageEvent<{ type: string; payload: SteamGiftProGameListData }>) => {
      if (event.data.type !== MESSAGE_ID) return;
      resolve(event.data.payload);
      clearTimeout(timeout);
      window.removeEventListener('message', onMessage);
      script.remove();
    };
    window.addEventListener('message', onMessage);

    const timeout = setTimeout(() => {
      reject('Request Timeout');
    }, 2000);

    const script = document.createElement('script');
    script.innerHTML = SteamGiftProGameListDataScript;

    document.body.appendChild(script);
  });
};

export const extractPageData = async (): Promise<PageData | null> => {
  try {
    const { g_steamID: userId, personaName: userName, profileLink, rgGames } = await getRawPageData();

    return {
      userId: Number(userId),
      userName,
      profileLink,
      games: rgGames.map(({ appid, logo, name }) => ({ appId: appid, logo, name })),
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
};
