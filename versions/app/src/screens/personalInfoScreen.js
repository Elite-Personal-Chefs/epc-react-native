/*******************************************************************************/
//? Personal Info Screen allows the user (chef) to enter and update their personal information such as: 
//? name, email, and password as of November 22, 2020.
/*******************************************************************************/

// CORE IMPORTS
import React, { useState, useRef, useContext, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import AppContext from "../components/AppContext";

// OUTSIDE IMPORTS
import { firebase, configKeys } from "../config/config";

// HELPER DEPENDENCIES

// COMPONENTS
import { CustomButton, InformationButton } from "../components/Button";

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

  // console.log(
  //   `appsGlobalContext in PersonalInfoScreen: ${JSON.stringify(
  //     appsGlobalContext.userData.searchable.first_name
  //   )}`
  // );

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
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);
  const [hide_password, toggleShowPassword] = useState(true);
  const [focusField, setFocusField] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // MODAL STATE VARIABLES
  const [modalVisible, setModalVisible] = useState(false);

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
  };

  const updateAccount = async () => {
    // email already updated in the state
    // password already updated in the state
    updateFirebaseAuth();
    updateFirebaseFirestore();

    setUpdatingProfile(false);
    setDataLoaded(false);
    //Clean up and refresh profile editing
    appsGlobalContext.reload();

    Alert.alert("Account Updated!", `Your account was successfully updated!`, [
      { text: "View Profile", onPress: () => navigation.goBack() },
    ]);
  };

  /*************************************************************/
  //! UPDATE PASSWORD
  /*************************************************************/
  const passwordsMatch = () => {
    if (newPassword === "" || confirmPassword === "") {
      Alert.alert("Passwords do not match", "Please make sure your passwords match");
      setDoPasswordsMatch(false);
      return;
    }

    if (newPassword === confirmPassword) {
      setDoPasswordsMatch(true);
      appsGlobalContext.updatePassword(newPassword);
      Alert.alert("Password Updated!", `Your password was successfully updated!`);
      navigation.goBack();
    } else {
      setDoPasswordsMatch(false);
    }
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

          <View style={forms.information_divider}></View>

          <View style={forms.information_container}>
            <Text style={forms.information_header}>Manage Password</Text>
            <Text style={forms.information_text}>
              You can set a new password if you don't want to use a temporary login codes.
            </Text>
            <InformationButton
              text='Change Password'
              size='small'
              onPress={() => {
                setModalVisible(true);
              }}
            ></InformationButton>
          </View>

          <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              //setIsEdit(false);
            }}
          >
            <View style={modal.modalBackground}>
              <View style={modal.modal_container}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={modal.close_button}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    //setIsEditing(false);
                  }}
                >
                  <AntDesign name='closecircleo' size={25} color={Theme.SECONDARY_COLOR} />
                </TouchableOpacity>
                <View style={[modal.modalHeader, { marginVertical: 20 }]}>
                  <Text>Please Enter Your New Password</Text>
                </View>

                <Text style={forms.input_label}>New Password</Text>
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
                    placeholder='New Password'
                    placeholderTextColor={Theme.FAINT}
                    keyboardType='default'
                    onChangeText={setNewPassword}
                    value={newPassword}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                    secureTextEntry={hide_password}
                    onFocus={() => setFocusField("newPassword")}
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

                <Text style={[forms.input_label, { marginTop: 20 }]}>Confirm Password</Text>
                <View
                  style={[
                    forms.input_container,
                    focusField == "confirmPassword" ? forms.focused_light : forms.notFocused,
                  ]}
                >
                  <MaterialIcons
                    name='lock'
                    size={27}
                    style={[
                      forms.input_icon,
                      focusField == "confirmPassword" ? forms.focused_light : forms.notFocused,
                    ]}
                  />
                  <TextInput
                    style={[forms.custom_input]}
                    placeholder='Confirm Password'
                    placeholderTextColor={Theme.FAINT}
                    keyboardType='default'
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                    secureTextEntry={hide_password}
                    onFocus={() => setFocusField("confirmPassword")}
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

                {!doPasswordsMatch ? (
                  <Text style={forms.input_text}>Passwords don't match. Please try again.</Text>
                ) : null}

                <CustomButton
                  text='Save'
                  size='big'
                  onPress={() => {
                    passwordsMatch();
                  }}
                  disabled={!doPasswordsMatch}
                ></CustomButton>
              </View>
            </View>
          </Modal>

          <View style={[forms.button_container, forms.button_bottom]}>
            <Button
              color={Theme.WHITE}
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
