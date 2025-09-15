import {ApprovePullRequestUseCase} from "../../../../../src/backend/application/usecases/ApprovePullRequest/ApprovePullRequestUseCase";
import {AccessTokenStorage} from "../../../../../src/backend/application/ports/AccessTokenStorage";
import {VersionControlPlatform} from "../../../../../src/backend/application/ports/VersionControlPlatform";

describe("ApprovePullRequestUseCase", () => {
    const mockAccessTokenStorage: jest.Mocked<AccessTokenStorage> = {
        get: jest.fn(),
        save: jest.fn()
    };

    const mockVersionControlPlatform: jest.Mocked<VersionControlPlatform> = {
        validateAccessToken: jest.fn(),
        getRepositories: jest.fn(),
        approvePull: jest.fn(),
        mergePull: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should throw if accountId is empty", async () => {
        const useCase = new ApprovePullRequestUseCase(mockAccessTokenStorage, mockVersionControlPlatform);

        await expect(useCase.exec("", "repo", 1)).rejects.toThrow("accountId is required");
    });

    it("should throw if repo is empty", async () => {
        const useCase = new ApprovePullRequestUseCase(mockAccessTokenStorage, mockVersionControlPlatform);

        await expect(useCase.exec("user-1", "", 1)).rejects.toThrow("repo is required");
    });

    it("should throw if token is missing", async () => {
        mockAccessTokenStorage.get.mockResolvedValue(undefined);

        const useCase = new ApprovePullRequestUseCase(mockAccessTokenStorage, mockVersionControlPlatform);

        await expect(useCase.exec("user-1", "repo", 1)).rejects.toThrow("Access token not found");
        expect(mockVersionControlPlatform.approvePull).not.toHaveBeenCalled();
    });

    it("should approve pull request successfully", async () => {
        mockAccessTokenStorage.get.mockResolvedValue("token-123");

        const useCase = new ApprovePullRequestUseCase(mockAccessTokenStorage, mockVersionControlPlatform);

        await useCase.exec("user-1", "my-repo", 1);

        expect(mockAccessTokenStorage.get).toHaveBeenCalledWith("user-1");
        expect(mockVersionControlPlatform.approvePull).toHaveBeenCalledWith("token-123", "my-repo", 1);
    });
});
