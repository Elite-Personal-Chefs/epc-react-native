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
			{/* <View style={eventGlobalStyles.details_container}>
				<View style={eventGlobalStyles.detail}>
					<FontAwesome5 name='calendar' size={20} style={eventGlobalStyles.detail_icon} />
					<Text style={eventGlobalStyles.detail_label}>Start Date - End Date</Text>
				</View>
				<View style={eventGlobalStyles.detail}>
					<AntDesign name='clockcircle' size={17} style={eventGlobalStyles.detail_icon} />
					<Text style={eventGlobalStyles.detail_label}>Start Time - End Time</Text>
				</View>
				<View style={eventGlobalStyles.detail}>
					<MaterialIcons
						name='location-on'
						size={23}
						style={[eventGlobalStyles.detail_icon, { marginLeft: -3, width: 33 }]}
					/>
					<Text style={eventGlobalStyles.detail_label}>Event Location</Text>
				</View>
				<View style={eventGlobalStyles.detail}>
					<Ionicons
						name='md-person'
						size={20}
						style={[eventGlobalStyles.detail_icon, { marginLeft: -1, width: 31 }]}
					/>
					<Text style={eventGlobalStyles.detail_label}># of Guests</Text>
				</View>
			</View> */}
		</View>
	);
}
