import { NavigationContainer } from '@react-navigation/native';

import {enableScreens} from 'react-native-screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabs } from './bottom.nav';
import { Quizzes } from '../screens/quiz';
import { ADS } from '../screens/ads';
import { RegisterScreen } from '../screens/Register';
import { useEffect } from 'react';
import { authUserState } from '../features/recoilState';
import { RecoilRoot, useRecoilState } from 'recoil';
import { getStoreUserInfo } from '../features/storage/UserStorage';
import { useAtom } from 'jotai';
import { AuthAtom } from '../features/jotai/model/auth';
import { setHeaderWithToken } from '../features/apiClient/config/Instance';
import { PrivacyPolicy } from '../screens/privacypolicy';
import { TermsAndConditions } from '../screens/TermsAndConditions';
import { HelperPage } from '../screens/helper';


export enum MainNav  {
  WELCOME = "Welcome",
  HOME = "Home",
  QUIZZES="Quizzes",
  ADS="ADS",
  REGISTER="Register",
  privacypolicy="Privacy Policy",
  TermsAndConditions="Terms And Conditions",
  helper="Helper Program"
}

export type RootStackParamList = {
  "Welcome":any,
  "Register":any,
  "Home":any,
  "Quizzes":any,
  "ADS":any,
  "Privacy Policy":any,
  "Terms And Conditions":any,
  "Helper Program":any
};


const Stack = createNativeStackNavigator<RootStackParamList>();

enableScreens();
export default function AppRoute() {

  const [getAuthUser,setAuthUser] = useAtom(AuthAtom)

  useEffect(()=>{
    if(getAuthUser?.token) setHeaderWithToken(getAuthUser.token)
  },[getAuthUser])

  if(!getAuthUser?.id){
    return (
      <Stack.Navigator>
        <Stack.Screen name={MainNav.WELCOME} component={RegisterScreen} options={{headerShown:false}}  />
      </Stack.Navigator>
    )
  }

  return (
    <RecoilRoot>
      <Stack.Navigator>
        {/* <Stack.Screen name={MainNav.WELCOME} component={RegisterScreen} options={{headerShown:false}}  /> */}
        <Stack.Screen name={MainNav.HOME} component={BottomTabs} options={{headerShown:false}}  />
        <Stack.Screen name={MainNav.QUIZZES} component={Quizzes} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.ADS} component={ADS} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.helper} component={HelperPage} options={{headerShown:true}}   />
        <Stack.Screen name={MainNav.privacypolicy} component={PrivacyPolicy} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.TermsAndConditions} component={TermsAndConditions} options={{headerShown:false}}   />
      </Stack.Navigator>
    </RecoilRoot>
  );
}

