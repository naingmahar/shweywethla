import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';


export const TermsAndConditions = () => {
  return <WebView source={{ uri: 'https://s3.ap-southeast-1.amazonaws.com/visa.uetron.com/tems%26conditions.html' }} style={{ flex: 1 }} />;
}