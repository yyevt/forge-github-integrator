import {invoke} from "@forge/bridge";
import {ForgeGateway} from "../../../src/frontend/services/ForgeGateway";
import {ACTIVE_REPO, ARCHIVED_REPO, CLOSED_MERGED_PULL, OPEN_PULL} from "../../../__fixtures__";

jest.mock("@forge/bridge", () => ({
    invoke: jest.fn(),
}));

describe("ForgeGateway", () => {
    let gateway: ForgeGateway;

    beforeEach(() => {
        gateway = new ForgeGateway();
        jest.clearAllMocks();
    });

    it("calls invoke with correct args for saveToken", async () => {
        await gateway.saveToken("mock-token");

        expect(invoke).toHaveBeenCalledWith("saveGithubToken", {
            token: "mock-token"
        });
    });

    it("returns repos from getGithubReposWithPulls", async () => {
        const mockRepos = [ACTIVE_REPO, ARCHIVED_REPO];
        (invoke as jest.Mock).mockResolvedValueOnce(mockRepos);

        const repos = await gateway.getGithubReposWithPulls();

        expect(invoke).toHaveBeenCalledWith("getGithubReposWithPulls");
        expect(repos).toEqual(mockRepos);
    });

    it("calls invoke with correct args for approvePullRequest", async () => {
        await gateway.approvePullRequest(OPEN_PULL);

        expect(invoke).toHaveBeenCalledWith("approvePullRequest", {
            repo: OPEN_PULL.repoName,
            pullNumber: OPEN_PULL.number
        });
    });

    it("calls invoke with correct args for mergePullRequest", async () => {
        await gateway.mergePullRequest(CLOSED_MERGED_PULL);

        expect(invoke).toHaveBeenCalledWith("mergePullRequest", {
            repo: CLOSED_MERGED_PULL.repoName,
            pullNumber: CLOSED_MERGED_PULL.number,
        });
    });
});
