import React from 'react';
import { GiftObserver } from './components/Gift';

// only pathname + search after https://steamcommunity.com/
const routes = {
  gift: {
    pathname: /^\/(profiles\/\d+|id\/[^/]+)\/inventory\/?$/,
  },
};

export const Router = () => {
  if (!location.href.startsWith('https://steamcommunity.com/')) return null;

  const { pathname } = location;
  if (routes.gift.pathname.test(pathname)) {
    return <GiftObserver />;
  }

  return null;
};
