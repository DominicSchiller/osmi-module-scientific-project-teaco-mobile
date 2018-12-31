import {Vote} from "./vote";
import {DateTimeHelper} from "../utils/date-time-helper";

/**
 * Model class representing a suggestion.
 */
export class Suggestion {

    /**
     * The suggestion's unique id
     */
    id: number;
    /**
     * The associated meeting's unique ID
     */
    meetingId: number;
    /**
     * The initiator's id representing the creator of the suggestion.
     */
    creatorId: number;
    /**
     * Status whether this suggestions has been picked as final date or not
     */
    isPicked: boolean;
    /**
     * The suggestion's date
     */
    date: Date;
    /**
     * The suggestion's starting time
     */
    startTime: Date;
    /**
     * The suggestion's ending time
     */
    endTime: Date;
    /**
     * Timestamp of creation
     */
    createdAt: Date;
    /**
     * Timestamp of last update
     */
    updatedAt: Date;
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
        this.meetingId = data.meeting_id;
        this.creatorId = data.creator_id;
        this.isPicked = data.picked;
        this.createdAt = new Date(data.created_at);
        this.updatedAt = new Date(data.updated_at);
        this.date = new Date(data.date);
        this.startTime = new Date(data.start);
        this.endTime = new Date(data.end);

        // parse votes
        this.votes = [];
        if(data.votes != undefined) {
            data.votes.forEach(voteData => {
                this.votes.push(new Vote(voteData))
            });
        }
    }
}