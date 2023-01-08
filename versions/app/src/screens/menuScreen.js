/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useEffect, useContext } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//OTHER DEPENDENCIES
import { useFocusEffect } from "@react-navigation/native";
import { getChefMenus } from "../data/chef";
import { getMenuTemplates } from "../data/menuTemplates";

// COMPONENTS
import AppContext from "../components/AppContext";
import MenuListing from "../components/MenuListing";
import { dynamicSort } from "../helpers/helpers";

// STYLES
import { globalStyles } from "../styles/styles";
import Theme from "../styles/theme.style.js";
import { MaterialIcons } from "@expo/vector-icons";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function MenuScreen({ navigation, route }) {
	const appsGlobalContext = useContext(AppContext);
	const uid = appsGlobalContext.userID;

	const menuPageName = route.name;
	const [refreshing, setRefreshing] = useState(false);
	const [menuTemplates, setMenuTemplates] = useState(null);

	const getMenus = async (menuPageName) => {
		try {
			if (menuPageName == "Templates") {
				const menuTemplates = await getMenuTemplates();
				setMenuTemplates(menuTemplates.sort(dynamicSort("title")));
			} else if (menuPageName == "Your Menus") {
				const chefMenus = await getChefMenus(uid);
				setMenuTemplates(chefMenus.menus.sort(dynamicSort("title")));
			}
		} catch (error) {
			console.log(error);
		}
	};

	const onRefresh = () => {
		getMenus(menuPageName);
		setRefreshing(false);
	};

	useEffect(() => {
		getMenus(menuPageName);
	}, []);

	/*************************************************************/
	// RUN FOCUS EFFECT TO CHECK VARIOUS STATES ON LOAD
	/*************************************************************/
	useFocusEffect(
		React.useCallback(() => {
			getMenus(menuPageName);
		}, [1])
	);

	return (
		<SafeAreaView style={globalStyles.safe_light}>
			<View style={[globalStyles.page, { padding: 0 }]}>
				{menuTemplates ? (
					<MenuListing
						menuTemplates={menuTemplates}
						chefID={uid}
						pageName={menuPageName}
						navigation={navigation}
						key={menuPageName}
					/>
				) : (
					<View style={globalStyles.empty_state}>
						<Image
							style={globalStyles.empty_image}
							source={require("../assets/empty_calendar.png")}
						/>
						<Text style={globalStyles.empty_text}>You don't have any menus yet</Text>
					</View>
				)}
				{menuPageName == "Your Menus" && (
					<TouchableOpacity
						onPress={() => navigation.navigate("Create Menu")}
						style={{
							position: "absolute",
							right: 15,
							bottom: 15,
							width: 50,
							height: 50,
							borderRadius: 100,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: Theme.SECONDARY_COLOR,
						}}
					>
						<MaterialIcons name='add' size={25} color={Theme.WHITE} />
					</TouchableOpacity>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
    no_menu:{
        flex:1,
        width:'100%',
        height:'100%',
        justifyContent: 'center', 
        alignItems: 'center',
    },
})
