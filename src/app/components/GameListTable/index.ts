import { columns } from './columns';
import { createGameListContainer } from './container';
import { GameListTable } from './table';

export const GameList = createGameListContainer(columns, GameListTable);
