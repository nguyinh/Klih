import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Team from './Components/Team';
import Match from './Components/Match/Match';
import History from './Components/History/History';
import Statistics from './Components/Statistics/Statistics';
import Monitor from './Components/Monitor/Monitor';
import Profile from './Components/Profile/Profile';
import Navigation from './Components/Navigation/Navigation';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from "./redux/store.js";

// import 'rsuite/dist/styles/rsuite.min.css';
import 'rsuite/dist/styles/rsuite.css';

ReactDOM.render(<Provider store={store}>
  <Router>
    <div>
      <Navigation/>

      <Route exact={true} path="/" render={props => <div>
          <App/>
        </div>}/>

      <Route path="/match/:tableTag?" component={Match}/>

      <Route path="/history" component={History}/>

      <Route path="/statistics" component={Statistics}/>

      <Route path="/monitor" component={Monitor}/>

      <Route path="/profile" component={Profile}/>

      <Route path="/join/:teamTag" component={Team}/>
    </div>
  </Router>
</Provider>, document.getElementById('root')); // ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();