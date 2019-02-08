import {Meeting} from "../models/meeting";
import {VoteDecision} from "../models/vote-decision";
import {MeetingProgress} from "../models/meeting-progress";

/**
 * Utility class for working with meeting data.
 */
export class MeetingUtils {
    /**
     * Recalculate the current meeting's status
     * @param meeting The meeting for which to recalculate the overall status
     */
    public static recalculateMeetingStatus(meeting: Meeting) {
        let pending = 0;
        let started = 0;
        let completed = 0;

        meeting.suggestions.forEach(suggestion => {
            let votedCount = 0;
            suggestion.votes.forEach(vote => {
                votedCount += vote.decision !== VoteDecision.dontKnow ? 1: 0;
            });
            switch(votedCount) {
                case 0:
                    pending += 1;
                    break;
                case meeting.participants.length:
                    completed += 1;
                    break;
                default:
                    started += 1;
                    break;
            }
        });

        let suggestionsCount = meeting.suggestions.length;
        let progress = new MeetingProgress();
        progress.pending = suggestionsCount == 0 ? 1: pending / suggestionsCount;
        progress.started = suggestionsCount == 0 ? 0: started / suggestionsCount;
        progress.completed = suggestionsCount == 0 ? 0: completed / suggestionsCount;
        meeting.progress = progress;
    }
}