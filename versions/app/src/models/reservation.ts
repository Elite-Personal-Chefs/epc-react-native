export default interface Reservation {
	user?: string;
	numOfGuests?: number;
	userSummary?: {
		name?: string;
		profileImg?: string;
		email?: string;
	};
}
