package com.energymost.rocking;

import android.content.Intent;
import android.app.Activity;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.uimanager.ViewManager;


import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

public class PushNotificationPackage implements ReactPackage {

  private PushNotificationModule mRNPushNotification;
  private Activity mActivity;
  public PushNotificationPackage(Activity activity){
    super();
    mActivity = activity;
  }

  @Override
  public List<NativeModule> createNativeModules(
                              ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    mRNPushNotification = new PushNotificationModule(reactContext,mActivity);

    modules.add(mRNPushNotification);

    return modules;
  }

  @Override
  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return Collections.emptyList();
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  public void newIntent(Intent intent) {
      if(mRNPushNotification == null){ return; }
      mRNPushNotification.newIntent(intent);
  }
}
