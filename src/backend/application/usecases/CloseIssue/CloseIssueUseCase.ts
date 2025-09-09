import {IssueTrackingSoftware} from "../../ports/IssueTrackingSoftware";
import {assertNonEmpty} from "../../../utils/StringUtils";
import {MergeEventsQueue} from "../../ports/MergeEventsQueue";
import {Issue} from "../../../domain/entities/Issue";

export class CloseIssueUseCase {

    private static readonly QUEUE_EVENT_DELAY_SECONDS = 10;

    constructor(
        private readonly issueTrackingSoftware: IssueTrackingSoftware,
        private readonly mergeEventsQueue: MergeEventsQueue
    ) {
    }

    public async execute(issueKey: string): Promise<void> {
        assertNonEmpty(issueKey, "issueKey is required");

        const issue = await this.retrieveIssue(issueKey);
        if (!issue) {
            return;
        }

        if (issue.isClosed) {
            throw new Error(`Issue ${issue.issueKey} is already closed`);
        }

        await this.issueTrackingSoftware.closeIssue(issue.issueKey);
    }

    private async retrieveIssue(issueKey: string): Promise<Issue | null> {
        try {
            return await this.issueTrackingSoftware.retrieveIssue(issueKey);
        } catch (e) {
            if (this.isTooManyRequestsError(e)) {
                console.warn(`Too many requests occurred, task execution is postponed for ${CloseIssueUseCase.QUEUE_EVENT_DELAY_SECONDS} seconds`);

                const {success, inProgress, failed} = await this.mergeEventsQueue.push({
                    body: {issueKey},
                    delaySeconds: CloseIssueUseCase.QUEUE_EVENT_DELAY_SECONDS
                });

                console.log(`Delayed merge event queue job status [success: ${success}, inProgress: ${inProgress}, failed: ${failed}]`);
                return null;
            }
            throw e;
        }
    }

    private isTooManyRequestsError(e: unknown) {
        return e instanceof Error && e.message.includes("Too many requests");
    }
}