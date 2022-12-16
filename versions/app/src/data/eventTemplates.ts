// IMPORTS
import { Alert } from "react-native";
import { firebase } from "../config/config";
const { firestore } = firebase;
const db = firestore();

// MODELS
import EventTemplate from "../models/eventTemplate";

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
	const templateEventCollection = db.collection("experience_templates");
	const template = await templateEventCollection
		.doc(id)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				console.log("No such document!");
				return;
			} else {
				//console.log("Document data:", doc.data());
			}
		})
		.catch((err) => {
			console.log("Error getting document", err);
			Alert.alert("Tried to get a template doc that doesn't exist!", err.message, [{ text: "OK" }]);
		});
	return { ...template.data(), id: template.id } as EventTemplate;
};

export { getEventTemplates, getEventTemplateById };
