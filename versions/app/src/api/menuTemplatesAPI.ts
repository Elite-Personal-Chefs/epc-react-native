// IMPORTS
import { firebase } from "../config/config";
const { firestore } = firebase;
const db = firestore();

import Menu from "../models/menu";
import Course from "../models/course";

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
const eventConverter = {
	toFirestore: (course: Course): firebase.firestore.DocumentData => {
		// the id exists on the document, but not on the data;
		delete course.id;
		return course;
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

const getMenuTemplates = async (): Promise<Menu[]> => {
	const menuTemplateCollection = db
		.collection("menu_templates")
		.withConverter(menuConverter);
	const menuTemplates = await menuTemplateCollection.get();
	return menuTemplates.docs.map((doc) => {
		if (!doc.exists) {
			console.log("No such document!");
			return;
		} else {
			return doc.data();
		}
	}) as Menu[];
};

const getMenuTemplatesById = async (id: string): Promise<Menu> => {
	const menuTemplateCollection = db
		.collection("menu_templates")
		.withConverter(menuConverter);
	try {
		const menuTemplate = await menuTemplateCollection.doc(id).get();

		if (!menuTemplate.exists) {
			console.log("No such document!");
			throw new Error("No such document!");
		}

		return menuTemplate.data() as Menu;
	} catch (error) {
		console.log("Error getting document", error);
		throw error;
	}
};

const getMenuTemplateCourses = async (
	menuId: string,
	courses: any
): Promise<Course> => {
	let menuItems = [];

	for (const course of courses) {
		let courseSnapshot = await db
			.collection("menu_templates")
			.doc(menuId)
			.collection(course)
			.get();

		//console.log(`what is courseSnapshot? ${JSON.stringify(courseSnapshot)}`);

		if (!courseSnapshot.empty) {
			let meals: any[] = []; // TODO: change to proper type

			courseSnapshot.forEach((doc) => {
				meals.push({ ...doc.data(), id: doc.id });
			});
			menuItems.push({
				course: course,
				menuTemplateId: menuId,
				meals: meals,
			});
		}
	}
	return menuItems as Course;
};

export { getMenuTemplates, getMenuTemplatesById, getMenuTemplateCourses };
