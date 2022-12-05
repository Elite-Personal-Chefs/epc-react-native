export default interface User {
	id?: string;
	name?: string;
	firstName?: string;
	lastName?: string;
	profileImg?: string;
	email?: string;
	avatar?: {
		url?: string;
	};
	reservationSummaries?: {
		eventTitle?: string;
		chefName?: string;
		eventLocation?: string;
		eventStart?: Date;
		eventEnd?: Date;
		eventPhoto?: string;
		event?: string;
		reservation?: string;
	}[];
}
