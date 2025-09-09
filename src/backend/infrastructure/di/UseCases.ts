import {ApprovePullRequestUseCase} from "../../application/usecases/ApprovePullRequest/ApprovePullRequestUseCase";
import {ForgeSecretStorage} from "../adapters/ForgeStore/ForgeSecretStorage";
import {Github} from "../adapters/Github/Github";
import {GithubApi} from "../adapters/Github/GithubApi";
import {GithubIntegrationMapper} from "../adapters/Github/GithubIntegrationMapper";
import {FetchRepositoriesUseCase} from "../../application/usecases/FetchRepositories/FetchRepositoriesUseCase";
import {JiraIssueKeyExtractor} from "../adapters/Jira/JiraIssueKeyExtractor";
import {Jira} from "../adapters/Jira/Jira";
import {JiraApi} from "../adapters/Jira/JiraApi";
import {JiraIntegrationMapper} from "../adapters/Jira/JiraIntegrationMapper";
import {MergePullRequestUseCase} from "../../application/usecases/MergePullRequest/MergePullRequestUseCase";
import {StoreAccessTokenUseCase} from "../../application/usecases/StoreAccessToken/StoreAccessTokenUseCase";
import {IssueAwareVcsRepository} from "../../domain/entities/IssueAwareVcsRepository";
import {NotifyPullRequestIsMergedUseCase} from "../../application/usecases/NotifyPullRequestIsMerged/NotifyPullRequestIsMergedUseCase";
import {ForgeMergeEventsQueueAdapter} from "../adapters/ForgeQueue/ForgeMergeEventsQueueAdapter";
import {PullRequestAction} from "../../domain/entities/PullRequestAction";
import {CloseIssueUseCase} from "../../application/usecases/CloseIssue/CloseIssueUseCase";

export class UseCases {

    public storeAccessToken(accountId: string, accessToken: string): Promise<void> {
        const storeUseCase = new StoreAccessTokenUseCase(
            new Github(new GithubApi(), new GithubIntegrationMapper()),
            new ForgeSecretStorage()
        );

        return storeUseCase.exec(accountId, accessToken);
    }

    public fetchRepositories(accountId: string): Promise<ReadonlyArray<IssueAwareVcsRepository>> {
        const fetchUseCase = new FetchRepositoriesUseCase(
            new ForgeSecretStorage(),
            new Github(new GithubApi(), new GithubIntegrationMapper()),
            new JiraIssueKeyExtractor(),
            new Jira(new JiraApi(), new JiraIntegrationMapper())
        );

        return fetchUseCase.exec(accountId);
    }

    public approvePull(accountId: string, repo: string, pullNumber: number): Promise<void> {
        const approveUseCase = new ApprovePullRequestUseCase(
            new ForgeSecretStorage(),
            new Github(new GithubApi(), new GithubIntegrationMapper())
        );

        return approveUseCase.exec(accountId, repo, pullNumber);
    }

    public mergePull(accountId: string, repo: string, pullNumber: number): Promise<void> {
        const mergeUseCase =  new MergePullRequestUseCase(new ForgeSecretStorage(), new Github(new GithubApi(), new GithubIntegrationMapper()));
        return mergeUseCase.exec(accountId, repo, pullNumber);
    }

    public notifyPullIsMerged(pullAction: PullRequestAction): Promise<void> {
        const notifyUseCase = new NotifyPullRequestIsMergedUseCase(new JiraIssueKeyExtractor(), new ForgeMergeEventsQueueAdapter());
        return notifyUseCase.exec(pullAction);
    }

    public closeIssue(issueKey: string): Promise<void> {
        const closeIssueUseCase = new CloseIssueUseCase(new Jira(new JiraApi(), new JiraIntegrationMapper()), new ForgeMergeEventsQueueAdapter());
        return closeIssueUseCase.exec(issueKey);
    }
}