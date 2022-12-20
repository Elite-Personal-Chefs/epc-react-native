// IMPORTS
import React, { useState, useContext, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// STYLES
import { globalStyles, eventGlobalStyles } from "../../styles/styles";

export default function EventTemplateCard(event) {
	return (
		<View style={[globalStyles.card, { width: "100%" }]}>
			<View style={globalStyles.card_header}>
				<Text style={globalStyles.card_header_text}>Details</Text>
			</View>
			<Text style={globalStyles.card_content}>{event.description}</Text>
		</View>
	);
}
