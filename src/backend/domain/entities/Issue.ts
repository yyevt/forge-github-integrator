export interface IssueSpec {
    readonly issueKey: string;
    readonly isClosed: boolean;
}

export class Issue {

    private readonly _issueKey: string;
    private readonly _isClosed: boolean;

    constructor(spec: IssueSpec) {
        this._issueKey = spec.issueKey;
        this._isClosed = spec.isClosed;
    }

    get issueKey(): string {
        return this._issueKey;
    }

    get isClosed(): boolean {
        return this._isClosed;
    }
}

