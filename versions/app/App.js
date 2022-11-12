/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text, StatusBar, Platform, LogBox } from "react-native";

//import Sentry from './src/components/Sentry';

//EXPO DEPENDENCIES
import * as Updates from "expo-updates";
import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";

//COMPONENTS
import AppContext from "./src/components/AppContext";
import Navigator from "./src/routes";

//HOOKS
import useSession from "./src/hooks/useSession";

//THEMES AND FONTS SETUP
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


//Ignore Yellow Timer Warnings caused by firebase and react native packages (Hopefully this will be fixed in the future)
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["ViewPropTypes"]);
LogBox.ignoreLogs(["AsyncStorage has been extracted"]);

SplashScreen.preventAutoHideAsync();
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
		checkForUpdates();

		if (fontsLoaded)
			Text.defaultProps.style = { fontFamily: "Roboto_400Regular" };

		//SETUP FUNCTION TO MANAGE GOOGLE AUTH STATE CHANGES
	}, [fontsLoaded]);

	const appIsReady = fontsLoaded && !appIsAwaitingOTAUpdates && !loading;

	if (!appIsReady) return null;

	SplashScreen.hideAsync();

	//LOAD CONTENT
	//You started loading the font "Roboto_400Regular", but used it before it finished loading. You need to wait for Font.loadAsync to complete before using the font.
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
}
