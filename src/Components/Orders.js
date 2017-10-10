import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../redux';
const { addToCart } = actions;

const Orders = ({ orders, addToCart, cart, user })=> {
  return (
    <ul className='list-group'>
      {
        orders.map( order => {
          return (
            <li className='list-group-item' key={ order.id }>
              Order ID: { order.id }
              <br style={ { clear: 'both' }} />
              <ul>
                {
                  order.lineItems.map( lineItem => {
                    if(!lineItem.product){
                      return null;
                    }
                    return (
                      <li key={ lineItem.id }>
                        Id: { lineItem.id }
                        <br />
                        Product: { lineItem.product.name }
                        <br />
                        <button className='btn btn-primary' onClick={ ()=> addToCart({ user, product: lineItem.product, cart })}>Buy Again</button>
                        <br />
                        Quanity: { lineItem.quantity }
                      </li>
                    );
                  })
                }
              </ul>
            </li>
          )
        })
      }
    </ul>
  );
};

const mapDispatchToProps = (dispatch)=> {
  return {
    addToCart: ({ user, cart, product })=> dispatch(addToCart({ user, cart, product }))
  };
};

const mapStateToProps = ({ user, products, cart })=> {
  if(user.orders){
    const productMap = products.reduce((memo, product)=> {
      memo[product.id] = product;
      return memo;
    }, {});
    const orders = user.orders.reduce((memo, order)=> {
      const lineItems = order.lineItems.reduce((memo, lineItem)=> {
        const product = productMap[lineItem.productId];
        if(!product){
          memo.push(lineItem);
        }
        else{
          memo.push(Object.assign({}, lineItem, { product }));
        }
        return memo;
      }, []);
      memo.push(Object.assign({}, order, { lineItems }));
      return memo;
    }, []);
    user = Object.assign({}, user, { orders });
  }
  return {
    orders: user.id ? user.orders : [],
    user,
    cart
  };
};

export default connect(mapStateToProps, mapDispatchToProps )(Orders);
