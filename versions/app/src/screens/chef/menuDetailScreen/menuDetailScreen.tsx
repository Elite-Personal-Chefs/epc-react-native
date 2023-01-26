/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	Text,
	StyleSheet,
	View,
	ScrollView,
	Dimensions,
	Image,
	ActivityIndicator,
	TextInput,
	TouchableOpacity,
} from "react-native";

//Other Dependencies
import { firebase, configKeys } from "../../../config/config";
import _ from "underscore";

// COMPONENTS
import AppContext from "../../../components/AppContext";
import { CustomButton } from "../../../components/Button";
import { getEndpoint } from "../../../helpers/helpers";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import Tooltip from "react-native-walkthrough-tooltip";
import Carousel from "../../../components/Carousel";

// STYLES
import { globalStyles, menusStyles, footer, forms } from "../../../styles/styles";
import Theme from "../../../styles/theme.style.js";
import { AntDesign, MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function MenuDetailScreen({ route, navigation }) {
	const appsGlobalContext = useContext(AppContext);
	const uid = appsGlobalContext.userID;
	const activeFlow = appsGlobalContext.activeFlow;
	const [isEditable, setIsEditable] = useState(false);
	const [menuItems, setMenuItems] = useState(false);
	const pageName = route.params.pageName;
	const details = route.params.details;
	const [knownMenuPrice, setKnownMenuPrice] = useState(
		details.price ? Number.parseInt(details.price) : false
	);

	const [menuImg, setMenuImg] = useState(
		details?.photos?.at(-1) ||
			"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/meal-placeholder-600x335_v1_501x289.jpg?alt=media&token=c3d9645a-4483-4414-8403-28e8df8d665b"
	);
	const [added, setAdded] = useState(false);
	const [adding, setAdding] = useState(false);
	const [toolTipVisible, setToolTipVisible] = useState(false);

	const addToMyMenu = async (menuID) => {
		setAdding(true);
		console.log(menuID, uid);
		try {
			const result = await fetch(getEndpoint(appsGlobalContext, "copy_template"), {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					menu_template_id: menuID,
					user_id: uid,
					add_data: {
						is_custom: false,
						is_published: false,
						menu_template_id: menuID,
					},
				}),
			});
			const json = await result.json();
			setAdding(false);
			setAdded(true);
		} catch (error) {
			console.log(error);
		}
	};

	const editMenu = () => {
		let editableMenuFormat = [];

		menuItems.map((menu, index) => {
			let addCourse = {
				type: "course",
				title: menu.course,
			};

			editableMenuFormat.push(addCourse);

			menu.items.map((item) => {
				let addItem = {
					type: "item",
					title: item.title,
					description: item.description ? item.description : "",
					course: item.course,
				};

				editableMenuFormat.push(addItem);
			});
		});

		navigation.navigate("Create Menu", {
			description: details.description,
			menu: editableMenuFormat,
			menuID: details.id,
			name: details.title,
			photo: menuImg, //details.photos[0],
		});
	};

	const getMenus = async (details) => {
		//console.log(uid, details);
		//If a chefID is passed in the details then use that as the ID of the chef to look for
		const chefID = details.chefID ? details.chefID : uid;
		//If this is a template page look for the menu in templates
		//otherwise look into the chefs colelction of menus
		const firestore = firebase.firestore();
		const menuRef =
			pageName == "Templates"
				? firestore.collection("menu_templates").doc(details.id)
				: firestore.collection("chefs").doc(chefID).collection("menus").doc(details.id);
		const menuDoc = await menuRef.get();
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

	useEffect(() => {
		getMenus(details);
	}, []);

	return (
		<SafeAreaView style={globalStyles.safe_light}>
			<ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%", flex: 1 }}>
				{menuImg ? (
					<Carousel></Carousel>
				) : (
					<View style={styles.container}>
						<ActivityIndicator size='small' color={Theme.SECONDARY_COLOR} style={styles.image} />
					</View>
				)}
				<View style={styles.content}>
					<View style={styles.header}>
						<View style={styles.title}>
							<Text style={globalStyles.h1}>{details.title}</Text>
						</View>
						{pageName == "Templates" && (
							<View style={styles.suggested_price_container}>
								<View style={styles.price_label_and_icon_container}>
									<Text style={styles.price_label}>EPC Suggested Price</Text>
									<Tooltip
										isVisible={toolTipVisible}
										showChildInTooltip={false}
										content={
											<View>
												<Text>
													This is only a suggested menu price. Your event price is what's shown to
													your guests.
												</Text>
											</View>
										}
										placement='bottom'
										onClose={() => setToolTipVisible(false)}
										useInteractionManager={true} // need this prop to wait for react navigation
										// below is for the status bar of react navigation bar
										// topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
									>
										<TouchableOpacity
											style={[{ width: "100%" }, styles.button]}
											onPress={() => setToolTipVisible(true)}
										>
											<AntDesign name='infocirlceo' size={17} color='black' />
										</TouchableOpacity>
									</Tooltip>
								</View>
								<Text style={styles.price}>
									${details.price}
									<Text style={styles.price_label}>/Person</Text>
								</Text>
							</View>
						)}
					</View>
					{pageName == "Templates" && (
						<View style={styles.btn_cont}>
							{added ? (
								<CustomButton
									text='Added to My Menus'
									size='big'
									disabled='true'
									checkmark='true'
								/>
							) : (
								<CustomButton
									text={adding ? "Adding..." : "Add to My Menus"}
									onPress={() => addToMyMenu(details.id)}
									size='big'
									disabled={adding}
								/>
							)}
						</View>
					)}
					{pageName == "Your Menus" && activeFlow == "chefs" && (
						<View style={styles.btn_cont}>
							<CustomButton text='Edit Menu' onPress={() => editMenu(true)} size='big' />
						</View>
					)}
					<View style={[globalStyles.card, { width: "100%" }]}>
						<View style={globalStyles.card_header}>
							<Text style={globalStyles.card_header_text}>Description</Text>
						</View>
						<Text style={globalStyles.card_content}>{details.description}</Text>
					</View>
					<View style={[globalStyles.card, { width: "100%" }]}>
						{menuItems ? (
							menuItems.map((menu, index) => {
								return (
									<View style={menusStyles.menu_course_cont} key={index}>
										{isEditable ? (
											<TextInput
												style={[styles.custom_input]}
												placeholder='Course'
												placeholderTextColor={Theme.FAINT}
												keyboardType='default'
												//onChangeText={(text) => changeEmail(text)}
												//value={(menu.course) ? menu.course : newCourse}
												value='HI'
												underlineColorAndroid='transparent'
												autoCapitalize='none'
												//onFocus={() => setFocusField("email")}
												//onBlur={() => setFocusField(null)}
												//setFocus={focusField}
											/>
										) : (
											menu.course != "blank" && (
												<Text style={menusStyles.menu_course}>- {menu.course} -</Text>
											)
										)}
										{menu.items.map((item, index2) => {
											return (
												<View style={menusStyles.menu_item_cont} key={index2}>
													<Text style={menusStyles.menu_name}>{item.title || item.item_name}</Text>
													{item.description != "" && (
														<Text style={menusStyles.menu_desc}>{item.description}</Text>
													)}
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
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	custom_input: {
		borderColor: "red",
		borderWidth: 1,
	},
	image: {
		width: windowWidth,
		height: 200,
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
	detail_icon: {
		paddingLeft: 0,
		marginRight: -8,
		color: Theme.PRIMARY_COLOR,
	},
	price_label: {
		color: Theme.PRIMARY_COLOR,
		fontSize: 14,
		paddingVertical: 5,
		marginRight: 5,
		textAlign: "center",
	},
	btn_cont: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 13,
	},
});
