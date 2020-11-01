import React from 'react';
import ReactDOM from 'react-dom';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import { App } from './App';

const render = () => {
  ReactDOM.render(<App />, document.querySelector('#app'));
};

render();
