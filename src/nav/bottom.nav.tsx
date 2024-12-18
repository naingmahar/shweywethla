import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RegisterScreen } from '../screens/Register';
import { DashboardScreen } from '../screens/dashboard';
import { Text, View } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { Icon, IconKey, IconsSize } from '../componet/atoms/icons';
import { Circle } from '../componet/atoms/Shape/Circle';

const Tab = createBottomTabNavigator();


function MyTabBar({ state, descriptors, navigation }:any) {
    const { colors } = useTheme();
    const { buildHref } = useLinkBuilder();
  
    const getIcon = (label:any) => {
        const temp = {
            Explore:IconKey.shop,
            Rewards:IconKey.package,
            History:IconKey.category,
            Setting:IconKey.setting
        }

        //@ts-ignore
        return temp[label]
    } 
    return (
      <View style={{ flexDirection: 'row',backgroundColor:"#81C784" }}>
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
                {!isFocused &&
                    <Icon icon={getIcon(label)} size={IconsSize.normal} className={{color:isFocused ? colors.background : colors.background}} />
                }
                {isFocused &&
                    <Circle size={50} style={{backgroundColor:"#fff",marginTop:-25,borderColor:"#fff",borderWidth:1}}>
                        <Icon icon={getIcon(label)} size={IconsSize.normal} className={{color:"#388E3C"}} />
                    </Circle>
                }
              <Text style={{ color: "#EAF1F7",textAlign:"center",fontSize:11 }}>
                {label}
              </Text>
              
            </PlatformPressable>
          );
        })}
      </View>
    );
  }

  
export function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown:false}}  tabBar={(props) => <MyTabBar {...props} />}>
        <Tab.Screen name="Explore" component={DashboardScreen} />
        <Tab.Screen name="Rewards" component={RegisterScreen} />
        <Tab.Screen name="History" component={DashboardScreen} />
        <Tab.Screen name="Setting" component={RegisterScreen} />
    </Tab.Navigator>
  );
}