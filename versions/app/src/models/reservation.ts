export default interface Reservation {
	id?: string;
	user?: string;
	numOfGuests?: number;
	userSummary?: {
		name?: string;
		profileImg?: string;
		email?: string;
	};
}
