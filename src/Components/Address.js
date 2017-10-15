import React from 'react';
import { Link } from 'react-router-dom';

const Address = ()=> {
  return (
    <div>
      <Link to='/cart'>Back to cart</Link>
      <div className='well'>
        To Do : Use this address or Add another address 
      </div>
    </div>
  );
};

export default Address;
