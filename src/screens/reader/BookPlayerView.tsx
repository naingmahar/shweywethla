import React, { FC } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { FlexRowContainer } from '../../componet/atoms/container/FlexContainer';
import { Icon, IconKey } from '../../componet/atoms/icons';
import { IEsModelRefProps } from '../../componet/atoms/Types/IModal';
import { Colors } from '../../res/color';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const FOOTER_HEIGHT = 80;

// The translation value when the footer is hidden (pushes it down by its own height)
const HIDDEN_OFFSET = FOOTER_HEIGHT;
const SHOWN_OFFSET = 0;

export const BookPlayerView:FC<{
    children:React.ReactNode,
    sendCommand:(cmd:"next"|"previous")=>any,
    currentPage:number,
    style?:View['props']['style'],
    pages:string[],
    htmlModelRef:React.RefObject<IEsModelRefProps | null>
}> = (props) =>{
  // 1. State Management: Shared Value for translateY
  const translateY = useSharedValue(SHOWN_OFFSET);

  // Function to toggle the visibility state (runs on JS thread)
  const toggleFooter = () => {
    // Check current state and toggle the animation
    if (translateY.value === SHOWN_OFFSET) {
      translateY.value = withTiming(HIDDEN_OFFSET, { duration: 300 });
    } else {
      translateY.value = withTiming(SHOWN_OFFSET, { duration: 300 });
    }
  };

  // 2. Animation: Define the animated style for the footer
  const animatedFooterStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // 3. Tap Detection: Define the gesture handler
  const tapGesture = Gesture.Tap()
    .numberOfTaps(1) // Single tap
    .onEnd(() => {
      // 4. Worklet Logic: Call the JS function to handle the animation
      // The logic to update the shared value must be done in the Worklet (UI thread),
      // but the function to toggle the state is simple enough to be run directly.
      runOnJS(toggleFooter)();
    });

  return (
    // Wrap the entire screen content in the GestureDetector
    <GestureDetector gesture={tapGesture}>
      {/* Use an Animated.View as the main container to capture taps across the whole screen */}
      <Animated.View style={styles.container}>
        
        {/* Main Content Area */}
        {/* <View style={styles.content}>
          <Text style={styles.mainText}>Tap Anywhere to Hide/Show Footer</Text>
          <Text style={styles.subText}>RN 0.82.1 + Reanimated</Text>
        </View> */}
        {props.children}

        {/* Animated Footer */}
        <Animated.View style={[styles.footer, animatedFooterStyle]}>
            <TouchableOpacity onPress={() => props.sendCommand("previous") } disabled={props.currentPage === 0}>
                <Text style={styles.button}>⬅ Prev</Text>
            </TouchableOpacity>
          
            <FlexRowContainer noneBasicStyle centerAlign isTouchable onPress={()=>props.htmlModelRef.current?.open()}>
                <Icon icon={IconKey.setting} size={20} className={{color:"white",marginRight:10}} />
                <Text style={styles.pageNumber}>
                    Setting
                </Text>
            </FlexRowContainer>
          
            <TouchableOpacity onPress={() => props.sendCommand("next") } disabled={props.currentPage === props.pages.length - 1}>
                <Text style={styles.button}>Next ➡</Text>
            </TouchableOpacity>
        </Animated.View>
        
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#333',
  },
  pageNumber: {
    fontSize: 16,
    color: "#fff",
  },
  button: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 10,
  },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: FOOTER_HEIGHT,
//     backgroundColor: '#007AFF', // Blue color for visibility
//     justifyContent: 'center',
//     alignItems: 'center',
//     // We don't need `zIndex` because the `translateY` property handles the movement.
//     // Setting a default transform ensures correct initial layout when using Reanimated
//     transform: [{ translateY: SHOWN_OFFSET }], 
//   },
footer: {
    // marginTop:60,
    height: 50,


    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,


    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius:20,
    position:"absolute",
    bottom:5,
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
  footerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});