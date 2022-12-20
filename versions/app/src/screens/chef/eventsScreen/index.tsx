/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

//OTHER DEPENDENCIES
import { useFocusEffect } from "@react-navigation/native";
import { getEventsByChefId } from "../../../data/event";
import { getEventTemplates } from "../../../data/eventTemplates";

// COMPONENTS
import { View } from "react-native";
import AppContext from "../../../components/AppContext";
import NoEventsPlaceholder from "../../../components/emptyStates/NoEventsPlaceholder";
import { CreateEventButton } from "../../../components/Button";
import EventListing from "../../../components/chefComponents/EventListing";
import { dynamicSort } from "../../../helpers/helpers";

// STYLES
import { globalStyles, eventGlobalStyles } from "../../../styles/styles";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function ChefEventScreen({ navigation, route }) {
	const appsGlobalContext = useContext(AppContext);
	const uid = appsGlobalContext.userID;
	const eventPageName = route.name;
	const [events, setEvents] = useState(null);

	const [refreshing, setRefreshing] = useState(false);

	const getEvents = async (eventPageName) => {
		try {
			if (eventPageName == "Templates") {
				try {
					const events = await getEventTemplates();
					events.sort(dynamicSort("title"));
					setEvents(events);
				} catch (error) {
					console.log(error);
				}
			} else if (eventPageName == "Your Events") {
				try {
					const events = await getEventsByChefId(uid);

					if (events) {
						//&& _.has(json,'transactions') <- removed 1/10 not sure why we needed it
						setEvents(
							events.transactions ? events.transactions : events
						);
					} else {
						setEvents(null);
						console.log("No events found for you");
					}
					setRefreshing(false);
				} catch (error) {
					console.log(error);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getEvents(eventPageName);
	}, [1]);

	/*************************************************************/
	// RUN FOCUS EFFECT TO CHECK VARIOUS STATES ON LOAD
	/*************************************************************/
	useFocusEffect(
		React.useCallback(() => {
			getEvents(eventPageName);
		}, [1])
	);

	return (
		<SafeAreaView style={globalStyles.safe_light}>
			<View style={[globalStyles.page_centered]}>
				{events ? (
					<EventListing
						eventTemplates={events}
						pageName={eventPageName}
						navigation={navigation}
						key={eventPageName}
					/>
				) : (
					<NoEventsPlaceholder />
				)}
				{eventPageName == "Your Events" && (
					<CreateEventButton
						style={
							eventGlobalStyles.lower_right_create_event_circle
						}
						onPress={() => navigation.navigate("Create Event")}
					></CreateEventButton>
				)}
			</View>
		</SafeAreaView>
	);
}
