import React, { Component} from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { mappers } from '../redux';
import ProductForm from './ProductForm';
const { productsDispatchMapper, productsStateMapper } = mappers;

class Products extends Component{
  constructor(){
    super();
    this.state = { deletingProduct: {} };
    this._deleteProduct = this._deleteProduct.bind(this);
  }
  _deleteProduct(product){
    if(product.id && this.state.deletingProduct.id){
      this.props.deleteProduct({ product: this.state.deletingProduct });
      this.setState({ deletingProduct: {}});
    }
    else{
      this.setState({ deletingProduct: product })
    }

  }
  render(){
    const {_deleteProduct} = this;
    return (
      <_Products { ...this.props } {...this.state } _deleteProduct={ _deleteProduct} />
    );

  }
}

const _Products = ({ products, user, cart, addToCart, _deleteProduct, undeleteProduct, deletingProduct })=> {
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
        <Button onClick={()=> _deleteProduct({})}>Close</Button>
        <Button bsStyle="primary" onClick={ ()=> _deleteProduct( deletingProduct )}>Yes</Button>
      </Modal.Footer>

    </Modal.Dialog>
  </div>
);
  return (
    <div>
      {
        !!deletingProduct.id && modalInstance 
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
                    <button className='pull-right btn btn-danger' onClick={ ()=> _deleteProduct(product)}>Delete Product</button>
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
