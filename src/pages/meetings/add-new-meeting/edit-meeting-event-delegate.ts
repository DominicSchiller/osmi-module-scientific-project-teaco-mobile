import {CreateSuggestionEventDelegate} from "../add-new-suggestion/create-suggestion-event-delegate";
import {AddParticipantsEventDelegate} from "../add-participant/add-participants-event-delegate";

/**
 * Delegate interface which defines core functions for editing a
 * meeting.
 */
export interface EditMeetingEventDelegate extends
    CreateSuggestionEventDelegate, AddParticipantsEventDelegate {
}