export interface RepositoryPresentationDto {
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
    readonly pullRequests: ReadonlyArray<PullPresentationDto>;
}

export interface PullPresentationDto {
    readonly issueKey: string;
    readonly issueIsClosed: boolean;
    readonly number: number;
    readonly title: string;
    readonly url: string;
    readonly state: string;
    readonly isDraft: boolean;
    readonly mergeable: string;
    readonly merged: boolean;
    readonly repoName: string;
    readonly repoIsDisabled: boolean;
    readonly repoIsArchived: boolean;
    readonly authorLogin: string;
}