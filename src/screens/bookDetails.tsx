import React, { createRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';

// Types
import { IBook } from '../types/models/IBook';
import { RootStackParamList, MainNav } from '../nav/main.nav';
import { IEsModelRefProps } from '../componet/atoms/Types/IModal';

// Components
import { EsModel } from '../componet/atoms/container/ModalContainer';
import { FlexContainer, FlexRowContainer } from '../componet/atoms/container/FlexContainer';
import { EsTextInput } from '../componet/atoms/EsTextInput';
import { EsNormalHeader, EsSmallHeader } from '../componet/atoms/EsText';
import { GradientButton } from '../componet/atoms/container/EsButton';
import { Icon, IconKey } from '../componet/atoms/icons';

// Services & Utils
import { RemoveSavedRecordAdWatch } from '../services/recordAdsWatch';
import { isBookDownloaded } from '../services/downloadedBooksDB';
import { getStoreUserInfo, StoreUserInfo } from '../features/storage/UserStorage';
import { deviceInfo } from '../utils/deviceInfo';
import { Colors } from '../res/color';

// Constants
const { width } = Dimensions.get('window');
const COVER_WIDTH = width * 0.6;
const COVER_HEIGHT = COVER_WIDTH * 1.5;
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

type BookDetailsScreenProps = NativeStackScreenProps<RootStackParamList, MainNav.BookDeatils>;

// Header Component
const GradientHeader: React.FC = () => (
  <LinearGradient
    colors={['#7B5EC9', '#4B71C8', '#22B4D3']}
    locations={[0.0, 0.5, 1.0]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[headerStyles.container, { flexDirection: 'row' }]}>
    <Text style={[headerStyles.title, { flex: 1,textAlign:"center" }]}>Shwe Ywet Hla</Text>
  </LinearGradient>
);

// Gender Selector Component
interface GenderSelectorProps {
  selectedGender: string;
  onGenderChange: (gender: 'Male' | 'Female' | 'Other') => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ selectedGender, onGenderChange }) => (
  <>
    <Text style={styles.genderLabel}>Gender Identity</Text>
    <FlexRowContainer noneBasicStyle style={styles.genderContainer}>
      {GENDER_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.genderChip,
            selectedGender === option
              ? styles.genderChipSelected
              : styles.genderChipUnselected,
          ]}
          activeOpacity={0.7}
          onPress={() => onGenderChange(option as any)}>
          <Icon
            icon={option === 'Male' ? IconKey.male : IconKey.female}
            size={20}
            className={{ color: selectedGender === option ? '#7B5EC9' : '#999' }}
          />
          <Text
            style={[
              styles.genderChipText,
              selectedGender === option && styles.genderChipTextSelected,
            ]}>
            {option}
          </Text>
          {selectedGender === option && <View style={styles.selectedDot} />}
        </TouchableOpacity>
      ))}
    </FlexRowContainer>
  </>
);

// Register Modal Component
interface RegisterModalProps {
  name: string;
  gender: string;
  onNameChange: (name: string) => void;
  onGenderChange: (gender: 'Male' | 'Female' | 'Other') => void;
  onRegister: () => void;
  onContinue: () => void;
  isFormValid: boolean;
}

const RegisterModal = React.forwardRef<IEsModelRefProps, RegisterModalProps>(
  (
    {
      name,
      gender,
      onNameChange,
      onGenderChange,
      onRegister,
      onContinue,
      isFormValid,
    },
    ref
  ) => (
    <EsModel ref={ref}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <FlexContainer fullWidth style={styles.modalContent}>
          <View style={styles.modalHandle} />

          <EsNormalHeader style={styles.modalTitle}>Create Profile</EsNormalHeader>

          <EsSmallHeader style={{ textAlign: 'center', marginBottom: 25, color: '#666' }}>
            Please enter your details to continue reading
          </EsSmallHeader>

          <View style={styles.inputWrapper}>
            <EsTextInput
              isError={false}
              label="Full Name"
              onChange={onNameChange}
              placeHolder="Enter your name"
            />
          </View>

          <GenderSelector selectedGender={gender} onGenderChange={onGenderChange} />

          <TouchableOpacity
            disabled={!isFormValid}
            onPress={onContinue}
            style={[styles.buttonWrapper, !isFormValid && { opacity: 0.5 }]}>
            <LinearGradient
              colors={['#7B5EC9', '#4B71C8', '#22B4D3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButtonGradient}>
              <Text style={styles.buttonText}>Continue to Reader</Text>
            </LinearGradient>
          </TouchableOpacity>
        </FlexContainer>
      </View>
    </EsModel>
  )
);

const BookDetailsScreen: React.FC<BookDetailsScreenProps> = ({ route, navigation }) => {
  const book = route.params;
  const registerModalRef = createRef<IEsModelRefProps>();

  // State
  const [downloaded, setDownloaded] = useState(false);
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('');

  const db = firestore();

  // Validation
  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Book not found.</Text>
      </View>
    );
  }

  // Check if book is downloaded on mount
  useEffect(() => {
    isBookDownloaded(book.id).then((res) => {
      setDownloaded(!!res);
    });
    return () => {
      RemoveSavedRecordAdWatch();
    };
  }, []);



  // Register user in Firestore
  const handleRegister = async () => {
    try {
      const deviceInformation = await deviceInfo();
      const userDoc = await db.collection('Users').add({
        name,
        gender,
        deviceInformation,
      });

      StoreUserInfo({ id: userDoc.id, name, gender });
      registerModalRef.current?.close();
    } catch (error) {
      console.error('Registration error:', error);
      registerModalRef.current?.close();
    }
  };

  // Log user activity
  const logUserActivity = async (action: string) => {
    try {
      const userData = await getStoreUserInfo();
      if (!userData?.id) return;

      await db.collection('activityLogs').add({
        user: userData.id,
        action,
        book: book.id,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Activity log error:', error);
    }
  };

  // Handle opening PDF/reader
  const handleOpenPdf = async () => {
    const userData = await getStoreUserInfo();
    
    await logUserActivity(downloaded ? 'read' : 'download');

    if (!userData) {
      registerModalRef.current?.open();
      return;
    }

    navigation.navigate(MainNav.ADS, book);
  };

  const isFormValid = name.trim() !== '' && gender !== '';

  return (
    <ScrollView style={styles.container}>
      <GradientHeader />

      <View style={styles.header}>
        <Image
          style={styles.coverImage}
          source={{ uri: book.coverImageUrl[0] }}
          resizeMode="contain"
        />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>

        {book.samplePdfUrl && (
          <GradientButton
            style={[styles.pdfButton, { marginTop: 20 }]}
            onPress={handleOpenPdf}
            title={downloaded ? 'Read Now' : 'Download'}
          />
        )}
      </View>

      <View style={{ height: 50 }} />

      <RegisterModal
        ref={registerModalRef}
        name={name}
        gender={gender}
        onNameChange={setName}
        onGenderChange={setGender}
        onRegister={handleRegister}
        onContinue={() => {
          handleRegister();
          navigation.navigate(MainNav.ADS, book);
        }}
        isFormValid={isFormValid}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'gray',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 20,
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  coverImage: {
    marginTop: -100,
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  author: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 35,
  },
  pdfButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  // Modal Styles
  modalContent: {
    padding: 24,
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#EFEEF0',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  inputWrapper: {
    marginBottom: 25,
  },
  // Gender Selector Styles
  genderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 1,
    marginLeft: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  genderChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    position: 'relative',
  },
  genderChipUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F0F0F2',
  },
  genderChipSelected: {
    backgroundColor: '#F8F7FF',
    borderColor: '#7B5EC9',
  },
  genderChipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginLeft: 10,
  },
  genderChipTextSelected: {
    color: '#7B5EC9',
  },
  selectedDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7B5EC9',
  },
  // Button Styles
  buttonWrapper: {
    marginTop: 30,
    shadowColor: '#4B71C8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  continueButtonGradient: {
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.nav,
    padding: 16,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default BookDetailsScreen;