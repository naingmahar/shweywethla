// import React, { createRef, useEffect, useRef, useState } from "react";
// import { View, Dimensions, StyleSheet, Text, NativeSyntheticEvent, NativeScrollEvent, ScrollView, TouchableOpacity, StatusBar, Switch, Pressable, Button, TextInput } from "react-native";
// import { WebView } from "react-native-webview";
// import RNFS from "react-native-fs";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Colors } from "../../res/color";
// import { FlexContainer, FlexRowContainer } from "../../componet/atoms/container/FlexContainer";
// import { Icon, IconKey, IconsSize } from "../../componet/atoms/icons";
// import { EsModel } from "../../componet/atoms/container/ModalContainer";
// import { IEsModelRefProps } from "../../componet/atoms/Types/IModal";
// import { useNavigation } from "@react-navigation/native";
// import { MainNav } from "../../nav/main.nav";
// import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
// import { BookPlayerView } from "./BookPlayerView";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// const { width, height } = Dimensions.get("window");

// const ReaderFlatListWebView = ({path,title}:{path:string,title:string}) => {
//   const [pages, setPages] = useState<string[]>([]);
//   const [currentPage, setCurrentPage] = useState(0);
//     const [enabled, setEnabled] = useState(false);
//   const [goToPage, setGoToPage] = useState(0);

     
//     const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//       const index = Math.round(event.nativeEvent.contentOffset.x / width);
//       setCurrentPage(index);
//     };

//     const sendCommand = (prompt:"next"|"previous") => {
//         if(prompt ==  "next") setCurrentPage(current =>  current + 1);
//         else setCurrentPage(current =>  current - 1);
//     };

  

//   useEffect(() => {
//     const loadText = async () => {
//       try {
//         const content = await RNFS.readFile(path, "utf8");

//         const paragraphs = content
//           .split("---")
//           .map((p) => p.trim())
//           .filter((p) => p.length > 0);

//          setPages(paragraphs);
//         // Convert each paragraph to HTML
//         const htmlPages = paragraphs.map((p) => {
//           let htmlText = p
//         //   p.replace(/\[img:(.*?)\]/g, '<img src="$1"/>');
//           htmlText = htmlText.replace(/--next--/g,"<br/>");
//           return `
//             <html>
//               <head>
//                 <meta charset="utf-8">
//                 ${
//                   enabled
//                   ? `<link href="https://s3.ap-southeast-2.amazonaws.com/shweywethla.com/dark.style.css" rel="stylesheet">`
//                   :
//                   `<link href="https://s3.ap-southeast-2.amazonaws.com/shweywethla.com/light-style.css" rel="stylesheet">`
                  
//               }
//               </head>
//               <body style="background-color:#fcf7ea">
//                 <p style="padding-top:50px;padding-bottom:10px">
//                     ${htmlText}
//                 </p>  
//               </body>
//             </html>
//           `;
//         });

//         setPages(htmlPages);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     loadText();
//   }, [enabled]);

//     const htmlModelRef = createRef<IEsModelRefProps>()
//     const navigation = useNavigation()
//     const INJECTED_JAVASCRIPT = `
//         // Target the entire body and apply unselectable styles
//         document.body.style.userSelect = 'none'; 
        
//         // Ensure cross-browser compatibility, especially for older iOS/Android WebViews
//         document.body.style.webkitUserSelect = 'none'; 
//         document.body.style.webkitTouchCallout = 'none'; // Specifically for iOS pop-up menu
        
//         true; // Don't forget to return true at the end
//     `;

//   return (
//     <SafeAreaView style={[styles.container, enabled ? {backgroundColor:"#121212"} : {backgroundColor:"#fff"}]}>
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <StatusBar barStyle={enabled ? "light-content" : "dark-content"} backgroundColor={enabled ? "#121212" : "#fff"} />
//         <BookPlayerView 
//           title={title}
//           navigate={()=>{navigation.navigate(MainNav.HOME as never)}}
//           sendCommand={sendCommand}
//           currentPage={currentPage}
//           pages={pages}
//           htmlModelRef={htmlModelRef}
//         >
//           {/* <FlexRowContainer noneBasicStyle fullWidth style={{alignItems:"center",justifyContent:"space-around",paddingHorizontal:10,paddingVertical:10,backgroundColor: enabled? "#121212" :"#fff",borderBottomWidth:1,borderBottomColor:"#ccc"}}>
//             <FlexContainer noneBasicStyle isTouchable onPress={()=>{navigation.navigate(MainNav.HOME as never)}} style={{justifyContent:"flex-start",alignItems:"flex-start"}}>
//               <Icon icon={IconKey.back} size={IconsSize.lg} className={{color: enabled? "#fff" :"#333"}} />
//             </FlexContainer>
//             <FlexContainer noneBasicStyle fullFlex centerAlign>
//                   <Text style={{fontSize:20,fontWeight:"500",color: enabled? "#fff" :"#333",textAlign:"center"}} >{title}</Text>
//             </FlexContainer>
//             <FlexContainer noneBasicStyle style={{justifyContent:"flex-end",alignItems:"flex-end"}}>
//                 <TouchableOpacity onPress={()=>htmlModelRef.current?.open()} style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",minWidth:80,height:25,borderColor:"white",borderWidth:1,borderBottomLeftRadius:15,borderTopLeftRadius:15,backgroundColor:Colors.nav}}>
//                     <Text style={{color:"#fff",textAlign:"center",fontSize:10,fontWeight:"500"}}>Page {currentPage + 1} / {pages.length + 1}</Text>
//                 </TouchableOpacity>
//             </FlexContainer>
//           </FlexRowContainer> */}
//           <WebView
//               originWhitelist={["*"]}
//               source={{ html: pages[currentPage] }}
//               style={{ width, height }}
//               javaScriptEnabled
//               domStorageEnabled
//               // Inject the JavaScript snippet here
//               injectedJavaScript={INJECTED_JAVASCRIPT}
//           />

//           {/* Footer */}
//           {/* <View
//             style={styles.footer}
//             >
//               <TouchableOpacity onPress={() => sendCommand("previous") } disabled={currentPage === 0}>
//                   <Text style={styles.button}>⬅ Prev</Text>
//               </TouchableOpacity>

//               <FlexRowContainer noneBasicStyle centerAlign isTouchable onPress={()=>htmlModelRef.current?.open()}>
//                   <Icon icon={IconKey.setting} size={20} className={{color:"white",marginRight:10}} />
//                   <Text style={styles.pageNumber}>
//                       Setting
//                   </Text>
//               </FlexRowContainer>

//               <TouchableOpacity onPress={() => sendCommand("next") } disabled={currentPage === pages.length - 1}>
//                   <Text style={styles.button}>Next ➡</Text>
//               </TouchableOpacity>
//           </View> */}
//       </BookPlayerView>
//         <EsModel ref={htmlModelRef}>
//           <FlexContainer noneBasicStyle fullWidth fullFlex>
//               <View style={{height:"65%",opacity:0}}></View>
//               <FlexContainer noneBasicStyle fullFlex  style={modalStyle.container}>
//                   <FlexContainer noneBasicStyle fullFlex style={{padding:20}}>
//                       <Text style={modalStyle.title}>Page Options</Text>
                      
//                       {/* Go to page*/}
//                       <FlexRowContainer noneBasicStyle style={modalStyle.gotopageCOntainer}>
//                           <Text style={{fontSize:16,fontWeight:"400",color:"#333"}}>Go To Page</Text>
//                           <FlexRowContainer noneBasicStyle centerAlign>
//                               <TextInput onChangeText={(val)=>{
//                                 setGoToPage(parseInt(String(val)))}} keyboardType="number-pad" style={{width:80,height:35,backgroundColor:"#cccccc",marginRight:20,borderRadius:10,paddingHorizontal:10}} />
//                               <TouchableOpacity onPress={()=>{
//                                   if(goToPage > pages.length || goToPage < 1) return;
//                                 setCurrentPage(goToPage -1)}} style={{backgroundColor:Colors.nav,padding:10,borderRadius:10}}>
//                                 <Icon icon={IconKey.search} size={15} className={{color:"white"}} />
//                                 {/* <Text style={{fontSize:14,fontWeight:"500",color:"#fff"}}>Search</Text> */}
//                             </TouchableOpacity>
//                           </FlexRowContainer>
//                       </FlexRowContainer>


//                       <FlexRowContainer noneBasicStyle style={{justifyContent:"space-between",alignItems:"center",marginVertical:10}}>
//                           <FlexRowContainer noneBasicStyle centerAlign>
//                               {/* <Icon icon={IconKey.addDocument} size={20} className={{color:"#333",marginRight:10}} /> */}
//                               <Text style={{fontSize:16,fontWeight:"400",color:"#333"}}>{"Save as bookmark"}</Text>
//                           </FlexRowContainer>
//                           <FlexContainer>
//                             <Icon icon={IconKey.bookmaek} size={30} className={{color:"#333",marginRight:10}}/>
//                           </FlexContainer>
//                       </FlexRowContainer>
//                       <FlexRowContainer noneBasicStyle style={{justifyContent:"center" ,alignItems:"center",marginVertical:10}}>
//                           <FlexRowContainer noneBasicStyle centerAlign>
//                               <Icon icon={IconKey.home} size={20} className={{color:"#333",marginRight:10}} />
//                               <Text style={{fontSize:16,fontWeight:"400",color:"#333"}}>{"Go To Home"}</Text>
//                           </FlexRowContainer>
//                       </FlexRowContainer>
                      
//                   </FlexContainer>
//               </FlexContainer>
//               {/* <View style={{height:"50%",opacity:0}}></View> */}
//               {/* </FlexContainer> */}
//           </FlexContainer>  
//         </EsModel>
//       </GestureHandlerRootView>
//     </SafeAreaView>
//   );
// };
// const modalStyle = StyleSheet.create({
//   title:{
//     fontSize:20,
//     fontWeight:"500",
//     color:"#333",
//     marginBottom:20,
//     textAlign:"center"
//   },
//   container:{
//     borderRadius:10,
//     backgroundColor:"white"
//   },
//   gotopageCOntainer:{
//     justifyContent:"space-between",
//     alignItems:"center",
//     marginVertical:10
//   }
// })
// const styles = StyleSheet.create({
//      button: { fontSize: 16, fontWeight: "bold", color: "#fff" },
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//     textAlign: "center",
//   },
//   page: {
//     width,
//     // minHeight: height - 110, // leave space for header + footer
//     padding: 20,
//     // paddingBottom: 40,
//     marginVertical: 10,
//     // justifyContent: "center",
//     // alignItems: "center",
//   },
//   paragraph: {
//     fontSize: 18,
//     fontWeight: "600",
//     lineHeight:40,
//      color: "#333",
//     textAlign: "auto",
//   },
//   footer: {
//     marginTop:60,
//     height: 50,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     borderRadius:20,
//     position:"absolute",
//     bottom:20,
//     left:10,
//     right:10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     backgroundColor: Colors.nav,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 5,
//     opacity:0.9

//   },
//   pageNumber: {
//     fontSize: 16,
//     color: "#fff",
//   },


//   modelContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: "transparent", // Semi-transparent overlay for the background
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },

// });

// export default ReaderFlatListWebView;



import React, { createRef, useEffect, useRef, useState } from "react";
import { View, Dimensions, StyleSheet, Text, NativeSyntheticEvent, NativeScrollEvent, ScrollView, TouchableOpacity, StatusBar, Switch, Pressable, Button, TextInput, Alert } from "react-native";
import { WebView } from "react-native-webview";
import RNFS from "react-native-fs";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, GradientColor } from "../../res/color";
import { FlexContainer, FlexRowContainer } from "../../componet/atoms/container/FlexContainer";
import { Icon, IconKey, IconsSize } from "../../componet/atoms/icons";
import { EsModel } from "../../componet/atoms/container/ModalContainer";
import { IEsModelRefProps } from "../../componet/atoms/Types/IModal";
import { useNavigation } from "@react-navigation/native";
import { MainNav } from "../../nav/main.nav";
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BookPlayerView } from "./BookPlayerView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LineBreak } from "../../componet/atoms/container/CardContainer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReaderGuideModal } from "../../componet/atoms/modal/ReaderGuideModal";

const { width, height } = Dimensions.get("window");

const ReaderFlatListWebView = ({path,title}:{path:string,title:string}) => {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [goToPage, setGoToPage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(index);
  };

  useEffect(() => {
    const loadSavedPage = async () => {
      try {
        const savedPage = await AsyncStorage.getItem(`@last_page_${title}`);
        if (savedPage !== null) {
          setCurrentPage(parseInt(savedPage));
        }else{
           setShowGuide(true);
        }
      } catch (e) {
        console.error("Failed to load page", e);
      } finally {
        setIsLoaded(true); // Signal that we have finished checking storage
      }
    };
    loadSavedPage();
  }, [title]);

  // --- NEW: Save page whenever it changes ---
  useEffect(() => {
    const savePage = async () => {
      // Only save if the initial load from storage has finished
      if (isLoaded) {
        try {
          await AsyncStorage.setItem(`@last_page_${title}`, currentPage.toString());
        } catch (e) {
          console.error("Failed to save page", e);
        }
      }
    };
    savePage();
  }, [currentPage, isLoaded, title]);

  const sendCommand = (prompt:"next"|"previous") => {
    if (pages.length <= 1) return; // Disable navigation if single page
    if(prompt ==  "next") setCurrentPage(current => Math.min(current + 1, pages.length - 1));
    else setCurrentPage(current => Math.max(current - 1, 0));
  };



  useEffect(() => {
    const loadText = async () => {
      try {
        const content = await RNFS.readFile(path, "utf8");

        const paragraphs = content
          .split("---")
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

        const totalPages = paragraphs.length;
        const htmlPages = paragraphs.map((p, index) => {
          let htmlText = p;
          htmlText = htmlText.replace(/--next--/g,"<br/>");
          // Replace large inline rem font sizes with readable px values
          htmlText = htmlText.replace(/font-size\s*:\s*3rem/gi,   'font-size: 20px');
          htmlText = htmlText.replace(/font-size\s*:\s*2\.75rem/gi,'font-size: 18px');
          htmlText = htmlText.replace(/font-size\s*:\s*2\.5rem/gi, 'font-size: 17px');
          //  htmlText = htmlText.replace(/<br>/gi, '');
          return `
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
              <style>
                * {
                  box-sizing: border-box;
                  -webkit-tap-highlight-color: transparent;
                }
                body {
                  font-family: -apple-system, Roboto, sans-serif;
                  font-size: 17px;
                  line-height: 1.85;
                  color: #2c2c2c;
                  margin: 0;
                  padding: 16px 8px 80px 8px;
                  background-color: #fcf7ea;
                  word-break: break-word;
                  text-align: justify;
                  -webkit-hyphens: auto;
                  hyphens: auto;
                }
                .page-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding-bottom: 8px;
                  margin-bottom: 20px;
                  border-bottom: 1px solid #d0c9b5;
                  font-size: 14px;
                  color: #999;
                }
                .page-header .book-title {
                  flex: 1;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  font-style: italic;
                  margin-right: 12px;
                  font-weight: 700;
                }
                .page-header .page-num {
                  font-weight: 700;
                  color: #777;
                  white-space: nowrap;
                }
                p {
                  margin: 0 0 16px 0;
                  text-align: justify;
                }
                h1 {
                  font-size: 20px;
                  font-weight: 700;
                  color: #1a1a1a;
                  margin: 20px 0 10px 0;
                  line-height: 1.4;
                  text-align: center;
                }
                h2 {
                  font-size: 18px;
                  font-weight: 700;
                  color: #222;
                  margin: 18px 0 10px 0;
                  line-height: 1.4;
                  text-align: center;
                }
                h3 {
                  font-size: 17px;
                  font-weight: 700;
                  color: #333;
                  margin: 16px 0 8px 0;
                  line-height: 1.4;
                  text-align: center;
                }
                h4 {
                  font-size: 16px;
                  font-weight: 600;
                  color: #444;
                  margin: 14px 0 6px 0;
                  line-height: 1.4;
                }
                h5 {
                  font-size: 15px;
                  font-weight: 600;
                  color: #555;
                  margin: 12px 0 6px 0;
                  line-height: 1.4;
                }
                h6 {
                  font-size: 14px;
                  font-weight: 600;
                  color: #666;
                  margin: 10px 0 4px 0;
                  line-height: 1.4;
                  font-style: italic;
                }
                blockquote {
                  margin: 16px 0;
                  padding: 12px 16px;
                  border-left: 4px solid ${enabled ? '#555' : '#c8b99a'};
                  background-color: ${enabled ? '#1e1e1e' : '#f3ede0'};
                  color: ${enabled ? '#ddd' : '#555'};
                  font-style: italic;
                  border-radius: 0 8px 8px 0;
                }
                pre {
                  background-color: #2b3440;
                  color: #f0f0f0;
                  padding: 16px;
                  border-radius: 10px;
                  font-family: "Courier New", Courier, monospace;
                  font-size: 14px;
                  margin: 16px 0;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  margin: 16px 0;
                  border-radius: 10px;
                  display: block;
                }
                bi {
                  font-weight: bold;
                  font-style: italic;
                }
                bic {
                  display: block;
                  font-weight: bold;
                  font-style: italic;
                  text-align: center;
                }
                c {
                  display: block;
                  text-align: center;
                }
                .txt-center { text-align: center; }
                .full-width { width: 100%; }
              </style>
              </head>
              <body>
                <div class="page-header">
                  <span class="book-title">${title}</span>
                  <span class="page-num">${index + 1} / ${totalPages}</span>
                </div>
                ${htmlText}
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

  const htmlModelRef = createRef<IEsModelRefProps>();
  const navigation = useNavigation();
  const totalPages = pages.length;
  const INJECTED_JAVASCRIPT = `
        // Disable text selection
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.webkitTouchCallout = 'none';

        var totalPages = ${totalPages};
        var touchStartX = 0;
        var touchStartY = 0;

        document.addEventListener('touchstart', function(e) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
          // If only one page, do nothing
          if (totalPages <= 1) return;

          var touchEndX = e.changedTouches[0].clientX;
          var touchEndY = e.changedTouches[0].clientY;
          var diffX = Math.abs(touchEndX - touchStartX);
          var diffY = Math.abs(touchEndY - touchStartY);

          // Only navigate if it was a tap (not a scroll)
          if (diffX < 10 && diffY < 10) {
            var screenWidth = window.innerWidth;
            if (touchStartX < screenWidth / 2) {
              window.ReactNativeWebView.postMessage('previous');
            } else {
              window.ReactNativeWebView.postMessage('next');
            }
          }
        }, { passive: true });
        true;
    `;

  return (
    <SafeAreaView style={[styles.container, enabled ? styles.containerDark : styles.containerLight]}>
      <GestureHandlerRootView style={styles.gestureRoot}>
        {/* <StatusBar barStyle={enabled ? "light-content" : "dark-content"} backgroundColor={enabled ? "#121212" : "#fff"} /> */}
        <BookPlayerView
          title={title}
          navigate={()=>{navigation.navigate(MainNav.HOME as never)}}
          sendCommand={sendCommand}
          currentPage={currentPage}
          pages={pages}
          htmlModelRef={htmlModelRef}
        >
          <WebView
            originWhitelist={["*"]}
            source={{ html: pages[currentPage] }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            scalesPageToFit={false}
            injectedJavaScript={INJECTED_JAVASCRIPT}
            onMessage={(event) => {
              const msg = event.nativeEvent.data;
              if (msg === 'next') sendCommand('next');
              else if (msg === 'previous') sendCommand('previous');
            }}
          />
      </BookPlayerView>

      <ReaderGuideModal
        visible={showGuide}
        onClose={() => setShowGuide(false)}
      />

        <EsModel ref={htmlModelRef}>
          <FlexContainer noneBasicStyle fullWidth fullFlex>
              <View style={styles.spacerHidden65}></View>
              <FlexContainer noneBasicStyle fullFlex style={modalStyle.container}>
                  <FlexContainer noneBasicStyle fullFlex style={styles.modalInnerPadding}>
                      <Text style={modalStyle.title}>Page Options</Text>

                      {/* Go to page*/}
                      <FlexRowContainer noneBasicStyle style={styles.rowSpaceBetween}>
                          <Icon icon={IconKey.book} size={30} className={{color:GradientColor[2]}}/>
                          <FlexRowContainer noneBasicStyle centerAlign>
                              <TextInput
                                onChangeText={(val) => {
                                  setGoToPage(parseInt(String(val)));
                                }}
                                keyboardType="number-pad"
                                placeholder="Page Number"
                                style={styles.goToInput}
                              />
                              <TouchableOpacity
                                onPress={()=>{
                                  if(goToPage > pages.length || goToPage < 1){}
                                  else setCurrentPage(goToPage -1);
                                  htmlModelRef.current?.close();
                                }}
                                style={styles.goToButton}
                              >
                                <Icon icon={IconKey.search} size={15} className={{color:"white"}} />
                              </TouchableOpacity>
                          </FlexRowContainer>
                      </FlexRowContainer>
                      
                      <LineBreak  />

                      <FlexRowContainer noneBasicStyle style={styles.rowSpaceBetween}>
                          <Icon icon={IconKey.bookmaek} size={30} className={{color:GradientColor[2],marginRight:10}}/>
                          <FlexRowContainer noneBasicStyle fullFlex>
                              <Text style={styles.modalTextPrimary}>{"Save as Bookmark"}</Text>
                          </FlexRowContainer>
                      </FlexRowContainer>

                      <LineBreak  />

                      <FlexRowContainer noneBasicStyle style={styles.rowSpaceBetween}>
                          <Icon icon={IconKey.love} size={30} className={{color:GradientColor[2],marginRight:10}}/>
                          <FlexRowContainer noneBasicStyle fullFlex>
                              <Text style={styles.modalTextPrimary}>{"Like"}</Text>
                          </FlexRowContainer>
                      </FlexRowContainer>

                      <LineBreak  />

                      <FlexRowContainer isTouchable  onPress={()=>{navigation.navigate(MainNav.HOME as never)}} noneBasicStyle style={styles.rowSpaceBetween}>
                          <Icon icon={IconKey.home} size={30} className={{color:GradientColor[2],marginRight:10}}/>
                          <FlexRowContainer noneBasicStyle fullFlex>
                              <Text style={styles.modalTextPrimary}>{"Back to Home"}</Text>
                          </FlexRowContainer>
                      </FlexRowContainer>

                      {/* <FlexRowContainer noneBasicStyle style={styles.centerRow}>
                          <FlexRowContainer noneBasicStyle centerAlign>
                              <Icon icon={IconKey.home} size={20} className={{color:"#333",marginRight:10}} />
                              <Text style={styles.modalTextPrimary}>{"Go To Home"}</Text>
                          </FlexRowContainer>
                      </FlexRowContainer> */}
                  </FlexContainer>
              </FlexContainer>
          </FlexContainer>
        </EsModel>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const modalStyle = StyleSheet.create({
  title:{
    fontSize:20,
    fontWeight:"500",
    color:"#333",
    marginBottom:20,
    textAlign:"center"
  },
  container:{
    borderRadius:10,
    backgroundColor:"white"
  },
  gotopageCOntainer:{
    justifyContent:"space-between",
    alignItems:"center",
    marginVertical:10
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  containerLight: {
    backgroundColor: "#fff",
  },
  gestureRoot: { flex: 1 },
  webview: { width, height },
  spacerHidden65: { height: "55%", opacity: 0 },
  modalInnerPadding: { padding: 20 },
  goToInput: { width: "80%", height: 40, backgroundColor: "#fafafa", borderWidth: 1, borderColor: GradientColor[2],marginRight: 10, borderRadius: 10, paddingHorizontal: 10 },
  goToButton: { backgroundColor: GradientColor[2], padding: 10, borderRadius: 20 },
  rowSpaceBetween: { justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  centerRow: { justifyContent: "center", alignItems: "center", marginVertical: 10 },
  modalTextPrimary: { fontSize: 16, fontWeight: "400", color: "#333" },

  button: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  header: {},
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  page: {
    width,
    padding: 20,
    marginVertical: 10,
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
    backgroundColor: "transparent",
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
