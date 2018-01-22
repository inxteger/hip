'use strict';

import {
  MAINTANCE_DETAIL_REQUEST, MAINTANCE_DETAIL_SUCCESS, MAINTANCE_DETAIL_FAILURE,
  MAINTANCE_DETAIL_CHANGED,
  MAINTANCE_MOIDFY_DETAIL_REQUEST, MAINTANCE_MOIDFY_DETAIL_SUCCESS, MAINTANCE_MOIDFY_DETAIL_FAILURE,
  RECORD_EDIT_INFO_RESET,
  CREATE_RECORD_DATA_INIT,
  MAINTANCE_PART_SELECT_CHANGED,
} from '../../actions/assetsAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';
import moment from 'moment';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

moment.locale('zh-cn');

var today = moment().format('YYYY-MM-DD');

var defaultState =  Immutable.fromJS({
  recordId:null,
  data:null,
  isFetching:true,
  isPosting:1,
  selectParts:[],
});

function recordLoadedStart(state,action){
    var {data:{recordId}} = action;
    return state.set('recordId',recordId).set('isFetching',true);
}

function recordLoadedSuccess(state,action) {
  var resRecordId = action.response.Result.Id;
  var objData=action.response.Result;
  if (objData&&objData.RemFiles) {
    objData.RemFiles.forEach((item,index)=>{
      item.FileName=item.Name;
      item.PictureId=item.Key;
      item.Name=undefined;
      item.Key=undefined;
    });
  }
  var arrDatas=[];
  objData.Parts.split('\n').map((item,index)=>{
    arrDatas.push({'Id':item,'RealName':item});
  });

  return state.set('data',Immutable.fromJS(objData)).
               set('recordId',resRecordId).
               set('isFetching',false).
               set('selectParts',arrDatas);
}

function initCreateRecord(state,action) {
  var {data:{hierarchyId,realName,userId}}=action;
  state=state.set('data',Immutable.fromJS(
    {
      "AutoId": 0,
      "HierarchyId": hierarchyId,
      "MaintainPerson": realName,
      "CreateUserId": userId,
      "UpdateTime": "",
      "MaintainTime": moment().format("YYYY-MM-DDTHH:00:00"),
      "Parts": "",
      "FaultPhenomenon": "",
      "FaultJudgeType": 0,
      "FaultJudgeText": '',
      "FaultRemoval": "",
      "DealResult": 0,
      "RemFiles": []
    }
  ));
  return state;
}

function generateName(pics,recordId,userId) {
  var time = new Date().getTime();
  return `image-maintaince--log-${recordId}-${userId}-${time}-${pics.size}`;
}

function startPostData(state,actioin) {
  return state.set('isPosting',1);
}

function postDataSuccess(state,action) {
  if (action.response.Result.Message) {
    action.error = '数据提交失败';
    return state.set('isPosting',3);
  }
  return state.set('isPosting',2);
}

function conditionChanged(state,action) {
  var newState = state;
  var {data:{type,value,action,recordId,userId}} = action;
  //FaultPhenomenon,FaultJudgeText,FaultRemoval
  if (type==='FaultPhenomenon') {
    newState = newState.setIn(['data','FaultPhenomenon'],value);
  }else if (type==='FaultJudgeText') {
    newState = newState.setIn(['data','FaultJudgeText'],value);
  }else if (type==='FaultRemoval') {
    newState = newState.setIn(['data','FaultRemoval'],value);
  }else if (type==='DealResult') {
    newState = newState.setIn(['data','DealResult'],value);
  }else if (type==='FaultJudgeType') {
    newState = newState.setIn(['data','FaultJudgeType'],value);
  }else if (type==='MaintainTime') {
    var dateTime = moment(value).format("YYYY-MM-DDTHH:00:00");
    newState = newState.setIn(['data','MaintainTime'],dateTime);
  }else if (type==='image') {
    var pics = newState.getIn(['data','RemFiles']);
    if(action === 'add'){
      //[{name,uri}]
      value.forEach((item)=>{
        pics = pics.push(
          Immutable.Map({
            PictureId:generateName(pics,recordId,userId),
            uri:item.uri
          }));
      })

    }
    else if (action === 'uploaded') {
      // console.warn('uploaded');
      var index = pics.findIndex((item)=>item === value);
      if (index!==-1) {
        pics = pics.update(index,(item)=>item.set('loaded',true));
      }
    }
    else if (action === 'delete'){
      var index = pics.findIndex((item)=>item === value);
      if (index!==-1) {
        pics = pics.delete(index);
      }
    }
    // console.warn('pics',pics);
    return newState.setIn(['data','RemFiles'],pics);
  }
  return newState;
}

function partsSelectInfoChange(state,action) {
  var {data:{type,value}}=action;
  var newState = state;
  var data=state.get('data');
  if (!data) {
    return state;
  }
  if (type==='save') {
    console.warn('aaaaa',value);
    var strValues='';
    if (value&&value.size>0) {
      strValues=value.get(0).get('Id');
    }
    newState = newState.set('selectParts', value)
    .setIn(['data','Parts'],strValues);
  }
  return newState;
}

export default function(state=defaultState,action){
  switch (action.type) {
    case MAINTANCE_DETAIL_REQUEST:
      return recordLoadedStart(state,action);
    case MAINTANCE_DETAIL_SUCCESS:
      return recordLoadedSuccess(state,action);
    case MAINTANCE_DETAIL_REQUEST:
      return state.set('isFetching',false);
    case CREATE_RECORD_DATA_INIT:
      return initCreateRecord(state,action);
    case MAINTANCE_DETAIL_CHANGED:
      return conditionChanged(state,action);
    case MAINTANCE_MOIDFY_DETAIL_REQUEST:
      return startPostData(state,action);
    case MAINTANCE_MOIDFY_DETAIL_SUCCESS:
      return postDataSuccess(state,action);
    case MAINTANCE_MOIDFY_DETAIL_FAILURE:
      return state.set('isPosting',3);
    case MAINTANCE_PART_SELECT_CHANGED:
      return partsSelectInfoChange(state,action);
    case RECORD_EDIT_INFO_RESET:
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
