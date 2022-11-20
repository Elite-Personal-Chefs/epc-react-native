/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StyleSheet, View, ScrollView, Dimensions , Image, ActivityIndicator, TouchableOpacity} from 'react-native'

//Other Dependencies
import { firebase, configKeys } from '../config/config'; 
import _ from 'underscore'; 
import { useFocusEffect } from '@react-navigation/native';

// COMPONENTS
import AppContext from '../components/AppContext';
import { CustomButton } from '../components/Button';
import {getEndpoint} from '../helpers/helpers'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Tooltip from 'react-native-walkthrough-tooltip';

// STYLES
import {globalStyles, menusStyles, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import {AntDesign, MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons'


/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function EventDetailScreen({route,navigation}) {

  const appsGlobalContext = useContext(AppContext);
  const uid = appsGlobalContext.userID;
  const user = appsGlobalContext.userData;
  const activeFlow = appsGlobalContext.activeFlow;
  const details = route.params.details;
  const pageName = route.params.pageName;
  const [eventImg, setEventImg] = useState(require("../assets/food_pasta.png"));
  const [reserved, setReserved] = useState(details.reserved ? true : false);
  const [guestList, setGuestList] = useState(false);
  const [menuItems, setMenuItems] = useState(false);
  const [eventDetails, setEventDetails] = useState(details ? details : null);
  const [knownCPP, setKnownCPP] = useState(details.cpp ? +details.cpp : false);
  const [toolTipVisible, setToolTipVisible] = useState(false);






  const getEventDetails = async () => {
    console.log("This is a reservation need more details");
    const firestore = firebase.firestore();
    const eventRef = firestore.collection("experiences").doc(eventDetails.id || eventDetails.experience_id);
    const eventDoc = await eventRef.get();
    if (!eventDoc.exists) {
      console.log("No event found");
    } else {
      let event = eventDoc.data();
      event.id = eventDoc.id;
      setEventDetails(event);
      getMenus(event);
      console.log("Found event details", event);
    }
  };

  //If we are coming from Reservation page then we need more details on the event
  const isReservation = route.params.isReservation;
  if (isReservation) {
    getEventDetails();
  }




  const reserveEvent = async (menuID) => {
    console.log("This is the user that is reserving ", user);
    try {
      const result = await fetch(getEndpoint(appsGlobalContext, "reserve"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guest_id: uid,
          guest_name: user.name ? user.name : "Guest Name",
          experience_id: eventDetails.id,
          title: eventDetails.title,
          readable_date:
            eventDetails.event_date + " | " + eventDetails.start_time + "-" + eventDetails.end_time,
          //experience_type: uid,
        }),
      });
      const json = await result.json();
      setReserved(true);
      alert("Reservation Completed");
    } catch (error) {
      console.log(error);
    }
  };



  const [added, setAdded] = useState(false);


  

  const addToMyEvents = async (eventID) => {
    //console.log(eventID, uid);
    try {
      const result = await fetch(getEndpoint(appsGlobalContext, "copy_event_template"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_template_id: eventID,
          add_data: {
            chef_id: uid,
            is_custom: false,
            is_published: false,
            event_template_id: eventID,
          },
        }),
      });
      const json = await result.json();
      setAdded(true);
    } catch (error) {
      console.log(error);
    }
  };





  const editEvent = () => {
    console.log("Lets edit the envet");
    navigation.navigate("Create Event", {
      details: details,
    });
  };




  const getMenus = async (details, pageName) => {
    console.log("GETTING MENU ID: ", details);
    //If this is a template page look for the menu in templates
    //otherwise look into the chefs colelction of menus
    const firestore = firebase.firestore();
    let menuRef;
    let menuDoc;

    if( pageName == 'Templates' || details.isTemplate ) {
      console.log(`pageName \n ${pageName}`);
      menuRef = firestore.collection("menu_templates").doc(details.menu_template_id);

    } else if ( pageName == 'Your Events' ) {
        menuRef = firestore.collection('chefs').doc(uid).collection('menus').doc(`${details.menu_template_id}`);
    }

    menuDoc = await menuRef.get();
      
    if (!menuDoc.exists) {
      console.log("No menu found");
    } else {
        
      console.log(`menuDoc: \n${JSON.stringify(menuDoc)}`);
      let menu = menuDoc.data();
      let courses = menu.courses;
      let menuItems = [];

      for await (const course of courses) {
        //Get all courses for this menu
        let courseSnapshot = await menuRef.collection(course).get();
        if (!courseSnapshot.empty) {
          let items = [];
          courseSnapshot.forEach((doc) => {
            let item = doc.data();
            items.push(item);
          });
          menuItems.push({ items, course: course });
        }
      }

      //console.log(menuItems);
      setMenuItems(menuItems);
    }
  };




  const getGuestList = async (guestListID) => {
    console.log("Getting guest list", guestListID);
    const firestore = firebase.firestore();
    const eventRef = firestore.collection("experiences").doc(guestListID);
    let guestListSnapshot = await eventRef.collection("guest_list").get();
    if (!guestListSnapshot.empty) {
      let guests = [];
      guestListSnapshot.forEach((doc) => {
        let guest = doc.data();
        guest.avatar =
          "https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/fe8c4ba1-5d37-4796-b193-c675017fe930?alt=media&token=b83172f7-9d27-49bf-8e1c-31429249ee4b";
        guests.push(guest);
      });
      console.log("Guests", guests);
      setGuestList(guests);
    } else {
      console.log("NO GUEST LIST FOUND");
    }
  };

  /*************************************************************/
  // RUN FOCUS EFFECT TO CHECK VARIOUS STATES ON LOAD
  /*************************************************************/
  useFocusEffect(
    React.useCallback(() => {
      if (details.photos) {
      setEventImg({ uri: details.photos[0] });
      //useState(require('../assets/food_pasta.png'))
      }

      getMenus(details, pageName);
      
      if (activeFlow == "chefs") {
        getGuestList(details.id);
      }

      getEventDetails();

    }, [])
  )

  return (
    <SafeAreaView style={globalStyles.safe_light}>
      {eventDetails ? (
        <ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
          <Image source={eventImg} style={styles.image} />
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.title}>
                <Text style={globalStyles.h1}>{eventDetails.title}</Text>
              </View>
              {pageName == "Templates" && (
              <View style={styles.suggested_price_container}>
                <View style={styles.price_label_and_icon_container}>
                <Text style={styles.price_label}>EPC Suggested Price</Text>
                <Tooltip
                  isVisible={toolTipVisible}
                  content={
                    <View>
                      <Text>Your cost per person is your event price and will be shown to your guests.</Text>
                    </View>
                  }
                  placement="bottom"
                  onClose={() => setToolTipVisible(false)}
                  useInteractionManager={true} // need this prop to wait for react navigation
                  // below is for the status bar of react navigation bar
                  // topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                >
                <TouchableOpacity
                  style={[{ width: '100%', }, styles.button]}
                  onPress={() => setToolTipVisible(true)}
                >
                  <AntDesign name="infocirlceo" size={17} color="black" />
                </TouchableOpacity>
                </Tooltip>
                </View>
                <Text style={styles.price}>
                  ${knownCPP}
                  <Text style={styles.price_label}>/Person</Text>
                </Text>
              </View>
            )}
            </View>
            {pageName == "Templates" && (
              <View style={styles.btn_cont}>
                {added ? (
                  <CustomButton
                    text='Added to My Events'
                    size='big'
                    disabled='true'
                    checkmark='true'
                  />
                ) : (
                  <CustomButton
                    text='Add to My Events'
                    onPress={() => addToMyEvents(details.id)}
                    size='big'
                  />
                )}
              </View>
            )}
            {activeFlow == "chefs" && pageName == "Your Events" && (
              <View style={styles.btn_cont}>
                <CustomButton text='Edit Event' onPress={() => editEvent(true)} size='big' />
              </View>
            )}
            {activeFlow == "guests" && !isReservation && (
              <View style={styles.btn_cont}>
                {reserved ? (
                  <CustomButton text='Reserved' size='big' disabled='true' checkmark='true' />
                ) : (
                  <CustomButton
                    text='Reserve this Event'
                    onPress={() => reserveEvent()}
                    size='big'
                  />
                )}
              </View>
            )}
            <View style={[globalStyles.card, { width: "100%" }]}>
              <View style={globalStyles.card_header}>
                <Text style={globalStyles.card_header_text}>Details</Text>
              </View>
              <Text style={globalStyles.card_content}>{eventDetails.description}</Text>
              <View style={styles.details_cont}>
                <View style={styles.detail}>
                  <FontAwesome5 name='calendar' size={20} style={styles.detail_icon} />
                  <Text style={styles.detail_label}>
                    {eventDetails.event_date ? eventDetails.event_date : "March 22, 2022"}
                  </Text>
                </View>
                <View style={styles.detail}>
                  <AntDesign name='clockcircle' size={17} style={styles.detail_icon} />
                  <Text style={styles.detail_label}>
                    {eventDetails.start_time
                      ? eventDetails.start_time + "-" + eventDetails.end_time
                      : "5pm-8pm"}
                  </Text>
                </View>
                <View style={styles.detail}>
                  <MaterialIcons
                    name='location-on'
                    size={23}
                    style={[styles.detail_icon, { marginLeft: -3, width: 33 }]}
                  />
                  <Text style={styles.detail_label}>
                    {eventDetails.location ? eventDetails.location : "Chicago"}
                  </Text>
                </View>
                <View style={styles.detail}>
                  <Ionicons
                    name='md-person'
                    size={20}
                    style={[styles.detail_icon, { marginLeft: -1, width: 31 }]}
                  />
                  <Text style={styles.detail_label}>
                    {eventDetails.guests ? eventDetails.guests + " Guests" : "22 Guests"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[globalStyles.card, { width: "100%" }]}>
              {menuItems ? (
                menuItems.map((menu, index) => {
                  return (
                    <View style={menusStyles.menu_course_cont} key={index}>
                      <Text style={menusStyles.menu_course}>-{menu.course}-</Text>
                      {menu.items.map((item, index2) => {
                        return (
                          <View style={menusStyles.menu_item_cont} key={index2}>
                            <Text style={menusStyles.menu_name}>
                              {item.item_name || item.title}
                            </Text>
                            {item.description && item.description != "" ? (
                              <Text style={menusStyles.menu_desc}>{item.description}</Text>
                            ) : null}
                          </View>
                        );
                      })}
                    </View>
                  );
                })
              ) : (
                <ActivityIndicator size='large' color={Theme.SECONDARY_COLOR} />
              )}
            </View>

            {/* HOUSE RULES */}
            {eventDetails.house_rules && (
              <View style={globalStyles.card}>
                <View style={globalStyles.card_header}>
                  <Text style={globalStyles.card_header_text}>House Rules</Text>
                </View>
                <Text style={globalStyles.card_content}>
                  Here are some guidelines to follow in the space and some other details.
                </Text>
                {eventDetails.house_rules.map((rule, index) => {
                  return <Text style={[globalStyles.card_content, styles.rules]}>• {rule}</Text>;
                })}
                <View style={globalStyles.card_header}>
                  <Text style={[globalStyles.h3, { marginTop: 10 }]}>You also acknowledge:</Text>
                </View>
                <Text style={globalStyles.card_content}>
                  If you damage the venue, you may be charged for the damage you cause.
                </Text>
              </View>
            )}

            {/* GUEST LIST */}
            {guestList && (
              <View style={[globalStyles.card, { width: "100%" }]}>
                <View style={globalStyles.card_header}>
                  <Text style={globalStyles.card_header_text}>Guest List</Text>
                </View>
                {guestList.map((guest, index) => {
                  return (
                    <View style={styles.guest}>
                      <Image source={{ uri: guest.avatar }} style={styles.profile_img} />
                      <Text style={{ marginLeft: 10, lineHeight: 20 }}>{guest.guest_name}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator size='large' color={Theme.SECONDARY_COLOR} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    image:{
      width: windowWidth,
      height: 260,
      backgroundColor: Theme.PRIMARY_COLOR
    },
    content: {
      flex: 1,
      padding: 15,
      alignItems: "center",
      width: "100%",
    },
    header:{
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title:{
      marginVertical: 5
		  //flex: 1
    },
    suggested_price_container: {
      //marginVertical: 10
      //flex:1,
    },
    price: {
        fontSize: 20,
        color: Theme.PRIMARY_COLOR,
        fontWeight: 'bold',
        textAlign: 'center', 
    },
    price_label_and_icon_container: {
    flexDirection: "row", 
    },
    price_label: {
      color: Theme.PRIMARY_COLOR,
      fontSize: 14,
      paddingVertical: 5,
      marginRight: 5,
      textAlign: "center",
    },
    detail_icon: {
    paddingLeft: 0,
    marginRight: -8,
    color: Theme.PRIMARY_COLOR,
    },
    btn_cont: {
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical:13
    },
    details_cont:{
        paddingVertical:8,
    },
    detail:{
        flexDirection: 'row',
        paddingVertical:5
    },
    detail_icon:{
        width:30,
        padding:0,
        marginRight: 8,
        color: Theme.PRIMARY_COLOR,
    },
    detail_label:{
        fontSize: 13,
        lineHeight:20,
        color: Theme.FAINT,
    },
    rules: {
        fontSize: 15,
        paddingVertical: 15
    },
    guest: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical:10
    },
    profile_img: {
        width: 30,
        height: 30,
        paddingRight: 25,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: Theme.SECONDARY_COLOR,
    },
})
