/**
 * Model class representing a meeting.
 */
import {User} from "./user";
import {Suggestion} from "./suggestion";
import {MeetingProgress} from "./meeting-progress";


export class Meeting {

    /**
     * Id representing the meeting.
     */
    id: number;

    /**
     * The ID from the creator of this meeting.
     */
    initiatorId: number;

    /**
     * Title of the meeting.
     */
    title: string;

    /**
     * Date the meeting was created.
     */
    createdAt: Date;

    /**
     * Date the meeting was last updated.
     */
    updatedAt: Date;

    /**
     * Whether the meeting is restricted.
     */
    isRestricted: boolean;

    /**
     * Status whether this meeting is closed or not
     */
    isClosed: boolean;

    /**
     * Status whether this meeting has been cancelled while closing
     */
    isCancelled: boolean;

    /**
     * The number of participants associated with this meeting
     */
    numberOfParticipants: number;
    /**
     * The number of suggestions associated with this meeting
     */
    numberOfSuggestions: number;
    /**
     * The overall meeting progress
     */
    progress: MeetingProgress;
    /**
     * The meeting's final location
     */
    location: string;
    /**
     * List of associated participants
     */
    participants: User[];
    /**
     * List of associated suggestions
     */
    suggestions: Suggestion[];

    /**
     * Constructor
     * @param data JSON data to parse all meeting's information from
     */
    constructor(data: any) {
        this.id = data.id;
        this.initiatorId = data.initiatorId;
        this.title = data.title;
        this.createdAt = new Date(data.created_at);
        this.updatedAt = new Date(data.updated_at);
        this.isRestricted = data.restricted;
        this.isClosed = data.is_closed;
        this.isCancelled = data.is_cancelled != undefined ? data.is_cancelled : false;
        this.location = data.location != undefined ? data.location : "-";
        this.numberOfParticipants = data.numberOfParticipants;
        this.numberOfSuggestions = data.numberOfSuggestions;
        this.progress = new MeetingProgress(data.progress);

        // parse participants
        this.participants = [];
        if(data.participants != undefined) {
            data.participants.forEach( participantData => {
               this.participants.push(new User(participantData));
            });
        }
        // parse suggestions
        this.suggestions = [];
        if(data.suggestions != undefined) {
            data.suggestions.forEach( suggestionData => {
               this.suggestions.push(new Suggestion(suggestionData));
            });
        }
    }

}