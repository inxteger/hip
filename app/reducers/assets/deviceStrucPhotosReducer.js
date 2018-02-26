'use strict';

import {
  STRUCTURE_PHOTOS_REQUEST,
  STRUCTURE_PHOTOS_SUCCESS,
  STRUCTURE_PHOTOS_FAILURE,
  STRUCTURE_PHOTOS_CHANGED
} from '../../actions/assetsAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';
import unit from '../../utils/unit.js';
import privilegeHelper from '../../utils/privilegeHelper.js';
import {formatNumber} from '../commonReducer.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
  deviceId:null,
  data:Immutable.fromJS({Pictures:null}),
  sectionData:[],
  isFetching:false,
});

// Immutable.fromJS({
//   "Pictures": [{
//     "Id": 13705,
//     "Name": "image-maintaince--log-378-301479-1517987951425-0.png",
//     "Url": "http://sejazz-test.images.energymost.com/image-maintaince--log-378-301479-1517987951425-0?x-oss-process=image/resize,m_pad,w_112,limit_0",
//     "CreateUserName": "Rap0昵称",
//     "CreateTime": "2018-02-07T10:40:04.87",
//     "PictureId": "image-maintaince--log-378-301479-1517987951425-0"
//   },]
// }),

function generateName(pics,hierarchyId,userId) {
  //key image-ticket-log-${ticketId}-${userId}-time
  var time = new Date().getTime();
  return `image-structure-log-${hierarchyId}-${userId}-${time}-${pics.size}`;
}

function infoChanged(state,action1) {

  var {data:{hierarchyId,userId,type,action,value}} = action1;

  if(type === 'init'){
    return initDefaultState(state,action1);
  }
  if(!state) return state; //fast back #14581,must put behind init

  var newState = state;
  if(type === 'content'){
    return newState.set('Content',value);
  }
  else {
    var pics = newState.getIn(['data','Pictures']);
    if(action === 'add'){
      //[{name,uri}]
      if (!pics) {
        pics=Immutable.fromJS([]);
      }
      var index=pics.findIndex((item)=>item.get('Type')==='dir');
      if (index===-1) {
        index=0;
      }
      value.forEach((item)=>{
        pics = pics.insert(index,
          Immutable.Map({
            PictureId:generateName(pics,hierarchyId,userId),
            uri:item.uri
          }));
      });
    }
    else if (action === 'uploaded') {
      if (pics) {
        var index = pics.findIndex((item)=>item.get('PictureId') === value.get('PictureId'));
        // console.warn('aaaaaaaaaa',index,value.get('Key'),value);
        pics = pics.update(index,(item)=>{
            item=item.set('loaded',true)
            .set('isUpdateing',false)
            .set('PictureId',value.get('Key'))
            .set('Key',value.get('Key'));
            return item;
          });
      }
    }
    else if (action === 'delete'){
      var index = pics.findIndex((item)=>item === value);
      pics = pics.delete(index);
    }
    // console.warn('pics',pics);
    return newState.setIn(['data','Pictures'],pics);
  }
}

function startGetStructure(state,action)
{
  var {data:{deviceId}} = action;
  return state.set('deviceId',deviceId).set('isFetching',true);
}

function updateStructureData(state,action) {
  var {data:{deviceId},response:{Result}} = action;
  var arrPhotos = Result;

  if (!arrPhotos) {
    return state;
  }
  arrPhotos.forEach((item)=>{
    item.PictureId=item.Key;//"image-maintaince--log-378-301479-1517987951425-0";
    item.Content=item.Description;
  });

  state=state.setIn(['data','Pictures'],Immutable.fromJS(arrPhotos))
  .set('isFetching',false)
  .set('deviceId',deviceId);
  return state;
}

function handleError(state,action) {
  var {Error} = action.error;
  // console.warn('handleError',action);

  switch (Error) {
    case '040001307022':
      action.error = localStr('lang_alarm_des1');
      break;
  }
  return state.set('isFetching',false);
}

export default function(state=defaultState,action){
  switch (action.type) {
    case STRUCTURE_PHOTOS_REQUEST:
      return startGetStructure(state,action);
    case STRUCTURE_PHOTOS_SUCCESS:
      return updateStructureData(state,action);
    case STRUCTURE_PHOTOS_FAILURE:
      return handleError(state,action);
    case STRUCTURE_PHOTOS_CHANGED:
      return infoChanged(state,action);
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
