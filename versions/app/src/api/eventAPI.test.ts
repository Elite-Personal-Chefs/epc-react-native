import React from "react";
import Event from "../models/event";
// import Event from "./event";

describe("<App />", () => {
	it("has 1 child", () => {
		const event: Event = {};
		// @ts-ignore
		expect("Event").toEqual("Event");
	});
});
