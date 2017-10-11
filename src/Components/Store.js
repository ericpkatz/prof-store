import React from 'react';
import { connect } from 'react-redux';

const Home = ({ state})=> {
  console.log(state);
  return (
    <div>
      <br style={{ clear: 'both' }} />
      <div>
        <pre>
        { JSON.stringify(state, null, 2) }
        </pre>
      </div>
    </div>
  );
};

export default connect((state)=> ({state}))(Home);
