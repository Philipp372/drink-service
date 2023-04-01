export class DrinksData {
    constructor(
        public drinkId: string,
        public name: string,
        public price: number,
        public imageUrl: string,
        public imageSize: number,
        public book: boolean
    ) {
        
    }
}