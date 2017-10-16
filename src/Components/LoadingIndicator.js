import React from 'react';
import { connect } from 'react-redux';

const LoadingIndicator = ({ isLoading})=> {
  if(!isLoading){
    return null;
  }
  return (
    <div className='waiting'>
      <p className='spinner'>
        Loading...
      </p>
    </div>
  );
};

const mapStateToProps = ({ requests })=> {
  return {
    isLoading: requests > 0
  };
};


export default connect(mapStateToProps)(LoadingIndicator);


