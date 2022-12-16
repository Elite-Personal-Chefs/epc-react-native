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

	menuItems.map((menu, index) => {
		console.log(`menu: ${JSON.stringify(menu)}`);
	});

	// const [menuItems, setMenuItems] = useState(null);
	// const [loading, setLoading] = useState(true);

	return (
		<View style={[globalStyles.card, { width: "100%" }]}>
			{true ? (
				<View style={menusStyles.menu_course_cont}>
					<Text>Menu Card</Text>
				</View>
			) : (
				// menuItems.map((menu, index) => {
				// 	return (
				// 		<View style={menusStyles.menu_course_cont} key={index}>
				// 			<Text style={menusStyles.menu_course}>-{menu.course}-</Text>
				// 			{menu.items.map((item, index2) => {
				// 				return (
				// 					<View style={menusStyles.menu_item_cont} key={index2}>
				// 						<Text style={menusStyles.menu_name}>{item.item_name || item.title}</Text>
				// 						{item.description && item.description != "" ? (
				// 							<Text style={menusStyles.menu_desc}>{item.description}</Text>
				// 						) : null}
				// 					</View>
				// 				);
				// 			})}
				// 		</View>
				// 	);
				//})
				<ActivityIndicator size='large' color={Theme.SECONDARY_COLOR} />
			)}
		</View>
	);
}
