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
import { DataPolicy } from '../screens/datapolicy';
import { AccountDelete } from '../screens/accountDelete';
import { AboutUs } from '../screens/aboutus';
import { Reader } from '../screens/reader';
import BookListScreen from '../screens/books';
import BookDetailsScreen from '../screens/bookDetails';
import { IBook } from '../types/models/IBook';
import ReaderWebView from '../screens/reader/htmlReader';
import TextReaderPage from '../screens/reader/textReader';
import { PdfReader } from '../screens/reader/pdfReader';


export enum MainNav  {
  WELCOME = "Welcome",
  HOME = "Home",
  QUIZZES="Quizzes",
  ADS="ADS",
  REGISTER="Register",
  privacypolicy="Privacy Policy",
  datapolicy="Data Policy",
  TermsAndConditions="Terms And Conditions",
  aboutUs="About Us",
  helper="Helper Program",
  deleteAccount="Delete Account",
  Reader="Reader",
  Books="Books",
  BookDeatils="BookDetails",
  History="History",
  PdfReader="PdfReader",
  TextReader="TextReader",
  HtmlReader="HtmlReader",
}

export type RootStackParamList = {
  "Welcome":any,
  "Register":any,
  "Home":any,
  "Quizzes":any,
  "ADS":IBook,
  "Privacy Policy":any,
  "Terms And Conditions":any,
  "Helper Program":any,
  "Data Policy":any,
  "Delete Account":any
  "About Us":any,
  "Reader":IBook,
  "PdfReader":IBook,
  "TextReader":IBook,
  "HtmlReader":IBook,
  "Books":any,
  "BookDetails":IBook,
  "History":any,
};


const Stack = createNativeStackNavigator<RootStackParamList>();

enableScreens();
export default function AppRoute() {

  // const [getAuthUser,setAuthUser] = useAtom(AuthAtom)

  // useEffect(()=>{
  //   if(getAuthUser?.token) setHeaderWithToken(getAuthUser.token)
  // },[getAuthUser])

  // if(!getAuthUser?.id){
  //   return (
  //     <Stack.Navigator>
  //       <Stack.Screen name={MainNav.WELCOME} component={BookListScreen} options={{headerShown:false}}  />
  //     </Stack.Navigator>
  //   )
  // }

  return (
    <RecoilRoot>
      <Stack.Navigator>
        {/* <Stack.Screen name={MainNav.WELCOME} component={RegisterScreen} options={{headerShown:false}}  /> */}
        {/* <Stack.Screen name={MainNav.Reader} component={ReaderWebView} options={{headerShown:false}}  />  */}
        <Stack.Screen name={MainNav.HOME} component={BottomTabs} options={{headerShown:false}}  />
        <Stack.Screen name={MainNav.BookDeatils} component={BookDetailsScreen} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.Reader} component={Reader} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.Books} component={BookListScreen} options={{headerShown:false}}  />
        {/* <Stack.Screen name={MainNav.PdfReader} component={PdfReader} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.TextReader} component={TextReaderPage} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.HtmlReader} component={ReaderWebView} options={{headerShown:false}}   /> */}
        {/* <Stack.Screen name={MainNav.Register} component={RegisterScreen} options={{headerShown:false}}   /> */}
        <Stack.Screen name={MainNav.QUIZZES} component={Quizzes} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.ADS} component={ADS} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.helper} component={HelperPage} options={{headerShown:true}}   />
        <Stack.Screen name={MainNav.privacypolicy} component={PrivacyPolicy} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.TermsAndConditions} component={TermsAndConditions} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.datapolicy} component={DataPolicy} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.aboutUs} component={AboutUs} options={{headerShown:false}}   />
        <Stack.Screen name={MainNav.deleteAccount} component={AccountDelete} options={{headerShown:false}}   />
      </Stack.Navigator>
    </RecoilRoot>
  );
}

