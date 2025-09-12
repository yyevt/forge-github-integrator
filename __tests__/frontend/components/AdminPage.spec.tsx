import React from "react";
import renderer from "react-test-renderer";
import {AdminPage} from "../../../src/frontend/components/AdminPage";

jest.mock("@forge/bridge", () => ({
    invoke: jest.fn()
}));

describe("AdminPage", () => {

    it("renders correctly", () => {
        const reactRenderer = renderer.create(<AdminPage/>);

        expect(reactRenderer.toJSON()).toMatchSnapshot();
    });
});