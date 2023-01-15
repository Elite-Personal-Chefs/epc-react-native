/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

//OTHER DEPENDENCIES
import { getChef, updateChef } from "../../../data/chef";

// COMPONENTS
import { View, Modal, Dimensions } from "react-native";
import ProfileSlider from "../../../components/chefComponents/ProfileSlider";
import AppContext from "../../../components/AppContext";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// STYLES
import { globalStyles, modal } from "../../../styles/styles";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function ProfileScreen({ navigation }) {
	const appsGlobalContext = useContext(AppContext);
	const uid = appsGlobalContext.userID;
	const userData = appsGlobalContext.userData;

	const [modalVisible, setModalVisible] = useState(true);

	const handleFormUpdates = async (values) => {
		await updateChef(uid, values);
		await getUserData(uid);
		navigation.navigate("Dashboard");
		setModalVisible(false);
	};

	async function getUserData(uid: string) {
		const chef = await getChef(uid);

		//? Not sure if we need this for first time chefs
		if (chef.exists) {
			appsGlobalContext.setUserData(chef.data());
			appsGlobalContext.setUserLoggedIn(true);
		}
	}

	useEffect(() => {
		getUserData(uid);
	}, [appsGlobalContext.userLoggedIn]);

	return (
		<SafeAreaView style={globalStyles.safe_light}>
			<View style={globalStyles.page}>
				<Modal
					animationType='slide'
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						setModalVisible(false);
					}}
				>
					<View style={modal.modalBackground}>
						<ProfileSlider handleFormUpdates={handleFormUpdates} userData={userData} />
					</View>
				</Modal>
			</View>
		</SafeAreaView>
	);
}
