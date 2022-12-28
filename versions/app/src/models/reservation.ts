export default interface Reservation {
	id?: string;
	user?: string;
	numOfGuests?: number;
	createdAt?: Date;
	userSummary?: {
		name?: string;
		profileImg?: string;
		email?: string;
	};
}
