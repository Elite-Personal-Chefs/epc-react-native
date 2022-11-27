/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState } from "react";
import { WebView } from "react-native-webview";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
const PrivacyPolicyScreen = () => (
	<WebView source={{ uri: "https://www.elitepersonalchefs.com/privacy-policy" }} />
);

export default PrivacyPolicyScreen;
