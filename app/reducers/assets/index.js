'use strict';

import assetData from './assetsReducer.js';
import assetTickets from './assetTicketsReducer.js';
import buildHierarchyData from './hierarchyReducer.js';
import hierarchyBindData from './hierarchyBindReducer.js';
import scan from './scanReducer.js';
import roomDetailData from './roomReducer.js';
import panelDetailData from './panelReducer.js';
import deviceDetailData from './deviceReducer.js';
import dashboardDatas from './deviceDashReducer.js';
import deviceRuntimSetting from './deviceRuntimSettingReducer.js';
import deviceRealtime from './deviceRealtimeReducer.js';
import maintainRecordData from './maintainRecordReducer.js'
import maintainPartsData from './maintancePartsReducer.js';
import maintainFilter from './maintainFilterReducer.js';
import logs from './logsReducer.js';
import assetLog from './logEditReducer.js';
import historyData from './historyReducer.js';
import maintances from './maintanceUsersReducer.js';
import mRecordDetail from './mRecordDetReducer.js';
import mSingleSelect from './mSingleSelectReducer.js';
import strucPhotos from './deviceStrucPhotosReducer.js';
import deviceFiles from './deviceFilesReducer.js';
import deviceSubFiles from './deviceSubFilesReducer.js';

import { combineReducers } from 'redux'

export default combineReducers({
  assetData,buildHierarchyData,hierarchyBindData,
  scan,roomDetailData,panelDetailData,deviceDetailData,
  deviceRuntimSetting,deviceRealtime,dashboardDatas,maintainRecordData,
  maintainPartsData,maintainFilter,maintances,mRecordDetail,logs,assetLog,
  historyData,assetTickets,mSingleSelect,strucPhotos,deviceFiles,deviceSubFiles
})
