import React from 'react';
import { connect } from 'react-redux';
import { mappers } from '../redux';
const { analyticsStateMapper } = mappers;

const Analytics = ({ orderHistory })=> {
  return (
    <div>
      <div className='well'>
        Show analytic data
        <h1>Total Orders: { orderHistory.length }</h1>
      </div>
    </div>
  );
};

export default connect(analyticsStateMapper)(Analytics);
