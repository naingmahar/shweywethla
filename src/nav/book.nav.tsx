import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IBook } from "../types/models/IBook";
import BookDetailsScreen from '../screens/bookDetails';
import BookListScreen from '../screens/books';
import { MainNav, RootStackParamList } from './main.nav';


export type BookStackParamList = {
  "Books":any,
  "BookDetails":IBook,
};

export enum BookNav  {
  Books="Books",
  BookDeatils="BookDetails",
}


const BookStack = createNativeStackNavigator<RootStackParamList>();

export default function BookRoute() {
  return (
    <BookStack.Navigator>
      <BookStack.Screen name={MainNav.Books} component={BookListScreen} options={{headerShown:false}}  />
      <BookStack.Screen name={MainNav.BookDeatils} component={BookDetailsScreen} options={{headerShown:false}}   />
    </BookStack.Navigator>

  );
}
