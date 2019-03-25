import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import axios from 'axios';
import { Button, Grid, Row, Col } from 'rsuite';
import { Link, withRouter } from "react-router-dom";

import { connect } from 'react-redux';
import { setUserAuth } from './redux/actions/index.actions.js'

const mapDispatchToProps = dispatch => {
  return ({
    setUserAuth: (value) => {
      dispatch(setUserAuth(value))
    }
  })
}

const mapStateToProps = state => {
  return { isConnected: state.isConnected };
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      working: false,
      collapse: true
    }
    this.collapseSwitch = this.collapseSwitch.bind(this);
  }

  componentDidMount() {
    axios.defaults.withCredentials = true;
    this.fetchAPI();
  }

  fetchAPI = () => {
    axios.get('/api/test', {}).then((res) => {
      // this.props.setUserAuth(true);
    }).catch((err) => {
      // this.props.setUserAuth(false);
    });
  }

  collapseSwitch() {
    this.setState({
      collapse: !this.state.collapse
    })
  }

  render() {
    return (<div className="App">
      <Grid>
        <Row>
          <Col md={6}>
            <Button block="block">Hello world</Button>
          </Col>
          <Col xs={24}>

            <Link to={'/join/hello'}>
              <h1>Link</h1>
            </Link>

          </Col>
        </Row>
      </Grid>

    </div>);
  }
}

// export default App;
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));