import {AccessTokenStorage} from "../../ports/AccessTokenStorage";
import {VersionControlPlatform} from "../../ports/VersionControlPlatform";
import {assertNonEmpty} from "../../../utils/StringUtils";

export class StoreAccessTokenUseCase {

    constructor(
        private readonly versionControlPlatform: VersionControlPlatform,
        private readonly accessTokenStorage: AccessTokenStorage
    ) {
    }

    public async execute(accountId: string, accessToken: string): Promise<void> {
        assertNonEmpty(accountId, "accountId is required");
        assertNonEmpty(accessToken, "accessToken is required");

        await this.versionControlPlatform.validateAccessToken(accessToken);

        return this.accessTokenStorage.save(accountId, accessToken);
    }
}