import {CreateMeetingEventDelegate} from "../../add-new-meeting/create-meeting-event-delegate";
import {CreateSuggestionEventDelegate} from "../../add-new-suggestion/create-suggestion-event-delegate";
import {AddParticipantsEventDelegate} from "../../add-participant/add-participants-event-delegate";
import {MeetingProgress} from "../../../../models/meeting-progress";

/**
 * Delegate interface which defines callback functions
 * for editing meetings.
 */
export interface EditMeetingEventDelegate extends CreateMeetingEventDelegate, CreateSuggestionEventDelegate, AddParticipantsEventDelegate {
    /**
     * Callback function which will be called in case of
     * a suggestion has been deleted from a meeting.
     * @param meetingId The suggestions' associated meeting's id
     * @param suggestionId The deleted suggestions's id
     */
    onSuggestionDeleted(meetingId: number, suggestionId: number);
    /**
     * Callback function which will be called in case of
     * a meeting's overall progress has been changed.
     * @param meetingId The suggestions' associated meeting's id
     * @param progress The new meeting progress
     */
    onMeetingProgressChanged(meetingId: number, progress: MeetingProgress);
}