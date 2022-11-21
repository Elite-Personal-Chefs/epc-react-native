/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from 'react'

//Other Dependencies
import _ from 'underscore'

//Custom Components
import { StyleSheet, Text, View,  TouchableWithoutFeedback, Dimensions } from 'react-native'

//Styles
import { globalStyles, modal, footer, forms } from '../styles/styles';
import Theme from '../styles/theme.style.js';
import {AntDesign, MaterialIcons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function MenuItem ({details, pageName, navigation}) {
    //TODO: If (pageName is chefDetailScreen) than fontWeight needs to be medium on Text below
    return (
        <>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Menu Details', {details:details,pageName:pageName})}>
            <View style={globalStyles.navigate_away}>
                <Text style={[globalStyles.navigate_away_content, {fontWeight: "bold"}]}>{details.title}</Text>
                <AntDesign name="right" size={20} color={Theme.FAINT} style={{paddingLeft:5}}/>
            </View>
        </TouchableWithoutFeedback>
        </>
    )
}
