export class MeetingProgress {
    pending: number;
    started: number;
    completed: number;

    constructor(data: any) {
        this.pending = data ? data.pending : 0;
        this.started = data ? data.started : 0;
        this.completed = data ? data.completed : 0;
    }
}