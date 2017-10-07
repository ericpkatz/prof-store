import React from 'react';

const Home = ({ message = 'home'})=> {
  return (
    <div>{ message }</div>
  );
};

export default Home;
