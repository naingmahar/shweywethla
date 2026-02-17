import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IBook } from "../types/models/IBook";
import BookDetailsScreen from '../screens/bookDetails';
import NotesScreen from '../screens/notes';
import { MainNav, RootStackParamList } from './main.nav';


export type NoteStackParamList = {
  "Notes":any,
  "BookDetails":IBook,
};

export enum NoteNav  {
  Notes="Notes",
  BookDeatils="BookDetails",
}


const NoteStack = createNativeStackNavigator<RootStackParamList>();

export default function NoteRoute() {
  return (
    <NoteStack.Navigator>
      <NoteStack.Screen name={MainNav.Notes} component={NotesScreen} options={{headerShown:false}}  />
      <NoteStack.Screen name={MainNav.BookDeatils} component={BookDetailsScreen} options={{headerShown:false}}   />
    </NoteStack.Navigator>

  );
}
