export class DrinkStatisticData {
    constructor(
        public drinkId: string,
        public name: string,
        public consumationCount: number,
        public bookingCount: number,
        public imageUrl: string,
        public imageSize: number
    ) {
        
    }
}