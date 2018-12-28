/**
 * Model class representing a vote.
 */
export class Vote {
    /**
     * The vote's unique id
     */
    id: number;

    /**
     * Represents the id from the associated voter.
     */
    voter_id: number;

    /**
     * value representing the value chosen by the vote.
     */
    value: VoteDecision;

    /**
     * Constructor
     * @param data JSON data to parse vote information from
     */
    constructor(data: any) {
        this.id = data.id;
        this.voter_id = data.voter_id;
        this.value = (<any>VoteDecision)[data.value]; // tries to cast received string value to Decision enum
    }
}