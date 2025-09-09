import {Queue} from "@forge/events";
import {MergeEventsQueue, QueueJobStats} from "../../../application/ports/MergeEventsQueue";
import {assertNonEmpty} from "../../../utils/StringUtils";

export class ForgeMergeEventsQueueAdapter implements MergeEventsQueue {

    private readonly queue: Queue;

    constructor(queueKey: string) {
        assertNonEmpty(queueKey, "Queue key must be provided");

        this.queue = new Queue({key: queueKey});
    }

    public async push(event: Record<string, unknown>): Promise<QueueJobStats> {
        const pushResult = await this.queue.push({body: event});
        const stats = await this.queue.getJob(pushResult.jobId).getStats();

        return {
            success: stats.success,
            inProgress: stats.inProgress,
            failed: stats.failed
        };
    }
}