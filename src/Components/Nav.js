import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Nav = ({ isLoggedIn, productCount, attemptSignIn })=> {
  const signIn = (ev)=> {
    ev.preventDefault();
    console.log(ev.target.email.value);
  }
  return (
    <div>
      <ul className='nav nav-tabs'>
        <li>
          <Link to='/'>
            Home
          </Link>
        </li>
        <li>
          <Link to='/products'>
            Products ({ productCount })
          </Link>
        </li>
      </ul>
      <form className="navbar-form navbar-right" role="search" onSubmit={ signIn }>
          <div className="form-group">
            <input type="text" className="form-control" name="email" placeholder='email' />
          </div>
          <div className="form-group">
              <input type="text" className="form-control" name="password" placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-default">Sign In</button>
      </form>
    </div>
  );
}

const mapStateToProps = ({ user, products })=> {
  return {
    isLoggedIn: !!user.id,
    productCount: products.length
  };
};

const mapDispatchToProps = (dispatch)=> {
  //to do login here...
  return {
    attemptLogin: ( credentials )=> {
      dispatch(attemptLogin(credentials));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
