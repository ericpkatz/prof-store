import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { actions } from './redux';

const { fetchProducts, fetchUser } = actions;

import Home from './Components/Home';
import Products from './Components/Products';
import Orders from './Components/Orders';
import Cart from './Components/Cart';
import Nav from './Components/Nav';
import Address from './Components/Address';
import Analytics from './Components/Analytics';
import Store from './Components/Store';
import LoadingIndicator from './Components/LoadingIndicator';

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
          <Route component={ LoadingIndicator } />
          <Route exact path='/' component={ Home } />
          <Route path='/products' component={ Products } />
          <Route exact path='/cart' component={ Cart } />
          <Route exact path='/cart/address' component={ Address } />
          <Route exact path='/orders' component={ Orders } />
          <Route exact path='/analytics' component={ Analytics } />
          <Route component={ Store } />
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
