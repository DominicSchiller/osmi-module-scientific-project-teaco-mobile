
export class Vote {
    /**
     * Id representing the vote.
     */
    id: number;

    /**
     * voter_id representing the voter.
     */
    voter_id: number;

    /**
     * value representing the value chosen by the vote.
     */
    value: Decision;

    /**
     * Constructor
     * @param data JSON data to parse vote information
     */
    constructor(data: any) {
        this.id = data.id;
        this.voter_id = data.voter_id;
        this.value = (<any>Decision)[data.value]; // tries to cast received string value to Decision enum
    }
}

/**
 * An enum representing the possible values a vote can have.
 */
enum Decision {
    YES = "yes",
    MAYBE = "maybe",
    NO = "no",
    DONTKNOW = "?",
}