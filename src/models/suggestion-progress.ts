/**
 * Model class representing a suggestions's progress state.
 */
export class SuggestionProgress {
    /**
     * The percentage of 'yes' votes
     */
    yes: number;
    /**
     * The percentage of 'no' votes
     */
    no: number;
    /**
     * The percentage of 'maybe' votes
     */
    maybe: number;
    /**
     * The percentage of 'unknown' votes
     */
    dontKnow: number;
}