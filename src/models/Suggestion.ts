import {Vote} from "./Vote";


/**
 * Model class representing a suggestion.
 */
export class Suggestion {

    /**
     * Id representing the suggestion.
     */
    id: number;

    /**
     * Initator_id representing the creator of the suggestion.
     */
    initiator_id: number; // seems to matter for deletion

    /**
     * Title of the suggestion.
     */
    title: string;

    /**
     * The votes cast.
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

        this.votes = [];
        data.participants.forEach(voteData => {
            this.votes.push(new Vote(voteData))
        });
    }
}