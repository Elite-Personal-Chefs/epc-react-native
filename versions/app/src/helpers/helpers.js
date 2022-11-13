/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React from "react";

//OTHER DEPENDENCIES
import { firebase, configKeys } from "../config/config";
import moment from "moment";
import * as WebBrowser from "expo-web-browser";
import * as DocumentPicker from "expo-document-picker";
import uuid from "uuid";


/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export const convertTimestamp = (dateObj) => {
	//depending on if its a snapshot or not, seconds can be returned with an "_" prepemded or not
	const seconds = dateObj._seconds ? dateObj._seconds : dateObj.seconds;
	const dateString = new Date(seconds * 1000).toLocaleDateString("en-US");
    
	return dateString;
};

export const getTimeDifference = (dateObj) => {
    //Figure out difference between timestamp and now
    const seconds = dateObj._seconds ? dateObj._seconds : dateObj.seconds;
    const dateString = new Date(seconds * 1000).toLocaleDateString("en-US");
	const now = moment();
	const eventTime = moment(dateString);
	const timeDiff = Math.abs(eventTime.diff(now, "days"));
	let timeDiffString;
	//If its less than 1 day (0 days), then get the hours
	if (timeDiff < 1) {
		timeDiffString = Math.abs(eventTime.diff(now, "hours")) + " hours ago";
	} else if (timeDiff == 1) {
		timeDiffString = "Yesterday";
	} else {
		timeDiffString = dateString;
	}

	return timeDiffString;
};

export const gotoWebLink = (link) => {
    return WebBrowser.openBrowserAsync(link)
}

export const mailto = (email = 'consultation@elitepersonalchefs.com', subject = 'EPC Application') => {
    Linking.openURL(`mailto:${email}?subject=${subject}`);
}

export const getEndpoint = (appsGlobalContext, endpoint) => {
	const apiMode = appsGlobalContext.apiMode;
	const apiBase = appsGlobalContext.configKeys[apiMode];
	return apiBase + endpoint;
};

/********************************/
//DOC UPLOADS
/********************************/
export const pickFile = async () => {
	let result = await DocumentPicker.getDocumentAsync({
		type: "*/*",
	});
	console.log(result);
	if (!result.cancelled) {
		return result.uri;
	}
};
export const uploadFile = async (uri) => {
	// Why are we using XMLHttpRequest? See:
	// https://github.com/expo/expo/issues/2402#issuecomment-443726662
	const blob = await new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			resolve(xhr.response);
		};
		xhr.onerror = function (e) {
			console.log(e);
			reject(new TypeError("Network request failed"));
		};
		xhr.responseType = "blob";
		xhr.open("GET", uri, true);
		xhr.send(null);
	});

	const ref = firebase.storage().ref().child(uuid.v4());
	const snapshot = await ref.put(blob);
	// We're done with the blob, close and release it
	blob.close();
	//Here is the URL from firebase
	const fileUrl = await snapshot.ref.getDownloadURL();
	console.log(fileUrl);
	return fileUrl;
};
