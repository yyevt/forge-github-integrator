import Resolver, {Request} from "@forge/resolver";
import {VcsRepositoryPresentationMapper} from "./VcsRepositoryPresentationMapper";
import {RepositoryPresentationDto} from "../../../../common/PresentationTypes";
import {UseCases} from "../../di/UseCases";

const resolver = new Resolver();
const useCases = new UseCases();

resolver.define("saveGithubToken", async (req: Request<{ token: string }>): Promise<void> => {
    const accId = req.context.accountId;
    const accessToken = req.payload.token;

    await useCases.storeAccessToken(accId, accessToken);
});

resolver.define("getGithubReposWithPulls", async (req: Request): Promise<ReadonlyArray<RepositoryPresentationDto>> => {
    const accId = req.context.accountId;

    const vcsRepositories = await useCases.fetchRepositories(accId);

    return new VcsRepositoryPresentationMapper().mapToPresentation(vcsRepositories);
});

resolver.define("approvePullRequest", async (req: Request<{ repo: string; pullNumber: number }>): Promise<void> => {
    const accId = req.context.accountId;
    const repo = req.payload.repo;
    const pullNumber = req.payload.pullNumber;

    await useCases.approvePull(accId, repo, pullNumber);
});

resolver.define("mergePullRequest", async (req: Request<{ repo: string; pullNumber: number }>): Promise<void> => {
    const accId = req.context.accountId;
    const repo = req.payload.repo;
    const pullNumber = req.payload.pullNumber;

    await useCases.mergePull(accId, repo, pullNumber);
});

export const apiResolver = resolver.getDefinitions();
