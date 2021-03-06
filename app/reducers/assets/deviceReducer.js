'use strict';

import {
  DEVICE_LOAD_REQUEST,
  DEVICE_LOAD_SUCCESS,
  DEVICE_LOAD_FAILURE,
  STRUCTURE_PHOTOS_CHANGED,
  ASSET_IMAGE_CHANGED,
  ASSET_IMAGE_CHANGED_COMPLETE,
  DEVICE_EXIT
} from '../../actions/assetsAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';
import {findSectioniIndexByType} from '../commonReducer.js';
import Immutable from 'immutable';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
  deviceId:null,
  customerId:null,
  data:null,
  sectionData:[],
  arrCanCalcuDash:[],
  hasRuntime:false,
  hasRealtime:false,
  isFetching:false,
  numStructures:'',
  strTkdyly:null,
  classType:null,
  errorMessage:null,
});

function updateAssetDetailData(state,action) {
  var {body:{deviceId},response:{Result}} = action;
  // let {url,body,types} = action;
  var res = Result;
  var deviceDescption = [
  ];
  if (res.Description) {
    deviceDescption.splice(0,0,
      {'title':localStr('lang_asset_des45'),'value':res.Description,'isNav':false,},
    );
  }
  if (res.FactoryDate) {
    deviceDescption.splice(0,0,
      {'title':localStr('lang_asset_des46'),'value':res.FactoryDate,'isNav':false,},
    );
  }
  if (res.Factory) {
    deviceDescption.splice(0,0,
      {'title':localStr('lang_asset_des47'),'value':res.Factory,'isNav':false,},
    );
  }
  if (res.SerialNumber) {
    deviceDescption.splice(0,0,
      {'title':localStr('lang_asset_des48'),'value':res.SerialNumber,'isNav':false,}
    );
  }
  var strTkdyly=null;
  var classType=res.Class;
  var arrParamDatas=[
    {'title':localStr('lang_asset_des43'),'value':res.Class,'isNav':false,},
  ];
  if (res.DeviceType) {
    arrParamDatas.push(
      {'title':localStr('lang_asset_des44'),'value':res.DeviceType,'isNav':false,}
    );
  }
  if(res.Specification){
    arrParamDatas.push({
      'title':localStr('lang_asset_des102'),'value':res.Specification,'isNav':false,
    })
  }
  var parameters = res.LedgerParameters.
                        map((item)=>{
                          if(item.Values.length > 1){
                            return {
                              title:item.Name,
                              value:'',
                              data:item.Values.map((item)=>{
                                return Immutable.Map({title:item,value:'',isNav:false})
                              }),
                              empty:'',
                              isNav:true,
                              type:'arrayParamValues'
                            }
                          }
                          else {
                            if (item.Name==='脱扣单元类型') {
                              strTkdyly=item.Values.join('');
                            }
                            return {
                              'title':item.Name,
                              'value':item.Values.join(''),
                              'isNav':false,
                            }
                          }

                        });
  arrParamDatas.push(...parameters);
  var runtimeSetting = res.RuntimeSettingParameter;
  if((runtimeSetting.MaintenanceParameters && runtimeSetting.MaintenanceParameters.length > 0)
      || (runtimeSetting.SettingParameters && runtimeSetting.SettingParameters.length > 0)){
    runtimeSetting = [{title:localStr('lang_asset_des15'),value:'',isNav:true,type:'runtimeSetting'}];
  }
  else {
    runtimeSetting = null;
  }
  // var arrLogPhoto = [
  //   {'title':'现场照片','value':'','isNav':false,},
  //   {'title':localStr('lang_asset_des31'),'value':'','isNav':false,},
  // ];
  var numStructures = res.StructurePhotoCount;
  var tendingCount='';//res.HistoryTicketsCount;
  if (!numStructures) {
    numStructures=0;
  }

  var allElements=[
    // [{title:'',value:res.LogoKey}],
    deviceDescption,
    arrParamDatas,
    [{title:localStr('机器结构'),value:numStructures,isNav:true,type:'structure',secType:'strucSection'}],
    [{title:localStr('机器文件'),value:tendingCount,isNav:true,type:'files'}]
  ];

  var allSecTitle=[
    // '',
    '基本信息',
    localStr('lang_asset_des50'),
    ' ',
    ' '
  ];
  if (!arrParamDatas||arrParamDatas.length===0) {
    allElements.splice(1,1);
    allSecTitle.splice(1,1);
  }
  var hasRuntime = false,hasRealtime=false;
  if(runtimeSetting){
    hasRuntime = true;
  }

  if(res.MonitorParameterGroups && res.MonitorParameterGroups.length > 0){
    var groupItem=res.MonitorParameterGroups[0];
    // if (groupItem.Name&&groupItem.Name.length>0) {
      hasRealtime = true;
    // }
  }
  var arrCanCalcu=[];
  if(res.ParameterCanCalculates && res.ParameterCanCalculates.length > 0){
    res.ParameterCanCalculates.forEach((item)=>{
      if (item.DisplayInstrument) {
        arrCanCalcu.push(item);
      }
    });
  }
  return Immutable.fromJS({
    data:Immutable.fromJS(allElements),
    sectionData:Immutable.fromJS(allSecTitle),
    arrCanCalcuDash:Immutable.fromJS(arrCanCalcu),
    isFetching:false,
    hasRuntime,
    hasRealtime,
    deviceId,
    strTkdyly,
    classType,
    customerId:res.CustomerId,
  });

}

function addPhotosCount(state,action) {
  // var {hierarchyId,response:{Result}} = action;
  var {data:{hierarchyId,action,numPhotos}} = action;
  console.warn('addPhotosCount,,,,',hierarchyId,numPhotos,action);
  if(state.get('deviceId') === hierarchyId&&action==='uploaded'){
    // if(!Result){
    //   Result = [];
    // }
    // var len = Result.length;
    if(state.get('numStructures') !== numPhotos){
      var newState = state.set('numStructures',numPhotos);
      var indexSec=2;//findSectioniIndexByType(newState.get('data'),'strucSection');
      var data = newState.get('data');
      data = data.setIn([indexSec,0,'value'],numPhotos);
      return newState.set('data',data);
    }
  }
  return state;
}



function imageChanged(state,action) {
  let {data,hierarchyType} = action;
  if(hierarchyType !== 'device') return state;
  if(data.length > 0){
    let image = data[0];
    // console.warn('imageChanged',image.uri);
    // console.warn('state',state);
    var newState = state.setIn(['data',0,0,'pendingImageUri'],image.uri);
    // console.warn('newState',newState);
    return newState;
  }

  return state;

}

function imageChangedComplete(state,action) {
  let {data} = action;
  let newState = state;
  // newState = newState.set('pendingImageUri','');
  newState = newState.setIn(['data',0,0,'value'],data);

  return newState;
}

function handleError(state,action) {
  var {Error} = action.error;
  var strError=null;
  switch (Error) {
    case '050001251009':
      strError = localStr('lang_commons_notice1');
      action.error=null;
      break;
  }
  return state.set('isFetching',false).set('errorMessage',strError);
}

export default function(state=defaultState,action){
  switch (action.type) {
    case DEVICE_LOAD_REQUEST:
      return state.set('isFetching',true);
    case DEVICE_LOAD_SUCCESS:
      return updateAssetDetailData(state,action);
    case DEVICE_LOAD_FAILURE:
      var newState = state.set('isFetching',false);
      return handleError(newState,action);
    case STRUCTURE_PHOTOS_CHANGED:
      return addPhotosCount(state,action);
    case ASSET_IMAGE_CHANGED:
      return imageChanged(state,action);
    case ASSET_IMAGE_CHANGED_COMPLETE:
      return imageChangedComplete(state,action);
    case DEVICE_EXIT:
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
