import { firebase } from "../config/config";
const { firestore } = firebase;
const db = firestore();

import Event from "../models/event";
import Reservation from "../models/reservation";
import User from "../models/user";

const eventConverter = {
	toFirestore: (event: Event): firebase.firestore.DocumentData => {
		// the id exists on the document, but not on the data;
		delete event.id;
		return event;
	},
	fromFirestore: (
		snapshot: firebase.firestore.QueryDocumentSnapshot,
		options: firebase.firestore.SnapshotOptions
	): Event => {
		const data = snapshot.data(options);
		return {
			...data,
			id: snapshot.id,
			start: data.start.toDate(),
			end: data.end.toDate(),
		};
	},
};

// CRUD Events in firestore
const createEvent = async (eventData: Event): Promise<Event> => {
	const eventCollection = db
		.collection("events")
		.withConverter(eventConverter);
	// eventData.menuId ??= null;

	const newEventSnap = await eventCollection.add(eventData);
	const newEvent = await newEventSnap.get();
	return newEvent.data as Event;
};

const getEventTemplates = async (): Promise<Event[]> => {
	const eventCollection = db.collection("experience_templates");
	const events = await eventCollection.get();
	return events.docs.map((doc) => doc.data()) as Event[];
};

const getEventById = async (eventId: string): Promise<Event> => {
	const eventCollection = db.collection("events");
	const event = await eventCollection
		.withConverter(eventConverter)
		.doc(eventId)
		.get();

	return event.data() as Event;
};

const getEventsByChefId = async (chefId: string): Promise<Event[]> => {
	const eventCollection = db
		.collection("events")
		.where("chefId", "==", chefId);
	const events = await eventCollection.get();

	const results = events.docs.map((doc) => {
		return { ...doc.data(), id: doc.id };
	}) as Event[];
	return results;
};

const getEvents = async ({
	start,
	end,
	published,
}: {
	start?: Date;
	end?: Date;
	published?: boolean;
}): Promise<Event[]> => {
	let eventCollection = firebase
		.firestore()
		.collection("events")
		.withConverter(eventConverter);

	if (start)
		eventCollection = eventCollection.where("end", ">=", start) as any;

	if (end) eventCollection = eventCollection.where("end", "<=", end) as any;

	if (published)
		eventCollection = eventCollection.where(
			"published",
			"==",
			published
		) as any;

	const events = await eventCollection.get();

	const results = events.docs.map((doc) => doc.data()) as Event[];
	console.debug("Events retrieved from firestore", results);
	return results;
};

const getPublishedEvents = async (): Promise<Event[]> => {
	const eventCollection = db.collection("events");
	const events = await eventCollection.where("published", "==", true).get();
	return events.docs.map((doc) => doc.data()) as Event[];
};

const updateEvent = async (eventId: string, data: Event): Promise<void> => {
	const event = await firebase
		.firestore()
		.collection("events")
		.doc(eventId)
		.update(data);
	return event;
};

const publishEvent = async (eventId: string): Promise<void> => {
	const event = await firebase
		.firestore()
		.collection("events")
		.doc(eventId)
		.update({ published: true });

	return event;
};

const unpublishEvent = async (eventId: string): Promise<void> => {
	const event = await firebase
		.firestore()
		.collection("events")
		.doc(eventId)
		.update({ published: false });

	return event;
};

const getEventReservations = async (
	eventId: string
): Promise<Reservation[]> => {
	console.log(eventId);
	const eventRef = db.collection("events").doc(eventId);
	const eventReservationsCollection = await eventRef
		.collection("reservations")
		.get();
	return eventReservationsCollection.docs.map((doc) =>
		doc.data()
	) as Reservation[];
};

const reserveEvent = async (
	eventId: string,
	userID: string,
	numOfGuests: number = 1
): Promise<void> => {
	//get the user, event, and reservations
	//TODO: Create global constants for collection names
	const userRef = db.collection("guests").doc(userID);
	const eventRef = db.collection("events").doc(eventId);
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
				profileImg: userData?.avatar?.url || "",
				email: userData.email,
			},
		};
		transaction.set(reservationRef, reservationData);

		// add a new reservation summary to the user
		if (!userData.reservationSummaries) userData.reservationSummaries = [];

		userData.reservationSummaries.push({
			eventTitle: eventData.title,
			eventLocation: eventData.location,
			chefName: eventData.chefName,
			eventStart: eventData.start,
			eventEnd: eventData.end,
			eventPhoto: eventData.photos ? eventData.photos[0] : "",
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
	getEvents,
	getEventById,
	getEventsByChefId,
	getEventTemplates,
	getPublishedEvents,
	getEventReservations,
	updateEvent,
	publishEvent,
	unpublishEvent,
	reserveEvent,
};
