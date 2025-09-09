export interface PullRequestActionSpec {
    readonly action: string;
    readonly number: number;
    readonly title: string;
    readonly head: {
        readonly label: string;
        readonly ref: string;
    };
}

export class PullRequestAction {

    private readonly _action: string;
    private readonly _number: number;
    private readonly _title: string;
    private readonly _head: PullRequestActionHead;

    constructor(spec: PullRequestActionSpec) {
        this._action = spec.action;
        this._number = spec.number;
        this._title = spec.title;
        this._head = new PullRequestActionHead(spec.head.label, spec.head.ref);
    }

    get action(): string {
        return this._action;
    }

    get number(): number {
        return this._number;
    }

    get title(): string {
        return this._title;
    }

    get head(): PullRequestActionHead {
        return this._head;
    }
}

export class PullRequestActionHead {

    private readonly _label: string;
    private readonly _ref: string;

    constructor(label: string, ref: string) {
        this._label = label;
        this._ref = ref;
    }

    get label(): string {
        return this._label;
    }

    get ref(): string {
        return this._ref;
    }
}