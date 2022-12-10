import { firebase } from "../config/config";
const { firestore } = firebase;
const db = firestore();

import Event from "../models/event";
import Reservation from "../models/reservation";
import User from "../models/user";

// CRUD Events in firestore
const createEvent = async (data): Promise<void> => {
	const eventCollection = db.collection("experiences");
	await eventCollection.add(data);
};

const getEvent = async (eventID): Promise<Event> => {
	const eventCollection = db.collection("experiences");
	const event = await eventCollection.doc(eventID).get();
	return event.data() as Event;
};

const getEventsByChef = async (chefId): Promise<Event[]> => {
	const eventCollection = db.collection("experiences").where("chefId", "==", chefId) as any;
	const events = await eventCollection.get();

	const results = events.docs.map((doc) => doc.data()) as Event[];
	console.debug("Events retrieved from firestore", results);
	return results;
};

const getEvents = async (
	start?: Date,
	end?: Date,
	published?: boolean
): Promise<Event[]> => {
	console.debug("getEvents arguments", {start,end,published})
	let eventCollection = firebase.firestore().collection("experiences");

	if (start) eventCollection = eventCollection.where("end", ">=", start) as any;

	if (end) eventCollection = eventCollection.where("end", "<=", end) as any;

	if (published) eventCollection = eventCollection.where("published", "==", published) as any;

	const events = await eventCollection.get();

	const results = events.docs.map((doc) => doc.data()) as Event[];
	console.debug("Events retrieved from firestore", results);
	return results;
};

const getPublishedEvents = async (): Promise<Event[]> => {
	const eventCollection = db.collection("experiences");
	const events = await eventCollection.where("published", "==", true).get();
	return events.docs.map((doc) => doc.data()) as Event[];
};

const updateEvent = async (eventID, data): Promise<void> => {
	const event = await firebase
		.firestore()
		.collection("experiences")
		.doc(eventID)
		.update(data);
	return event;
};

const publishEvent = async (eventID): Promise<void> => {
	const event = await firebase
		.firestore()
		.collection("experiences")
		.doc(eventID)
		.update({ published: true });

	return event;
};

const unpublishEvent = async (eventID): Promise<void> => {
	const event = await firebase
		.firestore()
		.collection("experiences")
		.doc(eventID)
		.update({ published: false });

	return event;
};

const reserveEvent = async (
	eventId: string,
	userID: string,
	numOfGuests: number = 1
): Promise<void> => {
	//get the user, event, and reservations
	//TODO: Create global constants for collection names
	const userRef = db.collection("guests").doc(userID);
	const eventRef = db.collection("experiences").doc(eventId);
	const eventReservationsCollection = eventRef.collection("reservations");

	await db.runTransaction(async (transaction) => {
		const eventDoc = await transaction.get(eventRef);
		const userDoc = await transaction.get(userRef);

		const eventData = eventDoc.data() as Event;
		const userData = userDoc.data() as User;

		console.debug("Event Helper User", userData);
		console.debug("Event Helper Event", eventData);

		// create the new reservation document
		const reservationRef = eventReservationsCollection.doc();
		const reservationData: Reservation = {
			user: userRef.path,
			numOfGuests,
			userSummary: {
				name: userData.name,
				profileImg: userData.avatar.url || "",
				email: userData.email,
			},
		};
		transaction.set(reservationRef, reservationData);

		// add a new reservation summary to the user
		if (!userData.reservationSummaries) userData.reservationSummaries = [];

		userData.reservationSummaries.push({
			eventTitle: eventData.title,
			eventLocation: eventData.location,
			chefName: eventData.chefName || eventData.chef_name,
			eventStart: eventData.start,
			eventEnd: eventData.end,
			eventPhoto: eventData.photos[0],
			event: eventRef.path,
			reservation: eventReservationsCollection.doc().path,
		});

		transaction.update(userRef, {
			reservationSummaries: userData.reservationSummaries,
		});
	});
};

export {
	createEvent,
	getEvent,
	getEvents,
	getEventsByChef,
	getPublishedEvents,
	updateEvent,
	publishEvent,
	unpublishEvent,
	reserveEvent,
};
