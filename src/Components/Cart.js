import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { actions } from '../redux';
import { mappers } from '../redux';
const { createOrder, deleteFromCart } = actions;
const { cartStateMapper, cartDispatchMapper } = mappers;

class Cart extends Component {
  constructor(){
    super();
    this.state = { deleting : {} };
    this.deleteLineItem = this.deleteLineItem.bind(this);
  }
  deleteLineItem(lineItem){
    this.setState({ deleting: lineItem });
  }
  render(){
    const { deleting } = this.state;
    const { deleteLineItem } = this;
    return (
      <_Cart {...this.props } deleting={ deleting } deleteLineItem={ deleteLineItem }/>
    )
  }
}

const _Cart = ({ cart, user, createOrder, deleteFromCart, deleting, deleteLineItem })=> {
  const modalInstance = (
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>This is a great item</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure?
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={()=> deleteLineItem({})}>Close</Button>
        <Button bsStyle="primary" onClick={ ()=> {
            deleteFromCart({ cart, user, lineItem: deleting });
            deleteLineItem({});
          }
        }>Yes</Button>
      </Modal.Footer>

    </Modal.Dialog>
  </div>
);
  return (
    <div>
      {
        deleting.productId && modalInstance 
      }
      <ul className='list-group'>
        {
          cart.lineItems.map( (lineItem, idx) => {
            return (
              <li className='list-group-item' key={ lineItem.id || idx }>
                LineItemId: { lineItem.id }
                <br />
                ProductId:
                { lineItem.productId }
                <br />
                {
                  lineItem.product && (<strong>Name: { lineItem.product.name }</strong>)
                }
                <br />
                Quantity: 
                { lineItem.quantity }
                { ' ' }
                <button className='btn btn-warning pull-right' onClick={ ()=> deleteLineItem( lineItem ) }>Delete From Cart</button>
                <br style={ { clear: 'both' }} />
              </li>
            )
          })
        }
      </ul>
      {
        !!cart.lineItems.length && (
          <div>
          <button disabled={ !user.id } className='pull-right btn btn-primary' onClick={ ()=> createOrder({ cart, user })}> Create Order</button>
            <br style={ { clear: 'both' }} />
          </div>

        )
      }
      </div>
  );
};

export default connect(cartStateMapper, cartDispatchMapper )(Cart);
