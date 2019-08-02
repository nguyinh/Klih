import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import store from "./redux/store.js";

// import 'rsuite/dist/styles/rsuite.min.css';
import 'rsuite/dist/styles/rsuite.css';

ReactDOM.render(<Provider store={store}>
  <App/>
</Provider>, document.getElementById('root')); // ReactDOM.render(<App/>, document.getElementById('root'));

// <Route path="/join/:teamTag" component={Team}/>
// TODO: Build join team route

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();