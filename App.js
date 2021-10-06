import React, { Component } from 'react';

import {
    Alert,
    LayoutAnimation,
    StyleSheet,
    View,
    Text,
    ScrollView,
    UIManager,
    TouchableOpacity,
    Platform,
    Image,
    Linking,
    ToastAndroid
} from 'react-native';

import { firebase } from '@react-native-firebase/messaging';

const CleverTap = require('clevertap-react-native');

class Expandable_ListView extends Component {

    constructor() {

        super();

        this.state = {

            layout_Height: 0

        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.item.expanded) {
            this.setState(() => {
                return {
                    layout_Height: null
                }
            });
        } else {
            this.setState(() => {
                return {
                    layout_Height: 0
                }
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.layout_Height !== nextState.layout_Height) {
            return true;
        }
        return false;
    }


    //In this Function You can write the items to be called w.r.t list id:
    show_Selected_Category = (item) => {
        switch (item) {
            case 1:
                set_userProfile();
                break;
            case 6:
                onUser_Login();
                break;
            case 9:
                getCleverTap_id();
                break;
            case 22:
                pushevent();
                break;
            case 23:
                pushChargedEvent();
                break;
            case 24:
                CleverTap.setDebugLevel(3);
                break;
            case 26:
                create_NotificationChannel();
                break;
            case 53:
                addCleverTapAPIListeners(true);
                break;
        }
    }

    render() {
        return (

            <View style={styles.Panel_Holder}>

                <TouchableOpacity activeOpacity={0.8} onPress={this.props.onClickFunction} style={styles.category_View}>

                    <Text style={styles.category_Text}>{this.props.item.category_Name} </Text>

                    <Image
                        source={{ uri: 'https://reactnativecode.com/wp-content/uploads/2019/02/arrow_right_icon.png' }}
                        style={styles.iconStyle} />

                </TouchableOpacity>

                <View style={{ height: this.state.layout_Height, overflow: 'hidden' }}>

                    {
                        this.props.item.sub_Category.map((item, key) => (

                            <TouchableOpacity key={key} style={styles.sub_Category_Text}

                                onPress={this.show_Selected_Category.bind(this, item.id)}>

                                <Text style={styles.setSubCategoryFontSizeOne}> {item.name} </Text>

                                <View style={{ width: '100%', height: 1, backgroundColor: '#000' }} />

                            </TouchableOpacity>

                        ))
                    }

                </View>
            </View>
        );
    }
}

export default class App extends Component {

    constructor() {
        super();

        if (Platform.OS === 'android') {

            UIManager.setLayoutAnimationEnabledExperimental(true)

        }

        checkPermission();
        messageListener();
        
        CleverTap.setDebugLevel(3);
        // for iOS only: register for push notifications
        CleverTap.registerForPush();
        addCleverTapAPIListeners(true);
        
        // Listener to handle incoming deep links
        Linking.addEventListener('url', _handleOpenUrl);

        /// this handles the case where a deep link launches the application
        Linking.getInitialURL().then((url) => {
            if (url) {
                console.log('launch url', url);
                _handleOpenUrl({ url });
            }
        }).catch(err => console.error('launch url error', err));

        // check to see if CleverTap has a launch deep link
        // handles the case where the app is launched from a push notification containing a deep link
        CleverTap.getInitialUrl((err, url) => {
            if (url) {
                console.log('CleverTap launch url', url);
                _handleOpenUrl({ url }, 'CleverTap');
            } else if (err) {
                console.log('CleverTap launch url', err);
            }
        });

        const array = [
            {

                expanded: false,
                category_Name: "User Properties",
                sub_Category: [{ id: 1, name: 'pushProfile' }]
            },

            {
                expanded: false,
                category_Name: "Identity Management",
                sub_Category: [{ id: 6, name: 'onUserLogin' },{ id: 9, name: 'getCleverTapID' }]
            },
            {
                expanded: false,
                category_Name: "Events",
                sub_Category: [{ id: 22, name: 'pushEvent' },{ id: 23, name: 'pushChargedEvent' }]
            },

            {
                expanded: false, category_Name: "Enable Debugging", sub_Category: [{ id: 24, name: 'Set Debug Level' }]
            },
            {
                expanded: false,
                category_Name: "Push Notifications",
                sub_Category: [
                { id: 26, name: 'createNotificationChannel'}]
            },
            {
                expanded: false,
                category_Name: "Listeners",
                sub_Category: [{ id: 53, name: 'addCleverTapAPIListeners' }]
            }

        ];

        this.state = { AccordionData: [...array] }
    }

    update_Layout = (index) => {

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        const array = [...this.state.AccordionData];

        array[index]['expanded'] = !array[index]['expanded'];

        this.setState(() => {
            return {
                AccordionData: array
            }
        });
    }

    render() {
        return (
            <View style={styles.MainContainer}>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 5 }}>
                    <TouchableOpacity
                        style={styles.button}>
                        <Text style={styles.button_Text}>CleverTap Example</Text>

                    </TouchableOpacity>
                    {
                        this.state.AccordionData.map((item, key) =>
                            (
                                <Expandable_ListView key={item.category_Name}
                                    onClickFunction={this.update_Layout.bind(this, key)} item={item} />
                            ))
                    }

                </ScrollView>

            </View>
        );
    }
}

checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getFcmToken();
    } else {
        this.requestPermission();
    }
  }

  getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      CleverTap.setPushToken(fcmToken, CleverTap.FCM);
      this.showAlert('Your Firebase Token is:', fcmToken);
    } else {
      this.showAlert('Failed', 'No token received');
    }
  }

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
    } catch (error) {
    }
  }

  messageListener = async () => {

    // this.notificationListener = firebase.messaging().onNotification((notification) => {
    //     const { title, body } = notification;
    //     this.showAlert(title, body);
    // });

    // this.notificationOpenedListener = firebase.messaging().onNotificationOpened((notificationOpen) => {
    //     const { title, body } = notificationOpen.notification;
    //     this.showAlert(title, body);
    // });
  
    // const notificationOpen = await firebase.messaging().getInitialNotification();
    // if (notificationOpen) {
    //     const { title, body } = notificationOpen.notification;
    //     this.showAlert(title, body);
    // }

    // this.messageListener = firebase.messaging().onMessage((message) => {
    //   console.log(JSON.stringify(message));
    // });

    this.messageListener =  firebase.messaging().onMessage(async (remoteMessage) => {
        console.log('FCM Message Data:', JSON.stringify(remoteMessage));
        console.log('FCM Message:', remoteMessage.title);
        //CleverTap_command.createNotificationChannel("channelID","channelName","channelDescription",10,true);
      });

     this.messageListener =  firebase.messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('FCM Message Data background:', remoteMessage.data);
        console.log('FCM Message Data background:', remoteMessage.title);
          //CleverTap_command.createNotificationChannel("channelID","channelName","channelDescription",10,true);
      });
 
  }

showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

set_userProfile = () => {

    alert('User Profile Updated');

    CleverTap.profileSet({
        'Name': 'testUserA1', 'Identity': '123456', 'Email': 'test@test.com', 'custom1': 123,
        'birthdate': new Date('2020-03-03T06:35:31')
    });

};
//Identity_Management
onUser_Login = () => {
    alert('User Profile Updated');

    //On user Login
    CleverTap.onUserLogin({
        'Name': 'testUserA1', 'Identity': new Date().getTime() + '',
        'Email': new Date().getTime() + 'testmobile@test.com', 'custom1': 123,
        'birthdate': new Date('1992-12-22T06:35:31')
    })

};
getCleverTap_id = () => {
    // Below method is deprecated since 0.6.0, please check index.js for deprecation, instead use CleverTap.getCleverTapID()
    /*CleverTap.profileGetCleverTapID((err, res) => {
        console.log('CleverTapID', res, err);
        alert(`CleverTapID: \n ${res}`);
    });*/

    // Use below newly added method
    CleverTap.getCleverTapID((err, res) => {
        console.log('CleverTapID', res, err);
        alert('CleverTapID: \n ${res}');
    });
}
///Events

pushevent = () => {
    alert('Event Recorded');

    //Recording an Event
    CleverTap.recordEvent('testEvent');
    CleverTap.recordEvent('testEventWithProps', { 'start': new Date(), 'foo': 'bar' });
};

pushChargedEvent = () => {
    alert('Charged Event Recorded');

    //Recording an Event
    CleverTap.recordChargedEvent({ 'totalValue': 20, 'category': 'books', 'purchase_date': new Date() },
        [{ 'title': 'book1', 'published_date': new Date('2010-12-12T06:35:31'), 'author': 'ABC' },
        { 'title': 'book2', 'published_date': new Date('2000-12-12T06:35:31') },
        { 'title': 'book3', 'published_date': new Date(), 'author': 'XYZ' }]
    );

};


///Push Notification
create_NotificationChannel = () => {
    alert('Notification Channel Created');
    //Creating Notification Channel
    CleverTap.createNotificationChannel("CtRNS", "Clever Tap React Native Testing", "CT React Native Testing", 5, true);

};

function _handleOpenUrl(event, from) {
    console.log('handleOpenUrl', event.url, from);
}

function addCleverTapAPIListeners(fromClick) {
    // optional: add listeners for CleverTap Events
    CleverTap.addListener(CleverTap.CleverTapProfileDidInitialize, (event) => {
        _handleCleverTapEvent(CleverTap.CleverTapProfileDidInitialize, event);
    });
    CleverTap.addListener(CleverTap.CleverTapProfileSync, (event) => {
        _handleCleverTapEvent(CleverTap.CleverTapProfileSync, event);
    });
    CleverTap.addListener(CleverTap.CleverTapPushNotificationClicked, (event) => {
        _handleCleverTapEvent(CleverTap.CleverTapPushNotificationClicked, event);
    });

    if (fromClick) {
        alert("Listeners added successfully");
    }
}


function _handleCleverTapEvent(eventName, event) {
    console.log('handleCleverTapEvent', eventName, event);
    ToastAndroid.show('${eventName} called!', ToastAndroid.SHORT);
}


const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios') ? 44 : 0,
        backgroundColor: '#fff'
    },

    iconStyle: {
        width: 22,
        height: 22,
        justifyContent: 'flex-end',
        alignItems: 'center',
        tintColor: '#fff'
    },

    sub_Category_Text: {
        fontSize: 20,
        color: '#000',
        padding: 10
    },

    category_Text: {
        textAlign: 'left',
        color: '#fff',
        fontSize: 22,
        padding: 12
    },

    category_View: {
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#DC2626'
    },

    Btn: {
        padding: 10,
        backgroundColor: '#FF6F00'
    },

    button: {
        backgroundColor: "#fff",
        flexWrap: "wrap",
        color: '#fff',
        fontSize: 44,
        padding: 10
    },

    button_Text: {
        width: '100%',
        textAlign: 'center',
        color: '#000',
        fontWeight: 'bold',
        fontSize: 26
    },

    setSubCategoryFontSizeOne: {
        fontSize: 18
    },

});