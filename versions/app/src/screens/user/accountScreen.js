/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useRef, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// OTHER DEPENDENCIES
import { firebase, configKeys } from "../../config/config";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import Constants from "expo-constants";
import _ from "underscore";
import { getUserData } from "../../data/user";

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
import AppContext from "../../components/AppContext";
import { CustomButton, GoToButton } from "../../components/Button";
import { convertTimestamp } from "../../helpers/helpers";
import { TextInputMask, TextMask } from "react-native-masked-text";
import { getEndpoint } from "../../helpers/helpers";

// STYLES
import { globalStyles, forms, modal } from "../../styles/styles";
import Theme from "../../styles/theme.style.js";
import { MaterialCommunityIcons, FontAwesome, MaterialIcons, AntDesign } from "@expo/vector-icons";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function AccountScreen({ navigation }) {
	const appsGlobalContext = useContext(AppContext);
	const { userData: user } = appsGlobalContext;
	const activeFlow = appsGlobalContext.activeFlow;
	const chefProfileImage =
		appsGlobalContext?.userData?.chefProfile?.profile_img ||
		"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/chef-profile-image.png?alt=media&token=9f36f533-3c82-48d5-8a5e-f4ea0636dd02";

	//! No functionality for guests to upload profile image, this will do for now
	const guestProfileImage =
		"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/avatar.png?alt=media&token=817424ef-58b8-4058-939c-c8f2bfe25dac";
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
						appsGlobalContext.setUserData(null);
						appsGlobalContext.setUserID(null);
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

	if (user) {
		return (
			<View style={globalStyles.scrollContainer}>
				<KeyboardAwareScrollView>
					<ScrollView>
						<View style={globalStyles.page}>
							<View style={styles.profile_header}>
								<TouchableWithoutFeedback onPress={checkForCount}>
									{activeFlow == "chefs" ? (
										<Image source={{ uri: chefProfileImage }} style={styles.profile_img} />
									) : (
										<Image source={{ uri: guestProfileImage }} style={styles.profile_img} />
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
	return ccIcon == "cc-amex" ? "•••• •••••• •" : "•••• •••• •••• •••• ";
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
