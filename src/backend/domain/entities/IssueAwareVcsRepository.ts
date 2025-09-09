import {IssueAwarePullRequest} from "./IssueAwarePullRequest";
import {VcsRepositoryInfo} from "./VcsRepository";

export class IssueAwareVcsRepository {

    private readonly _info: VcsRepositoryInfo;
    private readonly _pullRequests: ReadonlyArray<IssueAwarePullRequest>;

    constructor(info: VcsRepositoryInfo, pullRequests: ReadonlyArray<IssueAwarePullRequest>) {
        this._info = info;
        this._pullRequests = pullRequests;
    }

    get info(): VcsRepositoryInfo {
        return this._info;
    }

    get pullRequests(): ReadonlyArray<IssueAwarePullRequest> {
        return this._pullRequests;
    }
}