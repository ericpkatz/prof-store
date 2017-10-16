import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { mappers } from '../redux';
const { addressStateMapper, addressDispatchMapper } = mappers;

/*
  var container = $(config.id);
  var template =`
    <div class='form-group'>
      <label>Name</label>
      <input class='form-control' name='name' />
    </div>
  `;
  var $html = $(template);
  var elem = $html.find('[name="name"]');
  var autocomplete = new google.maps.places.Autocomplete(elem[0]);
  autocomplete.addListener('place_changed', function(){
    var place = autocomplete.getPlace();
    config.onSave({
      name: place.formatted_address,
      lat: place.geometry.location.lat(), 
      lng: place.geometry.location.lng() 
    });
  });
  $html.on('click', '.btn', function(){
    var input = container.find('[name="name"]');
    config.onSave({
      name: input.val()
    });
  });
*/

class PlaceAutocomplete extends Component{
  componentDidMount(){
    const autocomplete = new google.maps.places.Autocomplete(this.el);
    autocomplete.addListener('place_changed', ()=> {
      var place = autocomplete.getPlace();
      this.props.addAddress(place);
      /*
      config.onSave({
        name: place.formatted_address,
        lat: place.geometry.location.lat(), 
        lng: place.geometry.location.lng() 
      });
      */
    });
  }
  render(){
    return (
      <input ref={ el => this.el = el } className='form-control'/>
    );
  }
}

const Address = ({ addAddress, user, cart, address, createOrder, addresses })=> {
  const setAddress = (ev)=> {
    const address = addresses.find( address=> address.formatted_address === ev.target.value);
    addAddress({ user, cart, address });
  }
  return (
    <div>
      <Link to='/cart'>Back to cart</Link>
      <div className='well'>
        Add a new Address:
        <PlaceAutocomplete addAddress={ (address)=> addAddress({ user, cart, address }) }/>
      {
        addresses.length > 0 && (
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
        )
      }
      {
        address &&  (
          <button onClick={ ()=> createOrder({ user, cart })}  className='btn btn-primary'>Use { address.formatted_address }</button>
        )
      }
      </div>
    </div>
  );
};

export default connect(addressStateMapper, addressDispatchMapper)(Address);
