import {PullRequestAction} from "../../../domain/entities/PullRequestAction";
import {IssueKeyExtractor} from "./IssueKeyExtractor";
import {MergeEventsQueue} from "../../ports/MergeEventsQueue";

export class NotifyPullRequestIsMergedUseCase {

    constructor(
        private readonly issueKeyExtractor: IssueKeyExtractor,
        private readonly mergeEventsQueue: MergeEventsQueue
    ) {
    }

    public async exec(pullAction: PullRequestAction): Promise<void> {
        const issueKey = this.extractIssueKey([pullAction.title, pullAction.head.label, pullAction.head.ref]);
        if (!issueKey) {
            console.warn(`No issue key found in merge: ${pullAction.number}`);
            return;
        }

        const {success, inProgress, failed} = await this.mergeEventsQueue.push({issueKey});
        console.log(`Queue job status [success: ${success}, inProgress: ${inProgress}, failed: ${failed}]`);
    }

    private extractIssueKey(issueKeySources: ReadonlyArray<string>): string | null {
        for (const keySource of issueKeySources) {
            const issueKey = this.issueKeyExtractor.extract(keySource);
            if (issueKey) {
                return issueKey;
            }
        }
        return null;
    }
}