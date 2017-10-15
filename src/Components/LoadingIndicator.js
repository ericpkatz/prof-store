import React from 'react';
import { connect } from 'react-redux';

const LoadingIndicator = ({ isLoading})=> {
  if(!isLoading){
    return null;
  }
  return (
    <div className='well'>
      Loading
    </div>
  );
};

const mapStateToProps = ({ requests })=> {
  return {
    isLoading: requests > 0
  };
};


export default connect(mapStateToProps)(LoadingIndicator);


