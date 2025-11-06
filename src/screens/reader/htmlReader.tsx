import React, { createRef, useEffect, useRef, useState } from "react";
import { View, Dimensions, StyleSheet, Text, NativeSyntheticEvent, NativeScrollEvent, ScrollView, TouchableOpacity, StatusBar, Switch, Pressable, Button, TextInput } from "react-native";
import { WebView } from "react-native-webview";
import RNFS from "react-native-fs";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../res/color";
import { FlexContainer, FlexRowContainer } from "../../componet/atoms/container/FlexContainer";
import { Icon, IconKey, IconsSize } from "../../componet/atoms/icons";
import { EsModel } from "../../componet/atoms/container/ModalContainer";
import { IEsModelRefProps } from "../../componet/atoms/Types/IModal";
import { useNavigation } from "@react-navigation/native";
import { MainNav } from "../../nav/main.nav";
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BookPlayerView } from "./BookPlayerView";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const ReaderFlatListWebView = ({path,title}:{path:string,title:string}) => {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
    const [enabled, setEnabled] = useState(false);
  const [goToPage, setGoToPage] = useState(0);

     
    const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      setCurrentPage(index);
    };

    const sendCommand = (prompt:"next"|"previous") => {
        if(prompt ==  "next") setCurrentPage(current =>  current + 1);
        else setCurrentPage(current =>  current - 1);
    };

  

  useEffect(() => {
    const loadText = async () => {
      try {
        const content = await RNFS.readFile(path, "utf8");

        const paragraphs = content
          .split("---")
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

         setPages(paragraphs);
        // Convert each paragraph to HTML
        const htmlPages = paragraphs.map((p) => {
          let htmlText = p
        //   p.replace(/\[img:(.*?)\]/g, '<img src="$1"/>');
          htmlText = htmlText.replace(/--next--/g,"<br/>");
          return `
            <html>
              <head>
                <meta charset="utf-8">
                ${
                  enabled
                  ? `<link href="https://s3.ap-southeast-2.amazonaws.com/shweywethla.com/dark.style.css" rel="stylesheet">`
                  :
                  `<link href="https://s3.ap-southeast-2.amazonaws.com/shweywethla.com/light-style.css" rel="stylesheet">`
                  
              }
              </head>
              <body>
                <p>
                    ${htmlText}
                </p>  
              </body>
            </html>
          `;
        });

        setPages(htmlPages);
      } catch (err) {
        console.error(err);
      }
    };

    loadText();
  }, [enabled]);

    const htmlModelRef = createRef<IEsModelRefProps>()
    const navigation = useNavigation()
    const INJECTED_JAVASCRIPT = `
        // Target the entire body and apply unselectable styles
        document.body.style.userSelect = 'none'; 
        
        // Ensure cross-browser compatibility, especially for older iOS/Android WebViews
        document.body.style.webkitUserSelect = 'none'; 
        document.body.style.webkitTouchCallout = 'none'; // Specifically for iOS pop-up menu
        
        true; // Don't forget to return true at the end
    `;

  return (
    <SafeAreaView style={[styles.container, enabled ? {backgroundColor:"#121212"} : {backgroundColor:"#fff"}]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle={enabled ? "light-content" : "dark-content"} backgroundColor={enabled ? "#121212" : "#fff"} />
        <BookPlayerView 
          sendCommand={sendCommand}
          currentPage={currentPage}
          pages={pages}
          htmlModelRef={htmlModelRef}
        >
          <FlexRowContainer noneBasicStyle fullWidth style={{alignItems:"center",justifyContent:"space-around",paddingHorizontal:10,paddingVertical:10,backgroundColor: enabled? "#121212" :"#fff",borderBottomWidth:1,borderBottomColor:"#ccc"}}>
            <FlexContainer noneBasicStyle isTouchable onPress={()=>{navigation.navigate(MainNav.HOME as never)}} style={{justifyContent:"flex-start",alignItems:"flex-start"}}>
              <Icon icon={IconKey.back} size={IconsSize.lg} className={{color: enabled? "#fff" :"#333"}} />
            </FlexContainer>
            <FlexContainer noneBasicStyle fullFlex centerAlign>
                  <Text style={{fontSize:20,fontWeight:"500",color: enabled? "#fff" :"#333",textAlign:"center"}} >{title}</Text>
            </FlexContainer>
            <FlexContainer noneBasicStyle style={{justifyContent:"flex-end",alignItems:"flex-end"}}>
                <TouchableOpacity onPress={()=>htmlModelRef.current?.open()} style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",minWidth:80,height:25,borderColor:"white",borderWidth:1,borderBottomLeftRadius:15,borderTopLeftRadius:15,backgroundColor:Colors.nav}}>
                    <Text style={{color:"#fff",textAlign:"center",fontSize:10,fontWeight:"500"}}>Page {currentPage + 1} / {pages.length + 1}</Text>
                    {/* <Icon icon={IconKey.nav} size={15} className={{color:"white"}} /> */}
                </TouchableOpacity>
            </FlexContainer>
          </FlexRowContainer>
          <WebView
              originWhitelist={["*"]}
              source={{ html: pages[currentPage] }}
              style={{ width, height }}
              javaScriptEnabled
              domStorageEnabled
              // Inject the JavaScript snippet here
              injectedJavaScript={INJECTED_JAVASCRIPT}
          />

          {/* Footer */}
          {/* <View
            style={styles.footer}
            >
              <TouchableOpacity onPress={() => sendCommand("previous") } disabled={currentPage === 0}>
                  <Text style={styles.button}>⬅ Prev</Text>
              </TouchableOpacity>

              <FlexRowContainer noneBasicStyle centerAlign isTouchable onPress={()=>htmlModelRef.current?.open()}>
                  <Icon icon={IconKey.setting} size={20} className={{color:"white",marginRight:10}} />
                  <Text style={styles.pageNumber}>
                      Setting
                  </Text>
              </FlexRowContainer>

              <TouchableOpacity onPress={() => sendCommand("next") } disabled={currentPage === pages.length - 1}>
                  <Text style={styles.button}>Next ➡</Text>
              </TouchableOpacity>
          </View> */}
      </BookPlayerView>
        <EsModel ref={htmlModelRef}>
          <FlexContainer noneBasicStyle fullWidth fullFlex>
              <View style={{height:"65%",opacity:0}}></View>
              <FlexContainer noneBasicStyle fullFlex  style={{borderRadius:10,backgroundColor:"white"}}>
                  <FlexRowContainer noneBasicStyle style={{justifyContent:"flex-end"}}>
                      <FlexContainer isTouchable onPress={()=>{htmlModelRef.current?.close()}}><Icon icon={IconKey.close} className={{color:"black"}} /></FlexContainer>
                  </FlexRowContainer>
                  <FlexContainer noneBasicStyle fullFlex style={{padding:20}}>
                      <Text style={{fontSize:20,fontWeight:"500",color:"#333",marginBottom:20}}>Reading Settings</Text>
                      <FlexRowContainer noneBasicStyle style={{justifyContent:"space-between",alignItems:"center",marginVertical:10}}>
                          <Text style={{fontSize:16,fontWeight:"400",color:"#333"}}>Go To Page</Text>
                          <FlexRowContainer noneBasicStyle centerAlign>
                              <TextInput onChangeText={(val)=>{
                                setGoToPage(parseInt(String(val)))}} keyboardType="number-pad" style={{width:80,height:35,backgroundColor:"#cccccc",marginRight:20,borderRadius:10,paddingHorizontal:10}} />
                              <TouchableOpacity onPress={()=>{
                                  if(goToPage > pages.length || goToPage < 1) return;
                                setCurrentPage(goToPage -1)}} style={{backgroundColor:Colors.nav,padding:10,borderRadius:10}}>
                                <Icon icon={IconKey.search} size={15} className={{color:"white"}} />
                                {/* <Text style={{fontSize:14,fontWeight:"500",color:"#fff"}}>Search</Text> */}
                            </TouchableOpacity>
                          </FlexRowContainer>
                      </FlexRowContainer>
                      <FlexRowContainer noneBasicStyle style={{justifyContent:"space-between",alignItems:"center",marginVertical:10}}>
                          <FlexRowContainer noneBasicStyle centerAlign>
                              <Icon icon={enabled ? IconKey.moon : IconKey.sun} size={20} className={{color:"#333",marginRight:10}} />
                              <Text style={{fontSize:16,fontWeight:"400",color:"#333"}}>{enabled ? "Dark Mode" :"Light Mode"}</Text>
                          </FlexRowContainer>
                          <Switch
                              trackColor={{ false: "#767577", true: Colors.nav }}
                              thumbColor={enabled ? "#fff" : "#f4f3f4"}
                              ios_backgroundColor="#3e3e3e"
                              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                              onValueChange={() => setEnabled(previousState => !previousState)}
                              value={enabled}
                          />
                      </FlexRowContainer>
                      
                  </FlexContainer>
              </FlexContainer>
              {/* <View style={{height:"50%",opacity:0}}></View> */}
              {/* </FlexContainer> */}
          </FlexContainer>  
        </EsModel>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
     button: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  page: {
    width,
    // minHeight: height - 110, // leave space for header + footer
    padding: 20,
    // paddingBottom: 40,
    marginVertical: 10,
    // justifyContent: "center",
    // alignItems: "center",
  },
  paragraph: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight:40,
     color: "#333",
    textAlign: "auto",
  },
  footer: {
    marginTop:60,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius:20,
    position:"absolute",
    bottom:20,
    left:10,
    right:10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: Colors.nav,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    opacity:0.9

  },
  pageNumber: {
    fontSize: 16,
    color: "#fff",
  },


  modelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "transparent", // Semi-transparent overlay for the background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

});

export default ReaderFlatListWebView;
