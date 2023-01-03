// IMPORTS
import React, { useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// OTHER DEPENDENCIES
import { CustomButton } from "../Button";

// SERVICES
import { addEventTemplateToChef } from "../../api/chef";
import { getEventsByChefId } from "../../api/event";

// STYLES
import { eventGlobalStyles } from "../../styles/styles";

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

				setAdded(found);
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
