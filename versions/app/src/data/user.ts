import { firebase } from "../config/config";

const getUserData = async (uid: string) => {
	console.log("Getting user data", uid);

	const genericUserCollection = firebase.firestore().collection("users");
	const genericUser = await genericUserCollection.doc(uid).get();

	if (!genericUser.exists) {
		console.log("User does not exist");
		return null;
	}

	// TODO: See if there is a way to simplify this.
	let genericUserData = genericUser.data();
	let userType = genericUserData?.user_type;
	const userRef = firebase.firestore().collection(userType);
	const userData = await userRef.doc(uid).get();

	if (!userData.exists) {
		console.log(`User does not exist with ${userType}`);
		return null;
	}

	return {
		...genericUserData,
		userID: userData.id,
		userData: userData.data(),
	};
};

// TODO: This function will need to conditionally update either the diner profile or the chef profile.
// const updateUser = async (uid, data) => {
// 	const user = await firebase
// 		.firestore()
// 		.collection("users")
// 		.doc(uid)
// 		.update(data);
// 	return user;
// };

export { getUserData };
