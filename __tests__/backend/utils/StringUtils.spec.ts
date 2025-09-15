import {assertNonEmpty} from "../../../src/backend/utils/StringUtils";

describe("StringUtils", () => {

    it("throws error on missing string", () => {
        expect(() => assertNonEmpty(null, "accountId is required"))
            .toThrow("accountId is required");
    });

    it("throws error on blank string", () => {
        expect(() => assertNonEmpty("  ", "accountId is required"))
            .toThrow("accountId is required");
    });

    it("finished successfully on non-empty string", () => {
        expect(() => assertNonEmpty("123456", "accountId is required"))
            .not.toThrow();
    });
});