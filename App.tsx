/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { createRef, useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, IconKey } from './src/componet/atoms/icons';
import { BgPhoto, ShapStyles } from './src/componet/atoms/Photo/BgPhoto';
import SplashScreen from 'react-native-splash-screen';
import AppRoute from './src/nav/main.nav';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import NetworkLogger from 'react-native-network-logger';
import { EsModel, IEsModelRefProps } from './src/componet/atoms/modal/Networklogger';
import { FlexContainer, FlexRowContainer } from './src/componet/atoms/container/FlexContainer';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RecoilRoot } from 'recoil';
import { Provider } from 'jotai';
import { GetUser } from './src/features/jotai/model/auth';
import { setHeaderWithToken } from './src/features/apiClient/config/Instance';
import mobileAds from 'react-native-google-mobile-ads';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from './src/res/color';
import AppUpdateChecker from './src/componet/atoms/AppUpdateChecker';
import AdAlert from './src/componet/atoms/modal/AdAlert';
import { notificationListener, requestUserPermission } from './src/services/NotificationService';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
})


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 1, // 24 hours or 1 Day
    },
  },
})

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const networkLoggerRef = createRef<IEsModelRefProps>()

    const initMobileAds = () => {
        mobileAds()
            .initialize()
            .then(adapterStatuses => {
                console.log(" Initialization complete!")
                // Initialization complete!
            });
    }

  useEffect(()=>{
    initMobileAds()
    GetUser().then(user=>{
      if(user&&user.token) setHeaderWithToken(user.token||"")
    })
      setTimeout(()=>{
        SplashScreen.hide();
      },3000)
  },[])

  useEffect(() => {
    requestUserPermission();
    notificationListener(undefined); // pass your navigation ref here
  }, []);

  return (
    <SafeAreaView style={[{flex:1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={ isDarkMode ? "white" : "white" }
      />
      <PersistQueryClientProvider 
        client={queryClient}  
        persistOptions={{ persister: asyncStoragePersister }}
        onSuccess={()=>{
          console.log("STORE")
        }}
      >
        <AppUpdateChecker />
        <AdAlert  />
        {/* <RecoilRoot> */}
        <Provider>
          <NavigationContainer>
            <AppRoute />
          </NavigationContainer>
        </Provider>
        {/* </RecoilRoot> */}
      </PersistQueryClientProvider>
      {/* <TouchableOpacity style={styles.floatingActionButton} onPress={()=>networkLoggerRef.current?.open()}>
        <FlexRowContainer noneBasicStyle centerAlign>
          <Icon icon={IconKey.clock} className={{color:"white"}} />
          </FlexRowContainer>
      </TouchableOpacity> */}
      {/* <EsModel ref={networkLoggerRef}>
          <FlexContainer noneBasicStyle fullWidth fullFlex style={{backgroundColor:"rgba(180,180,180,0.9)"}}>
              <View style={{height:"5%"}}></View>
              <FlexContainer noneBasicStyle fullFlex  style={{borderRadius:10,backgroundColor:"gray"}}>
                  <FlexRowContainer noneBasicStyle style={{justifyContent:"flex-end"}}>
                      <FlexContainer isTouchable onPress={()=>{networkLoggerRef.current?.close()}}><Icon icon={IconKey.close} className={{color:"white"}} /></FlexContainer>
                  </FlexRowContainer>
                  <FlexContainer fullWidth noneBasicStyle style={{height:"90%"}}>
                    <NetworkLogger />
                  </FlexContainer>
              </FlexContainer>
          </FlexContainer>
      </EsModel>  */}
      
      {/* <Icon icon={IconKey.clock} /> */}
      {/* <BgPhoto style={ShapStyles.circle} uri='https://legacy.reactjs.org/logo-og.png'  /> */}
      {/* <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}  colors={['#FFF7B5', '#BF9507']} style={styles.linearGradient}>
        <Text style={styles.buttonText}>
          Sign in with Facebook
        </Text>
      </LinearGradient> */}

      
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  linearGradient: {
    // width:200,
    // height:200,
    flex:1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  floatingActionButton: {
    width: 40,  
    height: 40,   
    borderRadius: 20,            
    backgroundColor: '#ff6d00', 
    justifyContent:"center",
    alignItems:"center",                                   
    position: 'absolute',                                          
    bottom: 80,                                                    
    right: 10, 
  }
});

export default App;
