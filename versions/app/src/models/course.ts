import MenuItem from "./menuItem";
export default interface Course {
	id?: string;
	title?: string;
	description?: string;
	menuItems?: {
		order?: number;
		menuItem?: MenuItem;
	};
}
