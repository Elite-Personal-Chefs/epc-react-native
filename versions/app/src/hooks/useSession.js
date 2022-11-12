import { useState, useEffect } from "react";
import { firebase, configKeys } from "../config/config";
import { getUserData } from "../services/user";

const useSession = () => {
	const [loading, setLoading] = useState(true);
	const [activeFlow, setActiveFlow] = useState(null); //chefs or guests
	const [userID, setUserID] = useState("");
	const [userLoggedIn, setUserLoggedIn] = useState(false);
	const [userData, setUserData] = useState(null);

	const appGlobals = {
		userID: userID,
		userData: userData,
		configKeys: configKeys,
		activeFlow: activeFlow,
		userLoggedIn,
		apiMode: "api_live", //possible options: local, live, dev
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
	};

	useEffect(() => {
		setLoading(true);
		console.log("Starting Session (useSession)");

		//SETUP FUNCTION TO MANAGE GOOGLE AUTH STATE CHANGES
		const unsubscribe = firebase
			.auth()
			.onAuthStateChanged((firebaseUser) => {
				if (firebaseUser) {
					const uid = firebaseUser.uid;
					console.log("SESSION: Current User", uid);
					//Being inside useEffect, we have to create async function here and call it after

					//Call Async function
					if (!userData) loadUserData(uid);
					setUserID(uid);
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

	const loadUserData = async (uid) => {
		const user = await getUserData(uid);

		if (user.exists) {
			console.log("APP: User exists from " + userType);
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

	return {
		appGlobals,
		loading,
	};
};

export default useSession;
