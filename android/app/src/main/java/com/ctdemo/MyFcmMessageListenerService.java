package com.ctdemo;

import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.clevertap.android.sdk.CleverTapAPI;
import android.os.Bundle; 
import android.util.Log;
import java.util.Map;
import com.clevertap.android.sdk.pushnotification.NotificationInfo;

public class MyFcmMessageListenerService extends ReactNativeFirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage message){
        try {
            if (message.getData().size() > 0) {
                Bundle extras = new Bundle();
                for (Map.Entry<String, String> entry : message.getData().entrySet()) {
                    extras.putString(entry.getKey(), entry.getValue());
                }
                NotificationInfo info = CleverTapAPI.getNotificationInfo(extras);
                if (info.fromCleverTap) {
                       CleverTapAPI.createNotificationChannel(getApplicationContext(),"112233","CT Channel","CT Channel",5,true); 
                       CleverTapAPI.createNotificationChannel(getApplicationContext(),"123456","CT Channel 1","CT Channel",5,true); 
                       CleverTapAPI.createNotificationChannel(getApplicationContext(),"promotion","CT Promotion Channel","CT Channel",5,true); 
                       CleverTapAPI.createNotification(getApplicationContext(), extras);
                } else {
                    // not from CleverTap handle yourself or pass to another provider
                    super.onMessageReceived(message);
                }
            }
        } catch (Throwable t) {
           Log.d("MYFCMLIST", "Error parsing FCM message", t);
        }
    }
}
