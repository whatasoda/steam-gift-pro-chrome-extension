import React from 'react';
import { GamesParser } from './components/Games';
import { GiftObserver } from './components/Gift';

// only pathname + search after https://steamcommunity.com/
const routes = {
  gift: /^\/profiles\/(\d+)\/inventory\/?$/,
  games: /^\/profiles\/(\d+)\/games\/?\?tab=all$/,
};

export const Router = () => {
  if (!location.href.startsWith('https://steamcommunity.com/')) return null;

  const loc = location.pathname + location.search;
  if (routes.games.test(loc)) {
    return <GamesParser />;
  }
  if (routes.gift.test(loc)) {
    return <GiftObserver />;
  }

  return null;
};
