/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ScrollView, Image, ActivityIndicator } from "react-native";

//Other Dependencies
import _ from "underscore";
import { LogBox } from "react-native";

// COMPONENTS
import AppContext from "../../../components/AppContext";
import EventTemplateSuggestedPricing from "../../../components/chefComponents/EventTemplateSuggestedPricing";
import AddEventTemplateButton from "../../../components/chefComponents/AddEventTemplateButton";
import EventTemplateCard from "../../../components/chefComponents/EventTemplateCard";
import MenuCard from "../../../components/chefComponents/MenuCard";

import { getMenuTemplatesById, getMenuTemplateCourses } from "../../../data/menuTemplates";

// STYLES
import { globalStyles, eventGlobalStyles } from "../../../styles/styles";
import Theme from "../../../styles/theme.style.js";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function EventTemplateDetailScreen({ route, navigation }) {
	LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
	const appsGlobalContext = useContext(AppContext);
	const uid = appsGlobalContext.userID;
	const chefName = appsGlobalContext.userData.name;
	const routeParams = route.params;
	const [eventDetails, setEventDetails] = useState(routeParams);
	const [menuTemplateDetails, setMenuTemplateDetails] = useState(null);

	// PASSING TO CHILD COMPONENTS
	const [Img, setImg] = useState([
		"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/event-placeholder-1200x840_v1.png?alt=media&token=011c74ed-8a6d-4825-aa9a-bd74a1f5a234",
	]);
	const [eventId, setEventId] = useState(route.params.event.id);
	const [CPP, setCPP] = useState(routeParams.event.cpp ? +routeParams.event.cpp : false);
	const [eventDescription, setEventDescription] = useState(routeParams.event.description);
	const [menuId, setMenuId] = useState(route.params.event.menu_template_id);
	const [courses, setCourses] = useState();
	const [menuItems, setMenuItems] = useState([]);

	const getMenuCoursesAndMeals = async (menuId, courses) => {
		const menuItems = await getMenuTemplateCourses(menuId, courses);
		setMenuItems(menuItems);
	};

	const getMenuTemplateData = async (menuId) => {
		const menuTemplateDoc = await getMenuTemplatesById(menuId);
		setMenuTemplateDetails(menuTemplateDoc);

		let courses = menuTemplateDoc.courses;
		setCourses(courses);

		await getMenuCoursesAndMeals(menuId, courses);
	};

	useFocusEffect(
		React.useCallback(() => {
			getMenuTemplateData(eventDetails.event.menu_template_id);
		}, [])
	);

	return (
		<SafeAreaView style={globalStyles.page_blank}>
			{eventDetails ? (
				<ScrollView showsVerticalScrollIndicator={false}>
					<Image
						source={{
							uri: Img[0],
						}}
						style={eventGlobalStyles.image}
						resizeMode={"cover"}
					/>

					<View style={eventGlobalStyles.event_content_container}>
						<View style={eventGlobalStyles.event_header_content}>
							<View style={eventGlobalStyles.event_header_container}>
								<Text style={globalStyles.h1}>{eventDetails.event.title}</Text>
							</View>
							<EventTemplateSuggestedPricing CPP={CPP} />
						</View>
						{/* TODO: Make dumb button and move logic to this page. Only pass onPress and use CustomButton */}
						<AddEventTemplateButton
							chefId={uid}
							chefName={chefName}
							image={Img}
							event={eventDetails}
							courses={courses}
							menuItems={menuItems}
						/>
						<EventTemplateCard description={eventDescription} />
					</View>
					<MenuCard menuItems={menuItems} />
				</ScrollView>
			) : (
				<ActivityIndicator size='large' color={Theme.SECONDARY_COLOR} />
			)}
		</SafeAreaView>
	);
}
