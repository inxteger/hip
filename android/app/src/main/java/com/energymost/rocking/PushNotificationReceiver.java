package com.energymost.rocking;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.util.Log;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;
import java.util.Map;




import com.alibaba.sdk.android.push.MessageReceiver;



public class PushNotificationReceiver extends MessageReceiver
{

  private static final String TAG = "AliyunApp";

  // @Override
  // public void onReceive(Context paramContext, Intent paramIntent){
  //   Log.d(TAG, String.format("Intent",paramIntent.toString()));
  //   super.onReceive(paramContext,paramIntent);
  // }

   @Override
   public void onNotification(Context context,String title,String summary, Map <String, String > extraMap)
   {
    //  Log.d(TAG, String.format("title:%s,summary:%s",title,summary));

    //  WritableMap map = Arguments.createMap();
    //  WritableMap messageMap = Arguments.createMap();
    //  for (String key : extraMap.keySet()) {
    //    messageMap.putString(key,extraMap.get(key));
    //    Log.d(TAG, String.format("key:%s,value:%s",key,extraMap.get(key)));
    //  }
    //  map.putBoolean("inApp",true);
    //  map.putMap("extraData",messageMap);
    //  sendEvent(RECEIVED_EVENT_NAME,map);
   }

   @Override
   public void onNotificationOpened(Context context, String title, String summary, String extraMap)
   {
     Log.d(TAG, String.format("context:%s",context.toString()));
    Log.d(TAG, String.format("title:%s,summary:%s,extraMap:%s",title,summary,extraMap));
    // WritableMap map = Arguments.createMap();
    // map.putString("extraData",extraMap);
    // map.putBoolean("inApp",false);
    //
    // sendEvent(RECEIVED_EVENT_NAME,map);
    Bundle bundle = new Bundle();
    bundle.putString("title",title);
    bundle.putString("message",summary);
    bundle.putString("extraMap",extraMap);
    sendNotification(bundle);
   }

   private void sendNotification(Bundle bundle) {

      // Boolean isRunning = isApplicationRunning();

      Intent intent = new Intent("RNPushNotificationReceiveNotification");
      // bundle.putBoolean("foreground", isRunning);
      intent.putExtra("notification", bundle);
      // MainActivity.getContext().sendBroadcast(intent);

    }




}
