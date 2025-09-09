import {GithubRepositoriesIntegrationDto} from "./GithubTypes";
import {VcsRepository} from "../../../domain/entities/VcsRepository";

export class GithubIntegrationMapper {

    public mapToEntity(dto: GithubRepositoriesIntegrationDto): ReadonlyArray<VcsRepository> {
        return dto.data.repositoryOwner.repositories.nodes
            .map(repoNode => {
                const infoSpec = {
                    name: repoNode.name,
                    url: repoNode.url,
                    ownerLogin: repoNode.owner.login,
                    languages: repoNode.languages.nodes.map(node => node.name),
                    isMergeCommitAllowed: repoNode.mergeCommitAllowed,
                    isDisabled: repoNode.isDisabled,
                    isArchived: repoNode.isArchived,
                    visibility: repoNode.visibility,
                    createdAt: repoNode.createdAt,
                    pullRequestsTotalCount: repoNode.pullRequests.totalCount
                };

                const pullsSpec = repoNode.pullRequests.nodes.map(pullNode => ({
                    number: pullNode.number,
                    title: pullNode.title,
                    url: pullNode.url,
                    state: pullNode.state,
                    isDraft: pullNode.isDraft,
                    mergeable: pullNode.mergeable,
                    merged: pullNode.merged,
                    repoName: repoNode.name,
                    repoIsDisabled: repoNode.isDisabled,
                    repoIsArchived: repoNode.isArchived,
                    authorLogin: pullNode.author.login
                }));

                return new VcsRepository(infoSpec, pullsSpec);
            });
    }
}