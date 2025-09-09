export interface JiraIssuesShortDto {
    readonly issues: ReadonlyArray<JiraIssueShortDto>;
}

export interface JiraIssueShortDto {
    readonly expand: string;
    readonly id: string;
    readonly key: string;
    readonly fields: {
        readonly summary: string;
        readonly status: {
            readonly name: string;
            readonly statusCategory: {
                readonly id: string;
                readonly key: string;
                readonly name: string;
            }
        }
    }
}

export interface JiraTransitionsDto {
    readonly transitions: ReadonlyArray<JiraTransitionDto>;
}

export interface JiraTransitionDto {
    readonly id: string;
    readonly name?: string;
    readonly to?: {
        readonly id?: string;
        readonly name?: string;
        readonly description?: string;
    }
}