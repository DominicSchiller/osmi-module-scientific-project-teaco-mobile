/**
 * Class representing a meeting.
 */
export class Meeting {

    /**
     * Id representing the meeting.
     */
    id: number;

    /**
     * Initator_id representing the creator of the meeting.
     */
    initiator_id: number;

    /**
     * Title of the meeting.
     */
    title: string;

    /**
     * Date the meeting was created.
     */
    created_at: Date;


    /**
     * Date the meeting was last updated.
     */
    updated_at: Date;


    /**
     * Whether the meeting is restricted.
     */
    restricted: boolean;

    constructor(data: any) {
        this.id = data.id;
        this.initiator_id = data.initiator_id;
        this.title = data.title;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.restricted = data.restricted;
    }

}