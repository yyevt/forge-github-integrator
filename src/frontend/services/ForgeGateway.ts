import {invoke} from "@forge/bridge";
import {PullPresentationDto, RepositoryPresentationDto} from "../../common/PresentationTypes";

export class ForgeGateway {

    public async saveToken(token: string): Promise<void> {
        await invoke("saveGithubToken", {token: token});
    }

    public async getGithubReposWithPulls(): Promise<ReadonlyArray<RepositoryPresentationDto>> {
        return invoke("getGithubReposWithPulls");
    }

    public approvePullRequest(pullRequest: PullPresentationDto): Promise<void> {
        return invoke("approvePullRequest", {repo: pullRequest.repoName, pullNumber: pullRequest.number});
    }

    public mergePullRequest(pullRequest: PullPresentationDto): Promise<void> {
        return invoke("mergePullRequest", {repo: pullRequest.repoName, pullNumber: pullRequest.number});
    }

}