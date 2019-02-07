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
     * Default Constructor
     */
    constructor() {
        this.title = "";
        this.location = "";
        this.participants = [];
        this.suggestions = [];
        this.progress = new MeetingProgress();
    }

    /**
     * Create a new meeting instance from given data object
     * @param data JSON data to parse all meeting's information from
     * @return Build meeting instance
     */
    public static of(data: any): Meeting {
        let meeting = new Meeting();

        meeting.id = data.id;
        meeting.initiatorId = data.initiatorId;
        meeting.title = data.title;
        meeting.createdAt = new Date(data.created_at);
        meeting.updatedAt = new Date(data.updated_at);
        meeting.isRestricted = data.restricted;
        meeting.isClosed = data.is_closed;
        meeting.isCancelled = data.is_cancelled != undefined ? data.is_cancelled : false;
        meeting.location = data.location != undefined ? data.location : "-";
        meeting.numberOfParticipants = data.numberOfParticipants;
        meeting.numberOfSuggestions = data.numberOfSuggestions;
        meeting.progress = MeetingProgress.of(data.progress);

        // parse participants
        if(data.participants != undefined) {
            data.participants.forEach( participantData => {
                meeting.participants.push(User.of(participantData));
            });
        }
        // parse suggestions
        if(data.suggestions != undefined) {
            data.suggestions.forEach( suggestionData => {
                meeting.suggestions.push(Suggestion.of(suggestionData));
            });
        }

        return meeting;
    }
}