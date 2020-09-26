import React from 'react';
import ReactDom from 'react-dom';
import { fetch } from '../content/custom-fetch';
import { Observer } from '../content/components/Observer';

window.fetch = fetch;

const render = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDom.render(<Observer />, container);
};
render();
