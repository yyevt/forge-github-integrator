import {Queue} from "@forge/events";
import {MergeEventsQueue, QueueJobStats} from "../../../application/ports/MergeEventsQueue";

export class ForgeMergeEventsQueueAdapter implements MergeEventsQueue {

    private static readonly QUEUE = new Queue({key: "merge-events-queue"});

    public async push(event: Record<string, unknown>): Promise<QueueJobStats> {
        const pushResult = await ForgeMergeEventsQueueAdapter.QUEUE.push({body: event});
        const stats = await ForgeMergeEventsQueueAdapter.QUEUE.getJob(pushResult.jobId).getStats();

        return {
            success: stats.success,
            inProgress: stats.inProgress,
            failed: stats.failed
        };
    }
}