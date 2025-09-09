import {ApprovePullRequestUseCase} from "../../application/usecases/ApprovePullRequest/ApprovePullRequestUseCase";
import {FetchRepositoriesUseCase} from "../../application/usecases/FetchRepositories/FetchRepositoriesUseCase";
import {MergePullRequestUseCase} from "../../application/usecases/MergePullRequest/MergePullRequestUseCase";
import {StoreAccessTokenUseCase} from "../../application/usecases/StoreAccessToken/StoreAccessTokenUseCase";
import {IssueAwareVcsRepository} from "../../domain/entities/IssueAwareVcsRepository";
import {NotifyPullRequestIsMergedUseCase} from "../../application/usecases/NotifyPullRequestIsMerged/NotifyPullRequestIsMergedUseCase";
import {PullRequestAction} from "../../domain/entities/PullRequestAction";
import {CloseIssueUseCase} from "../../application/usecases/CloseIssue/CloseIssueUseCase";
import {DI} from "./DI";

export class BusinessOperations {

    public storeAccessToken(accountId: string, accessToken: string): Promise<void> {
        return new StoreAccessTokenUseCase(DI.github(), DI.forgeSecrets())
            .exec(accountId, accessToken);
    }

    public fetchRepositories(accountId: string): Promise<ReadonlyArray<IssueAwareVcsRepository>> {
        return new FetchRepositoriesUseCase(DI.forgeSecrets(), DI.github(), DI.jiraKeyExtractor(), DI.jira())
            .exec(accountId);
    }

    public approvePull(accountId: string, repo: string, pullNumber: number): Promise<void> {
        return new ApprovePullRequestUseCase(DI.forgeSecrets(), DI.github())
            .exec(accountId, repo, pullNumber);
    }

    public mergePull(accountId: string, repo: string, pullNumber: number): Promise<void> {
        return new MergePullRequestUseCase(DI.forgeSecrets(), DI.github())
            .exec(accountId, repo, pullNumber);
    }

    public notifyPullIsMerged(pullAction: PullRequestAction): Promise<void> {
        return new NotifyPullRequestIsMergedUseCase(DI.jiraKeyExtractor(), DI.forgeMergeQueue())
            .exec(pullAction);
    }

    public closeIssue(issueKey: string): Promise<void> {
        return new CloseIssueUseCase(DI.jira(), DI.forgeMergeQueue())
            .exec(issueKey);
    }
}