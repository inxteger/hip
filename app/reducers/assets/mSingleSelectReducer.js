'use strict';

import {
  SINGLE_SELECT_DATA_CHANGED,
} from '../../actions/assetsAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';

var defaultState = Immutable.fromJS({
  data:[],
  isFetching:false,
});

function updateDatas(state,action)
{
  var {type,value}=action.data;
  if (type==='init') {
    state=state.set('data',Immutable.fromJS(value));
  }else if (type==='select'){
    var arrDatas=state.get('data');
    arrDatas.forEach((item0,index)=>{
      arrDatas = arrDatas.update(index,(item)=>{
        if (value.get('id')===item.get('id')) {
          item = item.set('isCheck',true);
        }else {
          item = item.set('isCheck',false);
        }
        return item;
      });
    })
    state=state.set('data',arrDatas);
  }
  return state;
}

function handleError(state,action) {
  // var {Result} = action.error;
  // if(!Result){
  //   action.error = '无相关权限';
  // }
  return state.set('data',Immutable.fromJS(null))
  // .set('sectionData',Immutable.fromJS([]))
  .set('isFetching',false);
  // return state.set('isFetching',false);
}

export default function(state=defaultState,action){
  switch (action.type) {
    case SINGLE_SELECT_DATA_CHANGED:
      return updateDatas(state,action);
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
