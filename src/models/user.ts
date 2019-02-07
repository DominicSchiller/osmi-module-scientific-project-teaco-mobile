/**
 * Model class representing a user.
 */
export class User {
    /**
     * The user's unique Id
     */
    id: number;
    /**
     * The personal TeaCo key
     * Note: This Key will be only set for the app's registered user
     */
    key: string;
    /**
     * The user's full name
     */
    name: string;
    /**
     * The user's email address
     */
    email: string;
    /**
     * The user's account creation date
     */
    created_at: Date;

    /**
     * Default Constructor
     */
    constructor() {
        this.id = -1;
        this.name = "";
        this.email = "";
        this.key = "";
        this.created_at = new Date();
    }

    /**
     * Create a new user instance from given data object
     * @param data JSON data to parse all user's information from
     * @return Build user instance
     */
    public static of(data: any): User {
        let user = new User();
        user.id = data.id;
        user.name = data.name;
        user.email = data.email;
        user.key = data.key;
        user.created_at = new Date(data.createdAt);
        return user;
    }
}