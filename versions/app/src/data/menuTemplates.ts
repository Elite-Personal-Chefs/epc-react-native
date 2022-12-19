// IMPORTS
import { Alert } from "react-native";
import { firebase } from "../config/config";
const { firestore } = firebase;
const db = firestore();

import Menu from "../models/menu";
import Course from "../models/course";

const getMenuTemplates = async (): Promise<Menu[]> => {
	const menuTemplateCollection = db.collection("menu_templates");
	const menuTemplates = await menuTemplateCollection.get();
	return menuTemplates.docs.map((doc) => {
		if (!doc.exists) {
			console.log("No such document!");
			return;
		} else {
			//console.log("Document data:", doc.data());
			return { ...doc.data(), id: doc.id };
		}
	}) as Menu[];
};

const getMenuTemplatesById = async (id: string): Promise<Menu> => {
	const menuTemplateCollection = db.collection("menu_templates");
	try {
		const menuTemplate = await menuTemplateCollection.doc(id).get();

		if (!menuTemplate.exists) {
			console.log("No such document!");
			return;
		} else {
			// WHEN YOU USE THIS FUNCTION CALL, ADD THE FOLLOWING TO THE MENU MODEL:
			// photos: [
			// 	"https://firebasestorage.googleapis.com/v0/b/elite-ee4b7.appspot.com/o/meal-placeholder-600x335_v1_501x289.jpg?alt=media&token=c3d9645a-4483-4414-8403-28e8df8d665b",
			// ],

			return {
				...menuTemplate.data(),
				id: menuTemplate.id,
			} as Menu;
		}
	} catch (error) {
		console.log("Error getting document", error);
	}
};

const getMenuTemplateCourses = async (menuId: string, courses: any): Promise<Course> => {
	let menuItems = [];

	for (const course of courses) {
		let courseSnapshot = await db.collection("menu_templates").doc(menuId).collection(course).get();

		//console.log(`what is courseSnapshot? ${JSON.stringify(courseSnapshot)}`);

		if (!courseSnapshot.empty) {
			let meals = [];

			courseSnapshot.forEach((doc) => {
				meals.push({ ...doc.data(), id: doc.id });
			});
			menuItems.push({ course: course, menuTemplateId: menuId, meals: meals });
		}
	}
	return menuItems as Course;
};

export { getMenuTemplates, getMenuTemplatesById, getMenuTemplateCourses };
