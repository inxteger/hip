'use strict'
import React,{Component,PropTypes} from 'react';

import {
  View,
} from 'react-native';

import privilegeHelper from '../utils/privilegeHelper.js';

export default class PrivilegePanel extends Component {
  render() {
    var {code} = this.props;
    if(!privilegeHelper.hasAuth(code)){
      return null;
    }
    return (
      <View>
        {this.props.children}
      </View>
    )
  }
}

PrivilegePanel.propTypes = {
  hasAuth:PropTypes.func,
  code:PropTypes.string,
  children:PropTypes.object,
}
