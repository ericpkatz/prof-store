import React, { Component } from 'react';
import MapHelper from '../common/MapHelper';
import { connect } from 'react-redux';
import { mappers } from '../redux';
const { ordersMapStateMapper } = mappers;
const stateMapper = ordersMapStateMapper;

class OrdersMap extends Component{ 
  constructor(props){
    super();
    console.log(props);

  }
  componentDidMount(){
    this.map = new MapHelper('map');
  }
  componentWillReceiveProps(nextProps){
    console.log(nextProps.addresses);
    this.map.setMarkers(nextProps.addresses);
  }
  render(){
    const { addresses } = this.props;
    return (
      <div>
        We've got customers all over the world!!!
        <div id='map' ref={ ref=> this.mapContainer = ref } style={{ height: '300px'}}/>
      </div>
    );
  }
}

export default connect(stateMapper)(OrdersMap);
