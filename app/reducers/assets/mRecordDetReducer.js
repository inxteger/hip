'use strict';

import {
  MAINTANCE_DETAIL_REQUEST, MAINTANCE_DETAIL_SUCCESS, MAINTANCE_DETAIL_FAILURE,
  MAINTANCE_DETAIL_CHANGED,
  MAINTANCE_MOIDFY_DETAIL_REQUEST, MAINTANCE_MOIDFY_DETAIL_SUCCESS, MAINTANCE_MOIDFY_DETAIL_FAILURE,
  RECORD_EDIT_INFO_RESET,
  CREATE_RECORD_DATA_INIT,
  // ,
  // ,
  // USER_SELECT_CHANGED,
  // ASSET_SELECT_CHANGED,
  // TICKET_CREATE_REQUEST,
  // TICKET_CREATE_SUCCESS,
  // TICKET_CREATE_FAILURE,
  // TICKET_CREATE_RESET,
  // ASSETS_USERS_REQUEST,
  // ASSETS_USERS_SUCCESS,
  // ASSETS_USERS_FAILURE,
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

  // TicketType:0,
  // Assets:[],
  // StartTime:today,
  // EndTime:today,
  // Executors:[],
  // Content:'',
  // alarm:null,
  // isFetching:true,
  // isPosting:1,
  // selectUsers:[],
  // selectAssets:[],
});

// function initData(state,action) {
//   var {data:{type}}=action;
//   var newState=state;
//   if (type==='createNormalTicket') {
//     newState=_initCreateTicket(state,action);
//   }else if (type==='createAlarmTicket') {
//     newState=_initCreateAlarmTicket(state,action);
//   }else if (type==='editNormalTicket') {
//     newState=_initEditTicket(state,action);
//   }
//   return newState;
// }

function updateDetailData(state,action) {

}

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
  return state.set('data',Immutable.fromJS(objData)).
               set('recordId',resRecordId).
               set('isFetching',false);
}

function initCreateRecord(state,action) {
  var {data:{hierarchyId}}=action;
  state=state.set('data',Immutable.fromJS(
    {
      "AutoId": 0,
      "HierarchyId": hierarchyId,
      "MaintainPerson": "",
      // "CreateUserId": ,
      "UpdateTime": "",
      "MaintainTime": "",
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
// function _initCreateAlarmTicket(state,action) {
//   var {data:{value}}=action;
//   var {alarm,customer}=value;
//   var today = moment().format('YYYY-MM-DD');
//   state=state.set('CustomerId',customer.get('CustomerId'))
//             .set('TicketType',2)
//             .set('StartTime',today)
//             .set('EndTime',today)
//             .set('alarm',alarm)
//             .set('Assets',Immutable.fromJS([{'Name':alarm.get('DeviceName'),'Id':alarm.get('HierarchyId')}]))
//             .set('selectAssets',Immutable.fromJS([{'Name':alarm.get('DeviceName'),'Id':alarm.get('HierarchyId')}]))
//             .set('Executors',Immutable.fromJS([]))
//             .set('selectUsers',Immutable.fromJS([]))
//             .set('isFetching',false)
//             .set('isPosting',1)
//             .set('Content',getAlarmDescri(alarm));
//   console.warn('_initCreateAlarmTicket',state.get('Assets'),state.get('selectAssets'));
//   return state;
// }
//
// function _initEditTicket(state,action) {
//   var {data:{value}}=action;
//   var {ticket,customer}=value;
//   var startTime = moment(ticket.get('StartTime')).format('YYYY-MM-DD');
//   var endTime = moment(ticket.get('EndTime')).format('YYYY-MM-DD');
//   var arr = ticket.get('Executors');
//   var selectUsers = [];
//   arr.forEach((item)=>{
//     selectUsers.push({'Id':item.get('UserId'),'RealName':item.get('UserName')});
//   });
//   var arrAss = ticket.get('Assets');
//   var selectAssets = [];
//   arrAss.forEach((item)=>{
//     selectAssets.push({'Id':item.get('HierarchyId'),'Name':item.get('HierarchyName')});
//   });
//   var ticketType = ticket.get('TicketType');
//   // var enableEditStartTime = ticket.get('Status')<2;
//   state=state.set('CustomerId',customer.get('CustomerId'))
//             .set('TicketType',ticketType)
//             .set('StartTime',startTime)
//             .set('EndTime',endTime)
//             .set('Assets',Immutable.fromJS(selectAssets))
//             .set('selectAssets',Immutable.fromJS(selectAssets))
//             .set('Executors',Immutable.fromJS(selectUsers))
//             .set('selectUsers',Immutable.fromJS(selectUsers))
//             .set('Content',Immutable.fromJS(ticket.get('Content')))
//             .set('isFetching',false)
//             .set('isPosting',1);
//   return state;
// }
//
function postDataSuccess(state,action) {
  if (action.response.Result.Message) {
    action.error = '数据提交失败';
    return state.set('isPosting',3);
  }
  return state.set('isPosting',2);
}
function conditionChanged(state,action) {
  var newState = state;
  var {data:{type,value}} = action;
  //FaultPhenomenon,FaultJudgeText,FaultRemoval
  // if (type==='StartTime') {
  //   var startTime = moment(value).format('YYYY-MM-DD');
  //   newState = newState.set('StartTime',startTime);
  // }else if (type==='EndTime') {
  //   var endTime = moment(value).format('YYYY-MM-DD');
  //   newState = newState.set('EndTime',endTime);
  // }else
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
    //MAINTANCE_DETAIL_SUCCESS, MAINTANCE_DETAIL_FAILURE

    case CREATE_RECORD_DATA_INIT:
      return initCreateRecord(state,action);
    case MAINTANCE_DETAIL_CHANGED:
      return conditionChanged(state,action);
    case MAINTANCE_MOIDFY_DETAIL_REQUEST:
      return state.set('isPosting',1);
    case MAINTANCE_MOIDFY_DETAIL_SUCCESS:
      return postDataSuccess(state,action);
    case MAINTANCE_MOIDFY_DETAIL_FAILURE:
      return state.set('isPosting',3);
    // case USER_SELECT_CHANGED:
    //   return userSelectInfoChange(state,action);
    // case ASSET_SELECT_CHANGED:
    //   return assetsSelectInfoChange(state,action);
    // case ASSETS_USERS_SUCCESS:
    //   return updateAssetsUsers(state,action);
    // case TICKET_CREATE_REQUEST:
    //   return state.set('isPosting',1);
    // case TICKET_CREATE_SUCCESS:
    //   return state.set('isPosting',2);
    // case TICKET_CREATE_FAILURE:
    //   return state.set('isPosting',3);
    case RECORD_EDIT_INFO_RESET:
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
