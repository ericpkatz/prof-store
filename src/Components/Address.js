import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

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

const Address = ({ addAddress })=> {
  return (
    <div>
      <Link to='/cart'>Back to cart</Link>
      <div className='well'>
        Add an Address:
        <PlaceAutocomplete addAddress={ addAddress }/>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch)=> {
  return {
    addAddress: (address)=> {
      console.log(address);
    }
  }
}

export default connect(null, mapDispatchToProps)(Address);
