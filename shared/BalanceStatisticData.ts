export class BalanceStatisticData {
    constructor(
        public userName: string, // User that got balance
        public bookingCount: number, // How many bookings were done to increase balance
        public currentBalanceAmount: number,
        public overallBookingAmount: number,
        public numberOfDrinksConsumed: number
    ) {
        
    }
}