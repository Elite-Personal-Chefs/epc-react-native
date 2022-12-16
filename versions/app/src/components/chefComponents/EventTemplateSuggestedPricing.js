// IMPORTS
import React, { useState, useContext, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// OTHER DEPENDENCIES
import Tooltip from "react-native-walkthrough-tooltip";

// STYLES
import { globalStyles, eventGlobalStyles } from "../../styles/styles";
import { AntDesign } from "@expo/vector-icons";

export default function EventTemplateSuggestedPricing({ CPP }) {
	const [toolTipVisible, setToolTipVisible] = useState(false);

	return (
		<View style={eventGlobalStyles.suggested_price_container}>
			<View style={eventGlobalStyles.price_label_and_icon_container}>
				<Text style={eventGlobalStyles.price_label}>EPC Suggested Price</Text>
				<Tooltip
					isVisible={toolTipVisible}
					content={
						<View>
							<Text>
								Your cost per person is your event price and will be shown to your guests.
							</Text>
						</View>
					}
					placement='bottom'
					onClose={() => setToolTipVisible(false)}
					useInteractionManager={true} // need this prop to wait for react navigation
					// below is for the status bar of react navigation bar
					// topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
				>
					<TouchableOpacity style={[{ width: "100%" }]} onPress={() => setToolTipVisible(true)}>
						<AntDesign name='infocirlceo' size={17} color='black' />
					</TouchableOpacity>
				</Tooltip>
			</View>
			<Text style={eventGlobalStyles.price}>
				${CPP}
				<Text style={eventGlobalStyles.price_label}>/Person</Text>
			</Text>
		</View>
	);
}
