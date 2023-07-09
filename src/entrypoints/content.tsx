import '../../assets/logo.png';
import '../manifest.json';

import React from 'react';
import ReactDom from 'react-dom';
import { Router } from '../content/router';
import { fetch } from '../lib/custom-fetch';

window.fetch = fetch;

const render = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  ReactDom.render(<Router />, container);
};

render();
