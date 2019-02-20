/**
 * Model class representing a meeting's progress state.
 */
export class MeetingProgress {
    /**
     * The percentage of pending suggestions
     */
    pending: number;
    /**
     * The percentage of 'started voting' suggestions
     */
    started: number;
    /**
     * The percentage of 'completed voting' suggestions
     */
    completed: number;

    /**
     * Constructor
     */
    constructor() {
        this.pending = 0;
        this.started = 0;
        this.completed = 0;
    }

    /**
     * Get a new MeetingProgress instance from given data.
     * @param data The JSON date to parse
     * @return Build MeetingProgress instance
     */
    public static of(data: any): MeetingProgress {
        let meetingProgress = new MeetingProgress();
        meetingProgress.pending = data ? data.pending : 0;
        meetingProgress.started = data ? data.started : 0;
        meetingProgress.completed = data ? data.completed : 0;
        return meetingProgress;
    }
}