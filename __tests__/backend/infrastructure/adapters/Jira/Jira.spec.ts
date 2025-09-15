import {JiraApi} from "../../../../../src/backend/infrastructure/adapters/Jira/JiraApi";
import {JiraIntegrationMapper} from "../../../../../src/backend/infrastructure/adapters/Jira/JiraIntegrationMapper";
import {Jira} from "../../../../../src/backend/infrastructure/adapters/Jira/Jira";
import {Issue} from "../../../../../src/backend/domain/entities/Issue";
import {JiraIssueShortDto, JiraTransitionsDto} from "../../../../../src/backend/infrastructure/adapters/Jira/JiraTypes";

jest.mock("../../../../../src/backend/infrastructure/adapters/Jira/JiraApi");

/**
 * N.B! Not all methods and classes are tested, only important ones
 */
describe("Jira", () => {
    let jiraApi: jest.Mocked<JiraApi>;
    let jira: Jira;

    beforeEach(() => {
        jest.clearAllMocks();

        jiraApi = new JiraApi() as jest.Mocked<JiraApi>;
        jira = new Jira(jiraApi, new JiraIntegrationMapper());

        jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    describe("retrieveIssue", () => {

        it("should call jiraApi.getIssue and map result to entity", async () => {
            jiraApi.getIssue.mockResolvedValue({
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
            } as JiraIssueShortDto);

            const result = await jira.retrieveIssue("ABC-1");

            expect(jiraApi.getIssue).toHaveBeenCalledWith("ABC-1", ["key", "summary", "status"]);
            expect(result).toStrictEqual(new Issue({issueKey: "ABC-1", isClosed: true}));
        });
    });

    describe("closeIssue", () => {

        it("should warn and return if no closing transition found", async () => {
            jiraApi.getTransitions.mockResolvedValue({
                transitions: [
                    {id: "1", name: "In Progress"},
                    {id: "2", name: "Review"}
                ]
            } as JiraTransitionsDto);

            await expect(jira.closeIssue("ABC-123")).resolves
                .toBeUndefined();

            expect(jiraApi.doTransition).not.toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalledWith("No closing transition found for Jira ticket ABC-123");
        });
    });
});
