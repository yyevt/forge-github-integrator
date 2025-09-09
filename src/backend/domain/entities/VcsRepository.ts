import {PullRequest, PullRequestSpec} from "./PullRequest";

export interface VcsRepositoryInfoSpec {
    readonly name: string;
    readonly url: string;
    readonly ownerLogin: string;
    readonly languages: ReadonlyArray<string>;
    readonly isMergeCommitAllowed: boolean;
    readonly isDisabled: boolean;
    readonly isArchived: boolean;
    readonly visibility: string;
    readonly createdAt: string;
    readonly pullRequestsTotalCount: number;
}

export class VcsRepositoryInfo {

    private readonly _name: string;
    private readonly _url: string;
    private readonly _ownerLogin: string;
    private readonly _languages: ReadonlyArray<string>;
    private readonly _isMergeCommitAllowed: boolean;
    private readonly _isDisabled: boolean;
    private readonly _isArchived: boolean;
    private readonly _visibility: string;
    private readonly _createdAt: string;
    private readonly _pullRequestsTotalCount: number;

    constructor(spec: VcsRepositoryInfoSpec) {
        this._name = spec.name;
        this._url = spec.url;
        this._ownerLogin = spec.ownerLogin;
        this._languages = spec.languages;
        this._isMergeCommitAllowed = spec.isMergeCommitAllowed;
        this._isDisabled = spec.isDisabled;
        this._isArchived = spec.isArchived;
        this._visibility = spec.visibility;
        this._createdAt = spec.createdAt;
        this._pullRequestsTotalCount = spec.pullRequestsTotalCount;
    }

    get name(): string {
        return this._name;
    }

    get url(): string {
        return this._url;
    }

    get ownerLogin(): string {
        return this._ownerLogin;
    }

    get languages(): ReadonlyArray<string> {
        return this._languages;
    }

    get isMergeCommitAllowed(): boolean {
        return this._isMergeCommitAllowed;
    }

    get isDisabled(): boolean {
        return this._isDisabled;
    }

    get isArchived(): boolean {
        return this._isArchived;
    }

    get visibility(): string {
        return this._visibility;
    }

    get createdAt(): string {
        return this._createdAt;
    }

    get pullRequestsTotalCount(): number {
        return this._pullRequestsTotalCount;
    }

}

export class VcsRepository {

    private readonly _info: VcsRepositoryInfo;
    private readonly _pullRequests: ReadonlyArray<PullRequest>;

    constructor(infoSpec: VcsRepositoryInfoSpec, pullsSpec: ReadonlyArray<PullRequestSpec>) {
        this._info = new VcsRepositoryInfo(infoSpec);
        this._pullRequests = pullsSpec.map(pr => new PullRequest(pr));
    }

    get info(): VcsRepositoryInfo {
        return this._info;
    }

    get pullRequests(): ReadonlyArray<PullRequest> {
        return this._pullRequests;
    }
}