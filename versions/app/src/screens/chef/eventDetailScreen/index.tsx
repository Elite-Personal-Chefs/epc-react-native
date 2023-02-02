/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
	Button,
	Text,
	StyleSheet,
	View,
	ScrollView,
	Dimensions,
	Image,
	ActivityIndicator,
	Linking,
	Alert,
} from "react-native";
import { format } from "date-fns";

import Event from "../../../models/event";

//Other Dependencies
import { firebase } from "../../../config/config";
import _ from "underscore";

// COMPONENTS
import AppContext from "../../../components/AppContext";
import { CustomButton } from "../../../components/Button";
const windowWidth = Dimensions.get("window").width;
import {
	publishEvent,
	unpublishEvent,
	getEventById,
	getEventReservations,
} from "../../../data/event";

// STYLES
import { globalStyles, menusStyles } from "../../../styles/styles";
import Theme from "../../../styles/theme.style.js";
import { AntDesign, MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Reservation from "../../../models/reservation";

interface EventDetailProps {
	route: any;
	navigation: any;
}

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function EventDetailScreen({ route, navigation }: EventDetailProps) {
	const appsGlobalContext = useContext(AppContext);

	const userEmail = appsGlobalContext.userData.email;
	const routeParams = route.params.event;
	const placeholderImg =
		"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/event-placeholder-1200x840_v1.png?alt=media&token=011c74ed-8a6d-4825-aa9a-bd74a1f5a234";

	const [reservations, setReservations] = useState<Reservation[] | null>();
	const [menuItems, setMenuItems] = useState();
	const [eventDetails, setEventDetails] = useState<Event | null>();

	const getEventDetails = async () => {
		const event = await getEventById(routeParams.id);
		if (!event) {
			console.log("No event found");
			getMenus(routeParams);
			return;
		}
		setEventDetails(event);
		getMenus(event);
	};

	//If we are coming from Reservation page then we need more details on the event

	const editEvent = () => {
		navigation.navigate("Create Event", {
			details: eventDetails || routeParams,
		});
	};

	const getMenus = async (event: Event) => {
		const firestore = firebase.firestore();
		let menuRef;
		let menuDoc;

		menuRef = firestore
			.collection("chefs")
			.doc(event.chefId)
			.collection("menus")
			.doc(`${event.menuId}`);

		menuDoc = await menuRef.get();

		if (!menuDoc.exists) {
			console.log("No menu found");
		} else {
			let menu = menuDoc.data();
			let courses = menu.courses;
			let menuItems = [];

			for await (const course of courses) {
				//Get all courses for this menu
				let courseSnapshot = await menuRef.collection(course).get();
				if (!courseSnapshot.empty) {
					let items = [];
					courseSnapshot.forEach((doc) => {
						let item = doc.data();
						items.push(item);
					});
					menuItems.push({ items, course: course });
				}
			}

			setMenuItems(menuItems);
		}
	};

	/*******************************************************************************/
	// EMAIL GUESTS
	/*******************************************************************************/

	const getReservations = async (eventId: string) => {
		const reservations = await getEventReservations(eventId);
		console.log("RESERVATIONS", reservations);
		if (reservations) {
			setReservations(reservations);
		} else {
			console.log("NO GUEST LIST FOUND");
			``;
		}
	};

	const sendAllGuestEmail = () => {
		if (!reservations || reservations.length < 1) {
			Alert.alert("There are no reservations on this event.");
			return;
		}

		let emailSubject = `${eventDetails?.title} Update`;
		let emailList = reservations.map((guest) => guest?.userSummary?.email).join(",");

		Linking.openURL(`mailto:${" "}?subject=${emailSubject}&bcc=${emailList}`);
	};

	const emailGuest = (guest) => {
		let emailSubject = `${eventDetails?.title} Update`;
		let emailList = guest?.userSummary?.email;

		Linking.openURL(`mailto:${emailList}?subject=${emailSubject}`);
	};

	const changePublishStatus = async () => {
		if (eventDetails!.published) {
			await unpublishEvent(eventDetails!.id as string);
		} else {
			await publishEvent(eventDetails!.id as string);
		}

		getEventDetails();
	};

	/*************************************************************/
	// RUN FOCUS EFFECT TO CHECK VARIOUS STATES ON LOAD
	/*************************************************************/
	useFocusEffect(
		React.useCallback(() => {
			getReservations(routeParams.id);
			getEventDetails();
		}, [])
	);

	const eventPhoto = eventDetails?.photos?.at(-1) || placeholderImg;

	return (
		<SafeAreaView style={globalStyles.safe_light}>
			{eventDetails ? (
				<ScrollView showsVerticalScrollIndicator={false} style={{}}>
					<Image source={{ uri: eventPhoto }} style={styles.image} />
					<View style={styles.content}>
						<View style={styles.header}>
							<View style={styles.title}>
								<Text style={globalStyles.h1}>{eventDetails.title}</Text>
							</View>
							{!eventDetails.published && (
								<View
									style={{
										borderRadius: 15,
										width: 75,
										padding: 5,
										borderColor: Theme.SECONDARY_COLOR,
										borderWidth: 1,
										backgroundColor: "white",
									}}
								>
									<Text
										style={[
											globalStyles.h4,
											{
												color: Theme.SECONDARY_COLOR,
												textAlign: "center",
											},
										]}
									>
										Draft
									</Text>
								</View>
							)}
						</View>
						<View style={styles.btn_cont}>
							<CustomButton
								text='Edit Event'
								onPress={() => editEvent()}
								size='big'
								disabled={undefined}
								checkmark={undefined}
							/>
						</View>
						<View style={[globalStyles.card, { width: "100%" }]}>
							<View style={globalStyles.card_header}>
								<Text style={globalStyles.card_header_text}>Details</Text>
							</View>
							<Text style={globalStyles.card_content}>{eventDetails.description}</Text>
							<View style={styles.details_cont}>
								<View style={styles.detail}>
									<FontAwesome5 name='calendar' size={20} style={styles.detail_icon} />
									<Text style={styles.detail_label}>
										{eventDetails.start && eventDetails.end
											? `${format(eventDetails.start, "PPPP")}`
											: "No Date Found"}
									</Text>
								</View>
								<View style={styles.detail}>
									<AntDesign name='clockcircle' size={17} style={styles.detail_icon} />
									<Text style={styles.detail_label}>
										{eventDetails.start && eventDetails.end
											? format(eventDetails.start, "p") + "-" + format(eventDetails.end, "p")
											: "No Time Specified"}
									</Text>
								</View>
								<View style={styles.detail}>
									<MaterialIcons
										name='location-on'
										size={23}
										style={[styles.detail_icon, { marginLeft: -3, width: 33 }]}
									/>
									<Text style={styles.detail_label}>
										{eventDetails.location ? eventDetails.location : "No Location Specified"}
									</Text>
								</View>
								<View style={styles.detail}>
									<Ionicons
										name='md-person'
										size={20}
										style={[styles.detail_icon, { marginLeft: -1, width: 31 }]}
									/>
									<Text style={styles.detail_label}>
										{reservations ? `${reservations.length} Guest(s) Reserved` : "No guest yet"}
									</Text>
								</View>
							</View>
						</View>
						<View style={[globalStyles.card, { width: "100%" }]}>
							{menuItems ? (
								menuItems.map((menu, index) => {
									return (
										<View style={menusStyles.menu_course_cont} key={index}>
											<Text style={menusStyles.menu_course}>-{menu.course}-</Text>
											{menu.items.map((item, index2) => {
												return (
													<View style={menusStyles.menu_item_cont} key={index2}>
														<Text style={menusStyles.menu_name}>
															{item.item_name || item.title}
														</Text>
														{item.description && item.description != "" ? (
															<Text style={menusStyles.menu_desc}>{item.description}</Text>
														) : null}
													</View>
												);
											})}
										</View>
									);
								})
							) : (
								<ActivityIndicator size='large' color={Theme.SECONDARY_COLOR} />
							)}
						</View>
						{/* HOUSE RULES */}
						{eventDetails.house_rules && (
							<View style={globalStyles.card}>
								<View style={globalStyles.card_header}>
									<Text style={globalStyles.card_header_text}>House Rules</Text>
								</View>
								<Text style={globalStyles.card_content}>
									Here are some guidelines to follow in the space and some other details.
								</Text>
								{eventDetails.house_rules.map((rule, index) => {
									return <Text style={[globalStyles.card_content, styles.rules]}>• {rule}</Text>;
								})}
								<View style={globalStyles.card_header}>
									<Text style={[globalStyles.h3, { marginTop: 10 }]}>You also acknowledge:</Text>
								</View>
								<Text style={globalStyles.card_content}>
									If you damage the venue, you may be charged for the damage you cause.
								</Text>
							</View>
						)}
						{/* GUEST LIST */}
						{reservations && (
							<>
								<View style={[globalStyles.card, { width: "100%" }]}>
									<View style={globalStyles.card_header}>
										<Text style={globalStyles.card_header_text}>Guest List</Text>
									</View>
									{reservations.map((guest) => {
										return (
											<View style={styles.guest}>
												<Image
													source={{
														uri: guest.userSummary?.profileImg,
													}}
													style={styles.profile_img}
												/>
												<Text
													style={{
														marginLeft: 10,
														lineHeight: 20,
													}}
												>
													{`${guest?.userSummary?.name} (total guests: ${guest.numOfGuests || 1})`}
												</Text>
												<CustomButton
													text='Email Guest'
													onPress={() => {
														emailGuest(guest);
													}}
													size='small'
												></CustomButton>
											</View>
										);
									})}
									<View>
										<CustomButton
											text='Email All Guests'
											onPress={sendAllGuestEmail}
											size={undefined}
										></CustomButton>
									</View>
								</View>
							</>
						)}
					</View>
					<Button
						color={eventDetails.published ? Theme.SECONDARY_COLOR : "#357aff"}
						title={`${eventDetails.published ? "Unpublish" : "Publish"} Event`}
						onPress={changePublishStatus}
					>
						A Button
					</Button>
				</ScrollView>
			) : (
				<ActivityIndicator size='large' color={Theme.SECONDARY_COLOR} />
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	image: {
		width: windowWidth,
		height: 260,
		backgroundColor: Theme.PRIMARY_COLOR,
	},
	content: {
		flex: 1,
		padding: 15,
		alignItems: "center",
		width: "100%",
	},
	header: {
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: {
		marginVertical: 5,
		//flex: 1
	},
	suggested_price_container: {
		//marginVertical: 10
		//flex:1,
	},
	price: {
		fontSize: 20,
		color: Theme.PRIMARY_COLOR,
		fontWeight: "bold",
		textAlign: "center",
	},
	price_label_and_icon_container: {
		flexDirection: "row",
	},
	price_label: {
		color: Theme.PRIMARY_COLOR,
		fontSize: 14,
		paddingVertical: 5,
		marginRight: 5,
		textAlign: "center",
	},
	detail_icon: {
		paddingLeft: 0,
		marginRight: -8,
		color: Theme.PRIMARY_COLOR,
	},
	btn_cont: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 13,
	},
	details_cont: {
		paddingVertical: 8,
	},
	detail: {
		flexDirection: "row",
		paddingVertical: 5,
	},
	detail_icon: {
		width: 30,
		padding: 0,
		marginRight: 8,
		color: Theme.PRIMARY_COLOR,
	},
	detail_label: {
		fontSize: 13,
		lineHeight: 20,
		color: Theme.FAINT,
		width: "80%",
	},
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
