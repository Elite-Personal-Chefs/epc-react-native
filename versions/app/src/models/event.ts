export default interface Event {
	id?:string;
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
	chefId?: string;
	menuId?: string;
}
