import React from 'react';
import { GamesParser } from './components/Games';
import { GiftObserver } from './components/Gift';

// only pathname + search after https://steamcommunity.com/
const routes = {
  gift: {
    pathname: /^\/profiles\/\d+\/inventory\/?$/,
  },
  games: {
    pathname: /^\/(profiles\/\d+|id\/[^/]+)\/games\/?$/,
    search: () => {
      const search = new URLSearchParams(location.search);
      return search.get('tab') === 'all';
    },
  },
};

export const Router = () => {
  if (!location.href.startsWith('https://steamcommunity.com/')) return null;

  const { pathname } = location;
  if (routes.games.pathname.test(pathname) && routes.games.search()) {
    return <GamesParser />;
  }
  if (routes.gift.pathname.test(pathname)) {
    return <GiftObserver />;
  }

  return null;
};
