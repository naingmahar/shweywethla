import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

export async function requestUserPermission() {

  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted =await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("System tray permission DENIED by user");
        return;
    }else{
      console.log("System tray permission GRANTED by user",granted);
    }
  }
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    console.log('Authorization status: AUTHORIZED', messaging.AuthorizationStatus.AUTHORIZED);
    console.log('Authorization status: DENIED', messaging.AuthorizationStatus.DENIED);
    console.log('Authorization status: PROVISIONAL', messaging.AuthorizationStatus.PROVISIONAL);
    getFcmToken();
  }
}

const getFcmToken = async () => {
   await messaging().registerDeviceForRemoteMessages();
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log("Your FCM Token:", fcmToken);
    // Send this token to your server/database if you want to target specific users
  }
};

export const notificationListener = (navigation: any) => {
  // 1. Handling Background/Quit state tap
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background:', remoteMessage.data);
    if (remoteMessage.data?.bookId) {
      navigation.navigate('BookDetails', { id: remoteMessage.data.bookId });
    }
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });


  // 2. Handling Quit state tap (App was totally closed)
  messaging()
    .getInitialNotification()
    .then((remoteMessage: any) => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.data);
        if (remoteMessage.data?.bookId) {
           // Small delay to ensure navigation is ready
          setTimeout(() => navigation.navigate('BookDetails', { id: remoteMessage.data.bookId }), 500);
        }
      }
    });
};