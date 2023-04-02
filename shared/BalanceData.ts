export class BalanceData {
    constructor(
        public userName: string, // User that got balance
        public bookedByUserName: string, // user that was logged in on DrinkService
        public amount: number,
        public timestamp: number
    ) {
        
    }
}