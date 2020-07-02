import SInfo from 'react-native-sensitive-info';
import { Maybe } from './maybe';

export enum LocalStorageKey {
  JWT = 'JWT',
  TOUCHID = 'TOUCHID',
  DEVICENOTIFICATIONSTATUS = 'DEVICENOTIFICATIONSTATUS',
  EMAILNOTIFICATIONSTATUS = 'EMAILNOTIFICATIONSTATUS',
  UNAME='UNAME',
  USERID='USERID'
}

export const getSensitiveData = async (key: LocalStorageKey): Promise<Maybe<string>> => {
  try {
  //  sensitiveInfo.setInvalidatedByBiometricEnrollment(true)
    const value = await SInfo.getItem(key, {});
    return Maybe.of(value);
  } catch (e) {
    return Maybe.none();
  }
};

export const getNotifcationSensitiveDataWithHandler =  (key: LocalStorageKey,callBack: (value:string) =>void): void => {
 
 
  SInfo.getItem(key,{}).then(value => {
  if (value === null || value === undefined){
    callBack("none")
   }else{
    callBack(value)
   }
   
}).catch(e =>{
  callBack("none")
});
};

export const getTouchIDStatusWithHandler =  (key: LocalStorageKey,callBack: (value:string) =>void): void => {
 
 
  SInfo.getItem(key,{}).then(value => {
  if (value === null || value === undefined){
    callBack("none")
   }else{
    callBack(value)
   }
   
}).catch(e =>{
  callBack("none")
});
};

export const setSensitiveData =  (key: LocalStorageKey, value: string) => {
  try {
    SInfo.setItem('key1', 'value1', {});
   // SInfo.setItem(key, value, {});
  } catch (e) {
    console.error(e);
  }
};

export const clearSensitiveData = async (key: LocalStorageKey) => {
  try {
    await SInfo.deleteItem(key, {});
  } catch (e) {
    console.error(e);
  }
};

