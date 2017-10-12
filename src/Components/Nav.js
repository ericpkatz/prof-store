import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { mappers } from '../redux';
const { navDispatchMapper, navStateMapper } = mappers;

const Nav = ({ isLoggedIn, productCount, attemptLogin, logout, cartCount, orderCount, user, cart })=> {
  const signIn = (ev)=> {
    ev.preventDefault();
    const credentials = {
      email: ev.target.email.value,
      password: ev.target.password.value
    };
    attemptLogin(credentials, cart);
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
        <li>
          <Link to='/cart'>
            Cart ({ cartCount })
          </Link>
        </li>
      {
        isLoggedIn && (
          <li>
            <Link to='/orders'>
              Orders ({ orderCount })
            </Link>
          </li>
        )
      }
      </ul>
      {
        isLoggedIn && (
          <div className='well'>
            <button className='btn btn-warning' onClick={ logout }>Sign out { user.email }</button>
          </div>
        )
      }
      {
        !isLoggedIn && (
      
      <form className="navbar-form navbar-right" role="search" onSubmit={ signIn }>
          <div className="form-group">
            <input type="text" className="form-control" name="email" placeholder='email' />
          </div>
          <div className="form-group">
              <input type="password" className="form-control" name="password" placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-default">Sign In</button>
      </form>
        )
      }
    </div>
  );
}


export default connect(navStateMapper, navDispatchMapper)(Nav);
