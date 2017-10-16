import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { mappers } from '../redux';
const { navDispatchMapper, navStateMapper } = mappers;

const Nav = ({ isLoggedIn, attemptLogin, logout, user, cart, links })=> {
  const signIn = (ev)=> {
    ev.preventDefault();
    const credentials = {
      email: ev.target.email.value,
      password: ev.target.password.value
    };
    attemptLogin(credentials, cart);
  }
  return (
    <div className='navbar'>
      <div className='container-fluid'>
      <ul className='nav nav-tabs' style={ { marginBottom: '10px' } }>
      {
        links.map( link => (
          <li key={ link.path } className={ link.active ? 'active': ''}>
            <Link to={ link.path }>
              { link.text }
            </Link>
          </li>
        ))
      }
      </ul>
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
      {
        isLoggedIn && (
          <div className='well'>
            <button className='btn btn-warning' onClick={ logout }>Sign out { user.email }</button>
          </div>
        )
      }
      </div>
    </div>
  );
};


export default connect(navStateMapper, navDispatchMapper)(Nav);
