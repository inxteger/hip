'use strict'

import React,{Component} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Text from '../Text';
import Icon from '../Icon.js';
import TouchFeedback from '../TouchFeedback.js';

import TitleComponent from '../alarm/TitleComponent.js';
import {GRAY,BLACK,ALARM_FILTER_BUTTON_BORDER} from '../../styles/color.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';
// import KeyboardSpacer from '../KeyboardSpacer.js';

export default class StatableClickGroup extends Component{
  constructor(props){
    super(props);
  }
  _getNavIcon(){
    // if(item.isNav){
      return (
        <View style={{}}>
          <Icon type='arrow_right' size={17} color={GRAY} />
        </View>

      )
    // }
  }
  _getContent(){
    var textStyle=styles.titleText;
    var textValue=this.props.text;
    if (!textValue) {
      textValue=this.props.placeholderText;
    }
    return(
      <TouchFeedback
        onPress={()=>{
          this.props.onRowClick();
        }}>
      <View style={{flex:1,borderWidth:1,borderColor:ALARM_FILTER_BUTTON_BORDER,
        flexDirection:'row',alignItems:'center',height:38,paddingHorizontal:12,
      justifyContent:'space-between'}}>
        <Text style={textStyle} numberOfLines={1}>
          {textValue}
        </Text>
        {this._getNavIcon()}
      </View>
      </TouchFeedback>
  );
    // <KeyboardSpacer />
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.warn('nextProps',nextProps.selectedIndexes);
    if(nextProps.text === this.props.text){
      return false;
    }
    return true;
  }

  render() {
    return (
      <TitleComponent title={this.props.title}>
        {this._getContent()}
      </TitleComponent>

    );
  }
}

StatableClickGroup.propTypes = {
  title:PropTypes.string,
  text:PropTypes.string,
  placeholderText:PropTypes.string,
  onChanged:PropTypes.func,
  onRowClick:PropTypes.func,
}


var styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'column'
  },
  inputStyle:{
    // flex:1,
    // justifyContent:'flex-start',
    // alignItems:'flex-start',
    // textAlignVertical:'center',
    fontSize:15,
    color:BLACK,
    // padding:0,
    marginLeft:12,
    // backgroundColor:'red',
    height:45,
  },
  titleText:{
    fontSize:15,
    color:GRAY
  },
  inputWrapper:{
    borderColor:'gray',
    borderWidth:1,
  },
  itemContainer:{


  },

});
