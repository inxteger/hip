//
//  REMPushNotification.m
//  Rock
//
//  Created by Tan on 5/5/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "REMPushNotification.h"
#import <ALBBSDK/ALBBSDK.h>
#import <CloudPushSDK/CloudPushSDK.h>
@implementation REMPushNotification

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(bindAccount,
                 userId:(NSString *)userId
                 bind:(BOOL)bind
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  if(bind == YES){
    [CloudPushSDK bindAccount:userId withCallback:^(BOOL success) {
      NSLog(@"bindAccount %@ success:%d",userId,success);
      NSLog(@"deviceId:%@",[CloudPushSDK getDeviceId]);
    }];
  }
  else{
    [CloudPushSDK unbindAccount:userId withCallback:^(BOOL success) {
      
    }];
  }
  
}



@end
