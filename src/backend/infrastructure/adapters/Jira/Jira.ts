import {Issue} from "src/backend/domain/entities/Issue";
import {IssueTrackingSoftware} from "../../../application/ports/IssueTrackingSoftware";
import {JiraSDK} from "./JiraSDK";
import {JiraIssueShortDto, JiraIssuesShortDto} from "./JiraTypes";
import {JiraIntegrationMapper} from "./JiraIntegrationMapper";

export class Jira implements IssueTrackingSoftware {

    constructor(
        private readonly jiraSDK: JiraSDK,
        private readonly jiraIntegrationMapper: JiraIntegrationMapper
    ) {
    }

    public async searchIssues(issueKeys: ReadonlyArray<string>): Promise<ReadonlyArray<Issue>> {
        const jql = `key in (${issueKeys.map(k => "'" + k + "'").join(",")})`;

        const issueDtos = await this.jiraSDK.searchJQL<JiraIssuesShortDto>({jql, fields: ["key", "summary", "status"]});
        return issueDtos.issues.map(issueDto => this.jiraIntegrationMapper.mapToEntity(issueDto));
    }

    public async retrieveIssue(issueKey: string): Promise<Issue> {
        const issueDto = await this.jiraSDK.getIssue<JiraIssueShortDto>(issueKey, ["key", "summary", "status"]);
        return this.jiraIntegrationMapper.mapToEntity(issueDto);
    }

    public async closeIssue(issueKey: string): Promise<void> {
        const transitionsDto = await this.jiraSDK.getTransitions(issueKey);
        if (transitionsDto.transitions.length === 0) {
            console.warn(`No transitions found for Jira ticket ${issueKey}`);
            return;
        }

        const closingTransition = transitionsDto.transitions.find(tr => this.jiraIntegrationMapper.isTransitionClosed(tr.name));
        if (!closingTransition) {
            console.warn(`No closing transition found for Jira ticket ${issueKey}`);
            return;
        }

        return this.jiraSDK.doTransition(issueKey, {transition: {id: closingTransition.id}});
    }
}