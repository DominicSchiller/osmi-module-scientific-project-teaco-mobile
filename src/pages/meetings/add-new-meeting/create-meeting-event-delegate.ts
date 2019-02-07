/**
 * Delegate interface which defines callback functions for creating or editing a
 * meeting.
 */
import {Meeting} from "../../../models/meeting";

export interface CreateMeetingEventDelegate {
    /**
     * Callback function which will be called in case of
     * a new created meeting.
     * @param meeting The created meeting
     */
    onMeetingCreated(meeting: Meeting);
}