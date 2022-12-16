/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Dimensions,
	TouchableWithoutFeedback,
} from "react-native";
//Other Dependencies
import _ from "underscore";

//Custom Components
import MenuItem from "../MenuItem";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

//Styles
import { globalStyles, modal, footer, forms } from "../../styles/styles";
import Theme from "../../styles/theme.style.js";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function EventListing({ eventTemplates, pageName, navigation }) {
	let navigateTo = "";

	if (pageName === "Templates") navigateTo = "Chef Event Template Details";
	if (pageName === "Your Events") navigateTo = "Chef Event Details";

	const renderItem = ({ item }) => {
		return (
			<TouchableWithoutFeedback
				key={item.index}
				onPress={() => {
					navigation.navigate(navigateTo, {
						event: item,
					});
				}}
			>
				<View style={globalStyles.navigate_away}>
					<Text style={[globalStyles.navigate_away_content, { fontWeight: "bold" }]}>
						{item.title +
							` ${
								// TODO: Make this more readable
								!item.published && pageName === "Your Events" ? "[Draft]" : ""
							}`}
					</Text>
					<AntDesign name='right' size={20} color={Theme.FAINT} style={{ paddingLeft: 5 }} />
				</View>
			</TouchableWithoutFeedback>
		);
	};

	return (
		<View style={{ flex: 1, width: "100%" }}>
			<FlatList data={eventTemplates} renderItem={renderItem} keyExtractor={(item) => item.id} />
		</View>
	);
}
