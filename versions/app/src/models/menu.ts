import Course from "./course";

export default interface Menu {
	id?: string;
	title?: string;
	description?: string;
	photos?: string[];
	courses?: {
		order: number;
		course: Course;
	}[];
}
