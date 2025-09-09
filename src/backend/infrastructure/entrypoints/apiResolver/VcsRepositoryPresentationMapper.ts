import {RepositoryPresentationDto} from "../../../../common/PresentationTypes";
import {IssueAwareVcsRepository} from "../../../domain/entities/IssueAwareVcsRepository";

export class VcsRepositoryPresentationMapper {

    public mapToPresentationDto(repository: IssueAwareVcsRepository): RepositoryPresentationDto {
        return {
            name: repository.info.name,
            url: repository.info.url,
            ownerLogin: repository.info.ownerLogin,
            languages: repository.info.languages,
            isMergeCommitAllowed: repository.info.isMergeCommitAllowed,
            isDisabled: repository.info.isDisabled,
            isArchived: repository.info.isArchived,
            visibility: repository.info.visibility,
            createdAt: repository.info.createdAt,
            pullRequestsTotalCount: repository.info.pullRequestsTotalCount,
            pullRequests: repository.pullRequests.map(pull => ({
                issueKey: pull.issue.issueKey,
                issueIsClosed: pull.issue.isClosed,
                number: pull.pullRequest.number,
                title: pull.pullRequest.title,
                url: pull.pullRequest.url,
                state: pull.pullRequest.state,
                isDraft: pull.pullRequest.isDraft,
                mergeable: pull.pullRequest.mergeable,
                merged: pull.pullRequest.merged,
                repoName: pull.pullRequest.repoName,
                repoIsDisabled: pull.pullRequest.repoIsDisabled,
                repoIsArchived: pull.pullRequest.repoIsArchived,
                authorLogin: pull.pullRequest.authorLogin
            }))
        };
    }
}