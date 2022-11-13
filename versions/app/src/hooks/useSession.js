import { useState, useEffect } from "react";
import { firebase, configKeys } from "../config/config";
import { getUserData } from "../services/user";

const useSession = () => {
	// TODO: Consolidate. The biggest barrier is the onboarding flow. Do this when you refactor
	const [loading, setLoading] = useState(true);
	const [activeFlow, setActiveFlow] = useState(null); //chefs or guests
	const [userID, setUserID] = useState("");
	const [userLoggedIn, setUserLoggedIn] = useState(false);
	const [userData, setUserData] = useState(null);
	const [accessToken, setAccessToken] = useState(null);

	useEffect(() => {
		setLoading(true);
		console.log("Starting Session (useSession)");

		//SETUP FUNCTION TO MANAGE GOOGLE AUTH STATE CHANGES
		const unsubscribe = firebase
			.auth()
			.onAuthStateChanged((firebaseUser) => {
				if (firebaseUser) {
					const uid = firebaseUser.uid;
					loadUserData(uid);
					setUserID(uid);
					setAccessToken(firebaseUser.getIdToken());
					getAccessToken(firebaseUser);
					setUserLoggedIn(true);
				} else {
					console.log(
						"********************************* NO CURRENT USER. USER LOGGEDIN FALSE"
					);
					appGlobals.setUserID("");
					appGlobals.setUserData(null);
					setUserLoggedIn(false);
				}
				setLoading(false);
			});
		return () => unsubscribe();
	}, []);

	const getAccessToken = async (firebaseUser) => {
		const token = await firebaseUser.getIdToken();
		setAccessToken(token);
	};
	const loadUserData = async (uid) => {
		const user = await getUserData(uid);

		if (user) {
			console.log("APP: User exists from " + user.user_type);
			appGlobals.setActiveFlow(user.user_type);
			appGlobals.setUserData(user.userData);
			if (Platform.OS != "web") {
				//Setup Sentry user vairables to track
				//Sentry.Native.setUser({ uid: uid, username: user.data().name});
			}
		}
	};

	const signInWithEmailAndPassword = async (email, password) =>
		firebase.auth().signInWithEmailAndPassword(email, password);

	const signUpWithEmailAndPassword = async (email, password) =>
		firebase.auth().createUserWithEmailAndPassword(email, password);

	const signOut = async () => firebase.auth().signOut();

	const sendPasswordResetEmail = async (email) =>
		firebase.auth().sendPasswordResetEmail(email);

	const updateEmail = async (email) =>
		firebase.auth().currentUser.updateEmail(email);

	const updatePassword = async (password) =>
		firebase.auth().currentUser.updatePassword(password);

	const reload = async (password) => firebase.auth().currentUser.reload();

	const appGlobals = {
		userID: userID,
		userData: userData,
		configKeys: configKeys,
		activeFlow: activeFlow,
		userLoggedIn,
		apiMode: "api_live", //possible options: local, live, dev
		accessToken,
		setActiveFlow,
		setUserLoggedIn,
		setUserID, //Pass any functions that contexts needs to edit
		setUserData, //Pass any functions that contexts needs to edit
		signInWithEmailAndPassword,
		signUpWithEmailAndPassword,
		signOut,
		sendPasswordResetEmail,
		updateEmail,
		updatePassword,
		reload,
	};

	return {
		appGlobals,
		loading,
	};
};

export default useSession;
