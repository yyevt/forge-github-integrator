export interface GithubUserIntegrationDto {
    readonly id: string;
    readonly login: string;
}

export interface GithubRepositoriesIntegrationDto {
    readonly data: {
        readonly repositoryOwner: {
            readonly repositories: {
                readonly nodes: ReadonlyArray<{
                    readonly name: string;
                    readonly url: string;
                    readonly owner: {
                        readonly login: string;
                    };
                    readonly languages: {
                        readonly nodes: ReadonlyArray<{
                            readonly name: string;
                        }>;
                    };
                    readonly mergeCommitAllowed: boolean;
                    readonly isDisabled: boolean;
                    readonly isArchived: boolean;
                    readonly visibility: "PUBLIC" | "PRIVATE";
                    readonly createdAt: string;
                    readonly pullRequests: {
                        readonly totalCount: number;
                        readonly nodes: ReadonlyArray<{
                            readonly number: number;
                            readonly title: string;
                            readonly url: string;
                            readonly state: string;
                            readonly isDraft: boolean;
                            readonly mergeable: string;
                            readonly merged: boolean;
                            readonly author: {
                                readonly login: string;
                            }
                        }>
                    }
                }>
            }
        }
    }
}