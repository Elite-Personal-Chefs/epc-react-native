export default interface Reservation {
	user?: string;
	numOfPeople?: number;
	userSummary?: {
		name?: string;
		profileImg?: string;
		email?: string;
	};
}
