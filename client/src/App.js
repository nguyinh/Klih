import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    working: false
  }

  componentDidMount() {
    this.fetchAPI();
  }

  fetchAPI = () => {
    fetch('/api/test').then(res => {
      this.setState({working: true})
    })
  }

  render() {
    return (<div className="App">
      {
        this.state.working
          ? <h1>Works !</h1>
          : <h1>Don't work</h1>
      }
      </div>);
  }
}

export default App;
