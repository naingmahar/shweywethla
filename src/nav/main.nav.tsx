import { NavigationContainer } from '@react-navigation/native';

import {enableScreens} from 'react-native-screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabs } from './bottom.nav';
import { Quizzes } from '../screens/quiz';


export enum MainNav  {
  WELCOME = "Welcome",
  HOME = "Home",
  QUIZZES="Quizzes"
}

export type RootStackParamList = {
  "Welcome":any,
  "Home":any,
  "Quizzes":{category:number}
};


const Stack = createNativeStackNavigator<RootStackParamList>();

enableScreens();
export default function AppRoute() {
  return (
    <Stack.Navigator>
        <Stack.Screen name={MainNav.HOME} component={BottomTabs} options={{headerShown:false}}  />
        <Stack.Screen name={MainNav.QUIZZES} component={Quizzes} options={{headerShown:false}}   />
    </Stack.Navigator>
  );
}