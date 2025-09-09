import {kvs} from "@forge/kvs";
import {AccessTokenStorage} from "../../../application/ports/AccessTokenStorage";

export class ForgeSecretStorage implements AccessTokenStorage {

    public get(accountId: string): Promise<string | undefined> {
        return kvs.getSecret(this.createKey(accountId));
    }

    public save(accountId: string, accessToken: string): Promise<void> {
        return kvs.setSecret(this.createKey(accountId), accessToken);
    }

    private createKey(accountId: string): string {
        return `access-token:${accountId}`;
    }
}