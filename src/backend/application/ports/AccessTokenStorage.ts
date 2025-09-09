export interface AccessTokenStorage {

    get(accountId: string): Promise<string | undefined>;

    save(accountId: string, value: string): Promise<void>;

}