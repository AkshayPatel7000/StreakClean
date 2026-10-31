import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    console.log('[Notifee] User pressed background notification:', detail.notification?.id);
  }
});

AppRegistry.registerComponent(appName, () => App);

