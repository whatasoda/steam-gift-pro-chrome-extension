import React from 'react';
import ReactDom from 'react-dom';
import { fetch } from '../content/utils/custom-fetch';
import { Router } from '../content/router';

window.fetch = fetch;

const render = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDom.render(<Router />, container);
};
render();
