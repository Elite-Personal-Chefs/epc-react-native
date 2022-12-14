/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useRef, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// OTHER DEPENDENCIES
import { firebase, configKeys } from "../config/config";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import Constants from "expo-constants";
import _ from "underscore";

// COMPONENTS
import {
	StyleSheet,
	Text,
	TextInput,
	ScrollView,
	View,
	ActivityIndicator,
	TouchableWithoutFeedback,
	Alert,
	Image,
} from "react-native";
import AppContext from "../components/AppContext";
import { CustomButton, GoToButton } from "../components/Button";
import { convertTimestamp } from "../helpers/helpers";
import { TextInputMask, TextMask } from "react-native-masked-text";
import { getEndpoint } from "../helpers/helpers";

// STYLES
import { globalStyles, forms, modal } from "../styles/styles";
import Theme from "../styles/theme.style.js";
import { MaterialCommunityIcons, FontAwesome, MaterialIcons, AntDesign } from "@expo/vector-icons";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function AccountScreen({ navigation }) {
	//Get global vars from app context
	const appsGlobalContext = useContext(AppContext);
	const uid = appsGlobalContext.userID;
	const activeFlow = appsGlobalContext.activeFlow;
	const [profileImg, setProfileImg] = useState(false);
	console.log("Account UID", uid + " " + activeFlow);
	// const [user,setUserData] = useState(false)
	const [startDate, setStartDate] = useState("");
	const [dataLoaded, setDataLoaded] = useState(false);
	const [sectionName, setSectionName] = useState(false);

	/*************************************************************/
	// GET USER DATA TO RENDER PAGE WITH
	/*************************************************************/
	// const getUserData = async (uid) => {
	//     console.log("Account Screen Active Flow", activeFlow)
	//     const usersRef = firebase.firestore().collection(activeFlow);
	//     const firebaseUser = await usersRef.doc(uid).get();
	//     console.log("Finding user: "+activeFlow+" UID: "+uid)
	//     if (firebaseUser.exists) {
	//         let userData = firebaseUser.data()
	//         let userDate = convertTimestamp(userData.createdAt)

	//         //Set user data throughout page
	//         setUserData(userData);
	//         setStartDate(userDate[0])
	//         setDataLoaded(true)
	//     }
	//     else{
	//         console.log("No user found")
	//     }
	// }

	// if(!dataLoaded){
	//     getUserData(uid)
	// }

	/*************************************************************/
	// EDIT INFO
	/*************************************************************/
	const updateProfile = () => {
		if (sectionName == "phone") {
			updatePhone();
		}
		if (sectionName == "email") {
			updateEmail();
		}
		if (sectionName == "birthday") {
			updateBirthday();
		}
	};

	/*************************************************************/
	// UPDATE BIRTHDAY
	/*************************************************************/
	const [birthday, setNewBirthday] = useState("");
	const updateBirthday = async () => {
		const userData = {
			birthday: birthday,
		};
		const usersRef = firebase.firestore().collection(activeFlow);
		await usersRef.doc(uid).update(userData);
		//Clean up and refresh profile editing
		setSectionName(false);
		setEditProfileSection(false);
		setDataLoaded(false);
	};

	/*************************************************************/
	// LOGOUT
	/*************************************************************/
	const logout = () => {
		Alert.alert(
			"Logout",
			"Would you like to log out?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Logout",
					onPress: async () => {
						console.log("Logging out user");
						await appsGlobalContext.signOut();
						console.log("Logged out");
						// appsGlobalContext.setUserData(null)
						// appsGlobalContext.setUserID(null)
						setUserData(null);
					},
				},
			],
			{
				cancelable: true,
			}
		);
	};

	/*************************************************************/
	// EFFECT TO SHOW DEV SCREEN ON CLICKS
	/*************************************************************/
	const [theCount, setTheCount] = useState(0);
	const [devVisible, setDevVisible] = useState(false);

	const checkForCount = () => {
		let newCount = theCount + 1;
		setTheCount(newCount);
		if (newCount > 6) {
			setDevVisible(true);
		}
		console.log(theCount);
	};

	/*************************************************************/
	// ONLY SHOW IF WE HAVE USER
	/*************************************************************/

	const { userData: user } = appsGlobalContext;

	useEffect(() => {
		//! This is not updating properly
		if (_.has(user, "chefProfile.profile_img")) {
			setProfileImg(user.chefProfile.profile_img);
		}
	}, [user]);

	if (user) {
		return (
			<View style={globalStyles.scrollContainer}>
				<KeyboardAwareScrollView>
					<ScrollView>
						<View style={globalStyles.page}>
							<View style={styles.profile_header}>
								<TouchableWithoutFeedback onPress={checkForCount}>
									{profileImg ? (
										<Image source={{ uri: profileImg }} style={styles.profile_img} />
									) : (
										<MaterialIcons
											name='person'
											size={60}
											color={Theme.SECONDARY_COLOR}
											style={styles.person_icon}
										/>
									)}
								</TouchableWithoutFeedback>
								<View>
									<Text style={styles.profile_name}>{user.name}</Text>
									<Text style={styles.profile_id}>
										Member Since: {convertTimestamp(appsGlobalContext.userData.createdAt)}
									</Text>
									<Text>{appsGlobalContext.userData.email}</Text>
								</View>
							</View>
							{activeFlow == "chefs" && (
								<>
									<GoToButton
										navigation={navigation}
										navigator='Profile Info'
										copy='Profile'
										params={user}
									/>
									{/* <GoToButton navigation={navigation} navigator='Refer' copy='Refer A Chef' /> */}

									{/*                                
                                <GoToButton navigation={navigation} navigator="Waiver of Liability" copy="Waiver of Liability"/>
                                <GoToButton navigation={navigation} navigator="Background Check" copy="Background Check"/>

                                <GoToButton navigation={navigation} navigator="Professional Resume" copy="Professional Resume"/>
                                <GoToButton navigation={navigation} navigator="Food Handler's License" copy="Food Handler's License"/>

                                <GoToButton navigation={navigation} navigator="Professional Licenses" copy="Professional Licenses"/>
                                <GoToButton navigation={navigation} navigator="Sanitation Manager License" copy="Sanitation Manager License"/>
                                <GoToButton navigation={navigation} navigator="Liability Insurance" copy="Liability Insurance"/>
                                */}
								</>
							)}
							<GoToButton navigation={navigation} navigator='Terms' copy='Terms &amp; Conditions' />
							<GoToButton navigation={navigation} navigator='Contact' copy='Contact Us' />
							<GoToButton
								navigation={navigation}
								navigator='FAQ'
								copy='Frequently Asked Questions'
							/>

							<View>
								<Text onPress={() => logout()} style={styles.textLinkText}>
									LOG OUT
								</Text>
								<Text style={styles.versionText}>
									{/* TODO: Find what needs to be done to get the version id */}
									App Version: {"Check TestFlight"}
								</Text>
							</View>
							{devVisible && (
								<View>
									<Text
										onPress={() => navigation.navigate("Playground")}
										style={styles.textLinkText}
									>
										DEVELOPER
									</Text>
								</View>
							)}
						</View>
					</ScrollView>
				</KeyboardAwareScrollView>
			</View>
		);
	} else {
		return (
			<View
				style={[
					globalStyles.container,
					{ flex: 1, alignItems: "center", justifyContent: "center" },
				]}
			>
				<ActivityIndicator size='large' color={Theme.SECONDARY_COLOR} />
			</View>
		);
	}
}

const formatCardNumbers = (ccIcon) => {
	return ccIcon == "cc-amex" ? "???????????? ?????????????????? ???" : "???????????? ???????????? ???????????? ???????????? ";
};

const determineCCIcon = (brand) => {
	const str = brand.toLowerCase();
	switch (str) {
		case "mastercard":
			var icon = "cc-mastercard";
			break;
		case "amex":
			var icon = "cc-amex";
			break;
		default:
			var icon = "cc-visa";
			break;
	}
	return icon;
};

const styles = StyleSheet.create({
	profile_header: {
		marginVertical: 15,
		flexDirection: "row",
		alignItems: "center",
	},
	person_icon: {
		padding: 5,
		marginRight: 10,
	},
	profile_img: {
		width: 70,
		height: 70,
		borderRadius: 35,
		borderWidth: 2,
		borderColor: Theme.SECONDARY_COLOR,
		marginRight: 15, //So it overlaps on the edit icon above it
	},
	profile_name: {
		fontSize: 21,
		color: Theme.TEXT_ON_SURFACE_COLOR,
		fontFamily: Theme.FONT_STANDARD,
		textTransform: "capitalize",
	},
	profile_id: {
		fontSize: 15,
		color: Theme.PRIMARY_COLOR,
		fontFamily: Theme.FONT_LIGHT,
	},
	section_header: {
		fontFamily: Theme.FONT_MEDIUM,
		color: Theme.TEXT_ON_SURFACE_COLOR,
		fontSize: 16,
		padding: 5,
		marginTop: 10,
		marginBottom: 5,
	},
	info_container: {
		paddingHorizontal: 25,
		paddingVertical: 15,
		marginBottom: 25,
		backgroundColor: Theme.BORDER_COLOR,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
	},
	member_detail: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		paddingVertical: 10,
	},
	member_info_text: {
		flex: 1,
		color: Theme.TEXT_ON_SURFACE_COLOR,
		fontSize: 14,
	},
	detail_icons: {
		paddingRight: 15,
		color: Theme.PRIMARY_COLOR,
	},
	edit_icon: {
		color: Theme.SECONDARY_COLOR,
		padding: 10,
	},
	promo_text: {
		color: Theme.SECONDARY_COLOR,
		fontSize: 12,
		fontWeight: "bold",
	},
	textLinkText: {
		textAlign: "center",
		fontFamily: Theme.FONT_MEDIUM,
		textDecorationLine: "underline",
		fontSize: 12,
		padding: 10,
		marginTop: 6,
		color: Theme.PRIMARY_COLOR,
	},
	versionText: {
		textAlign: "center",
		fontFamily: Theme.FONT_STANDARD,
		fontSize: 10,
		padding: 5,
		marginTop: 2,
		color: Theme.FAINT,
	},
	edit_input: {
		borderWidth: 1,
		borderColor: Theme.SECONDARY_COLOR,
		borderRadius: 8,
		paddingLeft: 11,
	},
	modal_text: {
		textAlign: "center",
		color: Theme.TEXT_ON_SURFACE_COLOR,
		fontSize: 15,
	},
	verify_input: {
		paddingLeft: 0,
		borderWidth: 2,
		borderColor: Theme.PRIMARY_COLOR,
		textAlign: "center",
		fontSize: 16,
		lineHeight: 20,
		width: 200,
		height: 45,
		borderRadius: 20,
		fontFamily: Theme.FONT_MEDIUM,
	},
	cc_container: {
		borderRadius: 17,
		padding: 25,
		marginVertical: 16,
		backgroundColor: Theme.SURFACE_COLOR,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
	},
	cc_detail_container: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	small_field: {
		flex: 2,
		marginRight: 5,
		justifyContent: "flex-start",
		alignContent: "flex-start",
		alignItems: "flex-start",
	},
});
