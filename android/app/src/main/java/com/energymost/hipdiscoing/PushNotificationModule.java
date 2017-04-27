package com.energymost.hipdiscoing;

import java.util.Map;
import javax.annotation.Nullable;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.util.Log;
import android.content.Intent;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;

import com.alibaba.sdk.android.AlibabaSDK;
import com.alibaba.sdk.android.callback.InitResultCallback;
import com.alibaba.sdk.android.push.CloudPushService;
import com.alibaba.sdk.android.push.CommonCallback;



public class PushNotificationModule extends ReactContextBaseJavaModule {

  private Context mContext;

  public PushNotificationModule(ReactApplicationContext reactContext,Activity activity) {
    super(reactContext);
    mContext = activity;
    this.initOneSDK(reactContext);
    this.registerNotificationsReceiveNotification();
  }

  private static final String TAG = "AliyunApp";

  private static CloudPushService cloudPushService = null;

  /**
    * 初始化AlibabaSDK
    * @param applicationContext
    */
   private void initOneSDK(final Context applicationContext) {
       AlibabaSDK.asyncInit(applicationContext, new InitResultCallback() {

           @Override
           public void onSuccess() {
               Log.d(TAG, "init onesdk success");
               //alibabaSDK初始化成功后，初始化移动推送通道
               initCloudChannel(applicationContext);
           }

           @Override
           public void onFailure(int code, String message) {
               Log.e(TAG, "init onesdk failed : " + message);
           }
       });
   }

   /**
     * 初始化移动推送通道
     * @param applicationContext
     */
    private void initCloudChannel(Context applicationContext) {
      final CloudPushService cloudPushService = AlibabaSDK.getService(CloudPushService.class);
      this.cloudPushService = cloudPushService;
      if(cloudPushService != null) {
          cloudPushService.register(applicationContext,  new CommonCallback() {

              @Override
              public void onSuccess() {
                  Log.d(TAG, "init cloudchannel success");
                  Log.d(TAG, "device Id:"+ cloudPushService.getDeviceId());


              }

              @Override
              public void onFailed(String errorCode, String errorMessage) {
                  Log.d(TAG, "init cloudchannel fail" + "err:" + errorCode + " - message:"+ errorMessage);
              }
          });
      }else{
          Log.i(TAG, "CloudPushService is null");
      }
    }



  private Class getMainActivityClass() {
     String packageName = mContext.getPackageName();
     Intent launchIntent = mContext.getPackageManager().getLaunchIntentForPackage(packageName);
     String className = launchIntent.getComponent().getClassName();
     try {
         return Class.forName(className);
     } catch (ClassNotFoundException e) {
         e.printStackTrace();
         return null;
     }
  }



  private void registerNotificationsReceiveNotification() {
      IntentFilter intentFilter = new IntentFilter("RNPushNotificationReceiveNotification");

      getReactApplicationContext().registerReceiver(new BroadcastReceiver() {
          @Override
          public void onReceive(Context context, Intent intent) {
              notifyNotification(intent.getBundleExtra("notification"));
          }
      }, intentFilter);
  }

  private void notifyNotification(Bundle bundle) {

      WritableMap params = Arguments.createMap();
      params.putString("title", bundle.getString("title"));
      params.putString("message", bundle.getString("message"));
      params.putString("extraMap", bundle.getString("extraMap"));
      // params.putBoolean("foreground", isApplicationRunning());
      sendEvent("remoteNotificationReceived", params);
  }

  // private boolean isApplicationRunning() {
  //
  //   ActivityManager activityManager = (ActivityManager) this.getReactApplicationContext().getSystemService(this.getReactApplicationContext().ACTIVITY_SERVICE);
  //   List<RunningAppProcessInfo> processInfos = activityManager.getRunningAppProcesses();
  //   for (ActivityManager.RunningAppProcessInfo processInfo : processInfos) {
  //       if (processInfo.processName.equals(this.getReactApplicationContext().getApplication().getPackageName())) {
  //           if (processInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
  //               for (String d: processInfo.pkgList) {
  //                   return true;
  //               }
  //           }
  //       }
  //   }
  //   return false;
  // }

  // private final static String RECEIVED_EVENT_NAME = "notificationReceived";


  private void sendEvent(String eventName,@Nullable WritableMap params) {
    ReactContext reactContext = getReactApplicationContext();

    if(reactContext != null){
      Log.d(TAG, String.format("sendtojs"));

      reactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, params);
    }


  }

  public void newIntent(Intent intent) {
    if ( intent.hasExtra("notification") ) {
        Bundle bundle = intent.getBundleExtra("notification");
        bundle.putBoolean("foreground", false);
        intent.putExtra("notification", bundle);
        notifyNotification(bundle);
    }
  }


  @Override
  public String getName() {
    return "REMPushNotification";
  }

  @ReactMethod
  public void bindAccount(String userId,boolean bind,Promise promise) {
    if(bind){
      this.cloudPushService.bindAccount(userId);
      Log.d(TAG, "bindAccount success:" + userId);
    }
    else{
      this.cloudPushService.unbindAccount();
    }

  }
}
