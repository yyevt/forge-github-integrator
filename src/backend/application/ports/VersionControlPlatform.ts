import {VcsRepository} from "../../domain/entities/VcsRepository";

export type Limits = {
    readonly repos: number,
    readonly languages: number,
    readonly pulls: number
}

export interface VersionControlPlatform {

    validateAccessToken(accessToken: string): Promise<void>;

    getRepositories(accessToken: string, pullsStates: ReadonlyArray<string>, limits: Limits): Promise<ReadonlyArray<VcsRepository>>;

    approvePull(accessToken: string, repo: string, pullNumber: number): Promise<void>;

    mergePull(accessToken: string, repo: string, pullNumber: number): Promise<void>;

}