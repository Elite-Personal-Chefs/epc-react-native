/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// OTHER DEPENDENCIES
import _ from "underscore";
import { firebase, configKeys } from "../config/config";
import moment from "moment";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";

// COMPONENTS
import {
	Text,
	StyleSheet,
	View,
	TextInput,
	ScrollView,
	Dimensions,
	Modal,
	Alert,
	KeyboardAvoidingView,
	TouchableNativeFeedback,
	LogBox,
} from "react-native";
import AppContext from "../components/AppContext";
import { getEndpoint } from "../helpers/helpers";
import { CustomButton } from "../components/Button";
import { Formik, useFormikContext, Field } from "formik";
import ImageUploader from "../components/ImageUploader";
import * as yup from "yup";
import BouncyCheckbox from "react-native-bouncy-checkbox";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// STYLES
import { globalStyles, TouchableHighlight, footer, forms, modal } from "../styles/styles";
import {
	MaterialCommunityIcons,
	MaterialIcons,
	Fontisto,
	Entypo,
	Ionicons,
} from "@expo/vector-icons";
import Theme from "../styles/theme.style.js";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

/*******************************************************************************/
// Suppress Google Places Autocomplete Warning
/*******************************************************************************/
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function CreateEventScreen({ route, navigation }) {
	const appsGlobalContext = useContext(AppContext);
	const uid = appsGlobalContext.userID;
	const [isDisabled, setIsDisabled] = useState(false);
	const [focusName, setFocusName] = useState(null);

	//* FOR DROPDOWN PICKER
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [menusList, setMenusList] = useState([]);
	const [currentMenuID, setCurrentMenuID] = useState(
		route.params && route.params.details ? route.params.details.menu_template_id : value
	);

	const [details, setDetails] = useState(
		route.params && route.params.details ? route.params.details : {}
	);

	console.log("details:", details);

	const eventRef = useRef();
	const [eventLocation, setEventLocation] = useState(details.location ? details.location : "");
	const [eventID, setEventID] = useState(details ? details.id : null);

	const getCurrentLocation = async () => {
		console.log("Getting location");
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			console.log("Permission to access location was denied");
			/*
            //let { status } = await Location.requestForegroundPermissionsAsync()
            Alert.alert(
                "Location Permissions Requred",
                "Small Cheval needs your location to locate the nearest restaurant. Please enable locations in the settings menu on your device.",
                [
                    {
                        text: "Open Settings",
                        onPress: () =>  {
                            goToSettings()
                        }
                    },
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                ]
            );
            return
            */
		}
		let location = await Location.getLastKnownPositionAsync();
		console.log(location);
	};

	getCurrentLocation();

	let preserviceMsg =
		"Thank you for booking me with Elite Personal Chefs! If you or someone in your party has an allergy or dietary restriction, please let me know as soon as possible. As our clients often ask about gratuity; it is never mandatory or expected but always appreciated. I’m excited to give you a truly special dining experience!";
	let postserviceMsg =
		"Thank you again for booking with me! It was such a pleasure to cook for you and your guests. We rely on positive feedback from amazing clients like yourself. If you have a moment, please let us know how your event went!";
	if (details) {
		preserviceMsg = details.preservice ? details.preservice : preserviceMsg;
		postserviceMsg = details.postservice ? details.postservice : postserviceMsg;
	}

	//PICKER FOR: DATE
	const [pickerValueDate, setPickerValueDate] = useState(details ? details.event_date : false);

	//! DATE PICKER
	const [pickerEventStartDate, setPickerEventStartDate] = useState(
		details.event_start_date ? details.event_start_date : "Start Date"
	);

	const [pickerEventEndDate, setPickerEventEndDate] = useState(
		details ? details.event_end_date : false
	);

	const [pickerDateVisible, setPickerDateVisible] = useState(false);
	const [pickerStartDateVisible, setPickerStartDateVisible] = useState(false);
	const [pickerEndDateVisible, setPickerEndDateVisible] = useState(false);

	const showPickerStartDate = () => {
		setPickerStartDateVisible(true);
	};

	const showPickerEndDate = () => {
		setPickerEndDateVisible(true);
	};

	const showPickerDate = () => {
		setPickerDateVisible(true);
	};

	const hidePickerDate = () => {
		setPickerDateVisible(false);
		setPickerStartDateVisible(false);
		setPickerEndDateVisible(false);
	};

	const confirmPickerDate = (date) => {
		console.log("A date has been picked: ", date);
		const readableDate = moment(date).format("dddd, MMMM Do, YYYY");
		console.log(readableDate);
		setPickerValueDate(readableDate);
		hidePickerDate();
	};

	const pickerStartDateHandler = (date) => {
		const readableDate = moment(date).format("dddd, MMMM Do, YYYY");
		setPickerEventStartDate(readableDate);
		setPickerStartDateVisible(false);
	};

	const pickerEndDateHandler = (date) => {
		const readableDate = moment(date).format("dddd, MMMM Do, YYYY");
		setPickerEventEndDate(readableDate);
		setPickerEndDateVisible(false);
	};

	//PICKER FOR: START TIME
	const [pickerValueStart, setPickerValueStart] = useState(details ? details.start_time : false);
	const [pickerStartVisible, setPickerStartVisible] = useState(false);
	const showPickerStart = () => {
		setPickerStartVisible(true);
	};
	const hidePickerStart = () => {
		setPickerStartVisible(false);
	};
	const confirmPickerStart = (date) => {
		console.log("A date has been picked: ", date);
		const readableDate = moment(date).format("h:mmA");
		console.log(readableDate);
		setPickerValueStart(readableDate);
		hidePickerStart();
	};

	//PICKER FOR: END TIME
	const [pickerValueEnd, setPickerValueEnd] = useState(details ? details.end_time : false);
	const [pickerEndVisible, setPickerEndVisible] = useState(false);
	const showPickerEnd = () => {
		setPickerEndVisible(true);
	};
	const hidePickerEnd = () => {
		setPickerEndVisible(false);
	};
	const confirmPickerEnd = (date) => {
		console.log("A date has been picked: ", date);
		const readableDate = moment(date).format("h:mmA");
		console.log(readableDate);
		setPickerValueEnd(readableDate);
		hidePickerEnd();
	};

	const getMenus = async (uid) => {
		console.log(appsGlobalContext);
		const menusRef = await firebase
			.firestore()
			.collection("chefs")
			.doc(uid)
			.collection("menus")
			.get();
		if (!menusRef.empty) {
			let menus = [];
			menusRef.forEach((doc) => {
				let menu = doc.data();
				menus.push({ label: menu.title, value: doc.id });
			});
			setMenusList(menus);
			console.log("menusList", menus);
		} else {
			console.log("No menus found");
		}
	};

	const addExperience = async (values) => {
		//Add the new stripe to user data and create the user in the DB
		const usersRef = firebase.firestore().collection("experiences");
		//Add in details about chef
		const chef = appsGlobalContext.userData;
		values.chef_name = chef.name;
		if (_.has(chef, "rating")) {
			values.chef_rating = chef.rating;
		}
		//If details were passed then we are updating not creating
		if (details) {
			await usersRef.doc(eventID).update(values);
		} else {
			const snapshot = await usersRef.add(values);
			setEventID(snapshot.id);
		}
		//MENU ADDED NOW GO TO PHOTOS
		setPhotoMode(true);
	};

	/***********************************************/
	// PHOTO MODE
	/***********************************************/
	const [isPhotoMode, setPhotoMode] = useState(false);
	const [eventImg, setEventImg] = useState(null); //useState((route.params) ? route.params.photo : null)
	const getImageUrl = async (url) => {
		console.log("Got the image", url);
		setEventImg(url);
	};

	const addPhotoToEvent = async (url) => {
		const usersRef = firebase.firestore().collection("experiences");
		await usersRef.doc(eventID).update({
			photos: firebase.firestore.FieldValue.arrayUnion(eventImg),
		});
		setPhotoMode(false);
		Alert.alert("Congratulations", `Your event has been ${details ? "updated" : "created"}.`, [
			{ text: "View Events", onPress: () => navigation.goBack() },
		]);
	};

	useEffect(() => {
		Location.installWebGeolocationPolyfill();
		getMenus(uid);
		eventRef.current?.setAddressText(eventLocation);
	}, [1]);

	return (
		<SafeAreaView style={globalStyles.safe_light}>
			<KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
				{isPhotoMode ? (
					<View style={[globalStyles.page, { alignItems: "center", justifyContent: "center" }]}>
						<ScrollView>
							<Text style={[globalStyles.h1, styles.headline_text]}>Add Photos</Text>
							<Text style={[globalStyles.subtitle, styles.subtitle_text]}>
								Showcase your event with at least one high quality pic.
							</Text>
							<View style={{ paddingVertical: 20 }}>
								<ImageUploader currentImg={eventImg} getImageUrl={getImageUrl} shape='rectangle' />
							</View>
							{eventImg && (
								<CustomButton size='big' onPress={() => addPhotoToEvent()} text='Submit Photo' />
							)}
						</ScrollView>
					</View>
				) : (
					<View style={[globalStyles.page]}>
						<Formik
							enableReinitialize={true}
							initialValues={{
								title: details ? details.title : "",
								description: details ? details.description : "",
								guests: details ? details.guests : "",
								cpp: details ? details.cpp : "",
								menu_template_id: details ? details.menu_template_id : "",
							}}
							onSubmit={(values) => {
								setIsDisabled(false);
								values.chef_id = uid;
								values.start_time = pickerValueStart;
								values.end_time = pickerValueEnd;
								values.event_date = pickerValueDate;
								values.event_start_date = pickerEventStartDate;
								values.event_end_date = pickerEventEndDate;
								values.location = eventLocation;
								addExperience(values);
							}}
							validationSchema={yup.object().shape({
								//name: yup.string().required('Please, provide your name!'),
							})}
						>
							{({
								values,
								errors,
								handleChange,
								setFieldValue,
								handleBlur,
								isValid,
								handleSubmit,
							}) => (
								<>
									{/* //!Event Title */}
									<View
										style={[
											forms.create_event_input_container,
											focusName == "title" ? forms.focused_light : forms.notFocused,
										]}
									>
										<MaterialIcons
											name='event'
											size={23}
											style={[
												forms.input_icon,
												focusName == "title" ? forms.focused_light : forms.notFocused,
											]}
										/>
										<TextInput
											name='title'
											value={values.title}
											style={forms.custom_input}
											placeholder='Event Title'
											onChangeText={handleChange("title")}
											onBlur={handleBlur("title")}
											onFocus={() => setFocusName("title")}
											setFocus={focusName}
											placeholderTextColor={Theme.FAINT}
											underlineColorAndroid='transparent'
											autoCapitalize='none'
											keyboardType='default'
										/>
									</View>

									{/* //!Event Description */}
									<View
										style={[
											forms.create_event_input_container,
											focusName == "description" ? forms.focused_light : forms.notFocused,
											{
												height: 85,
												alignItems: "flex-start",
												paddingLeft: 5,
											},
										]}
									>
										<Entypo
											name='text'
											size={23}
											style={[
												forms.input_icon,
												focusName == "description" ? forms.focused_light : forms.notFocused,
											]}
										/>
										<TextInput
											name='description'
											value={values.description}
											style={[
												forms.custom_input,
												{
													textAlignVertical: "top",
													paddingTop: 5,
												},
											]}
											placeholder='Event Description'
											onChangeText={handleChange("description")}
											onBlur={handleBlur("description")}
											onFocus={() => setFocusName("description")}
											setFocus={focusName}
											multiline={true}
											numberOfLines={3}
											placeholderTextColor={Theme.FAINT}
											underlineColorAndroid='transparent'
											autoCapitalize='none'
											keyboardType='default'
										/>
									</View>

									<View style={[forms.small_input_container]}>
										{/* //!Event Start Date */}
										<Pressable style={[forms.input_container_center]} onPress={showPickerStartDate}>
											<View
												style={[
													forms.input_container,
													forms.input_container_border,
													forms.input_container_radius_round,
													forms.input_container_flex_start,
													{ marginLeft: 20, height: 58, width: windowWidth / 2.15 },
												]}
											>
												<Fontisto
													name='date'
													size={23}
													style={[
														forms.input_icon,
														focusName == "event_start_date"
															? forms.focused_light
															: forms.notFocused,
													]}
												/>
												<Text
													style={[
														forms.custom_input,
														{
															color: pickerValueDate ? "black" : Theme.FAINT,
															flex: 0,
														},
													]}
												>
													{pickerEventStartDate ? pickerEventStartDate : "Event Start Date"}
												</Text>
												<DateTimePickerModal
													isVisible={pickerStartDateVisible}
													mode='date'
													onConfirm={pickerStartDateHandler}
													onCancel={hidePickerDate}
												/>
											</View>
										</Pressable>

										{/* //!Event Start Time */}
										<TouchableNativeFeedback onPress={showPickerStart}>
											<View
												style={[
													forms.input_container,
													forms.input_container_border,
													forms.input_container_radius_round,
													focusName == "start_time" ? forms.focused_light : forms.notFocused,
													{
														marginRight: 20,
														marginLeft: 10,
														height: 58,
														width: windowWidth / 2.15,
													},
												]}
											>
												<MaterialIcons
													name='access-time'
													size={23}
													style={[
														forms.input_icon,
														focusName == "start_time" ? forms.focused_light : forms.notFocused,
													]}
												/>
												<View
													style={[
														forms.custom_input,
														{
															alignItems: "flex_start",
														},
													]}
												>
													<Text
														style={[
															{
																color: Theme.FAINT,
																flex: 0,
															},
														]}
													>
														{pickerValueStart ? pickerValueStart : "Start Time"}
													</Text>
													<DateTimePickerModal
														isVisible={pickerStartVisible}
														mode='time'
														onConfirm={confirmPickerStart}
														onCancel={hidePickerStart}
													/>
												</View>
											</View>
										</TouchableNativeFeedback>
									</View>

									<View style={[forms.small_input_container]}>
										{/* //!Event End Date */}
										<Pressable style={forms.input_container_center} onPress={showPickerEndDate}>
											<View
												style={[
													forms.input_container,
													forms.input_container_border,
													forms.input_container_radius_round,
													forms.input_container_flex_start,
													{ marginLeft: 20, height: 58, width: windowWidth / 2.15 },
												]}
											>
												<Fontisto
													name='date'
													size={23}
													style={[
														forms.input_icon,
														focusName == "event_end_date" ? forms.focused_light : forms.notFocused,
													]}
												/>
												<Text
													style={[
														forms.custom_input,
														{
															color: pickerValueDate ? "black" : Theme.FAINT,
															flex: 0,
														},
													]}
												>
													{pickerEventEndDate ? pickerEventEndDate : "End Date"}
												</Text>
												<DateTimePickerModal
													isVisible={pickerEndDateVisible}
													mode='date'
													onConfirm={pickerEndDateHandler}
													onCancel={hidePickerDate}
												/>
											</View>
										</Pressable>

										{/* //!Event End Time */}
										<TouchableNativeFeedback onPress={showPickerEnd}>
											<View
												style={[
													forms.input_container,
													forms.input_container_border,
													forms.input_container_radius_round,
													focusName == "start_time" ? forms.focused_light : forms.notFocused,
													{
														marginRight: 20,
														marginLeft: 10,
														height: 58,
														width: windowWidth / 2.15,
													},
												]}
											>
												<MaterialIcons
													name='access-time'
													size={23}
													style={[
														forms.input_icon,
														focusName == "start_time" ? forms.focused_light : forms.notFocused,
													]}
												/>
												<View
													style={[
														forms.custom_input,
														{
															alignItems: "flex_start",
														},
													]}
												>
													<Text
														style={[
															{
																color: Theme.FAINT,
																flex: 0,
															},
														]}
													>
														{pickerValueEnd ? pickerValueEnd : "End Time"}
													</Text>
													<DateTimePickerModal
														isVisible={pickerEndVisible}
														mode='time'
														onConfirm={pickerEndDateHandler}
														onCancel={hidePickerStart}
													/>
												</View>
											</View>
										</TouchableNativeFeedback>
									</View>

									{/* //!Event Date */}
									{/* <Pressable
										onPress={showPickerDate}
										style={{
											width: windowWidth,
											flexDirection: "row",
											justifyContent: "center",
											alignItems: "center",
											horizontalPadding: 8,
										}}
									>
										<View
											style={{
												width: "95%",
												flexDirection: "row",
												justifyContent: "center",
												alignItems: "center",
												paddingLeft: 8,
												horizontalMargin: "20%",
												height: 58,
												borderRadius: 8,
												borderWidth: 1,
												backgroundColor: Theme.SURFACE_COLOR,
												borderColor: Theme.BORDER_COLOR,
											}}
										>
											<Fontisto
												name='date'
												size={23}
												style={[
													forms.input_icon,
													focusName == "event_date" ? forms.focused_light : forms.notFocused,
												]}
											/>
											<Text
												style={[
													forms.custom_input,
													{
														color: pickerValueDate ? "black" : Theme.FAINT,
														flex: 0,
													},
												]}
											>
												{pickerValueDate ? pickerValueDate : "When?"}
											</Text>
											<DateTimePickerModal
												isVisible={pickerDateVisible}
												mode='date'
												onConfirm={confirmPickerDate}
												onCancel={hidePickerDate}
											/>
										</View>
									</Pressable> */}

									{/* //!Event Time Container */}
									{/* <View style={[forms.small_input_container]}> */}
									{/* //!Event Start Time */}
									{/* <TouchableNativeFeedback style={{ width: "48%" }} onPress={showPickerStart}>
											<View
												style={[
													forms.create_event_input_container,
													forms.small_field,
													focusName == "start_time" ? forms.focused_light : forms.notFocused,
												]}
											>
												<MaterialIcons
													name='access-time'
													size={23}
													style={[
														forms.input_icon,
														focusName == "start_time" ? forms.focused_light : forms.notFocused,
													]}
												/>
												<View
													style={[
														forms.custom_input,
														{
															alignItems: "flex-start",
														},
													]}
												>
													<Text
														style={[
															{
																color: Theme.FAINT,
																flex: 0,
															},
														]}
													>
														{pickerValueStart ? pickerValueStart : "Start Time"}
													</Text>
													<DateTimePickerModal
														isVisible={pickerStartVisible}
														mode='time'
														onConfirm={confirmPickerStart}
														onCancel={hidePickerStart}
													/>
												</View>
											</View>
										</TouchableNativeFeedback>

										<TouchableNativeFeedback style={{ width: "48%" }} onPress={showPickerEnd}>
											<View
												style={[
													forms.create_event_input_container,
													forms.small_field,
													{
														marginRight: 0,
														marginLeft: 5,
													},
													focusName == "end_time" ? forms.focused_light : forms.notFocused,
												]}
											>
												<MaterialIcons
													name='access-time'
													size={23}
													style={[
														forms.input_icon,
														focusName == "end_time" ? forms.focused_light : forms.notFocused,
													]}
												/>
												<View
													style={[
														forms.custom_input,
														{
															alignItems: "flex-start",
														},
													]}
												>
													<Text
														style={[
															{
																color: Theme.FAINT,
																flex: 0,
															},
														]}
													>
														{pickerValueEnd ? pickerValueEnd : "End Time"}
													</Text>
													<DateTimePickerModal
														isVisible={pickerEndVisible}
														mode='time'
														onConfirm={confirmPickerEnd}
														onCancel={hidePickerEnd}
													/>
												</View>
											</View>
										</TouchableNativeFeedback>
									</View> */}

									{/* //! Event Location */}
									<View
										style={[
											forms.create_event_input_container,
											{
												marginBottom: 4,
												alignItems: "flex-start",
												height: "auto",
											},
											focusName == "location" ? forms.focused_light : forms.notFocused,
										]}
									>
										<MaterialIcons
											name='location-on'
											size={23}
											style={[
												forms.input_icon,
												focusName == "location" ? forms.focused_light : forms.notFocused,
											]}
										/>
										{/* VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead. */}
										<GooglePlacesAutocomplete
											listViewDisplayed={true} // true/false/undefined
											onPress={(data, details = null) => {
												// 'details' is provided when fetchDetails = true
												console.log(data, details);
												setEventLocation(data.description);
											}}
											placeholder='Locations'
											ref={eventRef}
											textInputProps={{
												placeholderTextColor: "#b9b9b9",
											}}
											query={{
												key: "AIzaSyBNszkGed_0yWGVbllKvCElBiZrCxywKXo",
												language: "en",
												components: "country:us",
											}}
											styles={{
												container: {
													flex: 1,
													width: "99%",
													borderWidth: 0,
													borderRadius: 10,
													borderColor: Theme.BORDER_COLOR,
													zIndex: 10000,
												},
												poweredContainer: {},
											}}
										/>
									</View>
									<Text
										style={[
											globalStyles.subtitle,
											{
												paddingLeft: 15,
												marginBottom: 20,
												fontSize: 12,
												color: Theme.FAINT,
											},
										]}
									>
										Exact location will only be revealed after completed purchase.
									</Text>

									<DropDownPicker
										zIndex={1000}
										open={open}
										value={currentMenuID}
										items={menusList}
										setOpen={setOpen}
										setValue={setCurrentMenuID}
										closeAfterSelecting={true}
										itemSeparator={true}
										onChangeValue={(value) => {
											setFieldValue("menu_template_id", value, false);
										}}
										placeholder='Select a Menu'
										placeholderStyle={{
											color: Theme.FAINT,
											fontSize: 18,
										}}
										style={{
											borderColor: Theme.BORDER_COLOR,
											marginBottom: 20,
										}}
										dropDownContainerStyle={{
											borderColor: Theme.FAINT,
										}}
										labelStyle={{
											color: Theme.PRIMARY_COLOR,
											fontSize: 18,
										}}
										listItemLabelStyle={{
											color: Theme.PRIMARY_COLOR,
											fontSize: 18,
										}}
										itemSeparatorStyle={{
											backgroundColor: Theme.BORDER_COLOR,
										}}
									/>

									<View style={forms.small_input_container}>
										<View
											style={[
												forms.create_event_input_container,
												forms.small_field,
												focusName == "guests" ? forms.focused_light : forms.notFocused,
											]}
										>
											<MaterialIcons
												name='people'
												size={23}
												style={[
													forms.input_icon,
													focusName == "guests" ? forms.focused_light : forms.notFocused,
												]}
											/>
											<TextInput
												name='guests'
												value={values.guests}
												style={forms.custom_input}
												placeholder='# of Guests'
												onChangeText={handleChange("guests")}
												onBlur={handleBlur("guests")}
												onFocus={() => setFocusName("guests")}
												setFocus={focusName}
												placeholderTextColor={Theme.FAINT}
												underlineColorAndroid='transparent'
												autoCapitalize='none'
												keyboardType='default'
											/>
										</View>
										<View
											style={[
												forms.create_event_input_container,
												forms.small_field,
												{
													marginRight: 0,
													marginLeft: 5,
												},
												focusName == "cpp" ? forms.focused_light : forms.notFocused,
											]}
										>
											<MaterialIcons
												name='attach-money'
												size={23}
												style={[
													forms.input_icon,
													focusName == "cpp" ? forms.focused_light : forms.notFocused,
												]}
											/>
											<TextInput
												name='cpp'
												value={values.cpp}
												style={forms.custom_input}
												placeholder='Cost Per Person'
												onChangeText={handleChange("cpp")}
												onBlur={handleBlur("cpp")}
												onFocus={() => setFocusName("cpp")}
												setFocus={focusName}
												placeholderTextColor={Theme.FAINT}
												underlineColorAndroid='transparent'
												autoCapitalize='none'
												keyboardType='default'
											/>
										</View>
									</View>

									<Text
										style={{
											paddingLeft: 5,
											marginTop: 15,
											marginBottom: -12,
											fontSize: 17,
											color: Theme.FAINT,
										}}
									>
										Pre-Service Message
									</Text>

									<View
										style={[
											forms.create_event_input_container,
											focusName == "preservice" ? forms.focused_light : forms.notFocused,
											{
												height: 130,
												alignItems: "flex-start",
												paddingLeft: 5,
											},
										]}
									>
										<MaterialCommunityIcons
											name='message-text-outline'
											size={23}
											style={[
												forms.input_icon,
												focusName == "preservice" ? forms.focused_light : forms.notFocused,
											]}
										/>
										<TextInput
											name='preservice'
											defaultValue={preserviceMsg}
											value={values.preservice}
											style={[
												forms.custom_input,
												{
													textAlignVertical: "top",
													paddingTop: 5,
												},
											]}
											placeholder='Pre-Service Message'
											onChangeText={handleChange("preservice")}
											onBlur={handleBlur("preservice")}
											onFocus={() => setFocusName("preservice")}
											setFocus={focusName}
											numberOfLines={4}
											multiline={true}
											placeholderTextColor={Theme.FAINT}
											underlineColorAndroid='transparent'
											autoCapitalize='none'
											keyboardType='default'
										/>
									</View>
									<Text
										style={[
											globalStyles.subtitle,
											{
												paddingLeft: 15,
												marginBottom: 20,
												marginTop: -15,
												fontSize: 12,
												color: Theme.FAINT,
											},
										]}
									>
										Preservice message will be sent to your clients via text the day before your
										appointment.
									</Text>

									<Text
										style={{
											paddingLeft: 5,
											marginTop: 15,
											marginBottom: -12,
											fontSize: 17,
											color: Theme.FAINT,
										}}
									>
										Post-Service Message
									</Text>

									<View
										style={[
											forms.create_event_input_container,
											focusName == "postservice" ? forms.focused_light : forms.notFocused,
											{
												height: 130,
												alignItems: "flex-start",
												paddingLeft: 5,
											},
										]}
									>
										<MaterialCommunityIcons
											name='message-text-outline'
											size={23}
											style={[
												forms.input_icon,
												focusName == "postservice" ? forms.focused_light : forms.notFocused,
											]}
										/>
										<TextInput
											name='postservice'
											defaultValue={postserviceMsg}
											value={values.postservice}
											style={[
												forms.custom_input,
												{
													textAlignVertical: "top",
													paddingTop: 5,
												},
											]}
											placeholder='Pre-Service Message'
											onChangeText={handleChange("postservice")}
											onBlur={handleBlur("postservice")}
											onFocus={() => setFocusName("postservice")}
											setFocus={focusName}
											numberOfLines={4}
											multiline={true}
											placeholderTextColor={Theme.FAINT}
											underlineColorAndroid='transparent'
											autoCapitalize='none'
											keyboardType='default'
										/>
									</View>
									<Text
										style={[
											globalStyles.subtitle,
											{
												paddingLeft: 15,
												marginBottom: 20,
												marginTop: -15,
												fontSize: 12,
												color: Theme.FAINT,
											},
										]}
									>
										Post-service message will be sent to your clients via text the day after your
										appointment.
									</Text>

									<CustomButton
										text='Save and Continue'
										onPress={handleSubmit}
										size='big'
										disabled={isDisabled}
									/>
								</>
							)}
						</Formik>
					</View>
				)}
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	headline_text: {
		paddingTop: 0,
		textAlign: "left",
	},
});
