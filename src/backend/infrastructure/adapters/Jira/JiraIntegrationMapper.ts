import {JiraIssueShortDto} from "./JiraTypes";
import {Issue} from "../../../domain/entities/Issue";

export class JiraIntegrationMapper {

    private static readonly CLOSED_JIRA_TRANSITION_NAMES = ["closed", "done", "resolved"];

    public mapToEntity(issueDto: JiraIssueShortDto): Issue {
        const isClosed = this.isTransitionClosed(issueDto.fields.status.name)
            || this.isTransitionClosed(issueDto.fields.status.statusCategory.name);

        return new Issue({issueKey: issueDto.key, isClosed});
    }

    public isTransitionClosed(name: string | undefined | null): boolean {
        return !!name && name.trim().length > 0
            && JiraIntegrationMapper.CLOSED_JIRA_TRANSITION_NAMES.indexOf(name.toLowerCase()) !== -1;
    }
}