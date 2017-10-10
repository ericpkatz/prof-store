import React from 'react';
import { connect } from 'react-redux';
import { actions } from '../redux';

const Orders = ({ orders })=> {
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
  };
};

const mapStateToProps = ({ user, products })=> {
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
    orders: user.id ? user.orders : []
  };
};

export default connect(mapStateToProps, mapDispatchToProps )(Orders);
