import { firebase } from "../config/config";

export default interface Chef {
	userRef?: string;
}

// CRUD Chefs in firestore
const createChef = async (chef, data): Promise<void> => {
	const chefCollection = firebase.firestore().collection("chefs");
	await chefCollection.add(data);
}

const getChef = async (chefID): Promise<any> => {
	const chefCollection = firebase.firestore().collection("chefs");
	const chef = await chefCollection.doc(chefID).get();
	return chef.data() as any;
}

const getChefs = async (): Promise<Chef[]> => {
	const chefCollection = firebase.firestore().collection("chefs");
	const chefs = await chefCollection.get();
	return chefs.docs.map((doc) => doc.data()) as Chef[];
}

const updateChef = async (chefID, data): Promise<void> => {
	const chef = await firebase
		.firestore()
		.collection("chefs")
		.doc(chefID)
		.update(data);
	return chef;
}

export { createChef, getChef, getChefs, updateChef };



