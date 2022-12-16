/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
	Button,
	Text,
	StyleSheet,
	View,
	ScrollView,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	Linking,
} from "react-native";

//Other Dependencies
import { firebase, configKeys } from "../../config/config";
import _ from "underscore";
import { LogBox } from "react-native";

// COMPONENTS
import AppContext from "../../components/AppContext";
import EventTemplateSuggestedPricing from "../../components/chefComponents/EventTemplateSuggestedPricing";
import AddEventTemplateButton from "../../components/chefComponents/AddEventTemplateButton";
import EventTemplateCard from "../../components/chefComponents/EventTemplateCard";
import MenuCard from "../../components/chefComponents/MenuCard";
import { CustomButton } from "../../components/Button";
import { getEndpoint } from "../../helpers/helpers";

import Tooltip from "react-native-walkthrough-tooltip";
import { publishEvent, unpublishEvent, getEventById, getEventReservations } from "../../data/event";
import { getMenuTemplatesById, getMenuTemplateCourses } from "../../data/menuTemplates";

// STYLES
import { globalStyles, eventGlobalStyles, menusStyles, footer, forms } from "../../styles/styles";
import Theme from "../../styles/theme.style.js";
import { AntDesign, MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function EventTemplateDetailScreen({ route, navigation }) {
	LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
	const appsGlobalContext = useContext(AppContext);
	const uid = appsGlobalContext.userID;
	const user = appsGlobalContext.userData;
	const userEmail = appsGlobalContext.userData.email;
	const activeFlow = appsGlobalContext.activeFlow;
	const pageName = route.params.pageName;
	const routeParams = route.params;
	const [eventDetails, setEventDetails] = useState(routeParams || {});
	const [menuTemplateDetails, setMenuTemplateDetails] = useState(null);
	const [eventImg, setEventImg] = useState(
		routeParams.photo || require("../../assets/event_placeholder.png")
	);

	// PASSING TO CHILD COMPONENTS
	const [eventID, setEventID] = useState(route.params.event.id);
	const [CPP, setCPP] = useState(routeParams.event.cpp ? +routeParams.event.cpp : false);
	const [eventDescription, setEventDescription] = useState(routeParams.event.description);
	const [menuId, setMenuId] = useState(route.params.event.menu_template_id);

	const [courses, setCourses] = useState();
	const [menuItems, setMenuItems] = useState([]);

	//console.log(`eventDetails`, JSON.stringify(eventDetails));
	//console.log(`routeParams ${JSON.stringify(routeParams)}`);

	const [toolTipVisible, setToolTipVisible] = useState(false);

	const { firestore } = firebase;
	const db = firestore();
	//console.log(`menuTemplateDoc`, menuTemplateDoc);
	// const [reserved, setReserved] = useState(routeParams.reserved ? true : false);
	// const [guestList, setGuestList] = useState();
	// const [menuItems, setMenuItems] = useState(false);

	// const getEventDetails = async () => {
	// 	const event = await getEventById(eventDetails.id);
	// 	console.log("Event Details", event);
	// 	if (!event) {
	// 		console.log("No event found");
	// 		getMenus(routeParams, pageName);
	// 	} else {
	// 		setEventDetails(event);
	// 		console.log("Eventing Menus from this event", event);
	// 		getMenus(event);
	// 	}
	// };

	const getMenuCoursesAndMeals = async (menuId, courses) => {
		await getMenuTemplateCourses(menuId, courses).then((menuItems) => {
			console.log("MENU ITEMS", menuItems);
			setMenuItems(menuItems);
		});
	};

	const getMenuTemplateData = async (menuId) => {
		const menuTemplateDoc = await getMenuTemplatesById(menuId);
		setMenuTemplateDetails(menuTemplateDoc);
		console.log(`menuTemplateDoc`, menuTemplateDoc);

		let courses = menuTemplateDoc.courses;
		setCourses(courses);

		await getMenuCoursesAndMeals(menuId, courses);
	};

	// /*******************************************************************************/
	// // EMAIL GUESTS
	// /*******************************************************************************/

	// const getReservations = async (eventId) => {
	// 	const reservations = await getEventReservations(eventId);
	// 	console.log("RESERVATIONS", reservations);
	// 	if (reservations) {
	// 		setGuestList(reservations);
	// 	} else {
	// 		console.log("NO GUEST LIST FOUND");
	// 		``;
	// 	}
	// };

	// const sendEmail = () => {
	// 	let eventTitle = `${eventDetails.title} Update`;
	// 	let emailList = guestList.map((guest) => guest.userSummary.email).join(";");

	// 	Linking.openURL(`mailto:${userEmail}?subject=${eventTitle}&bcc=${emailList}`);
	// };

	// const changePublishStatus = async () => {
	// 	if (eventDetails.published) {
	// 		await unpublishEvent(eventDetails.id);
	// 	} else {
	// 		await publishEvent(eventDetails.id);
	// 	}

	// 	getEventDetails();
	// };

	// /*************************************************************/
	// // RUN FOCUS EFFECT TO CHECK VARIOUS STATES ON LOAD
	// /*************************************************************/

	//on mount grab the menu template data
	useEffect(() => {
		if (eventDetails) {
			getMenuTemplateData(eventDetails.event.menu_template_id);
		}
	}, [eventDetails]);

	// useFocusEffect(
	// 	React.useCallback(() => {
	// 		if (routeParams.photos) {
	// 			setEventImg({ uri: routeParams.photos[0] });
	// 			//useState(require('../assets/food_pasta.png'))
	// 		}
	// 		console.log("Passed in ID", routeParams.id);
	// 		if (activeFlow == "chefs") {
	// 			getReservations(routeParams.id);
	// 		}

	// 		getEventDetails();
	// 	}, [])
	// );

	return (
		<SafeAreaView style={globalStyles.page_blank}>
			{eventDetails ? (
				<ScrollView showsVerticalScrollIndicator={false}>
					<Image source={eventImg} style={eventGlobalStyles.image} />

					<View style={eventGlobalStyles.event_content_container}>
						<View style={eventGlobalStyles.event_header_content}>
							<View style={eventGlobalStyles.event_header_container}>
								<Text style={globalStyles.h1}>{eventDetails.event.title}</Text>
							</View>
							<EventTemplateSuggestedPricing CPP={CPP}></EventTemplateSuggestedPricing>
						</View>
						<AddEventTemplateButton
							eventID={eventID}
							chefID={uid}
							menuId={menuId}
						></AddEventTemplateButton>
						<EventTemplateCard description={eventDescription}></EventTemplateCard>
					</View>
					<MenuCard menuItems={menuItems}></MenuCard>
				</ScrollView>
			) : (
				<ActivityIndicator size='large' color={Theme.SECONDARY_COLOR} />
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	rules: {
		fontSize: 15,
		paddingVertical: 15,
	},
	guest: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
	},
	profile_img: {
		width: 30,
		height: 30,
		paddingRight: 25,
		borderRadius: 15,
		borderWidth: 2,
		borderColor: Theme.SECONDARY_COLOR,
	},
});
