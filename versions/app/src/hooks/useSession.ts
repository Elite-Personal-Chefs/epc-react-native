import { useState, useEffect } from "react";
import { Platform } from "react-native";
import PocketBase from "pocketbase";

import { firebase, configKeys } from "../config/config";
import { getUserData } from "../api/user";

const ERRORS = {
	REQUIRES_RECENT_LOGIN: "auth/requires-recent-login",
};

const pb = new PocketBase("http://127.0.0.1:8080"); // TODO: Change to read from config

const useSession = () => {
	// TODO: Consolidate. The biggest barrier is the onboarding flow. Do this when you refactor
	const [loading, setLoading] = useState(true);
	const [activeFlow, setActiveFlow] = useState(null); //chefs or guests
	const [user, setUser] = useState();
	const [userID, setUserID] = useState("");
	const [userLoggedIn, setUserLoggedIn] = useState(false);
	const [userData, setUserData] = useState(null);
	const [accessToken, setAccessToken] = useState<string>("");

	useEffect(() => {
		setLoading(true);
		console.log("Starting Session (useSession)");

		//SETUP FUNCTION TO MANAGE GOOGLE AUTH STATE CHANGES
		const unsubscribe = firebase
			.auth()
			.onAuthStateChanged(async (firebaseUser) => {
				if (firebaseUser) {
					console.log("User is logged in");
					const uid = firebaseUser.uid;
					loadUserData(uid);
					setUserID(uid);
					setAccessToken((await firebaseUser.getIdToken()) as string);
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

	const getAccessToken = async (firebaseUser: firebase.User) => {
		const token = await firebaseUser.getIdToken();
		setAccessToken(token);
	};

	const loadUserData = async (uid: string) => {
		const user = (await getUserData(uid)) as any;

		if (user) {
			//console.log("APP: User exists from " + user.user_type);
			appGlobals.setActiveFlow(user.user_type);
			appGlobals.setUserData(user.userData);
			if (Platform.OS != "web") {
				//Setup Sentry user vairables to track
				//Sentry.Native.setUser({ uid: uid, username: user.data().name});
			}
		}
	};

	const signInWithEmailAndPassword = async (
		email: string,
		password: string
	) => {
		const authData = await pb
			.collection("users")
			.authWithPassword(email, password);
		console.log("authData", authData);
		console.log("authstore", JSON.stringify(pb.authStore, null, 4));
		setUser(authData);

		// firebase.auth().signInWithEmailAndPassword(email, password);
	};

	const signUpWithEmailAndPassword = async (
		email: string,
		password: string
	) => {
		// example create data
		const data = {
			email,
			emailVisibility: true,
			password,
			passwordConfirm: password,
		};

		const newUser = await pb.collection("users").create(data);
		console.log("New User", newUser);
	};

	const signOut = async () => pb.authStore.clear();

	const sendPasswordResetEmail = async (email: string) =>
		firebase.auth().sendPasswordResetEmail(email);

	const updateEmail = async (newEmail: string, password: string) => {
		console.debug("Updating email in useSession");
		try {
			await firebase.auth().currentUser?.updateEmail(newEmail);
		} catch (error: any) {
			console.error("Error updating email", error.code);
			// sometimes users can't update their email because they haven't signed in recently
			if (error.code === ERRORS.REQUIRES_RECENT_LOGIN) {
				// create credential to reauthenticate user
				const credential = firebase.auth.EmailAuthProvider.credential(
					firebase.auth().currentUser?.email as string,
					password
				);
				await firebase
					.auth()
					.currentUser?.reauthenticateWithCredential(credential);
				//update email
				await firebase.auth().currentUser?.updateEmail(newEmail);
				console.log("Email updated to " + newEmail);
			} else {
				console.debug(
					"Error, Something else",
					JSON.stringify(error, null, 4)
				);
				throw error;
			}
		}
	};

	const updatePassword = async (password: string) =>
		firebase.auth().currentUser?.updatePassword(password);

	const reload = async (password: string) =>
		firebase.auth().currentUser?.reload();

	const appGlobals = {
		userID: userID,
		userData: userData,
		user,
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
