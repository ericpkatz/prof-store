import React, { Component } from 'react';
import Modal from '../common/Modal';
import { connect } from 'react-redux';
import { actions } from '../redux';
import { mappers } from '../redux';
const { createOrder, deleteFromCart } = actions;
const { cartStateMapper, cartDispatchMapper } = mappers;

class Cart extends Component {
  constructor(){
    super();
    this.state = { deletingLineItem : {} };
    this.confirmModal = this.confirmModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.cancelModal = this.cancelModal.bind(this);
  }
  confirmModal(){
      this.props.deleteFromCart({ cart: this.props.cart, lineItem: this.state.deletingLineItem, user: this.props.user });
      this.setState({ deletingLineItem: {}});
  }
  showModal(product){
    this.setState({ deletingLineItem: product });
  }
  cancelModal(){
    this.setState({ deletingLineItem: {} });
  }
  render(){
    const { deletingLineItem } = this.state;
    const { confirmModal, cancelModal, showModal } = this;
    return (
      <_Cart {...this.props } confirmModal={ confirmModal } showModal={ showModal } cancelModal={ cancelModal } deletingLineItem={ deletingLineItem }/>
    )
  }
}

const _Cart = ({ cart, user, createOrder, deleteFromCart, showModal, confirmModal, cancelModal, deletingLineItem })=> {
  return (
    <div>
      {
        deletingLineItem.productId && <Modal onConfirm={ confirmModal } onCancel={ cancelModal } /> 
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
                <button className='btn btn-warning pull-right' onClick={ ()=> showModal(lineItem) }>Delete From Cart</button>
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
