'use strict';


import {
  ASSET_MAINTAINCE_REQUEST,
  ASSET_MAINTAINCE_SUCCESS,
  ASSET_MAINTAINCE_FAILURE,
  MAINTANCE_FILTER_DIDCHANGED,
  MAINTANCE_RECORD_DELETE_REQUEST, MAINTANCE_RECORD_DELETE_SUCCESS, MAINTANCE_RECORD_DELETE_FAILURE,
  DEVICE_EXIT,
} from '../../actions/assetsAction.js';

// import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';
import {commonReducer} from '../commonReducer.js';

import Immutable from 'immutable';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
  data:null,
  pageCount:0,
  isFetching:false,
  sectionData:[],
  allDatas:null,
});

function categoryAllDatas(state)
{
  var newState = state;
  var Items = newState.get('data');

  // var listStatus1 = [];
  // var listStatus2 = [];
  // Items.forEach((item)=>{
  //   if (!item.get('SecureTime')) {
      // listStatus1.push(item);
  //   }else{
  //     listStatus2.push(item);
  //   }
  // });
  // var sectionTitle = [];
  // var allDatas = [];
  // sectionTitle.push('toolbar');
  // if (listStatus1.length>0) {
    // allDatas.push(listStatus1);
  // }
  // if (listStatus2.length>0) {
    // allDatas.push(listStatus2);
    // sectionTitle.push(localStr('lang_alarm_already_resolved'));
  // }
  // console.warn('categoryAllDatas',allDatas);
  newState=newState.set('sectionData',null).set('data',Immutable.fromJS(Items));
  return newState;
}

function mergeData(state,action) {
  var response = action.response.Result;
  var newState = state;
  var page = action.body.PageIndex;

  var items = response.Items;
  // items.forEach((item)=>{
  //   item.Status.push({'Timestamp':item.AlarmTime, 'Content':localStr('lang_alarm_create'),User:'self'});
  //   if (!!item.SecureTime) {
  //     item.Status.unshift({'Timestamp':item.SecureTime, 'Content':localStr('lang_alarm_des0'),User:'self'});
  //   }
  // })

  if(page === 1){
    newState = newState.set('data',Immutable.fromJS(response.Items));
  }
  else {
    var oldData = newState.get('data');
    var newList = Immutable.fromJS(response.Items);
    if (oldData) {
      newList = oldData.push(...newList.toArray());
    }

    newState = newState.set('data',newList);
  }
  // console.warn('alarmListReducer...',page,newState.get('data').size);
  newState = categoryAllDatas(newState);
  newState = newState.set('pageCount',response.PageCount);
  newState = newState.set('isFetching',false);

  return newState;
}

function removeData(state,action) {
  var {body:{maintainRecordId}} = action;
  var newState=state;
  var oldData = newState.get('data');
  if (oldData&&oldData.size>0) {
    var index = oldData.findIndex((item)=> item.get('AutoId') === maintainRecordId);
    if(index >= 0){
      oldData=oldData.remove(index);
    }
  }
  newState = newState.set('data',oldData);
  newState = categoryAllDatas(newState);
  return newState;
}

function handleError(state,action) {
  var {Error} = action.error;
  // console.warn('handleError',action);

  switch (Error) {
    case '040001307022':
      action.error = localStr('lang_alarm_des1');
      state=state.set('data',Immutable.fromJS([]));
      break;
  }
  return state.set('isFetching',false).set('allDatas',null);
}



export default commonReducer((state,action)=>{

  switch (action.type) {
    case MAINTANCE_FILTER_DIDCHANGED:
      return state.set('isFetching',true);
    case ASSET_MAINTAINCE_REQUEST:
      return state.set('isFetching',true);
    case ASSET_MAINTAINCE_SUCCESS:
      return mergeData(state,action);
    case MAINTANCE_RECORD_DELETE_SUCCESS:
      return removeData(state,action);
    case ASSET_MAINTAINCE_FAILURE:
      return handleError(state,action);
    case DEVICE_EXIT:
      return defaultState;

  }
  return state;
},defaultState);
