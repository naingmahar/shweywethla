import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { GradientColor } from '../../../res/color';
import { Icon, IconKey } from '../icons';

const { width } = Dimensions.get('window');

interface ReaderGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ReaderGuideModal: React.FC<ReaderGuideModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>စာဖတ်နည်း လမ်းညွှန်</Text>
            <Text style={styles.subtitle}>How to Read</Text>
          </View>

          {/* Instructions */}
          <View style={styles.content}>

            {/* Tap Left */}
            <View style={styles.instructionRow}>
              <View style={styles.iconContainer}>
                <Icon icon={IconKey.back} size={30} className={{ color: GradientColor[2] }} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>ဘယ်ဘက် နှိပ်ပါ</Text>
                <Text style={styles.instructionDesc}>Tap Left - ယခင်စာမျက်နှာသို့</Text>
              </View>
            </View>

            {/* Tap Right */}
            <View style={styles.instructionRow}>
              <View style={styles.iconContainer}>
                <Icon icon={IconKey.next} size={30} className={{ color: GradientColor[2] }} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>ညာဘက် နှိပ်ပါ</Text>
                <Text style={styles.instructionDesc}>Tap Right - နောက်စာမျက်နှာသို့</Text>
              </View>
            </View>

            {/* Scroll */}
            <View style={styles.instructionRow}>
              <View style={styles.iconContainer}>
                <Icon icon={IconKey.book} size={30} className={{ color: GradientColor[2] }} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.instructionTitle}>အပေါ်အောက် ပွတ်ဆွဲပါ</Text>
                <Text style={styles.instructionDesc}>Scroll Up/Down - စာဖတ်ရန်</Text>
              </View>
            </View>

          </View>

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>သိပြီ / Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: GradientColor[2],
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    marginBottom: 20,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  instructionDesc: {
    fontSize: 13,
    color: '#666',
  },
  button: {
    backgroundColor: GradientColor[2],
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
