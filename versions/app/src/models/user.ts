export default interface User {
	id?: string;
	firstName?: string;
	lastName?: string;
	profileImg?: string;
	email?: string;
	reservationSummaries?: {
		eventTitle?: string;
		location?: string;
		start?: string;
		eventImg?: string;
		reservationRef?: string;
	}[];
}
