import renderer from "react-test-renderer";
import {ACTIVE_REPO} from "../../../__fixtures__";
import React from "react";
import {RepoMainInfo} from "../../../src/frontend/components/RepoMainInfo";

jest.mock("@forge/bridge", () => ({
    invoke: jest.fn()
}));

describe("RepoMainInfo", () => {

    it("renders repository info correctly", async () => {
        let reactRenderer = renderer.create(<RepoMainInfo repo={ACTIVE_REPO}/>);

        expect(reactRenderer.toJSON()).toMatchSnapshot();
    });
});