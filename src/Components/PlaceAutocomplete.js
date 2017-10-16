import React, { Component } from 'react';

export default class PlaceAutocomplete extends Component{
  componentDidMount(){
    const autocomplete = new google.maps.places.Autocomplete(this.el);
    autocomplete.addListener('place_changed', ()=> {
      const place = autocomplete.getPlace();
      this.props.addAddress(place);
      this.el.value = '';
    });
  }
  shouldComponentUpdate(){
    return false;
  }
  render(){
    return (
      <input ref={ el => this.el = el } className='form-control'/>
    );
  }
}
