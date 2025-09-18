import {asApp} from "@forge/api";
import {StatusCodes} from "http-status-codes";
import {JiraSdk} from "../../../../../src/backend/infrastructure/adapters/Jira/JiraSdk";
import {JiraIssueShortDto, JiraIssuesShortDto} from "../../../../../src/backend/infrastructure/adapters/Jira/JiraTypes";

jest.mock("@forge/api", () => ({
    asApp: jest.fn(),
    route: (strings: TemplateStringsArray, ...values: any[]) => strings.reduce((accum, str, i) => accum + str + (values[i] || ""), "")
}));

/**
 * N.B! Not all methods and classes are tested, only important ones
 */
describe("JiraSdk", () => {

    const mockRequestJira = jest.fn();
    let jiraSdk: JiraSdk;

    beforeEach(() => {
        mockRequestJira.mockReset();
        (asApp as jest.Mock).mockReturnValue({
            requestJira: mockRequestJira
        });

        jiraSdk = new JiraSdk();
    });

    it("should call correct endpoint for searchJQL", async () => {
        const issuesDto: JiraIssuesShortDto = {
            issues: [{
                id: "1",
                key: "ABC-1",
                expand: "",
                fields: {
                    summary: "summary",
                    status: {
                        name: "Done",
                        statusCategory: {
                            id: "2",
                            key: "done",
                            name: "Done"
                        }
                    }
                }
            }]
        };

        mockRequestJira.mockResolvedValue({ok: true, status: 200, json: () => Promise.resolve(issuesDto)});

        const result = await jiraSdk.searchJQL({jql: "key in ('ABC-1')"});

        expect(mockRequestJira).toHaveBeenCalledWith("/rest/api/3/search/jql", expect.objectContaining({
            method: "POST",
            body: JSON.stringify({jql: "key in ('ABC-1')"})
        }));
        expect(result).toEqual(issuesDto);
    })
    ;

    it("should handle getIssue correctly", async () => {
        const issueDto: JiraIssueShortDto = {
            id: "1",
            key: "ABC-1",
            expand: "",
            fields: {
                summary: "summary",
                status: {
                    name: "Done",
                    statusCategory: {
                        id: "2",
                        key: "done",
                        name: "Done"
                    }
                }
            }
        };

        mockRequestJira.mockResolvedValue({ok: true, status: 200, json: () => Promise.resolve(issueDto)});

        const result = await jiraSdk.getIssue("ABC-123", ["summary", "status"]);

        expect(mockRequestJira).toHaveBeenCalledWith("/rest/api/3/issue/ABC-123?fields=summary,status", expect.objectContaining({
            method: "GET",
            headers: {"Accept": "application/json"},
            redirect: "follow"
        }));
        expect(result).toEqual(issueDto);
    });

    it("should handle getTransitions correctly", async () => {
        const transitionsDto = {transitions: [{id: "31", name: "Done"}]};

        mockRequestJira.mockResolvedValue({ok: true, status: 200, json: () => Promise.resolve(transitionsDto)});

        const result = await jiraSdk.getTransitions("ABC-321");

        expect(mockRequestJira).toHaveBeenCalledWith("/rest/api/3/issue/ABC-321/transitions", expect.objectContaining({
            method: "GET",
            headers: {"Accept": "application/json"},
            redirect: "follow"
        }));
        expect(result).toEqual(transitionsDto);
    });

    it("should call doTransition with correct body", async () => {
        mockRequestJira.mockResolvedValue({ok: true, status: StatusCodes.NO_CONTENT, json: () => Promise.resolve()});

        await expect(jiraSdk.doTransition("ABC-321", {transition: {id: "51"}})).resolves
            .toBeUndefined();

        expect(mockRequestJira).toHaveBeenCalledWith("/rest/api/3/issue/ABC-321/transitions", expect.objectContaining({
            method: "POST",
            body: JSON.stringify({transition: {id: "51"}})
        }));
    });

    it("should throw an error for <403 Forbidden> status", async () => {
        mockRequestJira.mockResolvedValue({ok: false, status: StatusCodes.FORBIDDEN, statusText: "Forbidden"});

        await expect(jiraSdk.getTransitions("ABC-999")).rejects
            .toThrow("Operation is forbidden, please ensure you have required Jira admin or site admin permissions");
    });

    it("should throw default error for <418 I'm a teapot> status", async () => {
        mockRequestJira.mockResolvedValue({
            ok: false,
            status: StatusCodes.IM_A_TEAPOT,
            statusText: "I am a teapot, not a coffee maker"
        });

        await expect(jiraSdk.getTransitions("ABC-999")).rejects
            .toThrow("Error occurred: 418: I am a teapot, not a coffee maker");
    });

    it("should return undefined for <204 No Content> response", async () => {
        mockRequestJira.mockResolvedValue({ok: true, status: StatusCodes.NO_CONTENT});

        const result = await jiraSdk.doTransition("ABC-321", {transition: {id: "51"}});

        expect(result).toBeUndefined();
    });
});
