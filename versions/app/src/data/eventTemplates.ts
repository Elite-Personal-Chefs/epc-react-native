// IMPORTS
import { firebase } from "../config/config";
const { firestore } = firebase;
const db = firestore();

// MODELS
import EventTemplate from "../models/eventTemplate";

const eventTemplateConverter = {
	toFirestore: (eventTemplate: EventTemplate): firebase.firestore.DocumentData => {
		// the id exists on the document, but not on the data;
		delete eventTemplate.id;
		return eventTemplate;
	},
	fromFirestore: (
		snapshot: firebase.firestore.QueryDocumentSnapshot,
		options: firebase.firestore.SnapshotOptions
	): EventTemplate => {
		const data = snapshot.data(options);
		return {
			...data,
			id: snapshot.id,
		};
	},
};

// CRUD Event Templates in firestore
const getEventTemplates = async (): Promise<EventTemplate[]> => {
	const templateEventCollection = db.collection("experience_templates");
	const templateEvents = await templateEventCollection.get();
	return templateEvents.docs.map((doc) => {
		if (!doc.exists) {
			console.log("No such document!");
			return;
		} else {
			//console.log("Document data:", doc.data());
			return { ...doc.data(), id: doc.id };
		}
	}) as EventTemplate[];
};

const getEventTemplateById = async (id: string): Promise<EventTemplate> => {
	const template = await db
		.collection("experience_templates")
		.withConverter(eventTemplateConverter)
		.doc(id)
		.get();

	return template.data() as EventTemplate;
};

export { getEventTemplates, getEventTemplateById };
