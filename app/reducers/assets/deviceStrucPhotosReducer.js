'use strict';

import {
  STRUCTURE_LOAD_REQUEST,
  STRUCTURE_LOAD_SUCCESS,
  STRUCTURE_LOAD_FAILURE,
  ROOM_SAVE_ENV_SUCCESS,
  ROOM_SAVE_ENV_FAILURE,
  ASSET_LOGS_SUCCESS,
  ASSET_IMAGE_CHANGED,
  ASSET_IMAGE_CHANGED_COMPLETE
} from '../../actions/assetsAction.js';

import {LOGOUT_SUCCESS} from '../../actions/loginAction.js';

import Immutable from 'immutable';
import unit from '../../utils/unit.js';
import privilegeHelper from '../../utils/privilegeHelper.js';
import {formatNumber} from '../commonReducer.js';
import {localStr,localFormatStr} from '../../utils/Localizations/localization.js';

var defaultState = Immutable.fromJS({
  deviceId:null,
  data:null,
  sectionData:[],
  isFetching:false,
});

function updateAssetDetailData(state,action) {
  var {body:{deviceId},response:{Result}} = action;
  // let {url,body,types} = action;
  var res = Result;

  var allElements={
    "ArrPhotos": [{
			"Id": 13705,
			"Name": "image-maintaince--log-378-301479-1517987951425-0.png",
			"Url": "http://sejazz-test.images.energymost.com/image-maintaince--log-378-301479-1517987951425-0?x-oss-process=image/resize,m_pad,w_112,limit_0",
			"CreateUserName": "Rap0昵称",
			"CreateTime": "2018-02-07T10:40:04.87",
			"Key": "image-maintaince--log-378-301479-1517987951425-0"
		}, {
			"Id": 13706,
			"Name": "image-maintaince--log-378-301479-1517987951425-1.png",
			"Url": "http://sejazz-test.images.energymost.com/image-maintaince--log-378-301479-1517987951425-1?x-oss-process=image/resize,m_pad,w_112,limit_0",
			"CreateUserName": "Rap0昵称",
			"CreateTime": "2018-02-07T10:40:04.87",
			"Key": "image-maintaince--log-378-301479-1517987951425-1"
		}, {
			"Id": 13707,
			"Name": "image-maintaince--log-378-301479-1517987951425-2.png",
			"Url": "http://sejazz-test.images.energymost.com/image-maintaince--log-378-301479-1517987951425-2?x-oss-process=image/resize,m_pad,w_112,limit_0",
			"CreateUserName": "Rap0昵称",
			"CreateTime": "2018-02-07T10:40:04.87",
			"Key": "image-maintaince--log-378-301479-1517987951425-2"
		}, {
			"Id": 13708,
			"Name": "image-maintaince--log-378-301479-1517987951425-3.png",
			"Url": "http://sejazz-test.images.energymost.com/image-maintaince--log-378-301479-1517987951425-3?x-oss-process=image/resize,m_pad,w_112,limit_0",
			"CreateUserName": "Rap0昵称",
			"CreateTime": "2018-02-07T10:40:04.87",
			"Key": "image-maintaince--log-378-301479-1517987951425-3"
		}]
  };

  return Immutable.fromJS({
    data:Immutable.fromJS(allElements),
    isFetching:false,
    logCount,
    deviceId,
  });

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
    case STRUCTURE_LOAD_REQUEST:
      return state.set('isFetching',true);
    case STRUCTURE_LOAD_SUCCESS:
      return updateAssetDetailData(state,action);
    case STRUCTURE_LOAD_FAILURE:
    case ROOM_SAVE_ENV_FAILURE:
      return handleError(state,action);
    case LOGOUT_SUCCESS:
      return defaultState;
    default:

  }
  return state;
}
