// IMPORTS
import React from "react";
import { Text, View } from "react-native";

// STYLES
import { globalStyles } from "../../styles/styles";

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
