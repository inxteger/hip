'use strict'

import React,{Component} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Platform,
  DatePickerAndroid,
  DatePickerIOS,
} from 'react-native';

import PropTypes from 'prop-types';
import TitleComponent from '../alarm/TitleComponent.js';
import {GRAY,BLACK,ALARM_FILTER_BUTTON_BORDER,LINE} from '../../styles/color.js';
// import KeyboardSpacer from '../KeyboardSpacer.js';
import ListSeperator from '../ListSeperator';
import Button from '../Button.js';
import Bottom from '../Bottom.js';
import Text from '../Text';
import TouchFeedback from '../TouchFeedback';
import Icon from '../Icon.js';
import moment from 'moment';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

export default class DateInputGroup extends Component{
  constructor(props){
    super(props);
    this.state = {rowType:'',openDatePicker:false};
  }
  async _showPicker(type) {
    if(Platform.OS === 'android'){
      try {
        console.warn('_showPicker,type',type);
        var value = undefined;
        if (type==='StartTime') {
          value = this.props.startTime || undefined;
        }else if (type==='EndTime') {
          value = this.props.endTime || undefined;
        }
        var date = moment(value);
        var options = {date:date.toDate()}
        var {action, year, month, day} = await DatePickerAndroid.open(options);
        // console.warn('date',year,month,day);
        if (action !== DatePickerAndroid.dismissedAction) {
          var date = moment({year,month,day,hour:8});//from timezone
          // console.warn('moment',date);
          this.props.onChanged(type,date.toDate());
        }

      } catch ({code, message}) {
        // console.warn(`Error in example '${stateKey}': `, message);
      }
    }
  }
  _getDatePicker(dateType){
    var type = this.state.rowType;
    if(Platform.OS === 'ios' && this.state.openDatePicker && type===dateType){
      var value = undefined;
      if (type==='StartTime') {
        value = this.props.startTime || undefined;
      }else if (type==='EndTime') {
        value = this.props.endTime || undefined;
      }
      var date = moment(value);
      // console.warn('_getDatePicker',value,date);
      return (
        <DatePickerIOS style={{borderTopWidth:1,borderColor:LINE}} date={date.toDate()} mode="date"
          onDateChange={(date1)=>{
              this.props.onChanged(type,date1);
            }} />
      );
    }
    return null;
  }
  _getNavIcon(isNav){
    if(isNav){
      return (
        <Icon type='arrow_right' size={16} color={GRAY} />
      )
    }
  }
  _getValueText(rowData)
  {
    var value = rowData.value;
    var placeholderText=localStr('lang_record_des33');
    if (rowData.type==='EndTime') {
      placeholderText=localStr('lang_record_des34');
    }
    if (!rowData.value) {
      return (
        <Text style={styles.placeholderStyle}>
          {placeholderText}
        </Text>
      );
    }else {
      return (
        <Text numberOfLines={1} lineBreakModel='charWrapping' style={[styles.valueText,{flex:1,}]}>
          {value}
        </Text>
      );
    }
  }
  _getSimpleRow(rowData){
    return (
      <TouchFeedback style={[{backgroundColor:'white'},styles.rowHeight]} onPress={()=>{
        if(rowData.isNav){
          // this.props.onRowClick(rowData.type);
          this.setState({
            openDatePicker:false,
          });
        }else if (rowData.type==='StartTime'||rowData.type==='EndTime') {
            var enableEditStartTime = true;
            if (rowData.type==='EndTime'||enableEditStartTime) {
              this.setState({
                rowType:rowData.type,
                openDatePicker:!this.state.openDatePicker,
              });
              this._showPicker(rowData.type);
              // this.props.onRowClick(rowData.type)
            }
          }}}>
        <View style={[styles.row,styles.rowHeight]}>
          <Text style={styles.titleText}>
            {rowData.title}
          </Text>
          <View style={{flex:1,alignItems:'center', justifyContent:'flex-end', flexDirection:'row',marginLeft:16}}>
            {this._getValueText(rowData)}
          </View>
        </View>
      </TouchFeedback>
    );
  }
  _getStartTimeRow()
  {
    return this._getSimpleRow({'title':localStr('lang_record_des35'),'value':this.props.startTime,'isNav':false,type:'StartTime'});
  }
  _getEndTimeRow()
  {
    return this._getSimpleRow({'title':localStr('lang_record_des36'),'value':this.props.endTime,'isNav':false,type:'EndTime'});
  }
  _getContent(){
    return(
      <View style={{flex:1,borderWidth:1,borderColor:ALARM_FILTER_BUTTON_BORDER}}>
        {this._getStartTimeRow()}
        {this._getDatePicker('StartTime')}
        <ListSeperator/>
        {this._getEndTimeRow()}
        {this._getDatePicker('EndTime')}
      </View>
  );
    // <KeyboardSpacer />
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.warn('nextProps',nextProps.selectedIndexes);
    // if(nextProps.text === this.props.text){
    //   return false;
    // }
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

DateInputGroup.propTypes = {
  title:PropTypes.string,
  startTime:PropTypes.string,
  endTime:PropTypes.string,
  onChanged:PropTypes.func,
}


var styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'column'
  },
  inputStyle:{
    flex:1,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    textAlignVertical:'center',
    fontSize:15,
    color:BLACK,
    padding:0,
    marginLeft:16,
    // backgroundColor:'red',
    height:45,
  },
  inputWrapper:{
    borderColor:'gray',
    borderWidth:1,
  },
  itemContainer:{
  },

  rowHeight:{
    height:36,
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    // flex:1,
    backgroundColor:'white',
    justifyContent:'space-between',
    paddingHorizontal:12,
  },
  titleText:{
    fontSize:15,
    color:'black',
    // flex:1,
    // backgroundColor:'white',
  },
  placeholderStyle:{
    fontSize:15,
    color:GRAY,
  },
  valueText:{
    textAlign:'right',
    marginLeft:10,
    fontSize:15,
    color:'#009530'
  },

});
