/*******************************************************************************/
//? Personal Info Screen allows the user (chef) to enter and update their personal information such as: 
//? name, email, and password as of November 22, 2020.
/*******************************************************************************/

// CORE IMPORTS
import React, { useState, useRef, useContext, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, View, Button } from "react-native";
import AppContext from "../components/AppContext";

// OUTSIDE IMPORTS
import { firebase, configKeys } from "../config/config";

// HELPER DEPENDENCIES
import { convertTimestamp } from "../helpers/helpers";

// COMPONENTS
import { CustomButton, GoToButton } from "../components/Button";

// STYLES
import { globalStyles, forms, modal } from "../styles/styles";
import Theme from "../styles/theme.style.js";
import { MaterialCommunityIcons, FontAwesome, MaterialIcons, AntDesign } from "@expo/vector-icons";

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function PersonalInfoScreen({ route, navigation }) {
  //GLOBAL VARIABLES
  const appsGlobalContext = useContext(AppContext);
  const {
    userID: uid,
    activeFlow: activeFlow,
    userLoggedIn: userLoggedIn,
    userData: userDataRef,
    certifications: certificationsRef,
  } = appsGlobalContext;

	// States
	const [focusField, setFocusField] = useState(false);
	const [password, setPassword] = useState("");
	const [hide_password, toggleShowPassword] = useState(true);
    const [updatingEmail, setUpdatingEmail] = useState(false);

  // GLOBAL STATE VARIABLES
  const [userData, setUserData] = useState(userDataRef ? userDataRef : {});
  const [searchableData, setSearchableData] = useState(userDataRef ? userDataRef.searchable : {});

  //? DO WE STILL NEED THIS?
  const [startDate, setStartDate] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  // FORM STATE VARIABLES
  const [firstName, setFirstName] = useState(
    searchableData.first_name ? `${searchableData.first_name}` : ""
  );
  const [lastName, setLastName] = useState(
    appsGlobalContext.userData.searchable.last_name
      ? `${appsGlobalContext.userData.searchable.last_name}`
      : ""
  );
  const [email, setEmail] = useState(appsGlobalContext.userData.email);
  const [password, setPassword] = useState("");
  const [hide_password, toggleShowPassword] = useState(true);
  const [focusField, setFocusField] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  /*************************************************************/
  //! UPDATE EMAIL
  /*************************************************************/
  const updateFirebaseAuth = async () => {
    setUpdatingProfile(true);
    setDataLoaded(true);
    await appsGlobalContext.updateEmail(email, password);
  };

  const updateFirebaseFirestore = async () => {
    const usersRef = firebase.firestore().collection(activeFlow);
    const userData = {
      email: email,
    };

    await usersRef.doc(uid).update(userData); // TODO: Update to use service
  };;

  const updateAccount = async () => {

    // email already updated in the state
    // password already updated in the state
    updateFirebaseAuth();
    updateFirebaseFirestore();

    setUpdatingProfile(false);
    setDataLoaded(false);
    //Clean up and refresh profile editing
    appsGlobalContext.reload();

    //updateEmail();
    //Alert.alert("Updating account...");
  };

  /*************************************************************/
  //! SHOW PERSONAL INFO TO USER
  /*************************************************************/
  return (
    <>
      <View style={[globalStyles.page_blank]}>
        <View style={[forms.form_container, { flex: 1 }]}>
          <View style={[forms.header_row_container, styles.edit_personal_info_view]}>
            <Text style={forms.header_text}>Edit Personal Info</Text>
          </View>

          {/* <View>
            <Text style={forms.input_label}>First Name</Text>
            <View
              style={[
                forms.input_container,
                focusField == "firstName" ? forms.focused_light : forms.notFocused,
              ]}
            >
              <MaterialIcons
                name='edit'
                size={27}
                style={[
                  forms.input_icon,
                  focusField == "firstName" ? forms.focused_light : forms.notFocused,
                ]}
              />
              <TextInput
                style={[forms.custom_input]}
                placeholder={firstName || "First Name"}
                placeholderTextColor={Theme.FAINT}
                keyboardType='default'
                value={firstName}
                onChangeText={setFirstName}
                underlineColorAndroid='transparent'
                autoCapitalize='words'
                onFocus={() => setFocusField("firstName")}
                onBlur={() => setFocusField(null)}
                setFocus={focusField}
              />
            </View>

            <Text style={forms.input_label}>Last Name</Text>
            <View
              style={[
                forms.input_container,
                focusField == "lastName" ? forms.focused_light : forms.notFocused,
              ]}
            >
              <MaterialIcons
                name='edit'
                size={27}
                style={[
                  forms.input_icon,
                  focusField == "lastName" ? forms.focused_light : forms.notFocused,
                ]}
              />
              <TextInput
                style={[forms.custom_input]}
                placeholder={lastName || "Last Name"}
                placeholderTextColor={Theme.FAINT}
                keyboardType='default'
                value={lastName}
                onChangeText={setLastName}
                underlineColorAndroid='transparent'
                autoCapitalize='words'
                onFocus={() => setFocusField("firstName")}
                onBlur={() => setFocusField(null)}
                setFocus={focusField}
              />
            </View>
          </View> */}

          <Text style={forms.input_label}>Email</Text>
          <View
            style={[
              forms.input_container,
              focusField == "email" ? forms.focused_light : forms.notFocused,
            ]}
          >
            <MaterialIcons
              name='email'
              size={27}
              style={[
                forms.input_icon,
                focusField == "email" ? forms.focused_light : forms.notFocused,
              ]}
            />
            <TextInput
              style={[forms.custom_input]}
              placeholder={userData.email}
              placeholderTextColor={Theme.FAINT}
              keyboardType='default'
              value={email}
              onChangeText={setEmail}
              underlineColorAndroid='transparent'
              autoCapitalize='none'
              onFocus={() => setFocusField("email")}
              onBlur={() => setFocusField(null)}
              setFocus={focusField}
            />
          </View>

          <Text style={forms.input_label}>Password</Text>
          <View
            style={[
              forms.input_container,
              focusField == "password" ? forms.focused_light : forms.notFocused,
            ]}
          >
            <MaterialIcons
              name='lock'
              size={27}
              style={[
                forms.input_icon,
                focusField == "password" ? forms.focused_light : forms.notFocused,
              ]}
            />
            <TextInput
              style={[forms.custom_input]}
              placeholder='Password'
              placeholderTextColor={Theme.FAINT}
              keyboardType='default'
              onChangeText={setPassword}
              value={password}
              underlineColorAndroid='transparent'
              autoCapitalize='none'
              secureTextEntry={hide_password}
              onFocus={() => setFocusField("password")}
              onBlur={() => setFocusField(null)}
              setFocus={focusField}
            />
            <FontAwesome
              name={hide_password ? "eye-slash" : "eye"}
              size={20}
              color={Theme.SECONDARY_COLOR}
              style={forms.password_icon}
              onPress={() => toggleShowPassword(!hide_password)}
            />
          </View>

          <Text style={forms.input_text}>
            You must type in your password in order to save these changes.
          </Text>

          <View style={[]}>
            <Text>Password</Text>
            <Text>
              You can set a permanent password if you don't want to use temporary login codes. If
              you lose access to your school email address, you'll be able to log in using your
              password.
            </Text>
            <Button title='Change Password'></Button>
          </View>

          <View style={[forms.button_container, forms.button_bottom]}>
            <Button
              color={"white"}
              title={!updatingProfile ? "Update Profile" : "Updating..."}
              disabled={!email || !password}
              size='big'
              onPress={() => updateAccount()}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  edit_personal_info_view: {
    //backgroundColor: Theme.SECONDARY_COLOR,
  },
});
