import {CLOSED_MERGED_PULL, OPEN_PULL} from "./pulls";
import {RepositoryPresentationDto} from "../src/common/PresentationTypes";

export const ACTIVE_REPO: RepositoryPresentationDto = {
    name: "design-system",
    url: "https://github.com/org/design-system",
    ownerLogin: "org",
    languages: ["TypeScript", "CSS"],
    isMergeCommitAllowed: true,
    isDisabled: false,
    isArchived: false,
    visibility: "public",
    createdAt: "2023-05-01T12:00:00Z",
    pullRequestsTotalCount: 2,
    pullRequests: [OPEN_PULL, CLOSED_MERGED_PULL],
};

export const ARCHIVED_REPO: RepositoryPresentationDto = {
    name: "legacy-app",
    url: "https://github.com/org/legacy-app",
    ownerLogin: "org",
    languages: ["JavaScript"],
    isMergeCommitAllowed: false,
    isDisabled: true,
    isArchived: true,
    visibility: "private",
    createdAt: "2020-01-15T08:30:00Z",
    pullRequestsTotalCount: 0,
    pullRequests: [],
};