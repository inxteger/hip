'use strict';


import {
  MAINTANCE_FILTER_CHANGED,
  MAINTANCE_FILTER_DIDCHANGED,
  MAINTANCE_FIRSTPAGE,
  MAINTANCE_NEXTPAGE,
  // ALARM_CODE_REQUEST,
  // ALARM_CODE_SUCCESS,
  // ALARM_BUILDING_SUCCESS,
  // ALARM_BUILDING_FAILURE,
  MAINTANCE_FILTER_CLEAR,
  MAINTANCE_FILTER_CLOSED,
  MAINTANCE_FILTER_RESET,
  MAINTANCE_USER_SELECT_CHANGED,
  MAINTANCE_PART_SELECT_CHANGED,
  // ALARM_LOAD_SUCCESS
} from '../../actions/assetsAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import {compose} from 'redux';
import Immutable from 'immutable';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

import moment from 'moment';
moment.locale('zh-cn');

var today = moment();
var lastMonth=moment(today).subtract(1,'M').format('YYYY-MM-DD');
var nextMonth=moment(today).format('YYYY-MM-DD');

var defaultState = Immutable.fromJS({
    hasFilter:false,
    isFetching:false,
    bugCodes:[{'Code':2,'Type':'操作不当'},{'Code':4,'Type':'自然老化'},{'Code':8,'Type':'设计缺陷'},
    {'Code':16,'Type':'维修不当'},{'Code':32,'Type':'维护不当'},{'Code':1,'Type':'其他原因'}],
    bugResults:[{'Code':1,'Type':'故障排除完成'},{'Code':2,'Type':'临时处理完成'},{'Code':3,'Type':'设备未修复'}],
    filterCodes: ['操作不当','自然老化','设计缺陷','维修不当','维护不当','其他原因'],
    filterProcessResult:['故障排除完成','临时处理完成','设备未修复'],
    selectUsers:[],
    selectParts:[],
    stable:{
      PageIndex:1,
      PageSize:20,
      StartTime:null,
      EndTime:null,
      Criteria:{
        HierarchyId:345654,
        MaintainPersons:[],
        BeginTime:null,
        EndTime:null,
        Parts:[],
        FaultJudgeType:[],
        DealResult:[],
      }
    },
    temp:{
      StartTime:null,
      EndTime:null,
      MaintainPersons:[],
      Parts:[],
      FaultJudgeType:[],
      DealResult:[],
    },
    temp1:{
      StartTime:null,
      EndTime:null,
      MaintainPersons:[],
      Parts:[],
      FaultJudgeType:[],
      DealResult:[],
    },
});

function mergeTempFilter(state,action) {
  var newState = state;

  var temp = newState.get('temp');
  var {type,value} = action.data;
  console.warn('mergeTempFilter',type,value);
  if (type==='StartTime'||type==='EndTime') {
    var strDate = moment(value).format('YYYY-MM-DD');
    temp = temp.set(type,strDate);
  }else {
    var typeValue = temp.get(type);
    var index = typeValue.findIndex((item)=> item === value);
    if(index < 0){
      typeValue=typeValue.unshift(value);
    }else {
      typeValue=typeValue.remove(index);
    }
    temp = temp.set(type,typeValue);

    // console.warn('mergeTempFilter...',type,value,typeValue);
  }
  return newState.set('temp',temp);
}

function mappingMaintanceCode(state,arrIndex) {
  if(!arrIndex) return null;
  var filterCodes = state.get('filterCodes');
  var arrCodes=[];
  arrIndex.forEach((index)=>{
    var text = filterCodes.get(index);
    var result = state.get('bugCodes').find((item)=>{
      return item.get('Type').indexOf(text) >= 0;
    });
    if(result){
      arrCodes.push(parseInt(result.get('Code')));
    }
  });
  // var arrOtherCodes=null;
  // if (arrIndex.includes(6)) {
  //   arrOtherCodes=state.get('codes').filterNot((item) => {
  //     return filterCodes.includes(item.get('Type'))
  //   }).map((item)=> item.get('Code'));
  // }
  // console.warn(
  //   'mappingAlarmCode...',arrCodes,arrOtherCodes.toArray()
  // );
  // if (arrOtherCodes) {
  //   arrCodes.push(arrOtherCodes.toArray());
  // }
  // var strCodes=arrCodes.map((item)=> parseInt(item)).join(',');
  // console.warn('mappingMaintanceCode',strCodes);
  return arrCodes;
}

function mappingDealResults(state,arrIndex) {
  if(!arrIndex) return null;
  var filterCodes = state.get('filterProcessResult');
  var arrCodes=[];
  arrIndex.forEach((index)=>{
    var text = filterCodes.get(index);
    var result = state.get('bugResults').find((item)=>{
      return item.get('Type').indexOf(text) >= 0;
    });
    if(result){
      arrCodes.push(result.get('Code'));
    }
  });
  // var strCodes=arrCodes.map((item)=> item).join(',');
  return arrCodes;
}

function convertPersons(state) {
  // var persons = state.getIn(['temp','maintainPersons']);
  var arrDatas=state.get('selectUsers');
  var arrIds=arrDatas.map((item,index)=>{
    return item.get('RealName');
  });
  return state.setIn(['stable','Criteria','MaintainPersons'],arrIds);
}

function convertParts(state) {
  // var parts = state.getIn(['temp','parts']);
  var arrDatas=state.get('selectParts');
  var arrIds=arrDatas.map((item,index)=>{
    return item.get('Id');
  });
  return state.setIn(['stable','Criteria','Parts'],arrIds);
}

function convertJudgeTyps(state) {
  var results = state.getIn(['temp','FaultJudgeType']);
  var strArr = mappingMaintanceCode(state,results);
  return state.setIn(['stable','Criteria','FaultJudgeType'],strArr);
}

function convertDealResults(state) {
  var results = state.getIn(['temp','DealResult']);
  var strArr = mappingDealResults(state,results);
  return state.setIn(['stable','Criteria','DealResult'],strArr);
}

function convertDates(state) {
  return state.setIn(['stable','Criteria','BeginTime'],state.getIn(['temp','StartTime']))
  .setIn(['stable','Criteria','EndTime'],state.getIn(['temp','EndTime']));
}

function mergeStableFilter(state,action) {
  console.warn('mergeStableFilter...',action);
  var newState = compose(convertPersons,convertParts,convertJudgeTyps,convertDealResults,convertDates)(state);
  newState = newState.setIn(['stable','PageIndex'],1);
  newState = newState.set('temp1',Immutable.fromJS(newState.get('temp').toJSON()));

  return newState.set('hasFilter',true);
}

function nextPage(state,action) {
  var stable = state.get('stable');
  stable = stable.set('PageIndex',stable.get('PageIndex')+1);
  return state.set('stable',stable);
}

function firstPage(state,action) {
  var stable = state.get('stable');
  stable = stable.set('PageIndex',1);

  return state.set('stable',stable);
}

function clearFilter(state,action) {
  return defaultState;
}

function filterClosed(state,action) {
  var newState = state;
  if(newState.get('temp1')){
    newState = newState.set('temp',newState.get('temp1'));
  }

  return newState;
}

function userSelectInfoChange(state,action){
  var {data:{type,value}}=action;
  var newState = state;
  if (type==='save') {
    newState = newState.set('selectUsers', value);
  }
  return newState;
}

function partsSelectInfoChange(state,action) {
  var {data:{type,value}}=action;
  var newState = state;
  if (type==='save') {
    newState = newState.set('selectParts', value);
  }
  return newState;
}

function resetFilter(state,action) {
  return state;//.set('bugResults',[]).set('bugCodes',null);
}

function handleError(state,action) {
  var {Error} = action.error;
  // console.warn('handleError',action);

  switch (Error) {
    case '040001307022':
      action.error = null;// localStr('lang_alarm_des1');
      break;
  }
  return state.set('isFetching',false);
}

export default function(state=defaultState,action){
  switch (action.type) {
    case MAINTANCE_FILTER_CHANGED:
      return mergeTempFilter(state,action);
    case MAINTANCE_FILTER_DIDCHANGED:
      return mergeStableFilter(state,action);
    case MAINTANCE_FILTER_CLEAR:
      return clearFilter(state,action);
    case MAINTANCE_NEXTPAGE:
      return nextPage(state,action);
    case MAINTANCE_FIRSTPAGE:
      return firstPage(state,action);
    // case ALARM_CODE_REQUEST:
    //   return state.set('isFetching',true);
    case MAINTANCE_FILTER_CLOSED:
      return filterClosed(state,action);
    case MAINTANCE_USER_SELECT_CHANGED:
      return userSelectInfoChange(state,action);
    case MAINTANCE_PART_SELECT_CHANGED:
      return partsSelectInfoChange(state,action);
    // case ALARM_CODE_SUCCESS:
      // return mergeAlarmCode(state,action);
    // case ALARM_BUILDING_SUCCESS:
      // return mergeAlarmBuilding(state,action);
    // case ALARM_BUILDING_FAILURE:
      // return handleError(state,action);
    case MAINTANCE_FILTER_RESET:
      return resetFilter(state,action);
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
