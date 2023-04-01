export class User {
    constructor(
        public userName: string,
        public firstName: string,
        public lastName: string,
        public lastLogin: number,
        public password: string,
        public passwordHash: string,
        public locked: boolean
    ) {
        
    }
}