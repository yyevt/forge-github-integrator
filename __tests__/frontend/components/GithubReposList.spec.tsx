import React from "react";
import renderer from "react-test-renderer";
import {ACTIVE_REPO, ARCHIVED_REPO} from "../../../__fixtures__";
import {GithubReposList} from "../../../src/frontend/components/GithubReposList";

jest.mock("@forge/bridge", () => ({
    invoke: jest.fn()
}));

describe("GithubReposList", () => {

    it("renders list no repositories correctly", async () => {
        let reactRenderer = renderer.create(
            <GithubReposList
                repos={[]}
                onPullMerge={jest.fn()}
            />
        );

        expect(reactRenderer.toJSON()).toMatchSnapshot();
    });

    it("renders list with repositories correctly", async () => {
        let reactRenderer = renderer.create(
            <GithubReposList
                repos={[
                    ACTIVE_REPO,
                    ARCHIVED_REPO
                ]}
                onPullMerge={jest.fn()}
            />
        );

        expect(reactRenderer.toJSON()).toMatchSnapshot();
    });
});