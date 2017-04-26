'use strict';

import {
  TICKET_LOGS_REQUEST,
  TICKET_LOGS_SUCCESS,
  TICKET_LOGS_FAILURE,
  TICKET_LOG_SAVE_SUCCESS,
  TICKET_LOG_SAVE_FAILURE,
  TICKET_LOG_DELETE_SUCCESS,
  TICKET_LOG_DELETE_FAILURE,
} from '../../actions/ticketAction.js';

import {LOGOUT} from '../../actions/loginAction.js';

import Immutable from 'immutable';

var defaultState = Immutable.fromJS({
  data:null,
  isFetching:false,
  ticketId:null
});

function updateData(state,action) {
  var {ticketId} = action;
  var response = action.response.Result;

  if(response === null){ //API return null for empty list
    response = [];
  }
  // console.warn('updateData response',response,ticketId);
  return state.set('data',Immutable.fromJS(response)).
               set('ticketId',ticketId).
               set('isFetching',false);
}

function mergeLog(state,action) {
  return state.set('data',null);
}

function handleError(state,action) {
  var {Error} = action.error;
  console.warn('handleError',action);
  switch (Error) {
    case '040001307022':
      action.error = '您没有这一项的操作权限，请联系系统管理员';
      break;
  }
  return state.set('isFetching',false);
}

export default function(state=defaultState,action){

  switch (action.type) {
    case TICKET_LOGS_REQUEST:
      return state.set('isFetching',true);
    case TICKET_LOGS_SUCCESS:
      return updateData(state,action);
    case TICKET_LOGS_FAILURE:
    case TICKET_LOG_SAVE_FAILURE:
    case TICKET_LOG_DELETE_FAILURE:
      return handleError(state,action);
    case TICKET_LOG_SAVE_SUCCESS:
    case TICKET_LOG_DELETE_SUCCESS:
      return mergeLog(state,action);
    case LOGOUT:
      return defaultState;
    default:

  }
  return state;
}
