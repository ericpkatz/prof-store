import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actions } from '../redux';
const { attemptLogin, logout } = actions;

const Nav = ({ isLoggedIn, productCount, attemptLogin, logout, cartCount, orderCount })=> {
  const signIn = (ev)=> {
    ev.preventDefault();
    const credentials = {
      email: ev.target.email.value,
      password: ev.target.password.value
    };
    attemptLogin(credentials);
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
      {
        isLoggedIn && (
          <li>
            <Link to='/cart'>
              Cart ({ cartCount })
            </Link>
          </li>
        )
      }
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
          <button className='btn btn-warning' onClick={ logout }>Sign out</button>
        )
      }
      {
        !isLoggedIn && (
      
      <form className="navbar-form navbar-right" role="search" onSubmit={ signIn }>
          <div className="form-group">
            <input type="text" className="form-control" name="email" placeholder='email' />
          </div>
          <div className="form-group">
              <input type="text" className="form-control" name="password" placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-default">Sign In</button>
      </form>
        )
      }
    </div>
  );
}

const mapStateToProps = ({ user, products, cart })=> {
  return {
    isLoggedIn: !!user.id,
    productCount: products.length,
    cartCount: cart.lineItems.reduce((memo, lineItem)=> {
      memo += lineItem.quantity;
      return memo;
    }, 0),
    orderCount: user.id ? user.orders.length : 0
  };
};

const mapDispatchToProps = (dispatch, { history })=> {
  return {
    logout: ()=> {
      dispatch(logout(history));
    },
    attemptLogin: ( credentials )=> {
      dispatch(attemptLogin(credentials, history));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
