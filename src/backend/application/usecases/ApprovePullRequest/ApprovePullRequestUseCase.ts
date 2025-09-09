import {AccessTokenStorage} from "../../ports/AccessTokenStorage";
import {VersionControlPlatform} from "../../ports/VersionControlPlatform";
import {assertNonEmpty} from "../../../utils/StringUtils";

export class ApprovePullRequestUseCase {

    constructor(
        private readonly accessTokenStorage: AccessTokenStorage,
        private readonly versionControlPlatform: VersionControlPlatform
    ) {
    }

    public async execute(accountId: string, repo: string, pullNumber: number): Promise<void> {
        assertNonEmpty(accountId, "accountId is required");
        assertNonEmpty(repo, "repo is required");

        const accessToken = await this.accessTokenStorage.get(accountId);
        assertNonEmpty(accessToken, "Access token not found");

        await this.versionControlPlatform.approvePull(<string>accessToken, repo, pullNumber);
    }
}