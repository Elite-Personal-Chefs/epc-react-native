import { firebase } from "../config/config";
const { firestore } = firebase;
const db = firestore();

import { getEventTemplateById } from "./eventTemplates";
import Menu from "../models/menu";

export default interface Chef {
	id?: string;
	userRef?: string;
}

const chefConverter = {
	toFirestore: (chef: Chef): firebase.firestore.DocumentData => {
		// the id exists on the document, but not on the data;
		delete chef.id;
		return chef;
	},
	fromFirestore: (
		snapshot: firebase.firestore.QueryDocumentSnapshot,
		options: firebase.firestore.SnapshotOptions
	): Event => {
		const data = snapshot.data(options);
		return {
			...data,
			id: snapshot.id,
		};
	},
};

const menuConverter = {
	toFirestore: (menu: Menu): firebase.firestore.DocumentData => {
		// the id exists on the document, but not on the data;
		delete menu.id;
		return menu;
	},
	fromFirestore: (
		snapshot: firebase.firestore.QueryDocumentSnapshot,
		options: firebase.firestore.SnapshotOptions
	): Menu => {
		const data = snapshot.data(options);
		return {
			...data,
			id: snapshot.id,
		};
	},
};

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
	const chefCollection = db.collection("chefs").withConverter(chefConverter);
	const chefs = await chefCollection.get();
	return chefs.docs.map((doc) => doc.data()) as Chef[];
};

const updateChef = async (chefID, data): Promise<void> => {
	const chef = await db.collection("chefs").doc(chefID).update(data);
	return chef;
};

const getChefMenus = async (chefID: string): Promise<any> => {
	const chefCollection = db.collection("chefs");
	const chef = await chefCollection.doc(chefID).get();
	const chefData = chef.data() as any;

	const menus = await chefCollection
		.doc(chefID)
		.collection("menus")
		.withConverter(menuConverter)
		.get();
	const menusData = menus.docs.map((doc) => doc.data()) as Menu[];
	return { chef: chefData, menus: menusData };
};

const addEventTemplateToChef = async (
	chefId: string,
	chefName: string,
	eventImage: string[],
	event: { event: any },
	courses: string[],
	menuItems: any[]
) => {
	//ADD MENU TEMPLATE TO CHEF
	const menuDoc = db.collection("chefs").doc(chefId).collection("menus").doc();

	await menuDoc.set({
		courses: courses,
		description: event.event.description,
		photos: [
			"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/meal-placeholder-600x335_v1_501x289.jpg?alt=media&token=c3d9645a-4483-4414-8403-28e8df8d665b",
		],
		title: event.event.title,
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
				});
		}
	}

	//ADD EVENT TEMPLATE TO EVENTS

	await db.collection("events").add({
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
	});
};

export { createChef, getChef, getChefs, updateChef, getChefMenus, addEventTemplateToChef };



