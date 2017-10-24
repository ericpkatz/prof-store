import React, { Component} from 'react';
import { connect } from 'react-redux';
import { mappers } from '../redux';
import ProductForm from './ProductForm';
const { productsDispatchMapper, productsStateMapper } = mappers;
import Modal from '../common/Modal';

class Products extends Component{
  constructor(){
    super();
    this.state = { deletingProduct: {} };
    this.confirmModal = this.confirmModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.cancelModal = this.cancelModal.bind(this);
  }
  confirmModal(){
      this.props.deleteProduct({ product: this.state.deletingProduct });
      this.setState({ deletingProduct: {}});
  }
  showModal(product){
    this.setState({ deletingProduct: product });
  }
  cancelModal(){
    this.setState({ deletingProduct: {} });
  }
  render(){
    const { confirmModal, cancelModal, showModal } = this;
    return (
      <_Products { ...this.props } {...this.state } confirmModal={ confirmModal } cancelModal={ cancelModal } showModal= { showModal } />
    );

  }
}

const _Products = ({ products, user, cart, addToCart, showModal, confirmModal, cancelModal, undeleteProduct, deletingProduct })=> {
  return (
    <div>
      {
        !!deletingProduct.id && <Modal onConfirm={ confirmModal } onCancel={ cancelModal }/> 
      }
      <ul className='list-group'>
        {
          products.map( product => {
            return (
              <li className='list-group-item' key={ product.id }>
                { product.name }
                 { ` $${product.price.toFixed(2) }` }
                { 
                  product.lineItem && (
                    <div style={ { marginTop: '5px' } }>
                      <span className='label label-default'>
                        This item is in your cart { product.lineItem.quantity } times.
                      </span>
                    </div>
                  )
                }
                {
                  !product.isDeleted && (
                    <button className='pull-right btn btn-primary' onClick={ ()=> addToCart({ user, product, cart })}> Add to Cart</button>
                  )
                }
                {
                  user.isAdmin && !product.isDeleted && (
                    <button className='pull-right btn btn-danger' onClick={ ()=> showModal(product)}>Delete Product</button>
                  )
                }
                {
                  user.isAdmin && product.isDeleted && (
                    <button className='pull-right btn btn-warning' onClick={ ()=> undeleteProduct({ product })}>Un-Delete Product</button>
                  )
                }
                <br style={{ clear: 'both' }} />
              </li>
            )
          })
        }
      </ul>
      {
        user.isAdmin && <ProductForm />
      }
    </div>
  );
};


export default connect(productsStateMapper, productsDispatchMapper )(Products);
