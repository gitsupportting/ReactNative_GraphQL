/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <ReactNativeNavigation/ReactNativeNavigation.h>

#import <TwitterKit/TWTRKit.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  if (@available(iOS 11.0, *)) {
    [[[application delegate] window] setTintColor:[UIColor colorNamed:@"BrandPrimary"]];
  } else {
    [[[application delegate] window] setTintColor:[UIColor colorWithRed:82/255 green:36/255 blue:158/255 alpha:1.0]];
  }
  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  [ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];

  return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
  return [[Twitter sharedInstance] application:app openURL:url options:options];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
