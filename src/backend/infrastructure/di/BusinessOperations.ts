import {ApprovePullRequestUseCase} from "../../application/usecases/ApprovePullRequest/ApprovePullRequestUseCase";
import {FetchRepositoriesUseCase} from "../../application/usecases/FetchRepositories/FetchRepositoriesUseCase";
import {MergePullRequestUseCase} from "../../application/usecases/MergePullRequest/MergePullRequestUseCase";
import {StoreAccessTokenUseCase} from "../../application/usecases/StoreAccessToken/StoreAccessTokenUseCase";
import {IssueAwareVcsRepository} from "../../domain/entities/IssueAwareVcsRepository";
import {NotifyPullRequestIsMergedUseCase} from "../../application/usecases/NotifyPullRequestIsMerged/NotifyPullRequestIsMergedUseCase";
import {PullRequestAction} from "../../domain/entities/PullRequestAction";
import {CloseIssueUseCase} from "../../application/usecases/CloseIssue/CloseIssueUseCase";
import {ServiceProvider as SP} from "./ServiceProvider";

export class BusinessOperations {

    public storeAccessToken(accountId: string, accessToken: string): Promise<void> {
        return new StoreAccessTokenUseCase(SP.github(), SP.forgeSecrets())
            .exec(accountId, accessToken);
    }

    public fetchRepositories(accountId: string): Promise<ReadonlyArray<IssueAwareVcsRepository>> {
        return new FetchRepositoriesUseCase(SP.forgeSecrets(), SP.github(), SP.jiraKeyExtractor(), SP.jira())
            .exec(accountId);
    }

    public approvePull(accountId: string, repo: string, pullNumber: number): Promise<void> {
        return new ApprovePullRequestUseCase(SP.forgeSecrets(), SP.github())
            .exec(accountId, repo, pullNumber);
    }

    public mergePull(accountId: string, repo: string, pullNumber: number): Promise<void> {
        return new MergePullRequestUseCase(SP.forgeSecrets(), SP.github())
            .exec(accountId, repo, pullNumber);
    }

    public notifyPullIsMerged(pullAction: PullRequestAction): Promise<void> {
        return new NotifyPullRequestIsMergedUseCase(SP.jiraKeyExtractor(), SP.forgeMergeQueue())
            .exec(pullAction);
    }

    public closeIssue(issueKey: string): Promise<void> {
        return new CloseIssueUseCase(SP.jira(), SP.forgeMergeQueue())
            .exec(issueKey);
    }
}