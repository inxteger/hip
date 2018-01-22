
'use strict';
import React,{Component} from 'react';
import {
  ListView,
  InteractionManager,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {Navigator} from 'react-native-deprecated-custom-components';

import {connect} from 'react-redux';
import backHelper from '../../utils/backHelper';

import {loadMaintainceRecords,firstPage,nextPage,clearMaintanceFilter,deleteRecord} from '../../actions/assetsAction.js';
import MaintainRecordsView from '../../components/assets/MaintainRecordsView.js';
import MaintainFilter from './MaintainFilter.js';
import MRecordDetail from './MRecordDetail.js';
import Immutable from 'immutable';

class MaintainRecords extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var data = props.recordData.get('data');
    if (data) {
      data = data.toArray();
      this.state = { dataSource:this.ds.cloneWithRows(data)};
    }else {
      this.state = { dataSource:null};
    }
  }
  _loadAlarms(filter){
    // console.warn('filter',filter.toJSON());
    filter=filter.setIn(['Criteria','HierarchyId'],this.props.hierarchyId);
    this.props.loadMaintainceRecords(filter.toJSON());
  }
  _onPostingCallback(type){
    // InteractionManager.runAfterInteractions(() => {
      this._refreshOnFocus = true;
    // });
  }
  _filterClick(){
    this.props.navigator.push({
      id:'alarm_filter',
      component:MaintainFilter,
      sceneConfig:Navigator.SceneConfigs.FloatFromBottom,
      passProps:{
        customerId:this.props.customerId,
        hierarchyId:this.props.hierarchyId
      }
    });
  }
  _onAddClick(){
    this.props.navigator.push({
      id:'record_detail',
      component:MRecordDetail,
      passProps:{
        hierarchyId:this.props.hierarchyId,
        onPostingCallback:(type)=>{this._onPostingCallback(type)},
      }
    });
  }
  _gotoDetail(recordId){
    this.props.navigator.push({
      id:'record_detail',
      component:MRecordDetail,
      passProps:{
        recordId:recordId,
        onPostingCallback:(type)=>{this._onPostingCallback(type)},
      }
    });
  }
  _delete(rowData){
    // console.warn('user',log.get('CreateUserName'),this.props.user.get('RealName'));
    if(rowData.get('MaintainPerson') !== this.props.user.get('RealName')){
      Alert.alert('','仅创建者可以删除此维修历史');
      return;
    }
    // if(!this._showAuth()){
    //   return;
    // }
    Alert.alert(
      '',
      '删除此条设备维修历史记录？',
      [
        {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: '删除', onPress: () => {
          this.props.deleteRecord(rowData.get('AutoId'));
        }}
      ]
    )
  }
  _onRefresh(){
    if (this.props.filter.get('PageIndex')===1) {
      this._loadAlarms(this.props.filter);
    }else {
      this.props.firstPage();
    }
  }
  _bindEvent(){
    var navigator = this.props.navigator;
    // console.warn('navigator',navigator);
    if (navigator) {
      var callback = (event) => {
        if(!event.data.route || !event.data.route.id || (event.data.route.id === 'main')){
          if(this._refreshOnFocus){
            this._onRefresh();
            this._refreshOnFocus = false;
          }
        }
      };
      // Observe focus change events from the owner.
      this._listener= navigator.navigationContext.addListener('didfocus', callback);
    }
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      if(!this.props.recordData.get('data')){
        this._loadAlarms(this.props.filter);
      }

    });
    // setInterval(()=>this._onRefresh(),10000);
    this._bindEvent();
    // backHelper.init(this.props.navigator,'alarm');
  }
  componentWillReceiveProps(nextProps) {
    var data = nextProps.recordData.get('data');
    var origData = this.props.recordData.get('data');
    // console.warn('componentWillReceiveProps...',data,origData);
    if((data !== origData) && data){// && data.size >= 1){
      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      InteractionManager.runAfterInteractions(()=>{
        this.setState({dataSource:this.ds.cloneWithRows(data.toArray())});
      });
    }

    if(this.props.filter !== nextProps.filter){
      InteractionManager.runAfterInteractions(()=>{
        this._loadAlarms(nextProps.filter);
      });
    }
  }
  componentWillUnmount() {
    backHelper.destroy('alarm');
  }
  render() {
    return (
      <MaintainRecordsView
        loadAlarm={()=>this._loadAlarm()}
        isFetching={this.props.recordData.get('isFetching')}
        listData={this.state.dataSource}
        hasFilter={this.props.hasFilter}
        nextPage={()=>this.props.nextPage()}
        clearFilter={()=>this.props.clearMaintanceFilter()}
        currentPage={this.props.filter.get('PageIndex')}
        onRefresh={()=>this._onRefresh()}
        totalPage={this.props.recordData.get('pageCount')}
        onFilterClick={()=>this._filterClick()}
        onAddClick={()=>this._onAddClick()}
        onRowClick={(rowData)=>this._gotoDetail(rowData.get('AutoId'))}
        onRowLongPress={(rowData)=>this._delete(rowData)}
        />
    );
  }
}

MaintainRecords.propTypes = {
  navigator:PropTypes.object,
  route:PropTypes.object,
  user:PropTypes.object,
  recordData:PropTypes.object,
  filter:PropTypes.object,
  customerId:PropTypes.number,
  hierarchyId:PropTypes.number,
  hasFilter:PropTypes.bool,
  loadMaintainceRecords:PropTypes.func,
  firstPage:PropTypes.func,
  nextPage:PropTypes.func,
  clearMaintanceFilter:PropTypes.func,
  deleteRecord:PropTypes.func,
}


function mapStateToProps(state) {
  var maintainFilter = state.asset.maintainFilter;
  var filter=maintainFilter.get('stable');
  return {
    user:state.user.get('user'),
    recordData:state.asset.maintainRecordData,
    hasFilter: maintainFilter.get('hasFilter'),
    filter,
  };
}

export default connect(mapStateToProps,{loadMaintainceRecords,firstPage,nextPage,clearMaintanceFilter,deleteRecord})(MaintainRecords);
