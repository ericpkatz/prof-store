import React from 'react';
import { connect } from 'react-redux';
import { mappers } from '../redux';
const { productFormDispatchMapper } = mappers;

const ProductForm = ({ createProduct })=> {
  const _createProduct = (ev)=> {
    ev.preventDefault();
    const target = ev.target;
    const product = {
      name: ev.target.name.value,
      price: ev.target.price.value
    };
    createProduct(product)
      .then(()=> {
        target.name.value = '';
        target.price.value = '';
      });
  }
  return (
    <div>
      <form className='well' onSubmit={ _createProduct }>
        <div className='form-group'>
          <input className='form-control' placeholder='name' name='name' />
        </div>
        <div className='form-group'>
          <input className='form-control' placeholder='price' name='price' />
        </div>
        <div className='form-group'>
          <button className='btn btn-primary'>Create</button>
        </div>
      </form>
    </div>
  );
};

export default connect(null, productFormDispatchMapper)(ProductForm);
