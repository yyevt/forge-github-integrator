import {fetch, Response} from "@forge/api";
import {StatusCodes} from "http-status-codes";
import {GithubUserIntegrationDto} from "./GithubTypes";

export class GithubSDK {

    private static readonly BASE_API_PATH = "https://api.github.com";
    private static readonly DEFAULT_RATE_LIMIT_WAIT_SECONDS = 10;

    public getTheAuthenticatedUser(accessToken: string): Promise<GithubUserIntegrationDto> {
        const url = GithubSDK.BASE_API_PATH + "/user";
        return this.request("GET", url, accessToken);
    }

    public graphQL<T>(accessToken: string, body: object): Promise<T> {
        const url = GithubSDK.BASE_API_PATH + "/graphql";
        return this.request("POST", url, accessToken, JSON.stringify(body));
    }

    public createReviewForPullRequest(accessToken: string, owner: string, repo: string, pullNumber: number, reviewBody: object): Promise<void> {
        const url = GithubSDK.BASE_API_PATH + `/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`;
        return this.request("POST", url, accessToken, JSON.stringify(reviewBody));
    }

    public mergePullRequest(accessToken: string, owner: string, repo: string, pullNumber: number): Promise<void> {
        const url = GithubSDK.BASE_API_PATH + `/repos/${owner}/${repo}/pulls/${pullNumber}/merge`;
        return this.request("PUT", url, accessToken);
    }

    private async request<T>(method: string, url: string, accessToken: string, body?: string): Promise<T> {
        const resp = await fetch(url, {
            method: method,
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Token ${accessToken}`,
                "User-Agent": "Forge GitHub Integrator",
                "X-GitHub-Api-Version": "2022-11-28"
            },
            redirect: "follow",
            body
        });

        if (!resp.ok) {
            throw this.createApiError(resp);
        }

        return resp.json();
    }

    private createApiError(resp: Response): Error {
        switch (resp.status) {
            case StatusCodes.UNAUTHORIZED:
                return new Error("Authentication required or GitHub access token is invalid");
            case StatusCodes.FORBIDDEN: {
                if (resp.headers.get("x-ratelimit-remaining") === "0") {
                    const waitSeconds = this.calculateWaitSeconds(resp.headers.get("x-ratelimit-reset"));
                    return new Error(`You have exceeded your Github rate limit, please try again in ${waitSeconds} seconds`);
                }
                return new Error("Operation is forbidden, please ensure you have sufficient permissions in Github account settings");
            }
            case StatusCodes.NOT_FOUND:
                return new Error("Resource is not found");
            case StatusCodes.TOO_MANY_REQUESTS:
                return new Error("Too many requests performed, please try again later");
            default:
                return new Error(`Error occurred: ${resp.status}: ${resp.statusText}`);
        }
    }

    private calculateWaitSeconds(xRateLimitReset: string | null): number {
        if (!xRateLimitReset) {
            return GithubSDK.DEFAULT_RATE_LIMIT_WAIT_SECONDS;
        }

        const futureTimeSeconds = Number(xRateLimitReset);
        const currentTimeSeconds = Math.ceil(Date.now() / 1000);

        return futureTimeSeconds - currentTimeSeconds;
    }
}

