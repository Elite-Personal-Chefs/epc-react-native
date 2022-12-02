import { firebase } from "../config/config";
import Event from "../models/event";

// CRUD Events in firestore
const createEvent = async (chef, data): Promise<void> => {
	const eventCollection = firebase.firestore().collection("experiences");
	await eventCollection.add(data);
};

const getEvent = async (eventID): Promise<Event> => {
	const eventCollection = firebase.firestore().collection("experiences");
	const event = await eventCollection.doc(eventID).get();
	return event.data() as Event;
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
	const eventCollection = firebase.firestore().collection("experiences");
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

export {
	createEvent,
	getEvent,
	getEvents,
	getPublishedEvents,
	updateEvent,
	publishEvent,
	unpublishEvent,
};
