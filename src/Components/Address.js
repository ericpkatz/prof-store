import React, { Component } from 'react';
import PlaceAutocomplete from './PlaceAutocomplete';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { mappers } from '../redux';

const  { addressStateMapper, addressDispatchMapper } = mappers;

const Address = ({ addAddress, user, cart, address, createOrder, addresses })=> {
  const setAddress = (ev)=> {
    const address = addresses.find( address=> address.formatted_address === ev.target.value);
    if(address){
      addAddress({ user, cart, address });
    }
  }
  return (
    <div>
      <Link to='/cart'>Back to cart</Link>
      <div className='well'>
        Add a new Address:
        <PlaceAutocomplete addAddress={ (address)=> addAddress({ user, cart, address }) }/>
      {
        addresses.length > 0 && (
          <div className='form-group'>
            <label>Existing Addresses</label>
            <select className='form-control' onChange={ setAddress }>
              <option>-- choose an address --</option>
              {
                addresses.map( (address, idx) => {
                  return (
                    <option key={ idx }>{ address.formatted_address }</option>
                  )
                })
              }
            </select>
          </div>
        )
      }
      {
        address &&  (
          <div>
            <button style={ { marginTop: '10px' }} onClick={ ()=> createOrder({ user, cart })}  className='btn btn-primary'><label className='label label-default'>Ship to:</label> { address.formatted_address }</button>
          </div>
        )
      }
      </div>
    </div>
  );
};

export default connect(addressStateMapper, addressDispatchMapper)(Address);
