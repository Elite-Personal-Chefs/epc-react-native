/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useRef, useContext, useEffect } from "react";

// OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'

// COMPONENTS
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { CustomButton, GoToButton } from '../components/Button';
import AppContext from '../components/AppContext';
import { convertTimestamp } from '../helpers/helpers';


// STYLES
import { globalStyles, forms, modal } from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { MaterialCommunityIcons, FontAwesome, MaterialIcons, AntDesign } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function PersonalInfoScreen({ route, navigation }) {
  
    //Get global vars from app context
    const user = route.params.details;
    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID;
    const activeFlow = appsGlobalContext.activeFlow;

    // States
    const [focusField, setFocusField] = useState(false);
    const [password, setPassword] = useState('');
    const [hide_password, toggleShowPassword] = useState(true);

    const [userData, setUserData] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [dataLoaded, setDataLoaded] = useState(false)

    /*************************************************************/
    // GET USER DATA TO RENDER PAGE WITH
    /*************************************************************/

    const getUserData = async (uid) => {

        //* We get the collection/table in firebase from our firestore cloud DB
        const usersRef = firebase.firestore().collection(activeFlow);
        const firebaseUser = await usersRef.doc(uid).get();

        if (firebaseUser.exists) {
            let userData = firebaseUser.data();
            let userDate = convertTimestamp(userData.createdAt)

            //Set user data throughout page
            setUserData(userData);
            setStartDate(userDate[0])
            setDataLoaded(true)
        }
        else {
            console.log("No user found")
        }
    }

    if (!dataLoaded) {
        getUserData(uid)
    }

    /*************************************************************/
    // UPDATE EMAIL
    /*************************************************************/
    const [email, setNewEmail] = useState('');

    const changeEmail = async (text) => {
        user.email = null;
        setNewEmail(text);
    }

    const updateEmail = async () => {
        const userData = {
            email: email
        }
        const usersRef = firebase.firestore().collection(activeFlow);
        await usersRef.doc(uid).update(userData);
        //Clean up and refresh profile editing
        setDataLoaded(false);
    }

    const updateAccount = () => {
        updateEmail()
        Alert.alert("Updating account...")
    }

    /*************************************************************/
    // SHOW PERSONAL INFO TO USER
    /*************************************************************/
    return (
        <View style={globalStyles.page}>
            <View style={{ padding: 10, justifyContent: 'center', margin: 20 }}>
                <Text>You can update your email and password here.</Text>
            </View>
            <View style={[forms.input_container, focusField == 'email' ? forms.focused_light : forms.notFocused]}>
                <MaterialIcons name="email" size={27} style={[forms.input_icon, focusField == 'email' ? forms.focused_light : forms.notFocused]} />
                <TextInput
                    style={[forms.custom_input]}
                    placeholder={userData.email}
                    placeholderTextColor={Theme.FAINT}
                    keyboardType='default'
                    value={(user.email) ? user.email : email}
                    onChangeText={(text) => changeEmail(text)}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    onFocus={() => setFocusField("email")}
                    onBlur={() => setFocusField(null)}
                    setFocus={focusField}
                />
            </View>
            <View style={[forms.input_container, focusField == 'password' ? forms.focused_light : forms.notFocused]}>
                <MaterialIcons name="email" size={27} style={[forms.input_icon, focusField == 'password' ? forms.focused_light : forms.notFocused]} />
                <TextInput
                    style={[forms.custom_input]}
                    placeholder='Password'
                    placeholderTextColor={Theme.FAINT}
                    keyboardType='default'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    secureTextEntry={hide_password}
                    onFocus={() => setFocusField("password")}
                    onBlur={() => setFocusField(null)}
                    setFocus={focusField}
                />
                <FontAwesome name={hide_password ? 'eye-slash' : 'eye'} size={20} color={Theme.SECONDARY_COLOR} style={forms.password_icon} onPress={() => toggleShowPassword(!hide_password)} />
            </View>

            <CustomButton text='Save' size="small" onPress={() => updateAccount()} />
        </View>

    )
}

const styles = StyleSheet.create({
    profile_header: {
        marginVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    person_icon: {
        padding: 5,
        marginRight: 10
    },
    profile_img: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: Theme.SECONDARY_COLOR,
        marginRight: 15 //So it overlaps on the edit icon above it
    },
    profile_name: {
        fontSize: 21,
        color: Theme.TEXT_ON_SURFACE_COLOR,
        fontFamily: Theme.FONT_STANDARD,
        textTransform: 'capitalize'
    },
    profile_id: {
        fontSize: 15,
        color: Theme.PRIMARY_COLOR,
        fontFamily: Theme.FONT_LIGHT
    },
    section_header: {
        fontFamily: Theme.FONT_MEDIUM,
        color: Theme.TEXT_ON_SURFACE_COLOR,
        fontSize: 16,
        padding: 5,
        marginTop: 10,
        marginBottom: 5
    },
    info_container: {
        paddingHorizontal: 25,
        paddingVertical: 15,
        marginBottom: 25,
        backgroundColor: Theme.BORDER_COLOR,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    member_detail: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
    },
    member_info_text: {
        flex: 1,
        color: Theme.TEXT_ON_SURFACE_COLOR,
        fontSize: 14
    },
    detail_icons: {
        paddingRight: 15,
        color: Theme.PRIMARY_COLOR
    },
    edit_icon: {
        color: Theme.SECONDARY_COLOR,
        padding: 10
    },
    promo_text: {
        color: Theme.SECONDARY_COLOR,
        fontSize: 12,
        fontWeight: 'bold'
    },
    textLinkText: {
        textAlign: 'center',
        fontFamily: Theme.FONT_MEDIUM,
        textDecorationLine: 'underline',
        fontSize: 12,
        padding: 10,
        marginTop: 6,
        color: Theme.PRIMARY_COLOR
    },
    versionText: {
        textAlign: 'center',
        fontFamily: Theme.FONT_STANDARD,
        fontSize: 10,
        padding: 5,
        marginTop: 2,
        color: Theme.FAINT
    },
    edit_input: {
        borderWidth: 1,
        borderColor: Theme.SECONDARY_COLOR,
        borderRadius: 8,
        paddingLeft: 11
    },
    modal_text: {
        textAlign: 'center',
        color: Theme.TEXT_ON_SURFACE_COLOR,
        fontSize: 15,
    },
    verify_input: {
        paddingLeft: 0,
        borderWidth: 2,
        borderColor: Theme.PRIMARY_COLOR,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 20,
        width: 200,
        height: 45,
        borderRadius: 20,
        fontFamily: Theme.FONT_MEDIUM,
    },
    cc_container: {
        borderRadius: 17,
        padding: 25,
        marginVertical: 16,
        backgroundColor: Theme.SURFACE_COLOR,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    cc_detail_container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    small_field: {
        flex: 2,
        marginRight: 5,
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        alignItems: 'flex-start'
    },

})