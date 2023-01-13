/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
	Text,
	StyleSheet,
	View,
	ScrollView,
	Dimensions,
	Image,
	ActivityIndicator,
	Alert,
	TouchableOpacity,
} from "react-native";

import { format } from "date-fns";
import { Dropdown } from "react-native-element-dropdown";

//Other Dependencies
import { firebase } from "../../../config/config";
import _ from "underscore";

// COMPONENTS
import AppContext from "../../../components/AppContext";
import { CustomButton } from "../../../components/Button";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { reserveEvent, getEventById, getEventsReservationByGuestId } from "../../../data/event";
import Event from "../../../models/event";

// STYLES
import { globalStyles, eventGlobalStyles, menusStyles } from "../../../styles/styles";
import Theme from "../../../styles/theme.style.js";
import { AntDesign, MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function ResrvationsDetailScreen({ route }: any) {
	const appsGlobalContext = useContext(AppContext);
	const uid = appsGlobalContext.userID;
	const user = appsGlobalContext.userData;
	const details = route.params.details;
	const eventId = route.params.details.id;
	const startDate = route.params.startDate;
	const endDate = route.params.endDate;
	const startTime = route.params.startTime;
	const endTime = route.params.endTime;
	const startSeconds = route.params.startSeconds;
	const endSeconds = route.params.endSeconds;
	const [eventImg, setEventImg] = useState<string>();
	const [reserved, setReserved] = useState(details.reserved ? true : false);
	const [menuItems, setMenuItems] = useState();
	const [eventDetails, setEventDetails] = useState(details ? details : null);
	const [reservationQuantity, setReservationQuantity] = useState(0);

	//If we are coming from Reservation page then we need more details on the event
	const isReservation = route.params.isReservation;

	const getEventDetails = async () => {
		const event = await getEventById(eventDetails.id);

		if (!event) {
			console.log("No event found");
			return;
		}
		setEventDetails(event);
		getMenus(event);
	};

	const getEventReservations = async (uid, eventId) => {
		const unfilteredReservations = await getEventsReservationByGuestId(uid, eventId);
		const reservations = unfilteredReservations.filter(function (el) {
			return el != null;
		});

		setReservationQuantity(reservations[0].numOfGuests);
	};

	const reserve = async () => {
		try {
			await reserveEvent(eventDetails.id, uid, reservationQuantity);
			setReserved(true);
			Alert.alert("Reservation Completed");
		} catch (error) {
			console.log(error);
		}
	};

	const getMenus = async (details: Event) => {
		//If this is a template page look for the menu in templates
		//otherwise look into the chefs colelction of menus
		const firestore = firebase.firestore();
		let menuRef;
		let menuDoc;

		menuRef = firestore
			.collection("chefs")
			.doc(eventDetails.chefId)
			.collection("menus")
			.doc(`${details.menuId}`);

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

	/*************************************************************/
	// RUN FOCUS EFFECT TO CHECK VARIOUS STATES ON LOAD
	/*************************************************************/
	useFocusEffect(
		React.useCallback(() => {
			setEventImg(
				eventDetails?.photos?.at(-1) ||
					"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/event-placeholder-1200x840_v1.png?alt=media&token=011c74ed-8a6d-4825-aa9a-bd74a1f5a234"
			);

			getEventDetails();
			getEventReservations(uid, eventId);
		}, [])
	);

	return (
		<SafeAreaView style={globalStyles.safe_light}>
			{eventDetails ? (
				<ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
					{
						<Image
							source={{ uri: eventImg }}
							style={eventGlobalStyles.image}
							resizeMode={"contain"}
						/>
					}
					<View style={styles.content}>
						<View style={styles.header}>
							<View style={styles.title}>
								<Text style={globalStyles.h1}>{eventDetails.title}</Text>
							</View>
						</View>

						{!isReservation && (
							<View style={styles.btn_cont}>
								{reserved ? (
									<View>
										<CustomButton
											text='Reserved'
											size='big'
											disabled={true}
											checkmark={true}
											onPress={undefined}
										/>
									</View>
								) : (
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											alignContent: "center",
										}}
									>
										<CustomButton text='Reserve this Event' onPress={() => reserve()} size='big' />

										<Dropdown
											iconStyle={styles.iconStyle}
											style={{ width: 60 }}
											data={[
												{ label: 1, value: 1 },
												{ label: 2, value: 2 },
												{ label: 3, value: 3 },
												{ label: 4, value: 4 },
												{ label: 5, value: 5 },
												{ label: 6, value: 6 },
												{ label: 7, value: 7 },
												{ label: 8, value: 8 },
												{ label: 9, value: 9 },
												{ label: 10, value: 10 },
											]}
											labelField='label'
											valueField='value'
											placeholder='Select item'
											searchPlaceholder='Search...'
											value={reservationQuantity}
											onChange={(item) => {
												setReservationQuantity(item.value);
											}}
											renderLeftIcon={() => (
												<AntDesign style={styles.icon} color='black' name='team' size={20} />
											)}
										/>
									</View>
								)}
							</View>
						)}
						<View style={[globalStyles.card, { width: "100%" }]}>
							<View style={globalStyles.card_header}>
								<Text style={globalStyles.card_header_text}>Details</Text>
							</View>
							<Text style={globalStyles.card_content}>{eventDetails.description}</Text>
							<View style={styles.details_cont}>
								<View style={styles.detail}>
									<FontAwesome5 name='calendar' size={20} style={styles.detail_icon} />
									<Text style={styles.detail_label}>
										{`${startDate} - ${endDate}` || "No Date Found"}
									</Text>
								</View>
								<View style={styles.detail}>
									<AntDesign name='clockcircle' size={17} style={styles.detail_icon} />
									<Text style={styles.detail_label}>
										{`${startTime} - ${endTime}` || "No Time Found"}
									</Text>
								</View>
								<View style={styles.detail}>
									<MaterialIcons
										name='location-on'
										size={23}
										style={[styles.detail_icon, { marginLeft: -3 }]}
									/>
									<Text style={styles.detail_label}>
										{eventDetails.location ? eventDetails.location : "Location Not Specified"}
									</Text>
								</View>
								<View style={styles.detail}>
									<FontAwesome5
										name='dollar-sign'
										size={20}
										style={[styles.detail_icon, { marginLeft: 3, width: 31 }]}
									/>
									<Text style={styles.detail_label}>
										{details?.cpp && details.cpp > 0 ? `$${details.cpp}/person` : "Free"}
									</Text>
								</View>
								<View style={styles.detail}>
									<Entypo
										name='ticket'
										size={23}
										style={[styles.detail_icon, { marginLeft: -3 }]}
									/>
									<Text style={styles.detail_label}>
										{reservationQuantity
											? reservationQuantity + " Guest(s) Reserved"
											: "No Guests Reserved"}
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
					</View>
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
		width: 30,
		paddingLeft: 0,
		marginRight: 8,
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
