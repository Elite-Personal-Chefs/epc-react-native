/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// COMPONENTS
import { Text, StyleSheet, View, ScrollView } from 'react-native'
import { mailto, gotoWebLink } from '../helpers/helpers'

// STYLES
import { globalStyles, TouchableHighlight, footer, forms } from '../styles/styles';
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function FaqScreen({ navigation }) {

    function MailTo() {
        return (
            <Text 
                onPress={() => mailto('consultation@elitepersonalchefs')} 
                style={globalStyles.linkTextColor}>
                    consultation@elitepersonalchefs.com
            </Text>
        );
    }

    return (
        <View style={globalStyles.scrollContainer}>
            <KeyboardAwareScrollView>
                <ScrollView >
                    <View style={{flex: 1, backgroundColor: Theme.BACKGROUND_COLOR, padding: 20}} >
                        <Text style={[globalStyles.h1, { marginBottom: 20, paddingLeft: 10, }]}>Benefits of Becoming an EPC Culinary Professional</Text>
                        <View style={styles.orderedList}>
                            <Text style={[globalStyles.list_item, styles.orderedItem]}>1. Set your own schedule - which also means Unlimited Vacations</Text>
                            <Text style={[globalStyles.list_item, styles.orderedItem]}>2. Set your own menus and pricing</Text>
                            <Text style={[globalStyles.list_item, styles.orderedItem]}>3. Create personalized experiences for clients</Text>
                            <Text style={[globalStyles.list_item, styles.orderedItem]}>4. Access to a wealth of information from EPC to streamline your day-to-day and grow your revenue streams</Text>
                            <Text style={[globalStyles.list_item, styles.orderedItem]}>5. Self-Employment tax benefits</Text>
                            <Text style={[globalStyles.list_item, styles.orderedItem]}>6. Access to our nationwide coupon rebate program</Text>
                            <View style={globalStyles.divider}></View>
                        </View>
                        <View style={globalStyles.reset}>
                            <Text style={[globalStyles.h1, { marginBottom: 20 }]}>FAQs</Text>
                            <Text style={styles.question}>What is EPC and why should I get involved?</Text>
                            <Text style={styles.answer}>Elite Personal Chefs (www.elitepersonalchefs.com) is a fast growing, multifaceted culinary business focused on high quality service, food, and client experiences. EPC is a one-of-a-kind opportunity for culinary professionals like you to work your own schedule, write your own menus, set your own prices all while helping us to revolutionize the hospitality industry. Once you become an EPC chef, you can book private events in your area and execute personalized experiences for your clients. With 9 years of experience, we've proven that the financial freedom and the chef's work/life balance is much more stable than being a line cook in any restaurant. If you like to create your own menus and curate experiences for guests, then you should join EPC!</Text>
                            <Text style={styles.question}>What is my employment status?</Text>
                            <Text style={styles.answer}>As an EPC Culinary Professional, your status is a 10-99 Contract Employee.</Text>
                            <Text style={styles.question}>How does it work?</Text>
                            <Text style={styles.answer}>Once you’ve signed up to become an EPC Culinary Professional, you’ll be on-boarded into our program that connects you to an EPC sales associate and various lead generators to bring you business. From the leads sent to you, your sales associate can reach out to the clients and book the events on your behalf – using the prices that you set and the menus that you create. EPC sales associates can even help you with client billing and collecting payments. Of the money you make from each event, 85% of it you keep (along with 100% of gratuity) and 15% of it goes to EPC. On average, starting chefs work about 35 hours a week and make around $100,000 a year.</Text>
                            <Text style={styles.question}>What’s the catch? There has to be a catch!</Text>
                            <Text style={styles.answer}>No catch! EPC was created by chefs, for chefs. Our team has worked in the hospitality industry for decades and wanted to find a better way to achieve work/life balance and financial freedom. EPC’s mission is to bring together hospitality industry professionals from across the globe, into one platform, providing the opportunity to work less hours, make more money, and take control of their future. By eliminating the issues that consistently plague our industry, we have the opportunity to build a company with the capacity to become one of the world’s leading hospitality organizations.</Text>
                            <Text style={styles.question}>What will my day-to-day look like?</Text>
                            <Text style={styles.answer}>As our company grows, each Culinary Professional will be responsible for all of his or her sales, along with development, procurement and production of all hospitality industry related projects within his or her region. Responsibilities include but are not limited to overseeing cooking and logistics operations, client management, hiring and managing an efficient staff, managing procurement and inventory, developing standardized menus and/or recipes, implementing policies and procedures, etc. The utmost importance for the chef must be placed upon the ability to creatively solve problems in a fluid environment. The right candidates will share our passion for high quality food and client experiences. As a Culinary Professional, you will have full access and transparency to company resources, documents, marketing, and finances along with tools to help you grow each of your revenue streams.</Text>
                            <Text style={styles.question}>How do I sign up and get started?</Text>
                            <Text style={styles.answer}>It’s easy to join! Send an email to {MailTo()} with “EPC Application” in the subject line. Attach resume, portfolio, head shot, biography, social media tags, and/or any other pertinent information you would like us to see. We are excited to meet you! </Text>
                        </View>
                        <View style={globalStyles.reset}>
                            <Text style={[globalStyles.h1, { marginBottom: 20 }]}>Financial Questions</Text>
                            <Text style={styles.question}>Where do my clients come from?</Text>
                            <Text style={styles.answer}>We use an array of lead generation techniques including, but not limited to: SEO, Current Client Base Reach Outs, Digital Mailers, Online Profiles, Mobile Apps, etc.</Text>
                            <Text style={styles.question}>How is this different from the other lead generators and websites I already use?</Text>
                            <Text style={styles.answer}>Current lead generators charge you a percentage of your contracted work and leave you to figure out how to run and grow your business on your own. Our platform offers tools and paths to improve your skills, certifications and business model, as well as the unique opportunity to schedule “pop-up” dinners and sell tickets. Don’t just wait for customers to find you, go out and grab them.</Text>
                            <Text style={styles.question}>How are prices for services set and/or negotiated?</Text>
                            <Text style={styles.answer}>As the chef, you set all of your own prices, along with your menus and your personal schedule. You have the ability to manage a calendar and sell tickets to events or a client can contact you privately and work with you on a custom event.</Text>
                            <Text style={styles.question}>How/when do I get compensated for an event?</Text>
                            <Text style={styles.answer}>Once booked, each client pays a 50% deposit to lock-in the event. The remaining 50% plus gratuity is paid on the day of the event.</Text>
                            <Text style={styles.question}>Can I accept additional gratuity for myself and my staff?</Text>
                            <Text style={styles.answer}>Of course! Extra gratuity is never mandatory because we charge our clients a service fee, but it is always appreciated by our Professionals.</Text>
                            <Text style={styles.question}>What is the benefit of joining EPC if I already have a successful business?</Text>
                            <Text style={styles.answer}>We love this question! Our platform was built by Chefs for Chefs. With that philosophy in mind, we are offering the tools for you to expand your opportunities beyond your current business model. Corporate clients, “pop-up” events and rebate programs for culinary ingredients/tools are just a few of the unique offerings available to you.</Text>
                            <Text style={styles.question}>What insurance do I need to have to become an EPC Culinary Professional?</Text>
                            <Text style={styles.answer}>Liability Insurance; contact {MailTo()} for further information and to be connected with our insurance provider.</Text>
                            <Text style={styles.question}>What Food Safety &  Sanitation certifications do I need?</Text>
                            <Text style={styles.answer}>The short answer is: It varies from state to state. EPC requires at minimum a Food Handler’s License, but a Food Manager’s License is preferred. For information in your state and county, please visit <Text style={globalStyles.textLinkText} onPress={() => gotoWebLink('https://www.servsafe.com/ss/regulatory/default.aspx')}>https://www.servsafe.com/ss/regulatory/default.aspx</Text>.</Text>
                        </View>
                        <View style={globalStyles.reset}>
                            <Text style={[globalStyles.h1, { marginBottom: 20 }]}>Marketing and Social Media Questions</Text>
                            <Text style={styles.question}>Who is responsible for Marketing?</Text>
                            <Text style={styles.answer}>EPC has an internal Branding and Marketing Team. We also encourage each Culinary Professional to market themselves as they see fit, staying within the parameters and strategy of the company. We are happy to provide consultation through our internal Branding and Marketing Team.</Text>
                            <Text style={styles.question}>Do I need my own Social Media accounts?</Text>
                            <Text style={styles.answer}>No, but it is highly encouraged for you to promote yourself and your creations!</Text>
                        </View>
                        <View style={globalStyles.reset}>
                            <Text style={[globalStyles.h1, { marginBottom: 20 }]}>Other Important Questions</Text>
                            <Text style={styles.question}>What tools and resources does EPC provide its Culinary Professionals?</Text>
                            <Text style={styles.answer}>Access to company documents, like pre-written menus and sample pricing; Full on-boarding process completed by EPC including sign-ups to lead generators; Grocery rebate program; Full support from EPC, etc.</Text>
                            <Text style={styles.question}>Do I have to use EPC’s menus or can I write my own?</Text>
                            <Text style={styles.answer}>We encourage you to write your own menus; you’re the chef, after all! We have thousands of menus at your disposal, accessible on our Google Drive/App as well as sample pricing to get you started.</Text>
                            <Text style={styles.question}>What equipment do I need to provide?</Text>
                            <Text style={styles.answer}>As a chef working in our clients’ homes, you will be utilizing your clients’ equipment (i.e. oven, stove)</Text>
                            <Text style={styles.question}>Can EPC help me find any servers or bartenders I may need?</Text>
                            <Text style={styles.answer}>Absolutely! We have tons of Hospitality Industry Professionals at our disposal to help you execute your unique chef experiences. We ask that you request staffing assistance at the time of booking to allow for adequate scheduling. Assistance will not be provided within one week of any event. </Text>
                            <Text style={styles.question}>What happens if I move to a different city?</Text>
                            <Text style={styles.answer}>Bon Voyage! With EPC, you can work from anywhere and on your own schedule. </Text>
                            <Text style={styles.question}>Do I offer a host space or have host space options?</Text>
                            <Text style={styles.answer}>You can certainly host events in your home or at someone else’s. If you are in need of a host space for the evening, we currently collaborate with various private venues. One of our team members will help secure the perfect fit for your event. The cost of the space rental various based on location, guest count and availability. Feel free to reach out to {MailTo()} and one of our team members will be happy to assist you.</Text>
                            <Text style={styles.question}>Can I accommodate allergies or dislikes?</Text>
                            <Text style={styles.answer}>EPC values dietary restrictions with the utmost care and attention to detail. This is one of the first questions that you will need to ask a client. Safety is of the utmost importance regarding our events.</Text>
                            <Text style={styles.question}>What if someone in my party has to cancel or does not show up?</Text>
                            <Text style={styles.answer}>While we do understand that extenuating circumstances happen, our policy is for the contract stated for the day of event to be final. Our chefs need an accurate number as soon as possible to prepare and provide service/cuisine for actual day of event. A full 48 hour notice would be necessary to make any changes day of events with deposits made. For events that have yet to finalize deposit this is necessary to give as accurate a quote as possible, and to allow chefs appropriate time to cook/shop/prepare your meals.</Text>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
        </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingBottom: 45,
        //fontFamily: Theme.FONT_STANDARD,
    },
    button_space: {
        width: '48%',
    },
    question: {
        textAlign: 'left',
        width: '100%',
        fontSize: 14,
        fontWeight: 'bold',
        color: Theme.SECONDARY_COLOR,
        paddingBottom: 7
    },
    answer: {
        fontSize: 13,
        width: '100%',
        color: Theme.PRIMARY_COLOR,
        marginBottom: 30
    },
    orderedList: {
    },
    orderedItem: {
        fontSize: 17,
        marginBottom: 15,
        marginLeft: 10,
    },
})
