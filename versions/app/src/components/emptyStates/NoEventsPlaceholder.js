/*******************************************************************************/
//? USED ON CHEF EVENTS SCREEN TO DISPLAY NO EVENTS PLACEHOLDER
/*******************************************************************************/

//* IMPORTS *********************************************************************/
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

//* OTHER DEPENDENCIES **********************************************************/
import _ from "underscore";

//* STYLES **********************************************************************/
import { emptyGlobalStyles, globalStyles } from "../../styles/styles";

/*******************************************************************************/
//* MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function NoEventsPlaceholder() {
	return (
		<View style={emptyGlobalStyles.empty_state}>
			<Image
				style={emptyGlobalStyles.empty_image}
				source={require("../../assets/empty_calendar.png")}
			/>
			<Text style={[emptyGlobalStyles.empty_text, styles.empty_text]}>
				You don't have any events yet
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	empty_text: {
		padding: 20,
	},
});
