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
			//console.log("Document data:", doc.data());
			return { ...menuTemplate.data(), id: menuTemplate.id } as Menu;
		}
	} catch (error) {
		console.log("Error getting document", error);
	}
};

const getMenuTemplateCourses = async (menuId: string, courses: any): Promise<Course> => {
	let menuItems = [];

	for (const course of courses) {
		let courseSnapshot = await db.collection("menu_templates").doc(menuId).collection(course).get();

		if (!courseSnapshot.empty) {
			let meals = [];

			courseSnapshot.forEach((doc) => {
				meals.push({ ...doc.data(), id: doc.id });
			});
			menuItems.push({ course: course, meals: meals });
		}
	}

	return menuItems as Course;
	console.log(`\n\nmenuItems ${JSON.stringify(menuItems)}\n\n`);
};

// const getMenuTemplateCourses = async (menuId: string, course: any): Promise<Course> => {
// 	const menuTemplateCollection = db.collection("menu_templates");

// 	try {
// 		const courseCollection = await menuTemplateCollection.doc(menuId).collection("courses").doc(course.id).get();
// 	}

// const getMenuTemplateCourses = async (id: string): Promise<Course> => {
//   const menuTemplateCollection = db.collection("menu_templates");
//   const menuTemplate = await menuTemplateCollection
//     .doc(id)
//     .get()
//     .then((doc) => {
//       if (!doc.exists) {
//         console.log("No such document!");
//         return -1;
//       } else {
//         let courses = doc.data().courses;
//         console.log("Document data:", courses);

//         console.log("Document data:", doc.data());
//       }
//     })
//     .catch((err) => {
//       console.log("Error getting document", err);
//       Alert.alert("Tried to get a template doc that doesn't exist!", err.message, [{ text: "OK" }]);
//     });
//   return { ...menuTemplate.data(), id: menuTemplate.id } as Menu;
// };

const getMenusByChefId = async (chefId: string): Promise<Menu[]> => {
	const menuCollection = db.collection("menus").where("chefId", "==", chefId);
	const menus = await menuCollection.get();
	return menus.docs.map((doc) => {
		return { ...doc.data(), id: doc.id };
	}) as Menu[];
};

const getMenus = async (start?: Date, end?: Date, published?: boolean): Promise<Menu[]> => {
	console.debug("getMenus arguments", { start, end, published });
	let menuCollection = firebase.firestore().collection("menus");

	if (start) menuCollection = menuCollection.where("end", ">=", start) as any;

	if (end) menuCollection = menuCollection.where("end", "<=", end) as any;

	if (published) menuCollection = menuCollection.where("published", "==", published) as any;

	const menus = await menuCollection.get();

	const results = menus.docs.map((doc) => doc.data()) as Menu[];
	console.debug("Menus retrieved from firestore", results);
	return results;
};

const getPublishedMenus = async (): Promise<Menu[]> => {
	const menuCollection = db.collection("menus");
	const menus = await menuCollection.where("published", "==", true).get();
	return menus.docs.map((doc) => doc.data()) as Menu[];
};

const updateMenu = async (menuID, data): Promise<void> => {
	const menu = await firebase.firestore().collection("menus").doc(menuID).update(data);
	return menu;
};

const publishMenu = async (menuID): Promise<void> => {
	const menu = await firebase
		.firestore()
		.collection("menus")
		.doc(menuID)
		.update({ published: true });

	return menu;
};

const unpublishMenu = async (menuID): Promise<void> => {
	const menu = await firebase
		.firestore()
		.collection("menus")
		.doc(menuID)
		.update({ published: false });

	return menu;
};

export {
	getMenuTemplates,
	getMenuTemplatesById,
	getMenuTemplateCourses,
	getMenusByChefId,
	getMenus,
	getPublishedMenus,
	updateMenu,
	publishMenu,
	unpublishMenu,
};
