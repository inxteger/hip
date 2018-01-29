'use strict';

import {
  MAINTANCE_PART_SELECT_CHANGED,
  MAINTANCE_PARTS_REQUEST, MAINTANCE_PARTS_SUCCESS, MAINTANCE_PARTS_FAILURE,
  RECORD_EDIT_INFO_RESET,
  MAINTANCE_FILTER_CLEAR
} from '../../actions/assetsAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

import Immutable from 'immutable';

var defaultState = Immutable.fromJS({
  data:null,
  sectionData:Immutable.fromJS([]),
  isFetching:false,
  selectParts:Immutable.fromJS([]),
  isSingleSelect:false,
});

function updateAssetsParts(state,action)
{
  var allSecTitle=[
  ];
  var response = action.response.Result;
  var selectParts = state.get('selectParts');
  var isSingleSelect=state.get('isSingleSelect');
  // console.warn('updateAssetsParts...', selectParts);

  var arrDatas=[];
  response.forEach((item,index)=>{
    arrDatas.push({'Id':item,'RealName':item});
  })
  response=arrDatas;
  if (response&&response.length>0&&!isSingleSelect) {
    response.unshift({Id:localStr('lang_record_des43'),RealName:localStr('lang_record_des43')});
  }
  var allElements = Immutable.fromJS(response);
  var newSelecUsers=[];
  var isAllSelect=true;
  selectParts.forEach((oldItem)=>{
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

  if (!isSingleSelect) {
    var isAllSelect=true;
    allElements.forEach((item)=>{
      if (item.get('Id')!==localStr('lang_record_des43')) {
        if (!item.get('isSelect')) {
          isAllSelect=false;
        }
      }
    });
    if (allElements.size>0) {
      allElements = allElements.update(0,(item)=>{
        item = item.set('isSelect',isAllSelect);
        return item;
      });
    }
  }

  if (allElements&&allElements.size>0) {
    state=state.set('data',Immutable.fromJS([allElements]));
  }else {
    state=state.set('data',Immutable.fromJS([]));
  }
  return state.set('isFetching',false)
  .set('selectParts',Immutable.fromJS(newSelecUsers));
}

function userSelectInfoChange(state,action){
  var newState = state;
  var {data:{type,value}}=action;
  var isSingleSelect=state.get('isSingleSelect');
  if (type==='select') {
    var arr = newState.getIn(['data',0]);
    var user = value;//action.data;
    var index = arr.findIndex((item)=>item.get('Id')===user.get('Id'));

    var arrSelect = newState.get('selectParts');
    if (!isSingleSelect) {
      arr = arr.update(index,(item)=>{
        if(!item.get('isSelect')){
          item = item.set('isSelect',true);
        }else {
          item = item.set('isSelect',false)
        }
        return item;
      });
      var index = arrSelect.findIndex((item)=>item.get('Id')===user.get('Id'));
      if (index!==-1) {
        arrSelect = arrSelect.delete(index);
      }else {
        arrSelect = arrSelect.push(user);
      }
      if (user.get('Id')===localStr('lang_record_des43')) {
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
        if (item.get('Id')!==localStr('lang_record_des43')) {
          if (!item.get('isSelect')) {
            isAllSelect=false;
          }
        }
      });
      arr = arr.update(0,(item)=>{
        item = item.set('isSelect',isAllSelect);
        return item;
      });
    }else {
      arr.forEach((item,index1)=>{
        arr = arr.update(index1,(item)=>{
          if (index===index1||index===-1) {
            return item.set('isSelect',true);
          }else {
            return item.set('isSelect',false);
          }
        });
      });
      arrSelect=arrSelect.clear();
      arrSelect = arrSelect.push(user);
    }
    newState = newState.setIn(['data',0], arr);

    newState = newState.set('selectParts', arrSelect);
  }else if (type==='init') {
      // console.warn('ready to init users:',value);
    newState=newState.set('selectParts',value);
  }else if (type==='initSingleSelect') {
    newState=newState.set('isSingleSelect',value);
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
      return updateAssetsParts(state,action);
    case MAINTANCE_PARTS_FAILURE:
      return handleError(state,action);
    case MAINTANCE_PART_SELECT_CHANGED:
      return userSelectInfoChange(state,action);
    case RECORD_EDIT_INFO_RESET:
    case MAINTANCE_FILTER_CLEAR:
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
