import {Vote} from "./vote";

/**
 * Model class representing a suggestion.
 */
export class Suggestion {

    /**
     * The suggestion's unique id
     */
    id: number;

    /**
     * The initiator's id representing the creator of the suggestion.
     */
    initiator_id: number;

    /**
     * Title of the suggestion.
     */
    title: string;

    /**
     * List of associated votes
     */
    votes: Vote[];

    /**
     * Constructor
     * @param data JSON data to parse suggestion information here
     */
    constructor(data: any) {
        this.id = data.id;
        this.initiator_id = data.initiator_id;
        this.title = data.title;

        // parse votes
        this.votes = [];
        if(data.votes != undefined) {
            data.votes.forEach(voteData => {
                this.votes.push(new Vote(voteData))
            });
        }

    }
}