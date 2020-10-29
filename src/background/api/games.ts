import { DataStorageStandalone } from '@whatasoda/browser-extension-toolkit/data-storage';
import { defaultAdopterChrome } from '@whatasoda/browser-extension-toolkit/data-storage/adopters/chrome';
import { fetchGameData } from '../../apis/get-game-data';

interface User {
  userId: number;
  userName: string;
  profileLink: string;
  games: number[];
}

const Games = new DataStorageStandalone<Game>('games', 'v1', defaultAdopterChrome);
const Users = new DataStorageStandalone<User>('users', 'v1', defaultAdopterChrome);

export const getAllGames = async (_: any) => {
  return await Games.query([]);
};

export const getGameListByUserId = async (_: any, userId: number) => {
  const [userEntity] = await Users.query([[{ key: 'userId', filter: userId }]]);
  if (!userEntity) return null;
  return Games.query([[{ key: 'appid', filter: new RegExp(userEntity.data.games.join('|'), 'g') }]]);
};

export const pushGameList = async (
  _: any,
  userId: number,
  userName: string,
  profileLink: string,
  games: PageData['games'],
) => {
  const gameMap = new Map<number, Game>();
  games.forEach((game) => {
    gameMap.set(game.appId, {
      ...game,
      tags: null,
      review: null,
      releaseDate: null,
    });
  });

  const appidList = [...gameMap.keys()];
  const existing = await Games.query([[{ key: 'appid', filter: new RegExp(appidList.join('|'), 'g') }]]);

  existing.forEach(({ data }) => gameMap.delete(data.appId));
  await [...gameMap.values()].reduce<Promise<any>>((prev, game) => {
    return prev.then(() => {
      return Games.create(game);
    });
  }, Promise.resolve());

  const [userEntity] = await Users.query([[{ key: 'userId', filter: userId }]]);
  const user: User = { userId, userName, profileLink, games: appidList };
  if (userEntity) {
    await Users.update(userEntity.index, user, true);
  } else {
    await Users.create(user);
  }
};

export const updateGameData = async (_: any, appIdList: number[]) => {
  const filter = new RegExp(`^(${appIdList.join('|')})$`);
  const games = await Games.query([[{ key: 'appId', filter }]]);
  const promises = games.map(async (game) => {
    const { review, metadata } = await fetchGameData(game.data.appId);
    const name = metadata?.name || game.data.name;
    return Games.update(game.index, { ...game.data, review, ...metadata, name });
  });
  return await Promise.all(promises);
};
