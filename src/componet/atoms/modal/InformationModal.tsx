import React, { FC } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { GradientColor } from '../../../res/color';
import { Icon, IconKey } from '../icons';

interface IInstructionModalProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const InstructionModal: FC<IInstructionModalProps> = ({ visible, onClose, isDarkMode }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View 
            entering={ZoomIn.duration(400).springify()} // ZoomIn is the standard "ScaleIn"
            exiting={ZoomOut.duration(300)} 
            style={[
                styles.modalContainer, 
                { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }
            ]}
        >
          {/* Top Gradient Bar */}
          <LinearGradient
            colors={[GradientColor[3], GradientColor[1], GradientColor[2]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topBar}
          />

          <View style={styles.content}>
            <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#333' : '#F0F0F0' }]}>
              <Icon icon={IconKey.info} size={30} className={{ color: GradientColor[2] }} />
            </View>

            <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#333' }]}>
              Reading Tip
            </Text>
            
            <Text style={[styles.message, { color: isDarkMode ? '#CCC' : '#666' }]}>
              စာမျက်နှာ အချက်အလက်များကို ဖျောက်ရန် သို့မဟုတ် ပြန်ဖော်ရန် မည်သည့်နေရာကိုမဆို 
    <Text style={{ fontWeight: 'bold', color: GradientColor[1] }}> နှစ်ချက်နှိပ် </Text> 
    (Double Tap) ပါ။
            </Text>

            <TouchableOpacity onPress={onClose} style={styles.button}>
              <LinearGradient
                colors={[GradientColor[3], GradientColor[2]]}
                style={styles.gradientBtn}
              >
                <Text style={styles.btnText}>Got it!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '85%',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  topBar: {
    height: 6,
    width: '100%',
  },
  content: {
    padding: 30,
    alignItems: 'center',
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  button: {
    width: '100%',
    height: 50,
  },
  gradientBtn: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});