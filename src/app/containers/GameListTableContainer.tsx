import { Entity } from '@whatasoda/browser-extension-toolkit/data-storage';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sendBackgroundMessage } from '../../utils/send-message';
import { GameListTable, GameFlat } from '../components/GameListTable';

export const GameListTableContainer = () => {
  const [gameEntities, setGameEntities] = useState<Entity<Game>[]>([]);
  const games = useMemo(() => {
    return gameEntities.map<GameFlat>(({ data, ...rest }) => ({ ...rest, ...data }));
  }, [gameEntities]);

  const filteredGamesRef = useRef(games);
  const onVisibleItemChange = (games: GameFlat[]) => {
    filteredGamesRef.current = games;
  };

  const onUpdateAllGameData = async () => {
    await sendBackgroundMessage(
      'updateGameData',
      filteredGamesRef.current.map(({ appId }) => appId),
    );
    await refreshItems();
  };

  const onUpdateGameData = async (appId: number) => {
    const promise = sendBackgroundMessage('updateGameData', [appId]);
    const index = await new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(games.findIndex((game) => game.appId === appId));
      }, 0);
    });

    const [next] = await promise;
    if (!next || index === -1) {
      // eslint-disable-next-line no-console
      console.log('Something wrong happened');
      return;
    }
    setGameEntities((curr) => {
      return [...curr.slice(0, index), next, ...curr.slice(index + 1)];
    });
  };

  const refreshItems = async () => {
    setGameEntities(await sendBackgroundMessage('getAllGames'));
  };

  useEffect(() => {
    refreshItems();
  }, []);

  return (
    <GameListTable
      games={games}
      onUpdateGameData={onUpdateGameData}
      onUpdateAllGameData={onUpdateAllGameData}
      onVisibleItemChange={onVisibleItemChange}
    />
  );
};
