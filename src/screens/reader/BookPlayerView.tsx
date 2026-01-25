// import React, { FC, useState } from 'react';
// import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import { Gesture, GestureDetector, GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
// import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
// import { FlexContainer, FlexRowContainer } from '../../componet/atoms/container/FlexContainer';
// import { Icon, IconKey, IconsSize } from '../../componet/atoms/icons';
// import { IEsModelRefProps } from '../../componet/atoms/Types/IModal';
// import { Colors, GradientColor } from '../../res/color';
// import LinearGradient from 'react-native-linear-gradient';
// import { scheduleOnRN } from 'react-native-worklets';

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// const FOOTER_HEIGHT = 80;

// // The translation value when the footer is hidden (pushes it down by its own height)
// const HIDDEN_OFFSET = FOOTER_HEIGHT;
// const SHOWN_OFFSET = 0;

// export const BookPlayerView:FC<{
//     children:React.ReactNode,
//     sendCommand:(cmd:"next"|"previous")=>any,
//     currentPage:number,
//     style?:View['props']['style'],
//     pages:string[],
//     htmlModelRef:React.RefObject<IEsModelRefProps | null>,
//     title:string,
//     navigate:()=>void
// }> = (props) =>{
//   const [show,setShow] = useState(true);
//   // 1. State Management: Shared Value for translateY
//   const translateY = useSharedValue(SHOWN_OFFSET);

//   // Function to toggle the visibility state (runs on JS thread)
//   const toggleFooter = () => {
//     setShow(prev=>!prev)
//     // Check current state and toggle the animation
//     if (translateY.value === SHOWN_OFFSET) {
//       translateY.value = withTiming(HIDDEN_OFFSET, { duration: 300 });
//     } else {
//       translateY.value = withTiming(SHOWN_OFFSET, { duration: 300 });
//     }
//   };

//   // 2. Animation: Define the animated style for the footer
//   const animatedFooterStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateY: translateY.value }],
//     };
//   });
//   const animatedHeadderStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateY: translateY.value}],
//     };
//   });

//   // 3. Tap Detection: Define the gesture handler
//   const tapGesture = Gesture.Tap()
//     .numberOfTaps(1) // Single tap
//     .onBegin(() => {
//       // 4. Worklet Logic: Call the JS function to handle the animation
//       // The logic to update the shared value must be done in the Worklet (UI thread),
//       // but the function to toggle the state is simple enough to be run directly.
//       runOnJS(toggleFooter)();
//     });

//   return (
//     // Wrap the entire screen content in the GestureDetector
//     <GestureDetector gesture={tapGesture}>
//       {/* Use an Animated.View as the main container to capture taps across the whole screen */}
//         <Animated.View style={styles.container}>
        
//         <View style={[{height:!show?50:0,width:"100%"}]}>
//           <LinearGradient
//           colors={[GradientColor[3], GradientColor[1], GradientColor[2]]}
//           locations={[0.0, 0.5, 1.0]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={[styles.gradient,{flexDirection:"row",justifyContent:"space-between",alignItems:"center",padding:10}]}
//         >
//           {/* <Icon icon={IconKey.book} size={IconsSize.lg} className={{color:"white",marginRight:10}} /> */}
//           <FlexContainer noneBasicStyle style={{justifyContent:"flex-end",alignItems:"flex-end"}}>
//             <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",minWidth:90,height:25,borderColor:"white",borderWidth:1,borderBottomRightRadius:15,borderTopRightRadius:15,backgroundColor:"white"}}>
//                 <Text style={{color:"#000",textAlign:"center",fontSize:12,fontWeight:"600"}}>Page { props.currentPage + 1} / {props.pages.length}</Text>
//             </TouchableOpacity>
//           </FlexContainer>
//           <Text style={{flex:1,fontSize:16,color:"white",fontWeight:"bold",textAlign:"center"}}>{props.title}</Text>
//            {/* <Icon icon={IconKey.search} size={IconsSize.lg} className={{color:"white",marginRight:10}} /> */}
//           <TouchableOpacity onPress={()=>props.navigate()}><Icon icon={IconKey.close} size={IconsSize.lg} className={{color:"white",marginRight:10}} /></TouchableOpacity>
//         </LinearGradient>
//         </View>
//         {props.children}

//         {/* Animated Footer */}
//         <Animated.View style={[styles.footer, animatedFooterStyle]}>
//           <LinearGradient
//           colors={[GradientColor[3], GradientColor[1], GradientColor[2]]}
//           locations={[0.0, 0.5, 1.0]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={{width:"100%",flexDirection:"row",justifyContent:"space-between",alignItems:"center",borderRadius:20}}
//         >
//             <TouchableOpacity style={styles.btn}  onPress={() => props.sendCommand("previous") } disabled={props.currentPage === 0}>
//                 <Text style={styles.button}>⬅ Prev</Text>
//             </TouchableOpacity>
          
//             <FlexRowContainer noneBasicStyle style={styles.btn}  centerAlign isTouchable onPress={()=>props.htmlModelRef.current?.open()}>
//                 <Icon icon={IconKey.setting} size={25} className={{color:"white",marginRight:10}} />
//                 <Text style={styles.pageNumber}>
//                     Options
//                 </Text>
//             </FlexRowContainer>
            
          
//             <TouchableOpacity style={styles.btn} onPress={() => props.sendCommand("next") } disabled={props.currentPage === props.pages.length - 1}>
//                 <Text style={styles.button}>Next ➡</Text>
//             </TouchableOpacity>
//         </LinearGradient>
//         </Animated.View>
        
//       </Animated.View>
//     </GestureDetector>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: '#333',
//   },
//   pageNumber: {
//     fontSize: 16,
//     color: "#fff",
//     fontWeight:"700"
//   },
//   button: { fontSize: 16, fontWeight: "bold", color: "#fff" },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   mainText: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   subText: {
//     color: '#ccc',
//     fontSize: 14,
//     marginTop: 10,
//   },
//   btn:{
//     padding:15,
//     paddingHorizontal:30
//   },
  
// //   footer: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     height: FOOTER_HEIGHT,
// //     backgroundColor: '#007AFF', // Blue color for visibility
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     // We don't need `zIndex` because the `translateY` property handles the movement.
// //     // Setting a default transform ensures correct initial layout when using Reanimated
// //     transform: [{ translateY: SHOWN_OFFSET }], 
// //   },
// gradient: {
//     flex: 1,
//     height:50
//   },
// footer: {
//     // marginTop:60,
//     // height: 50,


//     // position: 'absolute',
//     // bottom: 0,
//     // left: 0,
//     // right: 0,


//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     // paddingHorizontal: 5,
//     // borderRadius:20,
//     position:"absolute",
//     bottom:5,
//     left:10,
//     right:10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     // backgroundColor: Colors.nav,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 5,
//     opacity:0.9

//   },
//   footerText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '700',
//   },
// });



import React, { FC } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { FlexRowContainer } from '../../componet/atoms/container/FlexContainer';
import { Icon, IconKey, IconsSize } from '../../componet/atoms/icons';
import { IEsModelRefProps } from '../../componet/atoms/Types/IModal';
import { GradientColor } from '../../res/color';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const FOOTER_HEIGHT = 100;
const HEADER_HEIGHT = 60;

export const BookPlayerView: FC<{
  children: React.ReactNode,
  sendCommand: (cmd: "next" | "previous") => any,
  currentPage: number,
  pages: string[],
  htmlModelRef: React.RefObject<IEsModelRefProps | null>,
  title: string,
  navigate: () => void
}> = (props) => {
  
  // 0 = Fully Visible, 1 = Fully Hidden
  const hideProgress = useSharedValue(0);

  // Function to be called from the UI thread via runOnJS
  const toggleVisibility = () => {
    if (hideProgress.value === 0) {
      hideProgress.value = withTiming(1, { duration: 300 });
    } else {
      hideProgress.value = withTiming(0, { duration: 300 });
    }
  };

  // --- Animation Styles ---
  const animatedFooterStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: hideProgress.value * FOOTER_HEIGHT }],
    opacity: 1 - hideProgress.value,
  }));

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: hideProgress.value * -HEADER_HEIGHT }],
    opacity: 1 - hideProgress.value,
  }));

  // --- Correct Gesture Implementation ---
  const tapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true) // This tells the whole gesture to run on JS thread
    .onEnd(() => {
      toggleVisibility();
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={tapGesture}>
        <View style={styles.container}>
          
          {/* Header */}
          <Animated.View style={[styles.header, animatedHeaderStyle]}>
            <LinearGradient
              colors={[GradientColor[3], GradientColor[1], GradientColor[2]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.headerGradient}
            >
              <View style={styles.pagePill}>
                <Text style={styles.pagePillText}>
                  {props.currentPage + 1} / {props.pages.length}
                </Text>
              </View>
              <Text numberOfLines={1} style={styles.headerTitle}>{props.title}</Text>
              <TouchableOpacity onPress={props.navigate}>
                <Icon icon={IconKey.close} size={IconsSize.lg} className={{ color: "white" }} />
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          {/* Reader Content (WebView) */}
          <View style={styles.content}>
            {props.children}
          </View>

          {/* Footer */}
          <Animated.View style={[styles.footer, animatedFooterStyle]}>
            <LinearGradient
              colors={[GradientColor[3], GradientColor[1], GradientColor[2]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.footerGradient}
            >
              <TouchableOpacity 
                style={styles.btn} 
                onPress={() => props.sendCommand("previous")}
                disabled={props.currentPage === 0}
              >
                <Text style={[styles.btnText, props.currentPage === 0 && { opacity: 0.4 }]}>⬅ Prev</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.btn} 
                onPress={() => props.htmlModelRef.current?.open()}
              >
                <FlexRowContainer noneBasicStyle centerAlign>
                  <Icon icon={IconKey.setting} size={22} className={{ color: "white", marginRight: 8 }} />
                  <Text style={styles.btnText}>Options</Text>
                </FlexRowContainer>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.btn} 
                onPress={() => props.sendCommand("next")}
                disabled={props.currentPage === props.pages.length - 1}
              >
                <Text style={[styles.btnText, props.currentPage === props.pages.length - 1 && { opacity: 0.4 }]}>Next ➡</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 100,
  },
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between'
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10
  },
  pagePill: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12
  },
  pagePillText: { color: '#000', fontSize: 11, fontWeight: '700' },
  content: { flex: 1 },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 15,
    right: 15,
    zIndex: 100,
  },
  footerGradient: {
    flexDirection: 'row',
    borderRadius: 25,
    paddingVertical: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 }
  },
  btn: { flex: 1, alignItems: 'center', paddingVertical: 15 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 15 }
});