import React from "react";
import { getChef, getChefs } from "./chef";
import Event from "../models/event";
// import Event from "./event";

describe("Chef Data", () => {
	it("can get a chef's data", async () => {

		const chef = await getChef("A1sN3ZCLhPQsrdncRHe8wpfi3Gy1");
		// const chefData = await chef.data();
		const user = (await chef.userRef.get()).data();

		console.log("Chef", chef );
		console.log("User",  user);
		expect(chef).toBeTruthy();
		
	});
	// it("gets all chefs' data", async () => {

	// 	const chefs = await getChefs()
	// 	// const user = chef.userRef;

	// 	console.log("Chefs", chefs[0] );
	// 	// console.log("User", user );
	// 	expect(chefs).toBeTruthy();
		
	// });
});
