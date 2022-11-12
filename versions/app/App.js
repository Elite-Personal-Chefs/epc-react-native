/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text, StatusBar, Platform, LogBox, AsyncStorage } from "react-native";

//import Sentry from './src/components/Sentry';

//EXPO DEPENDENCIES
import * as Updates from "expo-updates";
import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";

// FIREBASE AND CONFIG DEPENDENCIES
import { firebase, configKeys } from "./src/config/config";

//COMPONENTS
import AppContext from "./src/components/AppContext";
import Navigator from "./src/routes";

//HOOKS
import useSession from "./src/hooks/useSession";

//THEMES AND FONTS SETUP
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Theme from "./src/styles/theme.style.js";

//FONTS SETUP
/*
https://docs.expo.io/guides/using-custom-fonts/
https://fonts.google.com/
https://directory.vercel.app/
*/
import {
	useFonts,
	Roboto_300Light,
	Roboto_400Regular,
	Roboto_400Regular_Italic,
	Roboto_500Medium,
	Roboto_700Bold,
	Roboto_900Black,
} from "@expo-google-fonts/roboto";
import { NotoSerif_400Regular } from "@expo-google-fonts/noto-serif";

/***** assign a default text to the whole app ******/
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: "Roboto_400Regular" };

//Ignore Yellow Timer Warnings caused by firebase
LogBox.ignoreLogs(["Setting a timer"]);

/*******************************************************************************/
//MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function App() {
	/* MANUAL RESET APP FOR DEV TESTING */
	//firebase.auth().signOut();
	//AsyncStorage.removeItem('hasLaunched')

	//LOAD FONTS
	let [fontsLoaded] = useFonts({
		"custom-icons": require("./src/assets/fonts/icomoon.ttf"),
		Roboto_300Light,
		Roboto_400Regular,
		Roboto_400Regular_Italic,
		Roboto_500Medium,
		Roboto_700Bold,
		Roboto_900Black,
		NotoSerif_400Regular,
	});

	//SET STATE OF LOGIN/READINESS VARIABLES
	const { appGlobals, loading } = useSession();
	const [appIsAwaitingOTAUpdates, setAppIsAwaitingOTAUpdates] =
		useState(false);
	console.log("USER", appGlobals.userData);

	//DIAGNOSTICS OF APP STATE
	console.log("APP: FONTS LOADED: " + fontsLoaded);
	console.log("APP: APP IS READY: " + appIsReady);
	console.log("APP: AWAITING OTA UPDATES: " + appIsAwaitingOTAUpdates);
	console.log("APP: USER ID: " + appGlobals.userID);
	console.log("APP: USER LOGGED IN: " + appGlobals.userLoggedIn);

	const holdSplashScreen = async () => {
		try {
			await SplashScreen.preventAutoHideAsync();
		} catch (e) {
			//console.warn(e);
		}
	};

	//CHECK FOR OTA UPDATES
	const checkForUpdates = async () => {
		if (Platform.OS != "web") {
			setAppIsAwaitingOTAUpdates(true);
			try {
				console.log("APP: Checking for updates");
				const update = await Updates.checkForUpdateAsync();
				if (update.isAvailable) {
					const updated = await Updates.fetchUpdateAsync();
					console.log("Updates found");
					// ... notify user of update ...
					await Updates.reloadAsync();
				} else {
					console.log("APP: No Updates detected");
				}
			} catch (e) {
				//console.log(e)
			}
			setAppIsAwaitingOTAUpdates(false);
		}
	};

	//IMMEDIATE CHECK FOR CREDENTIALS
	useEffect(() => {
		console.log(
			"++++++++++++++++ USE EFFECT IS RUNNING: FONTS LOADED ++++++++++++++++="
		);
		holdSplashScreen();
		checkForUpdates();

		//SETUP FUNCTION TO MANAGE GOOGLE AUTH STATE CHANGES

	}, [fontsLoaded]);

	const appIsReady = fontsLoaded && !appIsAwaitingOTAUpdates && !loading;

	//LOAD CONTENT
	if (fontsLoaded && appIsReady) {
		return (
			<AppContext.Provider value={appGlobals}>
				<SafeAreaProvider>
					<StatusBar
						animated={true}
						backgroundColor={Theme.PRIMARY_COLOR}
						barStyle="default"
					/>
					<Navigator userLoggedIn={appGlobals.userLoggedIn} />
				</SafeAreaProvider>
			</AppContext.Provider>
		);
	} else {
		return <AppLoading />;
	}
}
