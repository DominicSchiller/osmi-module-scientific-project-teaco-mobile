import {User} from "../../../models/user";

/**
 * Delegate interface which defines callback functions
 * for added participants.
 */
export interface AddParticipantsEventDelegate {
    /**
     * Callback function which will be called in case of
     * a list of participants must be added.
     * @param participants The list of participants which to add
     */
    onParticipantsAdded(participants: User[]);
}