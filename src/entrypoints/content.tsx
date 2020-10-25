import React from 'react';
import ReactDom from 'react-dom';
import { fetch } from '../content/utils/custom-fetch';
import { GiftObserver } from '../content/components/Gift';

window.fetch = fetch;

const render = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDom.render(<GiftObserver />, container);
};
render();
