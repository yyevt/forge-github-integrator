import {StatusCodes} from "http-status-codes";
import {BusinessOperations} from "../../../../../src/backend/infrastructure/di/BusinessOperations";
import {githubWebhookHandler} from "../../../../../src";
import {WebTriggerRequest} from "@forge/api/out/webTrigger";
import {GithubWebhookPullMetadata} from "../../../../../src/backend/infrastructure/entrypoints/githubWebhook/GithubWebhookTypes";
import {PullRequestAction} from "../../../../../src/backend/domain/entities/PullRequestAction";

jest.mock("../../../../../src/backend/infrastructure/di/BusinessOperations");

jest.mock("@forge/api", () => ({
    getAppContext: jest.fn().mockResolvedValue({environmentType: "DEVELOPMENT"}),
    webTrigger: {
        getUrl: jest.fn().mockResolvedValue("https://mock-webtrigger-url")
    }
}));

describe("githubWebhookHandler", () => {
    let notifyPullIsMergedMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        notifyPullIsMergedMock = jest.fn();

        (BusinessOperations as jest.Mock).mockImplementation(() => ({
            notifyPullIsMerged: notifyPullIsMergedMock
        }));
    });

    it("should return <400 Bad Request> if request body is missing", async () => {
        const response = await githubWebhookHandler({body: ""} as WebTriggerRequest);

        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(response.headers).toStrictEqual({"Content-Type": ["text/plain"]});
        expect(response.body).toBe("Empty body provided");
    });

    it("should return <400 Bad Request> if body is not valid GitHub metadata", async () => {
        const response = await githubWebhookHandler({body: JSON.stringify({})} as WebTriggerRequest);

        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(response.headers).toStrictEqual({"Content-Type": ["text/plain"]});
        expect(response.body).toBe("No valid body provided");
    });

    it("should return <200 OK> if action is not closed", async () => {
        const payload = {
            action: "opened",
            pull_request: {
                state: "open",
                title: "My PR",
                head: {}
            }
        };

        const response = await githubWebhookHandler({body: JSON.stringify(payload)} as WebTriggerRequest);

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.headers).toStrictEqual({"Content-Type": ["text/plain"]});
        expect(response.body).toBe("Event action is not closed");
    });

    it("should return <200 OK> if pull request is not merged", async () => {
        const payload = {
            action: "closed",
            pull_request: {
                state: "closed",
                merged: false,
                title: "My PR",
                head: {}
            }
        };

        const response = await githubWebhookHandler({body: JSON.stringify(payload)} as WebTriggerRequest);

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.headers).toStrictEqual({"Content-Type": ["text/plain"]});
        expect(response.body).toBe("Event pull state is not merged");
    });

    it("should process merged pull request", async () => {
        const payload: GithubWebhookPullMetadata = {
            action: "closed",
            number: 2,
            pull_request: {
                id: 101112,
                url: "https://api.github.com/repos/example-org/example-repo/pulls/42",
                number: 2,
                state: "closed",
                locked: false,
                title: "Add feature X",
                user: {
                    id: 1001,
                    login: "contributor-1",
                    type: "User",
                    site_admin: false
                },
                created_at: "2023-09-01T12:34:56Z",
                updated_at: "2023-09-02T15:00:00Z",
                closed_at: "2023-09-02T16:00:00Z",
                merged: true,
                merged_at: "2023-09-02T16:00:00Z",
                merge_commit_sha: "abc123def456789ghi012jkl345",
                draft: false,
                head: {
                    label: "feature/feature-x",
                    ref: "feature-x",
                    sha: "abc123def456789ghi012jkl345",
                    user: {
                        id: 1002,
                        login: "contributor-2",
                        type: "User",
                        site_admin: false
                    },
                    repo: {
                        id: 2020,
                        name: "example-repo",
                        full_name: "example-org/example-repo",
                        private: false,
                        owner: {
                            id: 1003,
                            login: "example-org",
                            type: "Organization",
                            site_admin: false
                        }
                    }
                }
            }
        };

        const response = await githubWebhookHandler({body: JSON.stringify(payload)} as WebTriggerRequest);

        expect(notifyPullIsMergedMock).toHaveBeenCalledWith(new PullRequestAction({
            action: "closed",
            number: 2,
            title: "Add feature X",
            head: {
                label: "feature/feature-x",
                ref: "feature-x"
            }
        }));
        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.headers).toStrictEqual({"Content-Type": ["text/plain"]});
        expect(response.body).toBe("Event is processed");
    });

    it("should return 500 if notifyPullIsMerged throws error", async () => {
        notifyPullIsMergedMock.mockRejectedValue(new Error("Something went wrong"));

        const payload = {
            action: "closed",
            pull_request: {
                state: "closed",
                merged: true,
                title: "My PR",
                head: {}
            }
        };

        const response = await githubWebhookHandler({body: JSON.stringify(payload)} as any);

        expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.headers).toStrictEqual({"Content-Type": ["text/plain"]});
        expect(response.body).toBe("Something went wrong");
    });
});
