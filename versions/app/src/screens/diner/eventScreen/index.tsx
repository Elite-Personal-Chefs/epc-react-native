/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";

//OTHER DEPENDENCIES
import _ from "underscore";
import { format } from "date-fns";
import { getAllUnreservedEvents } from "../../../data/event";

// COMPONENTS
import {
	Text,
	StyleSheet,
	View,
	Image,
	Dimensions,
	FlatList,
	TouchableWithoutFeedback,
	RefreshControl,
	Alert,
	ScrollView,
} from "react-native";
import AppContext from "../../../components/AppContext";

// STYLES
import { globalStyles } from "../../../styles/styles";
import Theme from "../../../styles/theme.style.js";
import { FontAwesome } from "@expo/vector-icons";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function EventsScreen({ navigation, route }) {
	const appsGlobalContext = useContext(AppContext);
	const uid = appsGlobalContext.userID;
	const eventPageName = route.name;

	const [refreshing, setRefreshing] = useState(false);
	const [hasEvents, setHasEvents] = useState(null);

	const [coordinates, setCoordinates] = useState(null);
	const [initialRegion, setInitialRegion] = useState({
		latitude: 41.8781,
		longitude: -87.6298,
		latitudeDelta: 0.2022,
		longitudeDelta: 0.0721,
	});

	const formatLocation = (location) => {
		let splitLocationArr = location.split(",");
		let displayedLocation =
			splitLocationArr[0] + "," + splitLocationArr[1] + "," + splitLocationArr[2];

		return displayedLocation;
	};

	const getEventsDetails = async () => {
		const json = await getAllUnreservedEvents(uid);

		if (!json.error) {
			setHasEvents(json);

			let coors = [];
			json.map((marker, index) => {
				let coordinate = {
					latitude: 41.8 + Math.random() * 0.1,
					longitude: -87.71 + Math.random() * 0.1,
				};
				coors.push(coordinate);
			});
			setCoordinates(coors);
		} else {
			setHasEvents(null);
			console.log("No event found");
		}
		setRefreshing(false);
	};

	const renderEvent = ({ item }) => {
		let startDateShort = format(item.start, "MMM do");
		let startTime = format(item.start, "h:mm a");
		let endDateShort = format(item.end, "MMM do");
		let endTime = format(item.end, "h:mm a");
		let location = formatLocation(item.location);
		let image =
			item?.photos?.at(-1) ||
			"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/event-placeholder-1200x840_v1.png?alt=media&token=011c74ed-8a6d-4825-aa9a-bd74a1f5a234";

		return (
			<TouchableWithoutFeedback
				key={item.index}
				onPress={() =>
					navigation.navigate("Event Details", {
						details: item,
						startDate: startDateShort,
						endDate: endDateShort,
						startTime: startTime,
						endTime: endTime,
					})
				}
			>
				<View style={styles.navigate_away}>
					<Image source={{ uri: image }} style={styles.image} />
					<View style={styles.navigate_away_content}>
						<Text style={styles.title}>{item.title}</Text>
						<Text
							style={styles.date_time}
						>{`${startDateShort} at ${startTime} - ${endDateShort} at ${endTime}`}</Text>

						<Text style={styles.location}>{location}</Text>
					</View>
					<View style={styles.chef_and_price}>
						<View>
							<Text style={styles.name}>{item.chefName ? item.chefName : "Chef Name"}</Text>
						</View>
						<View style={styles.price_cont}>
							<Text style={styles.price}>${item.cpp}</Text>
							<Text style={styles.price_label}>Per Person</Text>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	};

	const onRefresh = () => {
		getEventsDetails();
		setRefreshing(false);
	};

	/*************************************************************/
	// RUN FOCUS EFFECT TO CHECK VARIOUS STATES ON LOAD
	/*************************************************************/
	useFocusEffect(
		React.useCallback(() => {
			getEventsDetails();
		}, [])
	);

	const mapRef = useRef(null);

	const goToMarker = (latlng: any) => {
		console.log(latlng);
		mapRef.current.animateToRegion(latlng, 300);
	};

	const onRegionChange = (region) => {
		//console.log(region)
	};

	const markers = [
		{
			title: "Car Wash",
			description: "They do good",
			latlng: {
				latitude: 37.78825,
				longitude: -122.4324,
			},
		},
		{
			title: "Car Wash 2",
			description: "They do good",
			latlng: {
				latitude: 37.78835,
				longitude: -122.4334,
			},
		},
	];

	return (
		<View style={[globalStyles.page, { padding: 0 }]}>
			{hasEvents?.length > 0 || eventPageName === "Map View" ? (
				eventPageName == "Events" ? (
					<>
						<View style={{ flex: 1, width: "100%" }}>
							<FlatList
								data={hasEvents}
								renderItem={renderEvent}
								keyExtractor={(event) => event.id}
								refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
							/>
						</View>
					</>
				) : (
					<View style={styles.container}>
						<MapView
							ref={mapRef} //assign our ref to this MapView
							initialRegion={initialRegion}
							onRegionChange={onRegionChange}
							style={styles.map}
						>
							{coordinates &&
								hasEvents.map((marker, index) => {
									return (
										<Marker key={index} coordinate={coordinates[index]} title={marker.title} />
									);
								})}
						</MapView>
						<ScrollView style={styles.places} horizontal={true}>
							{coordinates &&
								hasEvents.map((item, index) => {
									let startDateShort = format(item.start, "MMM do");
									let startTime = format(item.start, "h:mm a");
									let endDateShort = format(item.end, "MMM do");
									let endTime = format(item.end, "h:mm a");
									let image =
										item?.photos?.at(-1) ||
										"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/event-placeholder-1200x840_v1.png?alt=media&token=011c74ed-8a6d-4825-aa9a-bd74a1f5a234";
									return (
										<TouchableWithoutFeedback
											key={index}
											onPress={() => goToMarker(coordinates[index])}
											onLongPress={() => navigation.navigate("Event Details", { details: item })}
										>
											<View style={styles.scroller}>
												<Image source={{ uri: image }} style={styles.scroller_img} />
												<View style={styles.scroller_content}>
													<View style={styles.upper_content}>
														<View>
															<Text style={styles.scroller_title}>{item.title}</Text>
															<Text
																style={styles.scroller_date_time}
															>{`${startDateShort} - ${endDateShort}`}</Text>
															<Text style={styles.scroller_date_time}>
																{startTime}-{endTime}
															</Text>
														</View>
														<View>
															<Text style={styles.scroller_price}>${item.cpp}</Text>
															<Text style={styles.scroller_price_label}>Per Person</Text>
														</View>
													</View>
													<View style={styles.lower_content}>
														<Text style={styles.scroller_name}>
															{item.chefName ? item.chefName : "Chef Name"}
														</Text>
													</View>
												</View>
											</View>
										</TouchableWithoutFeedback>
									);
								})}
						</ScrollView>
					</View>
				)
			) : (
				<View style={globalStyles.empty_state}>
					<Image
						style={globalStyles.empty_image}
						source={require("../../../assets/empty_calendar.png")}
					/>
					<Text style={globalStyles.empty_text}>There are no posted events yet</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
	places: {
		position: "absolute",
		width: "100%",
		height: 220,
		bottom: 0,
		flexDirection: "row",
	},
	place: {
		backgroundColor: "pink",
		padding: 5,
		margin: 5,
	},
	scroller: {
		width: 270,
		margin: 3,
		backgroundColor: "white",
	},
	scroller_img: {
		resizeMode: "cover",
		width: "100%",
		height: 120,
		margin: 0,
		padding: 0,
		backgroundColor: "yellow",
	},
	scroller_content: {
		flex: 1,
		paddingVertical: 5,
		paddingHorizontal: 8,
		justifyContent: "space-between",
	},
	upper_content: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	lower_content: {
		flexDirection: "row",
		justifyContent: "space-between",
	},

	scroller_title: {
		fontWeight: "bold",
		color: Theme.PRIMARY_COLOR,
		fontSize: 18,
	},
	scroller_date_time: {
		color: Theme.FAINT,
		fontSize: 13,
	},
	scroller_price: {
		fontSize: 17,
		color: Theme.PRIMARY_COLOR,
		fontWeight: "normal",
		textAlign: "right",
	},
	scroller_price_label: {
		fontSize: 10,
		color: Theme.PRIMARY_COLOR,
		textAlign: "center",
	},
	scroller_name: {
		fontWeight: "bold",
		color: Theme.TEXT_ON_SURFACE_COLOR,
		fontSize: 14,
	},

	navigate_away: {
		width: "100%",
		justifyContent: "space-between",
		alignItems: "flex-start",
		padding: 15,
		paddingHorizontal: 15,
		borderWidth: 1,
		borderColor: Theme.BORDER_COLOR,
		marginBottom: 10,
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
	location: {
		fontWeight: "normal",
		color: Theme.FAINT,
		fontSize: 12,
	},
	filter_bar: {
		position: "absolute",
		bottom: 0,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: Theme.TEXT_ON_SURFACE_COLOR,
		paddingVertical: 6,
		paddingHorizontal: 12,
		marginBottom: 5,
		borderRadius: 10,
	},
	filter_text: {
		fontSize: 12,
		paddingRight: 10,
		color: Theme.TEXT_ON_PRIMARY_COLOR,
	},
});
