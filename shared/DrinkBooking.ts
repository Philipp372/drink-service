export class DrinkBooking {
    constructor(
        public loggedInUserName: string, // user that was logged in on DrinkService
        public consumerUserName: string, // User that consumed drink
        public count: number,
        public drinkId: string,
        public timestamp: number
    ) {
        
    }
}