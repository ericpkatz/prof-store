import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../redux';

const Orders = ({ orders })=> {
  return (
    <ul className='list-group'>
      {
        orders.map( order => {
          return (
            <li className='list-group-item' key={ order.id }>
              { order.id }
              <br style={ { clear: 'both' }} />
            </li>
          )
        })
      }
    </ul>
  );
};

const mapDispatchToProps = (dispatch)=> {
  return {
  };
};

const mapStateToProps = ({ user })=> {
  return {
    orders: user.id ? user.orders : []
  };
};

export default connect(mapStateToProps, mapDispatchToProps )(Orders);
