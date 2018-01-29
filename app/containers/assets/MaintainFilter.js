
'use strict';
import React,{Component} from 'react';

import {
  InteractionManager,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import moment from 'moment';
import backHelper from '../../utils/backHelper';

import MaintanceUserSelect from './MaintanceUserSelect.js';
import MaintancePartsSelect from './MaintancePartsSelect.js';
import {filterMaintanceChanged,filterMaintanceClosed,
  filterMaintanceDidChanged,resetMaintanceFilterData,updateMaintanceUserSelectInfo,updateMaintancePartsSelectInfo} from '../../actions/assetsAction.js';
import MaintainFilterView from '../../components/assets/MaintainFilterView.js';
import {localStr,localFormatStr,getLanguage} from '../../utils/Localizations/localization.js';

class MaintainFilter extends Component{
  constructor(props){
    super(props);

  }
  componentDidMount() {
    // InteractionManager.runAfterInteractions(()=>{
      // this.props.loadAlarmCode();
      // this.props.loadAlarmBuildings();
    // });
    backHelper.init(this.props.navigator,this.props.route.id);
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {
    backHelper.destroy(this.props.route.id);
    this.props.resetMaintanceFilterData();
  }
  _checkTimeIsTrue()
  {
    var StartTime = this.props.filter.get('StartTime');
    var EndTime = this.props.filter.get('EndTime');
    if(StartTime > EndTime){
      Alert.alert(
        '',
        localStr('lang_ticket_starttimeerr0'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () => console.log('Cancel Pressed')}
        ]
      )
      return false;
    }
    if(moment(StartTime) > moment()||moment(EndTime) > moment()){
      Alert.alert(
        '',
        localStr('lang_asset_des11'),
        [
          {text: localStr('lang_ticket_OK'), onPress: () => console.log('Cancel Pressed')}
        ]
      )
      return false;
    }

    return true;
  }
  _onSelectMaintanceUsersClick()
  {
    this.props.updateMaintanceUserSelectInfo({type:'init',value:this.props.selectUsers});
    var customerId=this.props.customerId;
    var hierarchyId=this.props.hierarchyId;
    if (!this.props.customerId) {
      // customerId=321238;
      // hierarchyId=345761;//321637;//test
    }
    this.props.navigator.push({
        id:'ticket_users',
        component:MaintanceUserSelect,
        passProps:{
          title:localStr('lang_record_des02'),
          customerId:customerId,
          hierarchyId:hierarchyId
        }
      });
  }
  _onSelectParts()
  {
    this.props.updateMaintancePartsSelectInfo({type:'init',value:this.props.selectParts});
    var customerId=this.props.customerId;
    var hierarchyId=this.props.hierarchyId;
    if (!this.props.customerId) {
      // customerId=321238;
      // hierarchyId=345761;//321637;//test
    }
    this.props.navigator.push({
        id:'ticket_users',
        component:MaintancePartsSelect,
        passProps:{
          title:localStr('lang_record_des04'),
          customerId:customerId,
          hierarchyId:hierarchyId
        }
      });
  }
  render() {
    // console.warn('filterview...',this.props.selectUsers.size);
    return (
      <MaintainFilterView
        filter={this.props.filter}
        isFetching={this.props.isFetching}
        codes={this.props.codes.toArray()}
        bugCodes={this.props.bugCodes}
        bugResults={this.props.bugResults.toArray()}
        selectUsers={this.props.selectUsers}
        selectParts={this.props.selectParts}
        onSelectUsers={()=>{
          this._onSelectMaintanceUsersClick();
        }}
        onSelectParts={()=>{
          this._onSelectParts();
        }}
        onClose={()=>{
          this.props.filterMaintanceClosed();
          this.props.navigator.pop()}}
        doFilter={()=>{
          if (!this._checkTimeIsTrue()) {
            return;
          }
          this.props.filterMaintanceDidChanged(this.props.filter);
          this.props.navigator.pop();
        }}
        filterChanged={(type,value)=>this.props.filterMaintanceChanged({type,value})}/>
    );
  }
}

MaintainFilter.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  bugCodes:PropTypes.object,
  filter:PropTypes.object,
  isFetching:PropTypes.bool,
  codes:PropTypes.object,
  bugResults:PropTypes.object,
  doFilter:PropTypes.func,
  selectUsers:PropTypes.object,
  selectParts:PropTypes.object,
  filterMaintanceChanged:PropTypes.func,
  filterMaintanceClosed:PropTypes.func,
  resetMaintanceFilterData:PropTypes.func,
  // loadAlarmCode:PropTypes.func,
  // loadAlarmBuildings:PropTypes.func,
  filterMaintanceDidChanged:PropTypes.func,
  updateMaintanceUserSelectInfo:PropTypes.func,
  updateMaintancePartsSelectInfo:PropTypes.func,
}

function mapStateToProps(state) {
  var maintainFilter = state.asset.maintainFilter;
  var filter = maintainFilter.get('temp');
  var selectUsers = maintainFilter.get('selectUsers');
  var selectParts = maintainFilter.get('selectParts');
  return {
    filter,
    bugCodes:maintainFilter.get('bugCodes'),
    isFetching:maintainFilter.get('isFetching'),
    codes:maintainFilter.get('filterCodes'),
    bugResults:maintainFilter.get('filterProcessResult'),
    selectUsers,
    selectParts,
  };
}

export default connect(mapStateToProps,{
  filterMaintanceChanged,filterMaintanceDidChanged,resetMaintanceFilterData,filterMaintanceClosed,updateMaintanceUserSelectInfo,updateMaintancePartsSelectInfo})(MaintainFilter);
