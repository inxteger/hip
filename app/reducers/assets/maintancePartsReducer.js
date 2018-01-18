'use strict';

import {
  MAINTANCE_PART_SELECT_CHANGED,
  MAINTANCE_PARTS_REQUEST, MAINTANCE_PARTS_SUCCESS, MAINTANCE_PARTS_FAILURE,
  TICKET_CREATE_RESET
} from '../../actions/assetsAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';

var defaultState = Immutable.fromJS({
  data:null,
  sectionData:Immutable.fromJS([]),
  isFetching:false,
  selectUsers:Immutable.fromJS([]),
});

function updateAssetsUsers(state,action)
{
  var allSecTitle=[
  ];
  var response = action.response.Result;
  var selectUsers = state.get('selectUsers');
  console.warn('updateAssetsUsers...', selectUsers);
  if (response&&response.length>0) {
    response.unshift({Id:'全选',RealName:'全选'});
  }
  var allElements = Immutable.fromJS(response);
  var newSelecUsers=[];
  var isAllSelect=true;
  selectUsers.forEach((oldItem)=>{
    var index = allElements.findIndex((item)=>item.get('Id')===oldItem.get('Id'));
    if (index===-1) {
      return;
    }
    newSelecUsers.push(oldItem);
    allElements = allElements.update(index,(item)=>{
      item = item.set('isSelect',true);
      return item;
    });
  });
  var isAllSelect=true;
  allElements.forEach((item)=>{
    if (item.get('Id')!=='全选') {
      if (!item.get('isSelect')) {
        isAllSelect=false;
      }
    }
  });
  allElements = allElements.update(0,(item)=>{
    item = item.set('isSelect',isAllSelect);
    return item;
  });

  if (allElements.size>=1) {
    state=state.set('data',Immutable.fromJS([allElements]));
  }else {
    state=state.set('data',Immutable.fromJS([]));
  }
  return state.set('isFetching',false)
  .set('selectUsers',Immutable.fromJS(newSelecUsers));
}

function userSelectInfoChange(state,action){
  var newState = state;
  var {data:{type,value}}=action;
  if (type==='select') {
    var arr = newState.getIn(['data',0]);
    var user = value;//action.data;
    var index = arr.findIndex((item)=>item.get('Id')===user.get('Id'));
    arr = arr.update(index,(item)=>{
      if(!item.get('isSelect')){
        item = item.set('isSelect',true);
      }else {
        item = item.set('isSelect',false)
      }
      return item;
    });

    var arrSelect = newState.get('selectUsers');
    var index = arrSelect.findIndex((item)=>item.get('Id')===user.get('Id'));
    if (index!==-1) {
      arrSelect = arrSelect.delete(index);
    }else {
      arrSelect = arrSelect.push(user);
    }

    if (user.get('Id')==='全选') {
      var allSeleItem=arr.get(0);
      var isAllSelect=allSeleItem.get('isSelect');
      arr.forEach((item0,index)=>{
        arr = arr.update(index,(item)=>{
          item = item.set('isSelect',isAllSelect);
          return item;
        });
      });

      arrSelect=arrSelect.clear();
      if (isAllSelect) {
        arrSelect=arrSelect.push(...arr);
        arrSelect=arrSelect.delete(0);
      }
    }


    var isAllSelect=true;
    arr.forEach((item)=>{
      if (item.get('Id')!=='全选') {
        if (!item.get('isSelect')) {
          isAllSelect=false;
        }
      }
    });
    arr = arr.update(0,(item)=>{
      item = item.set('isSelect',isAllSelect);
      return item;
    });

    newState = newState.setIn(['data',0], arr);

    newState = newState.set('selectUsers', arrSelect);
  }else if (type==='init') {
      // console.warn('ready to init users:',value);
    newState=newState.set('selectUsers',value);
  }
  return newState;
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
    case MAINTANCE_PARTS_REQUEST:
      return state.set('isFetching',true);
    case MAINTANCE_PARTS_SUCCESS:
      return updateAssetsUsers(state,action);
    case MAINTANCE_PARTS_FAILURE:
      return handleError(state,action);
    case MAINTANCE_PART_SELECT_CHANGED:
      return userSelectInfoChange(state,action);
    case TICKET_CREATE_RESET:
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
