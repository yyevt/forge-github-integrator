import {Issue} from "../../domain/entities/Issue";

export interface IssueTrackingSoftware {

    searchIssues(issueKeys: ReadonlyArray<string>): Promise<ReadonlyArray<Issue>>;

    retrieveIssue(issueKey: string): Promise<Issue>;

    closeIssue(issueNumber: string): Promise<void>;

}