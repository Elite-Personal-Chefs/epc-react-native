import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
	Button,
	Text,
	StyleSheet,
	View,
	ScrollView,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	Linking,
} from "react-native";

//OTHER DEPENDENCIES

// STYLES
import { globalStyles, eventGlobalStyles, menusStyles, footer, forms } from "../../styles/styles";
import Theme from "../../styles/theme.style.js";

export default function MenuCard(menuItems) {
	console.log(`menuItems: ${JSON.stringify(menuItems)}`);

	// const [menuItems, setMenuItems] = useState(null);
	// const [loading, setLoading] = useState(true);

	return (
		<View style={[globalStyles.card, { width: "100%" }]}>
			{menuItems ? (
				<Text>Menu Card</Text>
			) : (
				<ActivityIndicator size='large' color={Theme.SECONDARY_COLOR} />
			)}
		</View>
	);
}
