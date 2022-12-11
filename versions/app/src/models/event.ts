export default interface Event {
	title?: string;
	photos?: string[];
	description?: string;
	published?: boolean;
	location?: string;
	chefName?: string;
	cpp?: number;
	start?: Date;
	end?: Date;
	guestCapacity?: number;
	chef?: string;
	menuId?: string;
}
