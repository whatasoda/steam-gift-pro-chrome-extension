import { DataStorageStandalone, Entity } from '@whatasoda/browser-extension-toolkit/data-storage';
import { defaultAdopterChrome } from '@whatasoda/browser-extension-toolkit/data-storage/adopters/chrome';
import { fetchGameData } from '../../apis/get-game-data';
import { createQueue } from '../../utils/queue';

const Games = new DataStorageStandalone<Game>('games', 'v1', defaultAdopterChrome);
const Users = new DataStorageStandalone<User>('users', 'v1', defaultAdopterChrome);
const GameLists = new DataStorageStandalone<CustomGameList>('game-lists', 'v1', defaultAdopterChrome);

export const getAllGames = async (_: any) => await Games.query([]);
export const getAllUsers = async (_: any) => await Users.query([]);
export const getAllGameLists = async (_: any) => await GameLists.query([]);

export const pushUserGameList = async (
  _: any,
  id: number,
  name: string,
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

  const [userEntity] = await Users.query([[{ key: 'userId', filter: id }]]);
  const user: User = {
    id,
    name,
    description: '',
    profileLink,
    games: appidList,
  };
  if (userEntity) {
    await Users.update(userEntity.index, user, true);
  } else {
    await Users.create(user);
  }
};

export const updateGameData = async (_: any, appIdList: number[]) => {
  const filter = new RegExp(`^(${appIdList.join('|')})$`);
  const games = await Games.query([[{ key: 'appId', filter }]]);

  return new Promise<Entity<Game>[]>((resolve, reject) => {
    const acc: Entity<Game>[] = [];
    const { start, enqueue } = createQueue(10, (err) => (err ? reject(err) : resolve(acc)));
    games.forEach((game, idx) => {
      enqueue({
        onStart: async () => {
          const { review, metadata } = await fetchGameData(game.data.appId);
          const name = metadata?.name || game.data.name;
          acc[idx] = await Games.update(game.index, { ...game.data, review, ...metadata, name });
        },
      });
    });
    start();
  });
};

export const createGameList = async (_: any, gameList: CustomGameList) => {
  try {
    return await GameLists.create(gameList);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
};

export const updateGameList = async (_: any, index: string, gameList: CustomGameList) => {
  try {
    return await GameLists.update(index, gameList);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
};
