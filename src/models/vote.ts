import {VoteDecision} from "./vote-decision";

/**
 * Model class representing a vote.
 */
export class Vote {
    /**
     * The vote's unique id
     */
    id: number;
    /**
     * The associated user's unique ID
     */
    voterId: number;
    /**
     * The associated suggestion's unique ID
     */
    suggestionId: number;
    /**
     * value representing the value chosen by the vote.
     */
    decision: VoteDecision;

    /**
     * The vote's creation date
     */
    createdAt: Date;
    /**
     * The vote's date of last update
     */
    updatedAt: Date;

    /**
     * Constructor
     * @param data JSON data to parse vote information from
     */
    constructor(data: any) {
        this.id = data.id;
        this.voterId = data.voter_id;
        this.suggestionId = data.suggestion_id;
        this.createdAt = new Date(data.created_at);
        this.updatedAt = new Date(data.updated_at);
        this.decision = Vote.parseDecision(data.decision);
    }

    /**
     * Parse a vote's decision from string to enum value
     * @param decisionKey The decision key to read the equivalent enum value for
     * @return the parsed vote decision
     */
    private static parseDecision(decisionKey: string): VoteDecision {
        let decision = VoteDecision[decisionKey];
        if(decision == undefined) {
            decision = VoteDecision.dontKnow
        }
        return decision;
    }
}