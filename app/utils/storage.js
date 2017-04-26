'use strict';

import {AsyncStorage,Clipboard} from 'react-native';

var TOKENKEY = "TOKENKEY";
var NAMEKEY = 'USERNAMEKEY';

var tempToken = null;
var tempName = null;

export default {
  encodeId(id){
		var n = Number(id);
		return n.toString(16);
	},
	decodeId(str){
		return parseInt(str,16);
	},
  setToken(tokenValue,isDemoUser){
    // console.log('tokenValue:'+tokenValue);
    if(isDemoUser){
      tempToken = tokenValue;
    }
    else {
      return this.setItem(TOKENKEY,tokenValue);
    }
  },
  removeToken(){
    tempToken = null;
    this.removeItem(TOKENKEY);
  },
  getToken(cb){
    if(tempToken){
      return tempToken;
    }
    return this.getItem(TOKENKEY,cb);
  },
  getIsDemoToken()
  {
    return tempToken?true:false;
  },
  getName(cb)
  {
    if(tempName){
      return tempName;
    }
    return this.getItem(NAMEKEY,cb);
  },
  setName(value){
    return this.setItem(NAMEKEY,value);
  },
  removeName(){
    this.removeItem(NAMEKEY);
  },
  removeItem(key){
    AsyncStorage.removeItem(key);
  },
  setItem(key,value){
    return AsyncStorage.setItem(key, value);
  },
  getItem(key,cb){
    return AsyncStorage.getItem(key,(err,ret)=>{cb && cb(ret,err)});
  },
  async getClipboardContent(cb){
    console.log('getClipboardContent');
    console.log(Clipboard);
    var content = await Clipboard.getString();
    cb.call(null,content);
  },
  emptyClipboardContent(){
    Clipboard.setString('');
  },
};
