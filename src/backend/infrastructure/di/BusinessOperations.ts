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
        const storeUseCase = new StoreAccessTokenUseCase(DI.github(), DI.forgeSecrets());
        return storeUseCase.exec(accountId, accessToken);
    }

    public fetchRepositories(accountId: string): Promise<ReadonlyArray<IssueAwareVcsRepository>> {
        const fetchUseCase = new FetchRepositoriesUseCase(DI.forgeSecrets(), DI.github(), DI.jiraKeyExtractor(), DI.jira());
        return fetchUseCase.exec(accountId);
    }

    public approvePull(accountId: string, repo: string, pullNumber: number): Promise<void> {
        const approveUseCase = new ApprovePullRequestUseCase(DI.forgeSecrets(), DI.github());
        return approveUseCase.exec(accountId, repo, pullNumber);
    }

    public mergePull(accountId: string, repo: string, pullNumber: number): Promise<void> {
        const mergeUseCase =  new MergePullRequestUseCase(DI.forgeSecrets(), DI.github());
        return mergeUseCase.exec(accountId, repo, pullNumber);
    }

    public notifyPullIsMerged(pullAction: PullRequestAction): Promise<void> {
        const notifyUseCase = new NotifyPullRequestIsMergedUseCase(DI.jiraKeyExtractor(), DI.forgeMergeQueue());
        return notifyUseCase.exec(pullAction);
    }

    public closeIssue(issueKey: string): Promise<void> {
        const closeIssueUseCase = new CloseIssueUseCase(DI.jira(), DI.forgeMergeQueue());
        return closeIssueUseCase.exec(issueKey);
    }
}