import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { actions } from './redux';

const { fetchProducts, fetchUser } = actions;

import Home from './Components/Home';
import Nav from './Components/Nav';

class Routes extends Component {
  constructor(){
    super();
  }
  componentDidMount(){
    this.props.loadInitialData();
  }
  render(){
    return (
      <Router>
        <div className='container'>
          <Route component={ Nav } />
          <Route path='/' component={ Home } />
        </div>
      </Router>
    );
  }
}

const mapDispatchToProps = (dispatch)=> {
  return {
    loadInitialData: ()=> {
      dispatch(fetchProducts());
      dispatch(fetchUser());
    }
  };
}

export default connect(null, mapDispatchToProps)(Routes);
