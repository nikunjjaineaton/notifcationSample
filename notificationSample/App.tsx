


import React from 'react';
import { ScrollView,SafeAreaView,View,Text,StyleSheet } from 'react-native'
import {CustomLoader} from './custom-loader'
import {HttpRequest} from './http-request'
import {  TouchableOpacity,Clipboard } from 'react-native';
import NotifService from './NotifService';

var udid = ''
import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

//import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {setSensitiveData,getSensitiveData ,LocalStorageKey} from './local-storage'


export type Props = {
 

};
export type State = {
  isTOLoaded:boolean
  message: string,
  udid:string
  permissions: {}
}

interface AppProps { }


class App extends React.Component<Props,State> {
  //notificationEngObj: NotificationEngine

  constructor(props: any) {
    super(props)
    let self = this
    let notifcationObj = new NotifService(
      function (tokenData) {
        const { token } = tokenData;
        Clipboard.setString(token)
          console.log("configur",token)
          udid = token
          alert("Token copied to clipboard"+ token)
      }.bind(this),
      function (notification) {
        alert(notification.data.aps.alert)
       // alert("configur"+notification.message)
       
      }.bind(this),
    );
    notifcationObj.requestPermissions()
    
    this.state = {
      isTOLoaded:false,
  message: "",
  permissions: {},
  udid:""
 }
  }

  componentWillMount(){
    const { notifcationOption } = this.props
    if(notifcationOption)
    {
      alert(notifcationOption.aps.alert)
    }

  }

 registerDevice = ( ) => {
  
  this.setState({isTOLoaded:true})
  HttpRequest.put("notification/registrations/22345678-1234-1433-1234-123456789012").mapResponse().withBody({
           platform : "apns",                                          
          pns_handle : udid,  
          mobile_app_id : "com.powerxpertmobile", 
          user : "Nikunj_Jain@eaton.com",                                  
          tags : ["mytag", "hello","email"],                                  
          user_phone_number : "9594390284"     
  }).send((value)=>{
    alert(value)
    this.setState({isTOLoaded:false})
  },(value)=>{
    alert(value)
    this.setState({isTOLoaded:false})
  },204)
}

updateTagDevice = ( ) => {
 
 this.setState({isTOLoaded:true})
 HttpRequest.put("notification/registrations/22345678-1234-1433-1234-123456789012/tags").mapResponse().withBody({
                                          
         tags : ["mytag12", "hello12","email12"],                                  
          
 }).send((value)=>{
   alert(value)
   this.setState({isTOLoaded:false})
 },(value)=>{
   alert(value)
   this.setState({isTOLoaded:false})
 },204)
}


dregisterDevice = () => {
 
 this.setState({isTOLoaded:true})
 HttpRequest.delete("notification/registrations/22345678-1234-1433-1234-123456789012").mapResponse().send((value)=>{
   alert(value)
   this.setState({isTOLoaded:false})
 },(value)=>{
   alert(value)
   this.setState({isTOLoaded:false})
 },204)
}



// [PUT /api/v1/notification/registrations/{registration_id}]

 

 

// + Description

// Register mobile devices with notification service in order to receive push notifications.

 

// + Parameters

 

//     + registration_id: `22345678-1234-1234-1234-123456789012` (string, required)

//         Represents the registration_id in the form of an 8-4-4-4-12 uuid string.

 

// + Request

//     + Body (required)

//     {

//         "platform" : "gcm",                                          // (string, required) - Represents the target platform for the registration. currently supported platforms are gcm, apns.

//         "pns_handle" : "dZ0vXUHDHzA:APA91bH5yIa4zIoqGmP3mcNfMzWadZTjBKB3ot-jBUhHe1YdDZrgXmQL_rqeDVwGKuRebSVaHFakPiL5DlB8VvheqJQjeRStxrD6a6bLnF9cWVTB0-bHMqKQdEa6FAWsUsLQjPUHO9xz",  (string, required) - // Represents the token obtained from platform-specific notification service.

//         "mobile_app_id" : "1:840900843793:android:5fda48d314a85f8a", // (string, required) -  Represents the unique key for the each mobile app.

//         "user" : "tester@test.com",                                  // (string, required) - Represents user's e-mail address for whom the mobile device registration would be created.    

//         "tags" : ["tag1", "tag2"],                                   // ([ string ], optional) - Represents the list of tags to target specific notification registrations, all registrations that contain the specified tag receive the notification. A tag can be any string, up to 120 characters, containing alphanumeric and the following non-alphanumeric characters: ‘_’, ‘@’, ‘#’, ‘.’, ‘:’, ‘-’. Notification service supports a maximum of 50 tags per device.

//         "user_phone_number" : "1234567890"                           // (string, required) - Represents the user phone number to be link with device registration. It must be unique across all device registration for given mobile_app_id.

// }

// + Response 201

loginUser = (username: string, password: string) => {
  this.setState({isTOLoaded:true})
  HttpRequest.post('security/token')
    .mapResponse()
    .withBody({
      user: "Nikunj_Jain@eaton.com",
      password: "Eaton123!",
      applicationId:'be443e7a-f72d-47d6-960f-316a67a3668d'
    })
    .sendForLogin((value)=>{
      alert(value)
      setSensitiveData(LocalStorageKey.JWT,value)
      this.setState({isTOLoaded:false})
    },(value)=>{
      alert(value)
      this.setState({isTOLoaded:false})
    })
  }

  
  
 

private  async getTokenJSON(){
  const jwt = await getSensitiveData(LocalStorageKey.JWT);
  const token =  await jwt.map(token => token).or(() => ({}))
    if(jwt.isSome()){
      
      return { Authorization: `${token}` }
      }else {
       
     return  ({})
     }
   
}

 
  
  _onRegistered(deviceToken) {
   
    udid = deviceToken
    alert(`Device token updated.`)
  }
  componentDidMount() {
    console.disableYellowBox = true;
    //this.notificationEngObj = NotificationEngine.getInstance(this)
    // if (Platform.OS === 'android'){
    //     PushNotificationEmitter = new NativeEventEmitter(NotificationHubAndroid);
    //     PushNotificationEmitter.addListener(DEVICE_NOTIF_EVENT, this._onRemoteNotification);
    //   }else{
    //     NotificationHubIOS.addEventListener('notification', this._onRemoteNotification);
    //     NotificationHubIOS.addEventListener('localNotification', this._onLocalNotification);
    //   }

  }
  render() {
    const { isTOLoaded } = this.state
   
    
    
    return (
      <View>
        
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
           
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          
          <View style={styles.body}>
          <View style={styles.sectionContainer}>
            {isTOLoaded && <CustomLoader />}
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.loginUser("","")}>
              <Text style={styles.sectionTitle}>Login</Text>
              </TouchableOpacity>
              </View>
            
            <View style={styles.sectionContainer}>
            
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.registerDevice()}>
              
              <Text style={styles.sectionTitle}>Register(mytag,hello,email)</Text>
              </TouchableOpacity>
              </View>
            <View style={styles.sectionContainer}>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.updateTagDevice()}>
              <Text style={styles.sectionTitle}>Update tags (mytag12,hello12,email12)</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sectionContainer}>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.dregisterDevice()}>
              <Text style={styles.sectionTitle}>DRegister</Text>
              </TouchableOpacity>
              </View>
              </View>
        </ScrollView>
      </SafeAreaView>
      </View>)
  }
}


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
export default App




  