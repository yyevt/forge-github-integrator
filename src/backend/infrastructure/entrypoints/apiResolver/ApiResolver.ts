import Resolver, {Request} from "@forge/resolver";
import {VcsRepositoryPresentationMapper} from "./VcsRepositoryPresentationMapper";
import {StoreAccessTokenUseCase} from "../../../application/usecases/StoreAccessToken/StoreAccessTokenUseCase";
import {Github} from "../../adapters/Github/Github";
import {ForgeSecretStorage} from "../../adapters/ForgeStore/ForgeSecretStorage";
import {GithubApi} from "../../adapters/Github/GithubApi";
import {ApprovePullRequestUseCase} from "../../../application/usecases/ApprovePullRequest/ApprovePullRequestUseCase";
import {MergePullRequestUseCase} from "../../../application/usecases/MergePullRequest/MergePullRequestUseCase";
import {FetchRepositoriesUseCase} from "../../../application/usecases/FetchRepositories/FetchRepositoriesUseCase";
import {RepositoryPresentationDto} from "../../../../common/PresentationTypes";
import {GithubIntegrationMapper} from "../../adapters/Github/GithubIntegrationMapper";
import {Jira} from "../../adapters/Jira/Jira";
import {JiraApi} from "../../adapters/Jira/JiraApi";
import {JiraIssueKeyExtractor} from "../../adapters/Jira/JiraIssueKeyExtractor";
import {JiraIntegrationMapper} from "../../adapters/Jira/JiraIntegrationMapper";

const resolver = new Resolver();

resolver.define("saveGithubToken", async (req: Request<{ token: string }>): Promise<void> => {
    const accId = req.context.accountId;
    const accessToken = req.payload.token;

    const useCase = new StoreAccessTokenUseCase(new Github(new GithubApi(), new GithubIntegrationMapper()), new ForgeSecretStorage());
    await useCase.execute(accId, accessToken);
});

resolver.define("getGithubReposWithPulls", async (req: Request): Promise<ReadonlyArray<RepositoryPresentationDto>> => {
    const accId = req.context.accountId;

    const useCase = new FetchRepositoriesUseCase(
        new ForgeSecretStorage(),
        new Github(new GithubApi(), new GithubIntegrationMapper()),
        new JiraIssueKeyExtractor(),
        new Jira(new JiraApi(), new JiraIntegrationMapper())
    );
    const vcsRepositories = await useCase.execute(accId);

    const presentationMapper = new VcsRepositoryPresentationMapper();
    return vcsRepositories.map(r => presentationMapper.mapToPresentationDto(r));
});

resolver.define("approvePullRequest", async (req: Request<{ repo: string; pullNumber: number }>): Promise<void> => {
    const accId = req.context.accountId;
    const repo = req.payload.repo;
    const pullNumber = req.payload.pullNumber;

    const useCase = new ApprovePullRequestUseCase(new ForgeSecretStorage(), new Github(new GithubApi(), new GithubIntegrationMapper()));
    await useCase.execute(accId, repo, pullNumber);
});

resolver.define("mergePullRequest", async (req: Request<{ repo: string; pullNumber: number }>): Promise<void> => {
    const accId = req.context.accountId;
    const repo = req.payload.repo;
    const pullNumber = req.payload.pullNumber;

    const useCase = new MergePullRequestUseCase(new ForgeSecretStorage(), new Github(new GithubApi(), new GithubIntegrationMapper()));
    await useCase.execute(accId, repo, pullNumber);
});

export const apiResolver = resolver.getDefinitions();
