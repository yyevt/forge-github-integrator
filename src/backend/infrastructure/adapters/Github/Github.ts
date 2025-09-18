import {GithubRepositoriesIntegrationDto} from "./GithubTypes";
import {Limits, VersionControlPlatform} from "../../../application/ports/VersionControlPlatform";
import {VcsRepository} from "../../../domain/entities/VcsRepository";
import {GithubSdk} from "./GithubSdk";
import {GithubIntegrationMapper} from "./GithubIntegrationMapper";

export class Github implements VersionControlPlatform {

    private static readonly GITHUB_ACCESS_TOKEN_REGEX = /^(gh[pousr]_[a-zA-Z0-9]{36,255})$/;

    private static readonly GET_REPOS_WITH_PRS_QL = `
    {
      repositoryOwner(login: "%login%") {
        repositories(first: %reposLimit%) {
          nodes {
            name
            url
            owner {
              login
            }
            languages(first: %languagesLimit%) {
              nodes {
                name
              }
            } 
            mergeCommitAllowed
            isDisabled
            isArchived
            visibility
            createdAt
            pullRequests(states: [%pullsStates%], first: %pullsLimit%, orderBy: {field: CREATED_AT, direction: DESC }) {
              totalCount
              nodes {
                number
                title
                url
                state
                isDraft
                mergeable
                merged
                author {
                  login
                }
              }
            }
          }
        }
      }
    }`;

    constructor(
        private readonly githubSdk: GithubSdk,
        private readonly githubMapper: GithubIntegrationMapper
    ) {
    }

    public async validateAccessToken(accessToken: string): Promise<void> {
        if (accessToken.trim().length === 0 || !Github.GITHUB_ACCESS_TOKEN_REGEX.test(accessToken)) {
            throw new Error("Github access token has incorrect format");
        }

        await this.githubSdk.getTheAuthenticatedUser(accessToken);
    }

    public async getRepositories(accessToken: string, pullsStates: ReadonlyArray<string>, limits: Limits): Promise<ReadonlyArray<VcsRepository>> {
        const user = await this.githubSdk.getTheAuthenticatedUser(accessToken);

        const query = Github.GET_REPOS_WITH_PRS_QL
            .replace("%login%", user.login)
            .replace("%reposLimit%", String(limits.repos))
            .replace("%languagesLimit%", String(limits.languages))
            .replace("%pullsLimit%", String(limits.pulls))
            .replace("%pullsStates%", pullsStates.join(","));

        const dto = await this.githubSdk.graphQL<GithubRepositoriesIntegrationDto>(accessToken, {query});
        return this.githubMapper.mapToEntity(dto);
    }

    public async approvePull(accessToken: string, repo: string, pullNumber: number): Promise<void> {
        const user = await this.githubSdk.getTheAuthenticatedUser(accessToken);

        const reviewBody = {
            event: "APPROVE",
            body: "Approved with Forge-Github integration"
        };

        return this.githubSdk.createReviewForPullRequest(accessToken, user.login, repo, pullNumber, reviewBody);
    }

    public async mergePull(accessToken: string, repo: string, pullNumber: number): Promise<void> {
        const user = await this.githubSdk.getTheAuthenticatedUser(accessToken);

        return this.githubSdk.mergePullRequest(accessToken, user.login, repo, pullNumber);
    }
}