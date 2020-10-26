import { DataStorageStandalone } from '@whatasoda/browser-extension-toolkit/data-storage';
import { defaultAdopterChrome } from '@whatasoda/browser-extension-toolkit/data-storage/adopters/chrome';
import { getGameData } from '../../apis/get-game-data';

interface Game extends Omit<RgGame, 'availStatLinks'> {
  histogram: Histogram | null;
  metadata: GameMetadata | null;
}
interface User {
  userId: number;
  userName: string;
  games: number[];
}

const Games = new DataStorageStandalone<Game>('games', 'v1', defaultAdopterChrome);
const Users = new DataStorageStandalone<User>('users', 'v1', defaultAdopterChrome);

export const getGameListByUserId = async (_: any, userId: number) => {
  const [userEntity] = await Users.query([[{ key: 'userId', filter: userId }]]);
  if (!userEntity) return null;
  return Games.query([[{ key: 'appid', filter: new RegExp(userEntity.data.games.join('|'), 'g') }]]);
};

export const pushGameList = async (_: any, userId: number, userName: string, rgGames: RgGame[]) => {
  const games = new Map<number, Game>();
  rgGames.forEach(({ appid, logo, name }) => {
    games.set(appid, { appid, logo, name, histogram: null, metadata: null });
  });

  const gameIdList = [...games.keys()];
  const existing = await Games.query([[{ key: 'appid', filter: new RegExp(gameIdList.join('|'), 'g') }]]);

  existing.forEach(({ data }) => games.delete(data.appid));
  await [...games.values()].reduce<Promise<any>>((prev, game) => {
    return prev.then(() => {
      return Games.create(game);
    });
  }, Promise.resolve());

  const [userEntity] = await Users.query([[{ key: 'userId', filter: userId }]]);
  if (userEntity) {
    await Users.update(userEntity.index, { userId, userName, games: gameIdList }, true);
  } else {
    await Users.create({ userId, userName, games: gameIdList });
  }
};

export const updateGameData = async (_: any, gameIdList: number[]) => {
  const games = await Games.query([[{ key: 'appid', filter: new RegExp(gameIdList.join('|'), 'g') }]]);

  const gameDataList = await Promise.all(games.map((game) => getGameData(game.data.appid)));
  await games.reduce<Promise<any>>((prev, game, i) => {
    return prev.then(() => {
      return Games.update(game.index, { ...game.data, ...gameDataList[i] });
    });
  }, Promise.resolve());
};
