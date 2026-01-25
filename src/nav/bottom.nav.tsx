import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RegisterScreen } from '../screens/Register';
import DashboardScreen  from '../screens/dashboard';
import { Text, View } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { Icon, IconKey, IconsSize } from '../componet/atoms/icons';
import { Circle } from '../componet/atoms/Shape/Circle';
import { Setting } from '../screens/Setting';
import { Colors } from '../res/color';
import { History } from '../screens/History';
import { HelperPage } from '../screens/helper';
import BookListScreen from '../screens/books';
import { MainNav } from './main.nav';
import LinearGradient from 'react-native-linear-gradient';
import BookRoute from './book.nav';
import Dashboard from '../screens/dashboard';

const Tab = createBottomTabNavigator();


function MyTabBar({ state, descriptors, navigation }:any) {
    const { colors } = useTheme();
    const { buildHref } = useLinkBuilder();
  
    const getIcon = (label:any) => {
        const temp = {
            Dashboard:IconKey.dashboard,
            Books:IconKey.book,
            History:IconKey.calendar,
            Setting:IconKey.setting
        }

        //@ts-ignore
        return temp[label]
    } 
    return (
      <LinearGradient
            colors={['#22B4D3', '#4B71C8', '#7B5EC9']} 
            locations={[0.0, 0.5, 1.0]}
            start={{ x: 0, y: 0 }} // Gradient start position
            end={{ x: 1, y: 1 }}   // Gradient end position (horizontal gradient)
            style={{ flexDirection: 'row',margin:10,borderRadius:30}}    // Ensures the gradient fills the entire tab bar height
      >
      {/* <View style={{ flexDirection: 'row',backgroundColor:Colors.infoCard }}> */}
        {state.routes.map((route:any, index:number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;
  
          const isFocused = state.index === index;
  
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
  
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
  
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
  
          return (
            <PlatformPressable
              key={index}
              href={buildHref(route.name, route.params)}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1,justifyContent:"center",alignItems:"center",paddingVertical:10 }}
            >
              <Icon icon={getIcon(label)} size={IconsSize.normal} className={{color:isFocused ? colors.background : colors.background}} />
                {/* {!isFocused &&
                    <Icon icon={getIcon(label)} size={IconsSize.normal} className={{color:isFocused ? colors.background : colors.background}} />
                }
                {isFocused &&
                    <Circle size={50} style={{backgroundColor:"#fff",marginTop:-25,borderColor:"#fff",borderWidth:1}}>
                        <Icon icon={getIcon(label)} size={IconsSize.normal} className={{color:"#388E3C"}} />
                    </Circle>
                } */}
              <Text style={{ color: "#EAF1F7",textAlign:"center",fontSize:11 }}>
                {label}
              </Text>
              
            </PlatformPressable>
          );
        })}
      {/* </View> */}
      </LinearGradient>
    );
  }

  
export function BottomTabs() {
  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown:false,
      }}  
      tabBar={(props) => <MyTabBar {...props} />}
    >
        <Tab.Screen name={MainNav.Dashboard} component={DashboardScreen} />
        <Tab.Screen name={MainNav.Books} component={BookRoute} />
        {/* <Tab.Screen name="Helper" component={HelperPage} /> */}
        <Tab.Screen name={MainNav.History} component={History} />
        <Tab.Screen name="Setting" component={Setting} />
    </Tab.Navigator>
  );
}