import React from "react";
import renderer, {act, ReactTestRenderer} from "react-test-renderer";
import {ConnectedScreen} from "../../../src/frontend/components/ConnectedScreen";
import {ForgeGateway} from "../../../src/frontend/services/ForgeGateway";
import {ACTIVE_REPO, ARCHIVED_REPO} from "../../../__fixtures__";

jest.mock("@forge/bridge", () => ({
    invoke: jest.fn()
}));

jest.mock("../../../src/frontend/services/ForgeGateway");

describe("ConnectedScreen", () => {

    it("renders screen no repositories correctly", async () => {
        (ForgeGateway.prototype.getGithubReposWithPulls as jest.Mock).mockResolvedValueOnce([]);

        let reactRenderer: ReactTestRenderer;

        await act(async () => {
            reactRenderer = renderer.create(<ConnectedScreen />);
        });

        await act(() => Promise.resolve());

        expect(reactRenderer!.toJSON()).toMatchSnapshot();
    });

    it("renders screen with repositories correctly", async () => {
        (ForgeGateway.prototype.getGithubReposWithPulls as jest.Mock).mockResolvedValueOnce([
            ACTIVE_REPO,
            ARCHIVED_REPO
        ]);

        let reactRenderer: renderer.ReactTestRenderer;

        await act(async () => {
            reactRenderer = renderer.create(<ConnectedScreen />);
        });

        await act(() => Promise.resolve());

        expect(reactRenderer!.toJSON()).toMatchSnapshot();
    });
});