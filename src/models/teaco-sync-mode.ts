/**
 * Enumeration representing all possible data syncData modes
 * a page or service can deal with.
 */
export enum TeaCoSyncMode {
    /**
     * No data will be synced with TeaCo.
     * - Note: This means if new meetings, suggestions etc. will be created or edited,
     * all saved changes won't be synced with TeaCo and will be just handled locally.
     */
    noDataSync = 0,
    /**
     * Handled data will be synced with TeaCo.
     * - Note: This means if new meetings, suggestions etc. will be created or edited,
     * all saved changes will be synced with TeaCo immediately (if mobile data or wifi is on).
     */
    syncData = 1
}