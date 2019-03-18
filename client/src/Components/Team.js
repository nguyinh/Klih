import React, {Component} from 'react';
import {Button, Grid, Row, Col} from 'rsuite';

class App extends Component {

  constructor(props) {
    super(props);
    console.log(props.match.params.teamTag);
    this.state = {
      team: props.match.params.teamTag
    }
  }

  render() {
    return (<div className="App">
      <Grid>
        <Row>
          <Col md={9}>
            <Button block="block">Wow</Button>
          </Col>
          <Col xs={12}>
            <h1>{this.state.team}</h1>
          </Col>
        </Row>
      </Grid>

    </div>);
  }
}

export default App;
