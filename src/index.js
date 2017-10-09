import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import store from './redux';

import Routes from './routes';

const App = () => (
  <Provider store={ store }>
    <Routes />
  </Provider>
);


render(<App />, document.getElementById('root'));
