import { firebase } from "../config/config";
const { firestore } = firebase;
const db = firestore();

import { getEventTemplateById } from "./eventTemplates";

export default interface Chef {
	userRef?: string;
}

// CRUD Chefs in firestore
const createChef = async (chef, data): Promise<void> => {
	const chefCollection = db.collection("chefs");
	await chefCollection.add(data);
};

const getChef = async (chefID): Promise<any> => {
	const chefCollection = db.collection("chefs");
	const chef = await chefCollection.doc(chefID).get();
	return chef.data() as any;
};

const getChefs = async (): Promise<Chef[]> => {
	const chefCollection = db.collection("chefs");
	const chefs = await chefCollection.get();
	return chefs.docs.map((doc) => doc.data()) as Chef[];
};

const updateChef = async (chefID, data): Promise<void> => {
	const chef = await db.collection("chefs").doc(chefID).update(data);
	return chef;
};

const addEventTemplateToChef = async (chefId, image, event, courses, menuItems) => {
	db.collection("chefs")
		.doc(chefId)
		.collection("menus")
		.add({
			courses: courses,
			description: event.event.description,
			image: image,
			title: event.event.title,
		})
		.then(() => {
			console.log("Document successfully written!");
		})
		.catch((error) => {
			console.error("Error writing document: ", error);
		});
};

export { createChef, getChef, getChefs, updateChef, addEventTemplateToChef };



