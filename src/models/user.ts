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
     * Constructor
     * @param data JSON data to parse all information from
     */
    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.created_at = new Date(data.created_at);
        this.key = data.key !== undefined ? data.key : "";
    }
}