import React, { Component } from 'react';
import './Team.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col
} from 'rsuite';


const cmp = (o1, o2) => JSON.stringify(o1) === JSON.stringify(o2);

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      tag: props.tag,
      image: undefined
    }
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  componentDidMount() {
    // let base64Flag = 'data:image/jpeg;base64,';
    // let imageStr = this.arrayBufferToBase64(this.state.data.avatar.data);
    // let imageStr = this.state.data.avatar.data;
    // this.setState({
    //   image: base64Flag + imageStr
    // });
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.data !== this.props.data)
    //   this.setState({
    //     ...nextProps
    //   });
  }

  render() {
    return <Col xs={8}>

      <Grid className='tagContainer'>
        <Row>
          <Col xs={24} className='nameContainer'>
            <Button>
              <h5>{this.state.name}</h5>
            </Button>
          </Col>
      </Row>
        <Row>
          <Col xs={12} xsOffset={3}>
            <span className='tagText'>TeamTag</span>
          </Col>
        </Row>
        <Row>
          <Col xs={12} xsOffset={3}>
            <span>{this.state.tag}</span>
          </Col>
        </Row>
      </Grid>

    </Col>
  }
}
export default withRouter(connect(null, null)(Team));