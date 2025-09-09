import {PullRequest} from "./PullRequest";
import {Issue} from "./Issue";

export class IssueAwarePullRequest {

    private readonly _pullRequest: PullRequest;
    private readonly _issue: Issue;

    constructor(pullRequest: PullRequest, issue: Issue) {
        this._pullRequest = pullRequest;
        this._issue = issue;
    }

    get pullRequest(): PullRequest {
        return this._pullRequest;
    }

    get issue(): Issue {
        return this._issue;
    }
}