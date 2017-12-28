'use strict'

import React,{Component,} from 'react';

import {View} from 'react-native';
import PropTypes from 'prop-types';

import {LINE} from '../styles/color.js';



export default class ListSeperator extends Component {
  constructor(props){
    super(props);
  }
  render () {
    return (
      <View style={{height:1,backgroundColor:LINE}}></View>
    )
  }
}
