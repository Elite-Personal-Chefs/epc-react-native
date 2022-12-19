/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// OTHER DEPENDENCIES
import _ from "underscore";
import { firebase } from "../../../config/config";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import { set, format } from "date-fns";

// COMPONENTS
import {
	Text,
	StyleSheet,
	View,
	TextInput,
	ScrollView,
	Dimensions,
	Alert,
	TouchableNativeFeedback,
	LogBox,
} from "react-native";
import AppContext from "../../../components/AppContext";
import { CustomButton } from "../../../components/Button";
import { Formik } from "formik";
import ImageUploader from "../../../components/ImageUploader";
import * as yup from "yup";
import { createEvent, updateEvent } from "../../../data/event";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// STYLES
import { globalStyles, forms } from "../../../styles/styles";
import {
	MaterialCommunityIcons,
	MaterialIcons,
	Fontisto,
	Entypo,
} from "@expo/vector-icons";
import Theme from "../../../styles/theme.style.js";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

/*******************************************************************************/
// Suppress Google Places Autocomplete Warning
/*******************************************************************************/
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function CreateEventScreen({ route, navigation }: any) {
	const appsGlobalContext = useContext(AppContext);
	const uid = appsGlobalContext.userID;
	const [submitDisabled, setSubmitDisabled] = useState(false);
	const [focusName, setFocusName] = useState<string>();

	//* FOR Menu DROPDOWN PICKER
	const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
	const [menusList, setMenusList] = useState([]);
	const [currentMenuID, setCurrentMenuID] = useState(
		route?.params?.details?.menu_template_id || null
	);

	const [eventDetails, setEventDetails] = useState(route?.params?.details);

	console.log("details:", eventDetails);

	const eventRef = useRef();
	const [eventLocation, setEventLocation] = useState(eventDetails.location ? eventDetails.location : "");
	const [eventID, setEventID] = useState(eventDetails?.id || null);

	const getCurrentLocation = async () => {
		console.log("Getting location");
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			console.log("Permission to access location was denied");
		}
		let location = await Location.getLastKnownPositionAsync();
	};

	getCurrentLocation();

	let preserviceMsg =
		"Thank you for booking me with Elite Personal Chefs! If you or someone in your party has an allergy or dietary restriction, please let me know as soon as possible. As our clients often ask about gratuity; it is never mandatory or expected but always appreciated. I’m excited to give you a truly special dining experience!";
	let postserviceMsg =
		"Thank you again for booking with me! It was such a pleasure to cook for you and your guests. We rely on positive feedback from amazing clients like yourself. If you have a moment, please let us know how your event went!";
	if (eventDetails) {
		preserviceMsg = eventDetails.preservice ? eventDetails.preservice : preserviceMsg;
		postserviceMsg = eventDetails.postservice ? eventDetails.postservice : postserviceMsg;
	}

	/***********************************************/
	//! DATE PICKER
	/***********************************************/
	// ===START DATE STATES===
	const [start, setStart] = useState(eventDetails?.start || new Date());

	const [showStartDatePicker, setShowStartDatePicker] = useState(false);
	const displayStartDate = () => setShowStartDatePicker(true);
	const hideStartDate = () => setShowStartDatePicker(false);
	const handleStartDateCancel = () => hideStartDate();

	const [showStartTimePicker, setShowStartTimePicker] = useState(false);
	const displayStartTime = () => setShowStartTimePicker(true);
	const hideStartTime = () => setShowStartTimePicker(false);
	const handleStartTimeCancel = () => hideStartTime();

	const handleStartDateConfirm = (date: Date) => {
		const newDate = set(start, {
			date: date.getDate(),
			month: date.getMonth(),
			year: date.getFullYear(),
		});

		setStart(newDate);
		hideStartDate();
	};

	const handleStartTimeConfirm = (time: Date) => {
		console.log(`in handleStartTimeConfirm: ${time}`);

		const newDate = set(end, {
			hours: time.getHours(),
			minutes: time.getMinutes(),
		});
		setStart(newDate);
		hideStartTime();
	};

	// ===END DATE STATES===
	const [end, setEnd] = useState(eventDetails.end || new Date());

	const [showEndDate, setShowEndDate] = useState(false);
	const displayEndDate = () => setShowEndDate(true);
	const hideEndDate = () => setShowEndDate(false);
	const handleEndDateCancel = () => setShowEndDate(false);

	const [showEndTime, setShowEndTime] = useState(false);
	const displayEndTime = () => setShowEndTime(true);
	const hideEndTime = () => setShowEndTime(false);
	const handleEndTimeCancel = () => setShowEndTime(false);

	const handleEndDateConfirm = (date: Date) => {
		const newDate = set(end, {
			date: date.getDate(),
			month: date.getMonth(),
			year: date.getFullYear(),
		});

		setEnd(newDate);
		hideEndDate();
	};

	const handleEndTimeConfirm = (time: Date) => {
		console.log(`in handleEndTimeConfirm: ${time}`);

		const newDate = set(end, {
			hours: time.getHours(),
			minutes: time.getMinutes(),
		});
		setEnd(newDate);
		hideEndTime();
	};

	/***********************************************/
	//
	/***********************************************/
	const getMenus = async (uid: string) => {
		
		console.debug("User Id for getting menus",uid);
		
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
			//console.log("menusList", menus);
		} else {
			console.log("No menus found");
		}
	};

	/***********************************************/
	//
	/***********************************************/
	const addEvent = async (values: any) => {
		console.log(`values`, values);

		//Add in details about chef
		const chef = appsGlobalContext.userData;

		values.chefName = chef.name;

		//If details were passed then we are updating not creating
		//console.log(`details`, details);
		if (Object.keys(eventDetails).length > 0) {
			console.log("Updating experience", values);
			await updateEvent(eventID, values);
		} else {
			console.log("Creating experience", values);
			const newEvent = await createEvent(values);
			console.log("Snapshot", JSON.stringify(newEvent, null, 2));
			console.log("New Event ID", newEvent.id);
			setEventID(newEvent.id);
		}

		//MENU ADDED NOW GO TO PHOTOS
		setPhotoMode(true);
	};

	/***********************************************/
	// PHOTO MODE
	/***********************************************/
	const [isPhotoMode, setPhotoMode] = useState(false);
	const [eventImg, setEventImg] = useState<string>(); //useState((route.params) ? route.params.photo : null)
	const getImageUrl = async (url: string) => {
		console.log("Got the image", url);
		setEventImg(url);
	};

	const addPhotoToEvent = async (url: string) => {
		const eventsRef = firebase.firestore().collection("events");
		await eventsRef.doc(eventID).update({
			photos: firebase.firestore.FieldValue.arrayUnion(eventImg),
		});
		setPhotoMode(false);
		Alert.alert("Congratulations", `Your event has been ${eventDetails ? "updated" : "created"}.`, [
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
								title: eventDetails ? eventDetails.title : "",
								description: eventDetails ? eventDetails.description : "",
								guestCapacity: eventDetails ? eventDetails.guestCapacity : "",
								cpp: eventDetails ? eventDetails.cpp : "",
								menuId: eventDetails ? eventDetails.menuId : "",
							}}
							onSubmit={(values: any) => {
								setSubmitDisabled(false);
								values.chefId = uid;
								values.start = start;
								values.end = end;

								// console.log(`😈 values.start`, values.start);
								// console.log(`😈 values.end`, values.end);

								values.location = eventLocation;

								console.log("Creating this event", values);
								addEvent(values);
								//	(values);
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

									{/* //!Event Start Date */}
									<Pressable style={[forms.input_container_center]} onPress={displayStartDate}>
										<View
											style={[
												forms.create_event_input_container,
												forms.input_container_border,
												forms.input_container_radius_round,
												forms.input_container_flex_start,
												{ width: windowWidth * 0.95 },
											]}
										>
											<Fontisto
												name='date'
												size={23}
												style={[
													forms.input_icon,
													focusName == "start_date" ? forms.focused_light : forms.notFocused,
												]}
											/>
											<Text
												style={[
													forms.custom_input,
													{
														color: start ? "black" : Theme.FAINT,
														flex: 0,
													},
												]}
											>
												{start ? format(start, "PPPP") : "Event Start Date"}
											</Text>
											<DateTimePickerModal
												isVisible={showStartDatePicker}
												mode='date'
												minimumDate={new Date()}
												date={start}
												onConfirm={handleStartDateConfirm}
												onCancel={handleStartDateCancel}
											/>
										</View>
									</Pressable>

									{/* //!Event Start Time */}
									<TouchableNativeFeedback onPress={displayStartTime}>
										<View
											style={[
												forms.create_event_input_container,
												forms.input_container_border,
												forms.input_container_radius_round,
												focusName == "start_time" ? forms.focused_light : forms.notFocused,
												{
													width: windowWidth * 0.95,
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
															color: start ? "black" : Theme.FAINT,
															flex: 0,
														},
													]}
												>
													{start ? format(start, "p") : "Start Time"}
												</Text>
												{console.log("Start time", start)}
												<DateTimePickerModal
													isVisible={showStartTimePicker}
													mode='time'
													minimumDate={new Date()}
													minuteInterval={15}
													date={start}
													onConfirm={handleStartTimeConfirm}
													onCancel={handleStartTimeCancel}
												/>
											</View>
										</View>
									</TouchableNativeFeedback>

									{/* //* END DATE */}
									<Pressable style={forms.input_container_center} onPress={displayEndDate}>
										<View
											style={[
												forms.create_event_input_container,
												forms.input_container_border,
												forms.input_container_radius_round,
												forms.input_container_flex_start,
												{ width: windowWidth * 0.95 },
											]}
										>
											<Fontisto
												name='date'
												size={23}
												style={[
													forms.input_icon,
													focusName == "end_date" ? forms.focused_light : forms.notFocused,
												]}
											/>
											<Text
												style={[
													forms.custom_input,
													{
														color: end ? "black" : Theme.FAINT,
														flex: 0,
													},
												]}
											>
												{end ? format(end, "PPPP") : "Event End Date"}
											</Text>
											<DateTimePickerModal
												isVisible={showEndDate}
												mode='date'
												minimumDate={new Date()}
												date={end}
												onConfirm={handleEndDateConfirm}
												onCancel={handleEndDateCancel}
											/>
										</View>
									</Pressable>

									{/* //* END TIME */}
									<TouchableNativeFeedback onPress={displayEndTime}>
										<View
											style={[
												forms.create_event_input_container,
												forms.input_container_border,
												forms.input_container_radius_round,
												focusName == "end_time" ? forms.focused_light : forms.notFocused,
												{
													width: windowWidth * 0.95,
												},
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
														alignItems: "flex_start",
													},
												]}
											>
												<Text
													style={[
														{
															color: end ? "black" : Theme.FAINT,
															flex: 0,
														},
													]}
												>
													{end ? format(end, "p") : "End Time"}
												</Text>
												<DateTimePickerModal
													isVisible={showEndTime}
													mode='time'
													minimumDate={new Date()}
													minuteInterval={15}
													date={end}
													onConfirm={handleEndTimeConfirm}
													onCancel={handleEndTimeCancel}
												/>
											</View>
										</View>
									</TouchableNativeFeedback>

									{/* //! Event Location */}
									<View
										style={[
											forms.create_event_input_container,
											{
												marginBottom: 4,
												alignItems: "center",
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
												//console.log(data, details);
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
													paddingTop: 3,
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
										open={menuDropdownOpen}
										value={eventDetails.menuId}
										items={menusList}
										setOpen={setMenuDropdownOpen}
										setValue={(value) => { 
											console.log("Dropdown Value", value())
											setEventDetails({...eventDetails, menuId: value()})
										}}
										closeAfterSelecting={true}
										itemSeparator={true}
										onChangeValue={(value) => {
											setFieldValue("menuId", value, false);
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
												focusName == "guestCapacity" ? forms.focused_light : forms.notFocused,
											]}
										>
											<MaterialIcons
												name='people'
												size={23}
												style={[
													forms.input_icon,
													focusName == "guestCapacity" ? forms.focused_light : forms.notFocused,
												]}
											/>
											<TextInput
												name='guestCapacity'
												value={values.guestCapacity}
												style={forms.custom_input}
												placeholder='# of Guests'
												onChangeText={handleChange("guestCapacity")}
												onBlur={handleBlur("guestCapacity")}
												onFocus={() => setFocusName("guestCapacity")}
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
										disabled={submitDisabled}
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
