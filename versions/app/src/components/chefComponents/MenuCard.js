import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View, ActivityIndicator } from "react-native";

//OTHER DEPENDENCIES

// STYLES
import { globalStyles, eventGlobalStyles, menusStyles, footer, forms } from "../../styles/styles";
import Theme from "../../styles/theme.style.js";

export default function MenuCard(menuCoursesAndMeals) {
	const renderMenu = menuCoursesAndMeals.menuItems.map((menu) => {
		return (
			<View style={menusStyles.menu_course_cont} key={menu.id}>
				<Text style={menusStyles.menu_course}>-{menu.course}-</Text>
				{menu.meals.map((meal) => {
					return (
						<View style={menusStyles.menu_item_cont} key={meal.id}>
							<Text style={menusStyles.menu_name}>{meal.title}</Text>
							{meal.description && <Text style={menusStyles.menu_desc}>{meal.description}</Text>}
						</View>
					);
				})}
			</View>
		);
	});

	return (
		<View style={[globalStyles.card]}>
			{menuCoursesAndMeals ? (
				renderMenu
			) : (
				<ActivityIndicator size='large' color={Theme.SECONDARY_COLOR} />
			)}
		</View>
	);
}
