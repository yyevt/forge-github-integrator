import {IssueKeyExtractor} from "../../../application/usecases/NotifyPullRequestIsMerged/IssueKeyExtractor";

export class JiraIssueKeyExtractor implements IssueKeyExtractor {

    private static readonly JIRA_ISSUE_REGEXP = /[a-z]+-[0-9]+/i;

    public extract(keySource: string): string | null {
        if (!keySource || keySource.trim().length === 0) {
            return null;
        }

        const matchArray = keySource.match(JiraIssueKeyExtractor.JIRA_ISSUE_REGEXP);
        return matchArray ? matchArray[0] : null;
    }
}