export default interface Course {
	title?: string;
	description?: string;
	menuItems?: {
		order: number;
		menuItem: MenuItem;
	};
}
