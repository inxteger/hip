'use strict';

import {
  FOLLOW_SELECT_CHANGED,
  FOLLOWS_LOAD_REQUEST,
  FOLLOWS_LOAD_SUCCESS,
  FOLLOWS_LOAD_FAILURE,
  FOLLOWS_SELECT_RESET,
  FOLLOWS_UPDATE_REQUEST, FOLLOWS_UPDATE_SUCCESS, FOLLOWS_UPDATE_FAILURE
} from '../../actions/followsAction.js';

import {LOGOUT} from '../../actions/loginAction.js';

import Immutable from 'immutable';
// [
//   {Id:1001,Name:'asdfa   sdf',isSelect:true},
//   {Id:1002,Name:'wang',isSelect:false},
//   {Id:1003,Name:'wang',isSelect:true},
//   {Id:1004,Name:'wang',isSelect:false},]
var defaultState = Immutable.fromJS({
  data:null,
  // data:Immutable.fromJS([]),
  isFetching:false,
  // selectFollows:Immutable.fromJS([]),
  updateSuccess:null,
  filter:{
    AssetTaskType:1,
    CurrentPage:1,
  }
});

function updateAssetsUsers(state,action)
{
  var allSecTitle=[];
  var response = action.response.Result;
  // var selectFollows = state.get('selectFollows');

  var allElements = Immutable.fromJS(response);
  // console.warn('selectFollows 0', selectFollows);
  // var newSelecUsers=[];
  // selectFollows.forEach((oldItem)=>{
  //   var index = allElements.findIndex((item)=>item.get('Id')===oldItem.get('Id'));
  //   if (index===-1) {
  //     return;
  //   }
  //   newSelecUsers.push(oldItem);
  //   allElements = allElements.update(index,(item)=>{
  //     item = item.set('Selected',true);
  //     return item;
  //   });
  // });
  if (allElements.size>=1) {
    state=state.set('data',Immutable.fromJS(allElements));
  }else {
    state=state.set('data',null);
  }
  return state.set('isFetching',false);
  // .set('selectFollows',Immutable.fromJS(newSelecUsers));
}

function selectInfoChange(state,action){
  var newState = state;
  var {data:{type,value}}=action;
  if (type==='select') {
    var arr = newState.get('data');
    var user = value;//action.data;
    var index = arr.findIndex((item)=>item.get('Id')===user.get('Id'));
    arr = arr.update(index,(item)=>{
      if(!item.get('Selected')){
        item = item.set('Selected',true);
      }else {
        item = item.set('Selected',false)
      }
      return item;
    });
    newState = newState.set('data', arr);

    // var arrSelect = newState.get('selectFollows');
    // var index = arrSelect.findIndex((item)=>item.get('Id')===user.get('Id'));
    // if (index!==-1) {
    //   arrSelect = arrSelect.delete(index);
    // }else {
    //   arrSelect = arrSelect.push(user);
    // }
    // newState = newState.set('selectFollows', arrSelect);
  }else if (type==='init') {
      //
      // console.warn('ready to init users:',value);
    // newState=newState.set('selectFollows',value);
  }
  return newState;
}

function updateFollowsSuccess(state,action)
{
  var response = action.response.Result;
  if (!response) {
    state=state.set('updateSuccess',true);
  }else {
    state=state.set('updateSuccess',false);
  }
  return state;
}

function handleError(state,action) {
  // var {Result} = action.error;
  // if(!Result){
  //   action.error = '无相关权限';
  // }
  return state.set('data',Immutable.fromJS([[]]))
  // .set('sectionData',Immutable.fromJS([]))
  .set('isFetching',false);
  // return state.set('isFetching',false);
}

export default function(state=defaultState,action){
  switch (action.type) {
    case FOLLOWS_UPDATE_REQUEST:
    case FOLLOWS_LOAD_REQUEST:
      return state.set('isFetching',true);
    case FOLLOWS_LOAD_SUCCESS:
      return updateAssetsUsers(state,action);
    case FOLLOWS_UPDATE_SUCCESS:
      return updateFollowsSuccess(state,action);
    case FOLLOWS_LOAD_FAILURE:
    case FOLLOWS_UPDATE_FAILURE:
      return handleError(state,action);
    case FOLLOW_SELECT_CHANGED:
      return selectInfoChange(state,action);
    case FOLLOWS_SELECT_RESET:
    case LOGOUT:
      return defaultState;
    default:

  }
  return state;
}
