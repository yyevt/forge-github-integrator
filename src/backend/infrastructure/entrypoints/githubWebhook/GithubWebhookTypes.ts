export interface GithubWebhookPullMetadata {
    readonly action: string;
    readonly number: number;
    readonly pull_request: GithubWebhookPullRequest;
}

export interface GithubWebhookPullRequest {
    readonly id: number;
    readonly url: string;
    readonly number: number;
    readonly state: string;
    readonly locked: boolean;
    readonly title: string;
    readonly user: GithubOwner;
    readonly created_at: string;
    readonly updated_at: string;
    readonly closed_at: string;
    readonly merged: boolean;
    readonly merged_at: string;
    readonly merge_commit_sha: string;
    readonly draft: boolean;
    readonly head: GithubWebhookPullRequestHead;
}

export interface GithubWebhookPullRequestHead {
    readonly label: string;
    readonly ref: string;
    readonly sha: string;
    readonly user: GithubOwner;
    readonly repo: {
        readonly id: number;
        readonly name: string;
        readonly full_name: string;
        readonly private: boolean;
        readonly owner: GithubOwner;
    }
}

export interface GithubOwner {
    readonly id: number;
    readonly login: string;
    readonly type: string;
    readonly site_admin: boolean;
}