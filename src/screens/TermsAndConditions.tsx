import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';


export const TermsAndConditions = () => {
  return <WebView source={{ uri: 'https://shweywethla-49cb4.web.app/tems%26conditions.html' }} style={{ flex: 1 }} />;
}