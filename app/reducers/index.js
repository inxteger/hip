
import { combineReducers } from 'redux'
import user from './userReducer';
import login from './loginReducer';
import alarm from './alarm';
import ticket from './ticket';
import asset from './assets';
import version from './versionReducer';
import boot from './bootReducer';
import feedBack from './feedbackReducer';
import {RESET_ERROR_MESSAGE} from '../actions/errorAction.js';


// Updates error message to notify about the failed fetches.
function error(state = null, action) {
  const { type, error } = action

  if (type === RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    if(typeof error === 'string'){
      // console.warn('error',error);
      return action.error
    }
    else if(error['message']){
      // console.warn('error message',error['message']);
      if(error['message'] === 'Network request failed'){
        return '加载失败，请检查您的网络设置';
      }
      return error['message'];
    }
    else {
      console.warn('error',action);
      return '未知错误';
    }

  }

  return state
}

const rootReducer = combineReducers({
  user,login,asset,alarm,ticket,error,version,boot,feedBack
})

export default rootReducer
