import 'es6-promise';
import 'whatwg-fetch';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import '../scss/main.scss';

ReactDOM.render(
  <App />,
    document.getElementById('root')
);
