import {Issue} from "src/backend/domain/entities/Issue";
import {IssueTrackingSoftware} from "../../../application/ports/IssueTrackingSoftware";
import {JiraSdk} from "./JiraSdk";
import {JiraIssueShortDto, JiraIssuesShortDto} from "./JiraTypes";
import {JiraIntegrationMapper} from "./JiraIntegrationMapper";

export class Jira implements IssueTrackingSoftware {

    constructor(
        private readonly jiraSdk: JiraSdk,
        private readonly jiraMapper: JiraIntegrationMapper
    ) {
    }

    public async searchIssues(issueKeys: ReadonlyArray<string>): Promise<ReadonlyArray<Issue>> {
        const jql = `key in (${issueKeys.map(k => "'" + k + "'").join(",")})`;

        const issueDtos = await this.jiraSdk.searchJQL<JiraIssuesShortDto>({jql, fields: ["key", "summary", "status"]});
        return issueDtos.issues.map(issueDto => this.jiraMapper.mapToEntity(issueDto));
    }

    public async retrieveIssue(issueKey: string): Promise<Issue> {
        const issueDto = await this.jiraSdk.getIssue<JiraIssueShortDto>(issueKey, ["key", "summary", "status"]);
        return this.jiraMapper.mapToEntity(issueDto);
    }

    public async closeIssue(issueKey: string): Promise<void> {
        const transitionsDto = await this.jiraSdk.getTransitions(issueKey);
        if (transitionsDto.transitions.length === 0) {
            console.warn(`No transitions found for Jira ticket ${issueKey}`);
            return;
        }

        const closingTransition = transitionsDto.transitions.find(tr => this.jiraMapper.isTransitionClosed(tr.name));
        if (!closingTransition) {
            console.warn(`No closing transition found for Jira ticket ${issueKey}`);
            return;
        }

        return this.jiraSdk.doTransition(issueKey, {transition: {id: closingTransition.id}});
    }
}