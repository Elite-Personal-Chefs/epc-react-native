/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// COMPONENTS
import { Text, StyleSheet, View, Alert } from 'react-native'
import { CustomButton, SubmitButton, ReferralButton } from '../components/Button'

// STYLES
import { globalStyles, TouchableHighlight, footer, forms } from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { MaterialIcons, Feather, Fontisto, FontAwesome } from '@expo/vector-icons';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function ReferScreen({ navigation }) {

    const buttonPress = () => {
        Alert.alert("Button Pressed")
    }

    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View>
                <Text style={styles.refer_and_earn_header}>Earn $50 for every chef you refer</Text>
                <Text style={styles.refer_and_earn_text}>Invite your friends and family to join as a chef on the EPC app and earn $50 when they complete their first reservation!</Text>
            </View>
            <View style={styles.buttons}>
                <ReferralButton text={'Copy Link'} styleIconName={'Feather'} iconName={'external-link'}></ReferralButton>
                <ReferralButton text={'Text'} styleIconName={'Feather'} iconName={'message-circle'}></ReferralButton>
                {/* <ReferralButton text={'Email'} styleIconName={'Fontisto'} iconName={'email'}></ReferralButton>
                <ReferralButton text={'Facebook'} styleIconName={'Feather'} iconName={'facebook'}></ReferralButton>
                <ReferralButton text={'LinkedIn'} styleIconName={'FontAwesome'} iconName={'linkedin-square'}></ReferralButton>
                <ReferralButton text={'Twitter'} styleIconName={'Feather'} iconName={'twitter'}></ReferralButton> */}
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    logos: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 130,
        //fontFamily: Theme.FONT_STANDARD,
    },
    hogsalt_logo: {
        width: 239,
        height: 33,
        alignSelf: "center",
    },
    loyalty_logo: {
        width: 156,
        height: 27,
        alignSelf: "center",
        marginTop: 20
    },
    buttons: {
        //backgroundColor: "#008080",
        display: "flex",
        flexDirection: "column", //change to row
        flexWrap: "wrap",
        fontFamily: Theme.FONT_STANDARD,
        //justifyContent: 'center', //comment out for row
        alignContent: "center",
    },
    refer_and_earn_header: {
        fontSize: 35,
        textAlign: 'center',
        marginBottom: 25,
        marginHorizontal: 10,
    },
    refer_and_earn_text: {
        textAlign: 'center',
        marginBottom: 25,
        marginHorizontal: 10,
    }
})
