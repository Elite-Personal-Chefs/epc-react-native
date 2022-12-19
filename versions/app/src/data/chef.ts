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

const addEventTemplateToChef = async (chefId, chefName, eventImage, event, courses, menuItems) => {
	//ADD MENU TEMPLATE TO CHEF
	const menuDoc = await db.collection("chefs").doc(chefId).collection("menus").doc();

	await menuDoc
		.set({
			courses: courses,
			description: event.event.description,
			photos: [
				"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/meal-placeholder-600x335_v1_501x289.jpg?alt=media&token=c3d9645a-4483-4414-8403-28e8df8d665b",
			],
			title: event.event.title,
		})
		.then(() => {
			//console.log("Document successfully written!");
		})
		.catch((error) => {
			console.error("Error writing document: ", error);
		});

	for (let i = 0; i < menuItems.length; i++) {
		for (let j = 0; j < menuItems[i].meals.length; j++) {
			await db
				.collection("chefs")
				.doc(chefId)
				.collection("menus")
				.doc(menuDoc.id)
				.collection(menuItems[i].course)
				.add({
					course: menuItems[i].course,
					description: menuItems[i].meals[j].description,
					order: menuItems[i].meals[j].order,
					title: menuItems[i].meals[j].title,
					type: menuItems[i].meals[j].type,
				})
				.then(() => {
					//console.log("Document successfully written!");
				})
				.catch((error) => {
					console.error("Error writing document: ", error);
				});
		}
	}

	//ADD EVENT TEMPLATE TO EVENTS

	await db
		.collection("events")
		.add({
			chefId: chefId,
			chefName: chefName,
			cpp: event.event.cpp,
			description: event.event.description,
			end: new Date(),
			eventTemplateId: event.event.id,
			isPublished: false,
			isEventTemplate: true,
			guestCapacity: 0,
			location: "",
			menuId: menuDoc.id,
			photos: eventImage,
			start: new Date(),
			title: event.event.title,
		})
		.then(() => {
			//console.log("Document successfully written!");
		})
		.catch((error) => {
			console.error("Error writing document: ", error);
		});
};

export { createChef, getChef, getChefs, updateChef, addEventTemplateToChef };



