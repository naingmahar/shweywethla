import React, { createRef, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTML_MODE_KEY, HtmlReaderMode } from './reader';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getFirestore, collection, addDoc, doc, onSnapshot, runTransaction, serverTimestamp } from '@react-native-firebase/firestore';
import { firebase, ref, get, set } from '@react-native-firebase/database';

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
import { Icon, IconKey, IconsSize } from '../componet/atoms/icons';

// Services & Utils
import { RemoveSavedRecordAdWatch } from '../services/recordAdsWatch';
import { isBookDownloaded } from '../services/downloadedBooksDB';
import { getStoreUserInfo, StoreUserInfo } from '../features/storage/UserStorage';
import { Storage } from '../features/storage/localstorage';
import { deviceInfo } from '../utils/deviceInfo';
import { Colors } from '../res/color';
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';

// Firebase Realtime Database instance
const rtdb = firebase
  .app()
  .database('https://shweywethla-49cb4-default-rtdb.asia-southeast1.firebasedatabase.app/');

// Read user's rating for a book from RTDB (source of truth across installs)
const getUserRatingFromRTDB = async (userId: string, bookId: string): Promise<number> => {
  try {
    const snapshot = await get(ref(rtdb, `userRatings/${userId}/${bookId}`));
    return snapshot.exists() ? (snapshot.val() as number) : 0;
  } catch {
    return 0;
  }
};

// Save user's rating to RTDB
const saveUserRatingToRTDB = async (userId: string, bookId: string, stars: number): Promise<void> => {
  await set(ref(rtdb, `userRatings/${userId}/${bookId}`), stars);
};

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

  // Reader mode state (only for html books)
  const [readerMode, setReaderMode] = useState<HtmlReaderMode | null>(null);
  const [readerSettingsVisible, setReaderSettingsVisible] = useState(false);

  useEffect(() => {
    if (book.premium_type !== 'html') return;
    AsyncStorage.getItem(HTML_MODE_KEY).then(saved => {
      if (saved === 'performance' || saved === 'design') setReaderMode(saved);
      else setReaderMode('design');
    });
  }, []);

  const saveReaderMode = (mode: HtmlReaderMode) => {
    setReaderMode(mode);
    AsyncStorage.setItem(HTML_MODE_KEY, mode);
  };

  // Rating state
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [savingRating, setSavingRating] = useState(false);

  const db = getFirestore();

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
    let isMounted = true;
    isBookDownloaded(book.id).then((res) => {
      if (isMounted) setDownloaded(!!res);
    }).catch(err => console.error('isBookDownloaded error:', err));
    return () => {
      isMounted = false;
      RemoveSavedRecordAdWatch();
    };
  }, []);

  // Load user's own rating from RTDB (persists across reinstalls) with AsyncStorage fallback
  // Load average rating from Firestore (aggregate only)
  useEffect(() => {
    let isMounted = true;

    // 1. Load user rating — RTDB is source of truth, AsyncStorage as fast local cache
    const loadUserRating = async () => {
      const cached = await Storage.getItemByObjectOrArray<number>(`@bookRating_${book.id}`);
      if (isMounted && cached !== null) setUserRating(cached);

      const userData = await getStoreUserInfo();
      if (!isMounted) return;
      if (userData?.id) {
        const rtdbRating = await getUserRatingFromRTDB(userData.id, book.id);
        if (isMounted && rtdbRating > 0) {
          setUserRating(rtdbRating);
          Storage.setItemByObjectOrArray(`@bookRating_${book.id}`, rtdbRating);
        }
      }
    };
    loadUserRating().catch(err => console.error('loadUserRating error:', err));

    // 2. Listen to aggregate average from Firestore (read-only)
    const ratingDoc = doc(db, 'bookRatings', book.id);
    const unsubscribe = onSnapshot(ratingDoc, (docSnap) => {
      if (!isMounted) return;
      if (docSnap.exists) {
        const data = docSnap.data();
        const count = data?.ratingCount ?? 0;
        const total = data?.totalRating ?? 0;
        setRatingCount(count);
        setAverageRating(count > 0 ? total / count : 0);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Handle star press — supports changing rating
  const handleRate = async (stars: number) => {
    if (stars === userRating) return; // tapped same star, nothing to do

    const userData = await getStoreUserInfo();
    if (!userData?.id) {
      registerModalRef.current?.open();
      return;
    }

    setSavingRating(true);
    try {
      // 1. Get previous rating from RTDB (authoritative — not affected by reinstall)
      const previousStars = await getUserRatingFromRTDB(userData.id, book.id);

      // 2. Save new rating to RTDB and local cache
      await saveUserRatingToRTDB(userData.id, book.id, stars);
      await Storage.setItemByObjectOrArray(`@bookRating_${book.id}`, stars);
      setUserRating(stars);

      // 3. Update Firestore aggregate using RTDB previousStars (deduplication safe)
      const ratingDocRef = doc(db, 'bookRatings', book.id);
      await runTransaction(db, async (transaction) => {
        const ratingSnap = await transaction.get(ratingDocRef);

        if (ratingSnap.exists) {
          const currentTotal = ratingSnap.data()?.totalRating ?? 0;
          const currentCount = ratingSnap.data()?.ratingCount ?? 0;

          if (previousStars > 0) {
            // Changing existing rating: swap old stars, count stays same
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
      const userDoc = await addDoc(collection(db, 'Users'), {
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

      await addDoc(collection(db, 'activityLogs'), {
        user: userData.id,
        action,
        book: book.id,
        timestamp: serverTimestamp(),
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

  // Handle listening to audio
  const handleListenAudio = async () => {
    const userData = await getStoreUserInfo();

    await logUserActivity('listen');

    if (!userData) {
      registerModalRef.current?.open();
      return;
    }

    const isAlbum = Array.isArray(book.audioUrl) && book.audioUrl.length > 1;

    if (isAlbum) {
      // Multi-part: show album list first — ad plays before each individual part
      navigation.navigate(MainNav.AudioAlbum, book);
    } else {
      // Single audio: show ad first, then player
      navigation.navigate(MainNav.ADS, { ...book, _adDestination: 'AudioPlayer' });
    }
  };

  const isFormValid = name.trim() !== '' && gender !== '';

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon icon={IconKey.back} size={IconsSize.normal} className={{ color: '#7B5EC9' }} />
      </TouchableOpacity>

      {/* Reader Settings Button — only for HTML books */}
      {book.premium_type === 'html' && (
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setReaderSettingsVisible(true)}
          activeOpacity={0.8}
        >
          <Icon icon={IconKey.setting} size={IconsSize.normal} className={{ color: '#7B5EC9' }} />
        </TouchableOpacity>
      )}

      {/* Reader Settings Modal */}
      <Modal
        visible={readerSettingsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReaderSettingsVisible(false)}
      >
        <TouchableOpacity
          style={readerStyles.backdrop}
          activeOpacity={1}
          onPress={() => setReaderSettingsVisible(false)}
        >
          <View style={readerStyles.sheet}>
            <View style={readerStyles.handle} />
            <Text style={readerStyles.title}>Reader Settings</Text>
            <Text style={readerStyles.subtitle}>ကြိုက်နှစ်သက်ရာ Reader ကို ရွေးချယ်ပါ</Text>

            {/* HTML Reader card */}
            <TouchableOpacity
              style={[readerStyles.card, readerMode === 'design' && readerStyles.cardActive]}
              onPress={() => saveReaderMode('design')}
              activeOpacity={0.85}
            >
              <View style={readerStyles.cardHeader}>
                <Text style={readerStyles.cardIcon}>🎨</Text>
                <View style={{ flex: 1 }}>
                  <Text style={readerStyles.cardTitle}>HTML Reader</Text>
                  <Text style={readerStyles.cardBadge}>Default</Text>
                </View>
                {readerMode === 'design' && <Text style={readerStyles.check}>✓</Text>}
              </View>
              <Text style={readerStyles.cardDesc}>
                စာအုပ်၏ မူရင်း Layout၊ Table၊ Image နှင့် Styling များကို အပြည့်အဝ ပြသသည်။ Format ရှုပ်ထွေးသော စာအုပ်များအတွက် အသင့်တော်ဆုံးဖြစ်သည်။
              </Text>
              <Text style={readerStyles.cardDescEn}>
                Renders full HTML layout with original formatting, tables, images, and styles. Best for richly formatted books.
              </Text>
            </TouchableOpacity>

            {/* Native Reader card */}
            <TouchableOpacity
              style={[readerStyles.card, readerMode === 'performance' && readerStyles.cardActive]}
              onPress={() => saveReaderMode('performance')}
              activeOpacity={0.85}
            >
              <View style={readerStyles.cardHeader}>
                <Text style={readerStyles.cardIcon}>⚡</Text>
                <View style={{ flex: 1 }}>
                  <Text style={readerStyles.cardTitle}>Native Reader</Text>
                  <Text style={readerStyles.cardBadgePerf}>Fast</Text>
                </View>
                {readerMode === 'performance' && <Text style={readerStyles.check}>✓</Text>}
              </View>
              <Text style={readerStyles.cardDesc}>
                မြန်ဆန်ချောမွေ့သော Native Rendering ဖြင့် ဖတ်ရှုနိုင်သည်။ Theme၊ Dark Mode နှင့် Font ချိန်ညှိမှုများ ထောက်ပံ့သည်။ စာများများပါသော စာအုပ်များအတွက် အကောင်းဆုံးဖြစ်သည်။
              </Text>
              <Text style={readerStyles.cardDescEn}>
                Smooth and fast native rendering with theme support, dark mode, and custom fonts. Best for text-heavy books.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={readerStyles.doneBtn}
              onPress={() => setReaderSettingsVisible(false)}
            >
              <Text style={readerStyles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* <GradientHeader /> */}
      <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.LEADERBOARD} />

      <View style={styles.header}>
        <Image
          style={styles.coverImage}
          source={{ uri: book.coverImageUrl?.[0] }}
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

        <View style={{ flexDirection: 'row', width: '100%', marginTop: 20, gap: 15 }}>
          {book.premium && (
            <TouchableOpacity
              style={[styles.pdfButton, { flex: 1 }]}
              onPress={handleOpenPdf}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#7B5EC9', '#4B71C8', '#22B4D3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1, width: '100%', borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon icon={IconKey.book} size={20} className={{ color: 'white' }} />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>Read Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {book.audioUrl && (
            <TouchableOpacity
              style={[styles.pdfButton, { flex: 1 }]}
              onPress={handleListenAudio}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#7B5EC9', '#4B71C8', '#22B4D3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1, width: '100%', borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon icon={IconKey.play} size={20} className={{ color: 'white' }} />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>Listen Audio</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
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

const readerStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#e0e0e0', alignSelf: 'center', marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#1a1a2e', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#888', marginBottom: 20 },
  card: {
    borderWidth: 2, borderColor: '#f0f0f0', borderRadius: 16,
    padding: 16, marginBottom: 12, backgroundColor: '#fafafa',
  },
  cardActive: { borderColor: '#7B5EC9', backgroundColor: '#f5f0ff' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  cardIcon: { fontSize: 28 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  cardBadge: {
    fontSize: 10, fontWeight: '700', color: '#22B4D3',
    backgroundColor: '#e8f8fc', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 6, alignSelf: 'flex-start', marginTop: 2,
  },
  cardBadgePerf: {
    fontSize: 10, fontWeight: '700', color: '#7B5EC9',
    backgroundColor: '#f0ebff', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 6, alignSelf: 'flex-start', marginTop: 2,
  },
  check: { fontSize: 20, color: '#7B5EC9', fontWeight: '800' },
  cardDesc: { fontSize: 13, color: '#555', lineHeight: 20, marginBottom: 4 },
  cardDescEn: { fontSize: 12, color: '#999', lineHeight: 18 },
  doneBtn: {
    marginTop: 8, backgroundColor: '#7B5EC9', borderRadius: 30,
    paddingVertical: 14, alignItems: 'center',
  },
  doneBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

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
  settingsButton: {
    position: 'absolute',
    top: 100,
    right: 16,
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