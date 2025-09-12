import React from "react";
import renderer from "react-test-renderer";
import {MergeButton} from "../../../src/frontend/components/MergeButton";
import {OPEN_PULL} from "../../../__fixtures__";

jest.mock("@forge/bridge", () => ({
    invoke: jest.fn()
}));

describe("MergeButton", () => {

    it("renders enabled correctly", () => {
        const reactRenderer = renderer.create(
            <MergeButton
                pullRequest={OPEN_PULL}
                isDisabled={false}
                onPullMerge={jest.fn()}
            />
        );

        expect(reactRenderer.toJSON()).toMatchSnapshot();
    });

    it("renders disabled correctly", () => {
        const reactRenderer = renderer.create(
            <MergeButton
                pullRequest={OPEN_PULL}
                isDisabled={true}
                onPullMerge={jest.fn()}
            />
        );

        expect(reactRenderer.toJSON()).toMatchSnapshot();
    });
});