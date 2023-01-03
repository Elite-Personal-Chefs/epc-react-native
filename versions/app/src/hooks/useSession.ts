import { useState, useEffect } from "react";
import { Platform } from "react-native";
import PocketBase from "pocketbase";

import { firebase, configKeys } from "../config/config";
import { getUserData } from "../api/userAPI";

const ERRORS = {
	REQUIRES_RECENT_LOGIN: "auth/requires-recent-login",
};

const pb = new PocketBase("http://127.0.0.1:8080"); // TODO: Change to read from config

const useSession = () => {
	// TODO: Consolidate. The biggest barrier is the onboarding flow. Do this when you refactor
	const [loading, setLoading] = useState(true);
	const [activeFlow, setActiveFlow] = useState(null); //chefs or guests
	const [user, setUser] = useState<any>(); // TODO: create a user type and use it here
	const [userID, setUserID] = useState("");
	const [userData, setUserData] = useState(null);
	const [accessToken, setAccessToken] = useState<string>("");

	useEffect(() => {
		setLoading(true);
		console.log("Starting Session (useSession)");
	}, []);


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
	};

	const signUpWithEmailAndPassword = async (
		email: string,
		password: string
	):Promise<void> => {
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
		const data = {
			email: newEmail,
		};
		
		const record = await pb.collection("users").update(user.id, data);
		console.log("Updated User", record);
	};

	const updatePassword = async (newPassword: string, oldPassword: string) =>
		{
			const data = {
				password: newPassword,
				oldPassword
			};

			const record = await pb.collection("users").update(user.id, data);
			console.log("Password updated", record);
		}

	const reload = async (password: string) =>
		pb.collection("users").authRefresh();

	const appGlobals = {
		userID: userID,
		userData: user,
		user,
		configKeys: configKeys,
		activeFlow: activeFlow,
		userLoggedIn: pb.authStore.isValid,
		apiMode: "api_live", //possible options: local, live, dev
		accessToken,
		setActiveFlow,
		setUserLoggedIn: () => {},
		setUserID, //Pass any functions that contexts needs to edit
		setUserData, //Pass any functions that contexts needs to edit
		signInWithEmailAndPassword,
		signUpWithEmailAndPassword,
		signOut,
		sendPasswordResetEmail,
		updateEmail,
		updatePassword,
	};

	return {
		appGlobals,
		loading,
	};
};

export default useSession;
