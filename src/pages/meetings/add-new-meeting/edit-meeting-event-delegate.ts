import {User} from "../../../models/user";
import {Suggestion} from "../../../models/suggestion";

/**
 * Delegate interface which defines core functions for editing a
 * meeting.
 */
export interface EditMeetingEventDelegate {
    /**
     * Callback function which will be called in case of
     * a list of participants must be added.
     * @param participants The list of participants which to add
     */
    onAddParticipants(participants: User[]);

    /**
     * Callback function which will be called in case of
     * one suggestion must be added.
     * @param suggestion The Suggestion which to add
     */
    onAddSuggestion(suggestion: Suggestion);
}