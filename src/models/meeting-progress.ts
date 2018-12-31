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
     * @param data The JSON date to parse
     */
    constructor(data: any) {
        this.pending = data ? data.pending : 0;
        this.started = data ? data.started : 0;
        this.completed = data ? data.completed : 0;
    }
}