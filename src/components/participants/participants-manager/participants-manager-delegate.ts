import {User} from "../../../models/user";

/**
 * Delegate interface which defines callback functions
 * in relation to the the ParticipantsManager.
 */
export interface ParticipantsManagerDelegate {
    /**
     * Callback function which will be called in case of
     * a list of participants must be added.
     * @param participants The list of participants which to add
     */
    onParticipantsInvited(participants: User[]);

    onParticipantsUninvited(participants: User[]);

    onSendParticipantsUpdate();
}