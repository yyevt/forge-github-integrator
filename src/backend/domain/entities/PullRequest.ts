export interface PullRequestSpec {
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

export class PullRequest {

    private readonly _number: number;
    private readonly _title: string;
    private readonly _url: string;
    private readonly _state: string;
    private readonly _isDraft: boolean;
    private readonly _mergeable: string;
    private readonly _merged: boolean;
    private readonly _repoName: string;
    private readonly _repoIsDisabled: boolean;
    private readonly _repoIsArchived: boolean;
    private readonly _authorLogin: string;

    constructor(spec: PullRequestSpec) {
      this._number = spec.number;
      this._title = spec.title;
      this._url = spec.url;
      this._state = spec.state;
      this._isDraft = spec.isDraft;
      this._mergeable = spec.mergeable;
      this._merged = spec.merged;
      this._repoName = spec.repoName;
      this._repoIsDisabled = spec.repoIsDisabled;
      this._repoIsArchived = spec.repoIsArchived;
      this._authorLogin = spec.authorLogin;
    }

    get number(): number {
        return this._number;
    }

    get title(): string {
        return this._title;
    }

    get url(): string {
        return this._url;
    }

    get state(): string {
        return this._state;
    }

    get isDraft(): boolean {
        return this._isDraft;
    }

    get mergeable(): string {
        return this._mergeable;
    }

    get merged(): boolean {
        return this._merged;
    }

    get repoName(): string {
        return this._repoName;
    }

    get repoIsDisabled(): boolean {
        return this._repoIsDisabled;
    }

    get repoIsArchived(): boolean {
        return this._repoIsArchived;
    }

    get authorLogin(): string {
        return this._authorLogin;
    }
}
