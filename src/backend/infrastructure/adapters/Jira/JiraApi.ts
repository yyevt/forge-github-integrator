import {JiraTransitionsDto} from "./JiraTypes";
import {asApp, Response, Route, route} from "@forge/api";
import {StatusCodes} from "http-status-codes";

export class JiraApi {

    public searchJQL<T>(query: object): Promise<T> {
        return this.request("POST", route`/rest/api/3/search/jql`, JSON.stringify(query));
    }

    public async getIssue<T>(issueKey: string, fields: ReadonlyArray<string>): Promise<T> {
        return this.request("GET", route`/rest/api/3/issue/${issueKey}?fields=${fields.join(",")}`);
    }

    public async getTransitions(issueKey: string): Promise<JiraTransitionsDto> {
        return this.request("GET", route`/rest/api/3/issue/${issueKey}/transitions`);
    }

    public async doTransition(issueKey: string, transition: { transition: { id: string } }): Promise<void> {
        return this.request("POST", route`/rest/api/3/issue/${issueKey}/transitions`, JSON.stringify(transition));
    }

    private async request<T>(method: string, url: Route, body?: string): Promise<T> {
        const resp = await asApp().requestJira(url, {
            method,
            headers: body
                ? {"Accept": "application/json", "Content-Type": "application/json"}
                : {"Accept": "application/json"},
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
                return new Error("Authentication credentials are incorrect or missing");
            case StatusCodes.FORBIDDEN:
                return new Error("Operation is forbidden, please ensure you have required Jira admin or site admin permissions");
            case StatusCodes.NOT_FOUND:
                return new Error("The issue does not exist or the user does not have permission to view it");
            case StatusCodes.CONFLICT:
                return new Error("The issue could not be updated due to a conflicting update");
            case StatusCodes.UNPROCESSABLE_ENTITY:
                return new Error("Configuration problem prevents the operation with the issue");
            case StatusCodes.REQUEST_TOO_LONG:
                return new Error("Per-issue size limit has been breached");
            case StatusCodes.TOO_MANY_REQUESTS:
                return new Error("Too many requests performed, please try again later");
            default:
                return new Error(`Error occurred: ${resp.status}: ${resp.statusText}`);
        }
    }
}