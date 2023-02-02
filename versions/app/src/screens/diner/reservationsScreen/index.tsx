/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";

//OTHER DEPENDENCIES
import { format } from "date-fns";

// COMPONENTS
import {
	Text,
	StyleSheet,
	View,
	Image,
	FlatList,
	TouchableWithoutFeedback,
	RefreshControl,
} from "react-native";
import AppContext from "../../../components/AppContext";
import { getEventsReservedByGuestId } from "../../../data/event";

// STYLES
import { globalStyles } from "../../../styles/styles";
import Theme from "../../../styles/theme.style.js";
import { FontAwesome } from "@expo/vector-icons";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function ReservationsScreen({ navigation }: any) {
	const appsGlobalContext = useContext(AppContext);
	const uid = appsGlobalContext.userID;
	const user = appsGlobalContext.userData;
	const activeFlow = appsGlobalContext.activeFlow;
	// let emptyReservationImage =
	// 	"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/empty_calendar.png?alt=media&token=ab0341fc-0393-4c08-82e9-f78ad2fc7026";

	const [refreshing, setRefreshing] = useState(false);
	const [hasEvents, setHasEvents] = useState(null);

	const getDinerEvents = async (uid: string) => {
		const events = await getEventsReservedByGuestId(uid);
		setHasEvents(events);
		setRefreshing(false);
	};

	const formatLocation = (location: string) => {
		let splitLocationArr = location.split(",");
		let displayedLocation =
			splitLocationArr[0] + "," + splitLocationArr[1] + "," + splitLocationArr[2];

		return displayedLocation;
	};

	const onRefresh = () => {
		setRefreshing(true);
		getDinerEvents(uid);
		setRefreshing(false);
	};

	useFocusEffect(
		React.useCallback(() => {
			getDinerEvents(uid);
		}, [1])
	);

	const renderEvent = ({ item }) => {
		let startDate = format(new Date(item.start.seconds * 1000), "MMM do");
		let startTime = format(new Date(item.start.seconds * 1000), "h:mm a");
		let endDate = format(new Date(item.end.seconds * 1000), "MMM do");
		let endTime = format(new Date(item.end.seconds * 1000), "h:mm a");
		let location = formatLocation(item.location);
		let reservationImage =
			item?.photos?.at(-1) ||
			"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/event-placeholder-1200x840_v1.png?alt=media&token=011c74ed-8a6d-4825-aa9a-bd74a1f5a234";

		return (
			<TouchableWithoutFeedback
				key={item.index}
				onPress={() =>
					navigation.navigate("Reservation Details", {
						details: item,
						isReservation: true,
						startDate: startDate,
						startTime: startTime,
						endDate: endDate,
						endTime: endTime,
					})
				}
			>
				<View>
					<Image source={{ uri: reservationImage }} style={styles.image} resizeMode='cover' />
					<View style={styles.navigate_away}>
						<View style={styles.navigate_away_content}>
							<Text style={styles.title}>{item.title}</Text>
							<Text
								style={styles.date_time}
							>{`${startDate} at ${startTime} - ${endDate} at ${endTime}`}</Text>
							<Text style={styles.location}>{location}</Text>
						</View>
						<View style={styles.chef_and_price}>
							<View>
								<Text style={styles.name}>
									{item.chefName ? `Chef ${item.chefName}` : "Chef Name"}
								</Text>
							</View>
							<View style={styles.price_cont}>
								<Text style={styles.price}>${item.cpp}</Text>
								<Text style={styles.price_label}>Per Person</Text>
							</View>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	};

	return (
		<View style={[globalStyles.page, { padding: 0 }]}>
			{hasEvents ? (
				<View style={{ flex: 1, width: "100%" }}>
					<FlatList
						data={hasEvents}
						renderItem={renderEvent}
						keyExtractor={(event) => event.id}
						refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
					/>
				</View>
			) : (
				<View style={globalStyles.empty_state}>
					<Image
						style={globalStyles.empty_image}
						// source={{ uri: emptyReservationImage }}
						source={require("../../../assets/empty_calendar.png")}
						resizeMode='contain'
					/>
					<Text style={globalStyles.empty_text}>You don't have any reserved events yet!</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	location: {
		fontWeight: "normal",
		color: Theme.FAINT,
		fontSize: 12,
	},
	no_event: {
		flex: 1,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	empty_image: {
		width: "70%",
		height: "40%",
		margin: 0,
		padding: 0,
	},

	navigate_away: {
		width: "100%",
		justifyContent: "space-between",
		alignItems: "flex-start",
		padding: 15,
		paddingHorizontal: 15,
		borderWidth: 1,
		borderColor: Theme.BORDER_COLOR,
	},
	navigate_away_content: {
		flex: 1,
		paddingTop: 8,
	},
	image: {
		width: "100%",
		height: 200,
	},
	title: {
		fontWeight: "bold",
		color: Theme.PRIMARY_COLOR,
		fontSize: 17,
	},
	name: {
		fontWeight: "bold",
		color: Theme.TEXT_ON_SURFACE_COLOR,
		fontSize: 13,
		paddingBottom: 4,
	},
	date_time: {
		color: Theme.FAINT,
		fontSize: 12,
	},
	chef_and_price: {
		flex: 1,
		width: "100%",
		paddingTop: 30,
		textAlign: "left",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	price_cont: {
		//alignContent: 'flex-end'
	},
	price: {
		fontSize: 20,
		color: Theme.PRIMARY_COLOR,
		fontWeight: "bold",
		textAlign: "center",
	},
	price_label: {
		fontSize: 14,
		color: Theme.PRIMARY_COLOR,
		textAlign: "center",
	},
	reviews_and_rating: {
		flexDirection: "row",
		alignItems: "center",
		paddingBottom: 2,
	},
	rating: {
		paddingHorizontal: 4,
		fontWeight: "bold",
		color: Theme.TEXT_ON_SURFACE_COLOR_LIGHT,
		fontSize: 12,
	},
	reviews: {
		fontWeight: "normal",
		color: Theme.FAINT,
		fontSize: 12,
	},
});
