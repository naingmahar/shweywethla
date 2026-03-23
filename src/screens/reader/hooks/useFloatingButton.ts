import { useRef, useCallback, useEffect } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import type { IEsModelRefProps } from '../../../componet/atoms/Types/IModal';
import { BUTTON_SIZE } from '../htmlReader.constants';

interface Params {
  snapLeftX: number;
  snapRightX: number;
  btnMinY: number;
  btnMaxY: number;
  containerWidth: number;
  containerHeight: number;
}

export interface FloatingButtonResult {
  htmlModelRef: React.RefObject<IEsModelRefProps>;
  dragGesture: ReturnType<typeof Gesture.Race>;
  floatingBtnAnimStyle: ReturnType<typeof useAnimatedStyle>;
  openSettingsModal: () => void;
}

export function useFloatingButton({
  snapLeftX, snapRightX,
  btnMinY, btnMaxY,
  containerWidth, containerHeight,
}: Params): FloatingButtonResult {
  const htmlModelRef    = useRef<IEsModelRefProps>(null);
  const sidePreference  = useSharedValue(1);
  const btnX            = useSharedValue(snapRightX);
  const btnY            = useSharedValue(containerHeight * 0.5);
  const btnContext      = useSharedValue({ x: 0, y: 0 });

  // Re-clamp when dimensions/insets change
  useEffect(() => {
    const targetX = sidePreference.value === 0 ? snapLeftX : snapRightX;
    btnX.value = withSpring(targetX);
    btnY.value = withSpring(Math.max(btnMinY, Math.min(btnY.value, btnMaxY)));
  }, [snapLeftX, snapRightX, btnMinY, btnMaxY, sidePreference]);

  const openSettingsModal = useCallback(() => {
    htmlModelRef.current?.open();
  }, []);

  const tapGesture = Gesture.Tap()
    .onEnd(() => { runOnJS(openSettingsModal)(); });

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      btnContext.value = { x: btnX.value, y: btnY.value };
    })
    .onUpdate(e => {
      btnX.value = btnContext.value.x + e.translationX;
      btnY.value = btnContext.value.y + e.translationY;
    })
    .onEnd(() => {
      const snapToLeft = btnX.value < containerWidth / 2;
      sidePreference.value = snapToLeft ? 0 : 1;
      btnX.value = withSpring(snapToLeft ? snapLeftX : snapRightX);
      btnY.value = withSpring(Math.max(btnMinY, Math.min(btnMaxY, btnY.value)));
    });

  const dragGesture = Gesture.Race(tapGesture, panGesture);

  const floatingBtnAnimStyle = useAnimatedStyle(() => ({
    left: btnX.value,
    top:  btnY.value,
  }));

  return { htmlModelRef, dragGesture, floatingBtnAnimStyle, openSettingsModal };
}
