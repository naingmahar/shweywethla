// AppUpdateChecker.tsx

import React, { useState, useEffect, FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Modal, ActivityIndicator, Platform } from 'react-native';
import { getDatabase, ref, onValue, DatabaseReference,firebase } from '@react-native-firebase/database';
import { getVersion } from 'react-native-device-info';
import { Colors } from '../../res/color';

// 1. Define the interfaces for the data structure
interface AppVersionConfig {
  currentVersion: string;
  forceUpdateVersion: string;
  noticMessage: string;
  noticMessageTitle: string;
  requestNoticMessage: boolean;
  requestUpdate: boolean;
  requiredVersion: string;
  updateMessage: string;
}

interface AppConfig {
  android: AppVersionConfig;
  ios: AppVersionConfig;
}

interface NoticeContent {
  title: string;
  message: string;
}
// 2. Firebase configuration (replace with your actual config)
const database = firebase
  .app()
  .database('https://shweywethla-49cb4-default-rtdb.asia-southeast1.firebasedatabase.app/')


// 4. Current App Version
const CURRENT_APP_VERSION = getVersion();

// 5. App Store URLs
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.shweywethla';

const AppUpdateChecker: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [updateRequired, setUpdateRequired] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);
  const [noticeVisible, setNoticeVisible] = useState<boolean>(false);
  const [noticeContent, setNoticeContent] = useState<NoticeContent>({ title: '', message: '' });

  useEffect(() => {
    const platform = 'android' ;
    const appRef: DatabaseReference = ref(database, `${platform}`);
    
    const unsubscribe = onValue(appRef, (snapshot) => {
      setLoading(false);
      const data: AppVersionConfig | null = snapshot.val();
      
      console.log("Fetched app config:", data);
      if (data) {
        // --- Check for updates ---
        const compareVersions = (current: string, required: string): boolean => {
          const currentParts: number[] = current.split('.').map(Number);
          const requiredParts: number[] = required.split('.').map(Number);
          
          for (let i = 0; i < requiredParts.length; i++) {
            if (currentParts[i] < requiredParts[i]) {
              return true;
            }
          }
          return false;
        };

        if (compareVersions(CURRENT_APP_VERSION, data.requiredVersion)) {
          setUpdateRequired(true);
          setForceUpdate(data.requestUpdate && data.forceUpdateVersion === data.requiredVersion);
          console.log("Update required:", data.requiredVersion, "Current version:", CURRENT_APP_VERSION);  
        } else {
          setUpdateRequired(false);
        }

        // --- Check for server notice ---
        if (data.requestNoticMessage) {
          setNoticeContent({
            title: data.noticMessageTitle,
            message: data.noticMessage,
          });
          setNoticeVisible(true);
        }
      }
    }, (error) => {
      console.error("Firebase fetch failed:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAppStore = (url: string): void => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const ForceUpdateModal: FC = () => (
    <Modal transparent={true} animationType="slide" visible={updateRequired && forceUpdate}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Required</Text>
          <Text style={styles.modalMessage}>
            A new version of the app is available. Please update to continue.
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.forceUpdateButton]}
            onPress={() => openAppStore(PLAY_STORE_URL)}
          >
            <Text style={styles.buttonText}>Update Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const NormalUpdateModal: FC = () => (
    <Modal transparent={true} animationType="slide" visible={updateRequired && !forceUpdate}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Available</Text>
          <Text style={styles.modalMessage}>
            A new version is available with new features and improvements.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.normalUpdateButton]}
              onPress={() => openAppStore( PLAY_STORE_URL)}
            >
              <Text style={styles.buttonText}>Update Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.laterButton]}
              onPress={() => setUpdateRequired(false)}
            >
              <Text style={styles.laterButtonText}>Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const NoticeAlertModal: FC = () => (
    <Modal
      transparent={true}
      animationType="fade"
      visible={noticeVisible}
      onRequestClose={() => setNoticeVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{noticeContent.title}</Text>
          <Text style={styles.modalMessage}>{noticeContent.message}</Text>
          <TouchableOpacity
            style={[styles.button, styles.normalUpdateButton]}
            onPress={() => setNoticeVisible(false)}
          >
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Checking for updates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.mainContent}>Welcome to the App!</Text>
      <Text style={styles.versionText}>Current Version: {CURRENT_APP_VERSION}</Text> */}
      
      {updateRequired && forceUpdate && <ForceUpdateModal />}
      {updateRequired && !forceUpdate && <NormalUpdateModal />}
      {noticeVisible && <NoticeAlertModal />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  mainContent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  versionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  laterButton: {
    backgroundColor: '#e0e0e0',
  },
  laterButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  forceUpdateButton: {
    backgroundColor: Colors.nav,
    width: '100%',
  },
  normalUpdateButton: {
    backgroundColor: Colors.nav,
  },
  buttonText: {
    minWidth:100,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AppUpdateChecker;