import React from "react";
import renderer from "react-test-renderer";
import {ApproveButton} from "../../../src/frontend/components/ApproveButton";
import {OPEN_PULL} from "../../../__fixtures__";

jest.mock("@forge/bridge", () => ({
    invoke: jest.fn()
}));

describe("ApproveButton", () => {

    it("renders correctly", () => {
        const reactRenderer = renderer.create(<ApproveButton pullRequest={OPEN_PULL}/>);

        expect(reactRenderer.toJSON()).toMatchSnapshot();
    });
});