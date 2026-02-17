import React, { createRef, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
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
import { Storage } from '../features/storage/localstorage';
import { deviceInfo } from '../utils/deviceInfo';
import { Colors } from '../res/color';
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';

// Constants
const COVER_WIDTH = 160;
const COVER_HEIGHT = 220;
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-1353250294440692/1557238259';

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

// Star Rating Component
interface StarRatingProps {
  userRating: number;
  averageRating: number;
  ratingCount: number;
  onRate: (stars: number) => void;
  saving: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ userRating, averageRating, ratingCount, onRate, saving }) => (
  <View style={ratingStyles.container}>
    <View style={ratingStyles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => !saving && onRate(star)}
          activeOpacity={0.7}
          style={ratingStyles.starButton}
        >
          <Text style={[ratingStyles.star, { color: star <= userRating ? '#F5A623' : '#D0D0D0' }]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    {ratingCount > 0 ? (
      <Text style={ratingStyles.avgText}>
        {averageRating.toFixed(1)} / 5  ({ratingCount} {ratingCount === 1 ? 'ဦး' : 'ဦး'} ထည့်သွင်းပြီး)
      </Text>
    ) : (
      <Text style={ratingStyles.avgText}>ပထမဦးဆုံး Rating ပေးသူ ဖြစ်ပါ!</Text>
    )}
    {userRating > 0 && (
      <Text style={ratingStyles.yourRating}>သင့်ရဲ့ Rating: {userRating} ★</Text>
    )}
    {saving && <Text style={ratingStyles.savingText}>သိမ်းနေသည်...</Text>}
  </View>
);

const BookDetailsScreen: React.FC<BookDetailsScreenProps> = ({ route, navigation }) => {
  const book = route.params;
  const registerModalRef = createRef<IEsModelRefProps>();

  // State
  const [downloaded, setDownloaded] = useState(false);
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('');

  // Rating state
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [savingRating, setSavingRating] = useState(false);

  const db = firestore();

  const bannerRef = useRef<BannerAd>(null);

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

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

  // Load user's own rating from AsyncStorage (per book, instant, no network)
  // Load average rating from Firestore (aggregate only)
  useEffect(() => {
    // 1. Load user rating from local storage
    Storage.getItemByObjectOrArray<number>(`@bookRating_${book.id}`).then((saved) => {
      if (saved !== null) setUserRating(saved);
    });

    // 2. Listen to aggregate average from Firestore (read-only)
    const ratingDoc = db.collection('bookRatings').doc(book.id);
    const unsubscribe = ratingDoc.onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const count = data?.ratingCount ?? 0;
        const total = data?.totalRating ?? 0;
        setRatingCount(count);
        setAverageRating(count > 0 ? total / count : 0);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle star press — supports changing rating
  const handleRate = async (stars: number) => {
    if (stars === userRating) return; // tapped same star, nothing to do

    const userData = await getStoreUserInfo();
    if (!userData?.id) {
      registerModalRef.current?.open();
      return;
    }

    const previousStars = userRating; // snapshot before update
    setSavingRating(true);
    try {
      // 1. Save to AsyncStorage (overwrite with new value)
      await Storage.setItemByObjectOrArray(`@bookRating_${book.id}`, stars);
      setUserRating(stars);

      // 2. Update Firestore aggregate
      const ratingDocRef = db.collection('bookRatings').doc(book.id);
      await db.runTransaction(async (transaction) => {
        const ratingSnap = await transaction.get(ratingDocRef);

        if (ratingSnap.exists) {
          const currentTotal = ratingSnap.data()?.totalRating ?? 0;
          const currentCount = ratingSnap.data()?.ratingCount ?? 0;

          if (previousStars > 0) {
            // Changing existing rating: swap old stars for new stars, count stays same
            transaction.update(ratingDocRef, {
              totalRating: currentTotal - previousStars + stars,
            });
          } else {
            // New rating: add stars, increment count
            transaction.update(ratingDocRef, {
              totalRating: currentTotal + stars,
              ratingCount: currentCount + 1,
            });
          }
        } else {
          // First ever rating for this book
          transaction.set(ratingDocRef, {
            totalRating: stars,
            ratingCount: 1,
            bookId: book.id,
            bookTitle: book.title,
          });
        }
      });
    } catch (error) {
      console.error('Rating error:', error);
    } finally {
      setSavingRating(false);
    }
  };



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
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          //@ts-ignore
          const target = (book as any).fromTab === 'Notes' ? MainNav.Notes : MainNav.Books;
          //@ts-ignore
          navigation.navigate(target);
        }}
      >
        <Icon icon={IconKey.back} size={24} className={{ color: '#7B5EC9' }} />
      </TouchableOpacity>

      {/* <GradientHeader /> */}
      <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.LEADERBOARD} />

      <View style={styles.header}>
        <Image
          style={styles.coverImage}
          source={{ uri: book.coverImageUrl[0] }}
          resizeMode="contain"
        />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>

        {/* Star Rating */}
        <StarRating
          userRating={userRating}
          averageRating={averageRating}
          ratingCount={ratingCount}
          onRate={handleRate}
          saving={savingRating}
        />

        {book.premium && (
          <GradientButton
            style={[styles.pdfButton, { marginTop: 20 }]}
            onPress={handleOpenPdf}
            title={'Read Now'}
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
  backButton: {
    position: 'absolute',
    top: 100,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
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
    marginTop:100,
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  coverImage: {
    marginTop: -80,
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  author: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 35,
  },
  pdfButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 30,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    // alignSelf: 'center',
    // marginBottom: 20,
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
    // backgroundColor: Colors.nav,
    // padding: 16,
    // paddingTop: 20,
    // alignContent:"center",
    textAlign:"center",
    justifyContent:"center",
    alignItems:"center",
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,"
    shadowColor: '#000',
    minHeight:60,
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

const ratingStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  starButton: {
    paddingHorizontal: 4,
  },
  star: {
    fontSize: 36,
  },
  avgText: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  yourRating: {
    fontSize: 12,
    color: '#7B5EC9',
    marginTop: 4,
    fontWeight: '600',
  },
  savingText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
});

export default BookDetailsScreen;