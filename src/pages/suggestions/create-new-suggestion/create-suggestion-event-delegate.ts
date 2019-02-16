import {Suggestion} from "../../../models/suggestion";

/**
 * Delegate interface which defines callback functions
 * for created suggestions.
 */
export interface CreateSuggestionEventDelegate {
    /**
     * Callback function which will be called in case of
     * one suggestion must be added.
     * @param suggestion The Suggestion which to add
     */
    onSuggestionCreated(suggestion: Suggestion);
}