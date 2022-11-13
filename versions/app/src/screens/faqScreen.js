/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { WebView } from 'react-native-webview';

// COMPONENTS
import { Text, StyleSheet, View, ScrollView } from 'react-native'
import { mailto, gotoWebLink } from '../helpers/helpers'

// STYLES
import { globalStyles, TouchableHighlight, footer, forms } from '../styles/styles';
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


const FaqScreen = () => <WebView source={{ uri: 'https://www.elitepersonalchefs.com/faqs-2' }} /> 


export default FaqScreen;