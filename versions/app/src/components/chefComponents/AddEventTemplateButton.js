// IMPORTS
import React, { useState, useContext, useEffect } from "react";
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

// OTHER DEPENDENCIES
import { CustomButton } from "../Button";

// SERVICES
import { getEventsByChefId } from "../../data/event";
import { getEventTemplateById } from "../../data/eventTemplates";

// STYLES
import { globalStyles, eventGlobalStyles } from "../../styles/styles";

export default function AddEventTemplateButton({ eventId, chefId, menuId }) {
	console.log(`what is eventId: ${eventId}`);
	console.log(`what is chefId: ${chefId}`);
	console.log(`what is menuId: ${menuId}`);

	//SET added is already found in my events
	const [added, setAdded] = useState(false);
	const [eventTemplate, setEventTemplate] = useState(null);
	const [menuTemplate, setMenuTemplate] = useState(null);

	//console.log(`eventTemplate: ${JSON.stringify(eventTemplate)}`);

	// const getEventTemplateById = async (eventID) => {
	// 	const eventTemplateDoc = await getEventTemplateById(eventID);
	// 	setEventTemplate(eventTemplateDoc);
	// };

	const addToMyEvents = async (eventID) => {
		//Grab experience template from firestore
		//Add template to events collection with with template model data
		// And all the event model data set to null
		// try {
		// 	const result = await fetch(getEndpoint(appsGlobalContext, "copy_event_template"), {
		// 		method: "POST",
		// 		headers: {
		// 			Accept: "application/json",
		// 			"Content-Type": "application/json",
		// 		},
		// 		body: JSON.stringify({
		// 			event_template_id: eventID,
		// 			add_data: {
		// 				chef_id: uid,
		// 				is_custom: false,
		// 				is_published: false,
		// 				event_template_id: eventID,
		// 			},
		// 		}),
		// 	});
		// 	const json = await result.json();
		// 	setAdded(true);
		// } catch (error) {
		// 	console.log(error);
		// }
	};

	useEffect(
		() => async () => {
			//await getEventTemplateById(eventID);
		},
		[1]
	);

	return (
		<View style={eventGlobalStyles.add_event_btn}>
			{added ? (
				<CustomButton text='Added to My Events' size='big' disabled='true' checkmark='true' />
			) : (
				<CustomButton
					text='Added to My Events'
					onPress={() => addToMyEvents(eventID)}
					size='big'
					disabled={added}
				/>
			)}
		</View>
	);
}
