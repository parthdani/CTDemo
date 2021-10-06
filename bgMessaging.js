import firebase from '@react-native-firebase/messaging';
// Optional flow type
import type { RemoteMessage } from '@react-native-firebase/messaging';

export default async (message: RemoteMessage) => {
      console.log('FCM Message Data background:', RemoteMessage.data);
        // CleverTap_command.createNotificationChannel("channelID","channelName","channelDescription",10,true);
        // CleverTap_command.createNotification(remoteMessage.data);
   // });

	return Promise.resolve();
 
}