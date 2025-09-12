import { PullPresentationDto } from "../src/common/PresentationTypes";

export const OPEN_PULL: PullPresentationDto = {
    issueKey: "KAN-1",
    issueIsClosed: false,
    number: 42,
    title: "Add dark mode support",
    url: "https://github.com/org/repo/pull/42",
    state: "OPEN",
    isDraft: false,
    mergeable: "MERGEABLE",
    merged: false,
    repoName: "design-system",
    repoIsDisabled: false,
    repoIsArchived: false,
    authorLogin: "octocat",
};

export const CLOSED_MERGED_PULL: PullPresentationDto = {
    issueKey: "DEF-456",
    issueIsClosed: true,
    number: 17,
    title: "Fix typo in README",
    url: "https://github.com/org/repo/pull/17",
    state: "CLOSED",
    isDraft: false,
    mergeable: "UNKNOWN",
    merged: true,
    repoName: "design-system",
    repoIsDisabled: false,
    repoIsArchived: false,
    authorLogin: "hubot",
};