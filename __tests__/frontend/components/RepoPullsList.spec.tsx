import renderer from "react-test-renderer";
import {OPEN_PULL, CLOSED_MERGED_PULL} from "../../../__fixtures__";
import React from "react";
import {RepoPullsList} from "../../../src/frontend/components/RepoPullsList";

jest.mock("@forge/bridge", () => ({
    invoke: jest.fn()
}));

describe("RepoPullsList", () => {

    it("renders list no pulls correctly", async () => {
        let reactRenderer = renderer.create(
            <RepoPullsList
                pulls={[]}
                isMergeAllowed={true}
                pullsTotalCount={0}
                onPullMerge={jest.fn()}
            />
        );

        expect(reactRenderer.toJSON()).toMatchSnapshot();
    });

    it("renders list with pulls correctly", async () => {
        let reactRenderer = renderer.create(
            <RepoPullsList
                pulls={[OPEN_PULL, CLOSED_MERGED_PULL]}
                isMergeAllowed={true}
                pullsTotalCount={2}
                onPullMerge={jest.fn()}
            />
        );

        expect(reactRenderer.toJSON()).toMatchSnapshot();
    });
});