export type QueueJobStats = {
    readonly success: number;
    readonly inProgress: number;
    readonly failed: number;
}

export interface MergeEventsQueue {

    push(event: Record<string, unknown>): Promise<QueueJobStats>;

}