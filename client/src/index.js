import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Team from './Components/Team';
import Match from './Components/Match/Match';
import Profile from './Components/Profile/Profile';
import Navigation from './Components/Navigation/Navigation';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux'
import store from "./redux/store.js";

import 'rsuite/dist/styles/rsuite.min.css';

ReactDOM.render(<Provider store={store}>
  <Router>
    <div>
      <Navigation/>
      <Route exact={true} path="/" render={props => <div>
          <App/>
        </div>}/>

      <Route path="/match/:tableTag?" component={Match}/>

      <Route path="/join/:teamTag" component={Team}/>

      <Route path="/profile" component={Profile}/>
    </div>
  </Router>
</Provider>, document.getElementById('root')); // ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();