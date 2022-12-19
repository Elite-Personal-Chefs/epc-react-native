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
import { useFocusEffect } from "@react-navigation/native";

// OTHER DEPENDENCIES
import { CustomButton } from "../Button";

// SERVICES
import { addEventTemplateToChef } from "../../data/chef";
import { getEventsByChefId } from "../../data/event";

// STYLES
import { globalStyles, eventGlobalStyles } from "../../styles/styles";

export default function AddEventTemplateButton({
	chefId,
	chefName,
	image,
	event,
	courses,
	menuItems,
}) {
	//SET added is already found in my events
	const [added, setAdded] = useState(false);

	const addToMyEvents = async (chefId, chefName, image, event, courses, menuItems) => {
		addEventTemplateToChef(chefId, chefName, image, event, courses, menuItems);
		setAdded(true);
	};

	useFocusEffect(
		React.useCallback(() => {
			// Do something when the screen is focused
			getEventsByChefId(chefId).then((chefEvents) => {
				const found = chefEvents.find((chefEvent) => chefEvent.eventTemplateId === event.event.id);
				if (found) {
					setAdded(true);
				} else {
					console.log("not found");
					setAdded(false);
				}
			});
			return () => {
				// Do something when the screen is unfocused
				// Useful for cleanup functions
			};
		}, [])
	);

	return (
		<View style={eventGlobalStyles.add_event_btn}>
			{added ? (
				<CustomButton text='Added to My Events' size='big' disabled='true' checkmark='true' />
			) : (
				<CustomButton
					text='Added to My Events'
					onPress={() => addToMyEvents(chefId, chefName, image, event, courses, menuItems)}
					size='big'
					disabled={added}
				/>
			)}
		</View>
	);
}
