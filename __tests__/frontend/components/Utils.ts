import {showToast} from "../../../src/frontend/components/Utils";
import {showFlag} from "@forge/bridge";

jest.mock("@forge/bridge", () => ({
    showFlag: jest.fn(),
}));

describe("showToast", () => {
    
    it("should call showFlag with correct parameters", () => {
        showToast("notification", "Success!", "success", "The operation was successful.");

        expect(showFlag).toHaveBeenCalledTimes(1);

        const callArg = (showFlag as jest.Mock).mock.lastCall[0];

        expect(callArg.title).toBe("Success!");
        expect(callArg.type).toBe("success");
        expect(callArg.description).toBe("The operation was successful.");
        expect(callArg.isAutoDismiss).toBe(true);
        expect(callArg.id).toMatch(/^notification_\d*\.\d+$/);
    });
});