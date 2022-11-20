export default interface Menu {
	title?: string;
	description?: string;
	photos: string[];
	courses?: {
		order: number;
		course: Course;
	}[];
}

// TODO: Separate this into a separate file?
interface Course {
	title?: string;
	description?: string;
	menuItems?: {
		order: number;
		menuItem: MenuItem;
	};
}

// TODO: Separate this into a separate file?
interface MenuItem {
	title?: string;
	description?: string;
	order?: number;
}