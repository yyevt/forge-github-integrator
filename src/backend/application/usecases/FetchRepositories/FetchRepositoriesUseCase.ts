import {VersionControlPlatform} from "../../ports/VersionControlPlatform";
import {assertNonEmpty} from "../../../utils/StringUtils";
import {AccessTokenStorage} from "../../ports/AccessTokenStorage";
import {VcsRepository} from "../../../domain/entities/VcsRepository";
import {IssueTrackingSoftware} from "../../ports/IssueTrackingSoftware";
import {IssueKeyExtractor} from "../NotifyPullRequestIsMerged/IssueKeyExtractor";
import {Issue} from "../../../domain/entities/Issue";
import {IssueAwareVcsRepository} from "../../../domain/entities/IssueAwareVcsRepository";
import {IssueAwarePullRequest} from "../../../domain/entities/IssueAwarePullRequest";

const FETCH_REPOS_LIMIT = Number(process.env.FETCH_REPOS_LIMIT) || 100;
const FETCH_LANGUAGES_LIMIT = Number(process.env.FETCH_LANGUAGES_LIMIT) || 100;
const FETCH_PULLS_LIMIT = Number(process.env.FETCH_PULLS_LIMIT) || 100;

export class FetchRepositoriesUseCase {

    private static readonly LIMITS = {
        repos: FETCH_REPOS_LIMIT,
        languages: FETCH_LANGUAGES_LIMIT,
        pulls: FETCH_PULLS_LIMIT
    };

    constructor(
        private readonly accessTokenStorage: AccessTokenStorage,
        private readonly versionControlPlatform: VersionControlPlatform,
        private readonly issueKeyExtractor: IssueKeyExtractor,
        private readonly issueTrackingSoftware: IssueTrackingSoftware
    ) {
    }

    public async exec(accountId: string): Promise<ReadonlyArray<IssueAwareVcsRepository>> {
        assertNonEmpty(accountId, "accountId is required");

        const accessToken = await this.accessTokenStorage.get(accountId);
        assertNonEmpty(accessToken, "Access token not found");

        const repositories = await this.versionControlPlatform.getRepositories(<string>accessToken, ["OPEN"], FetchRepositoriesUseCase.LIMITS);

        const issuesByPullNumber = this.mapIssuesByPullNumber(repositories);
        const existingIssues = issuesByPullNumber.size ? await this.issueTrackingSoftware.searchIssues([...issuesByPullNumber.values()]) : [];

        return this.filterPullsWithIssuesOnly(repositories, issuesByPullNumber, existingIssues);
    }

    private mapIssuesByPullNumber(repositories: ReadonlyArray<VcsRepository>): Map<number, string> {
        const map = new Map<number, string>();
        for (const repository of repositories) {
            for (const pull of repository.pullRequests) {
                const issueKey = this.issueKeyExtractor.extract(pull.title);
                if (issueKey) {
                    map.set(pull.number, issueKey);
                }
            }
        }
        return map;
    }

    private filterPullsWithIssuesOnly(repositories: ReadonlyArray<VcsRepository>, issuesByPullNumber: Map<number, string>, existingIssues: ReadonlyArray<Issue>): ReadonlyArray<IssueAwareVcsRepository> {
        const issuesByKey = new Map(
            existingIssues.map(issue => [issue.issueKey, issue])
        );

        const existingIssuesByPullNumber = new Map<number, Issue>();
        for (const [pullNumber, issueKey] of issuesByPullNumber) {
            const issue = issuesByKey.get(issueKey);
            if (issue) {
                existingIssuesByPullNumber.set(pullNumber, issue);
            }
        }

        return repositories
            .map(repo => new IssueAwareVcsRepository(
                repo.info,
                repo.pullRequests
                    .filter(pull => existingIssuesByPullNumber.has(pull.number))
                    .map(pull => {
                        const issue = existingIssuesByPullNumber.get(pull.number)!;
                        return new IssueAwarePullRequest(pull, new Issue(issue));
                    })
            ));
    }
}