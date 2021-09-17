import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename="/repo-name">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
