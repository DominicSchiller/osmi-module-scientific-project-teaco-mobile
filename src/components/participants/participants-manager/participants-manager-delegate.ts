import {User} from "../../../models/user";

/**
 * Delegate interface which defines callback functions
 * in relation to the the ParticipantsManager.
 */
export interface ParticipantsManagerDelegate {
    /**
     * Callback function which will be called in case of
     * a list of participants must be added.
     * @param participant The list of participants which to add
     */
    onParticipantAdded(participant: User);

    onParticipantRemoved(participant: User);
}