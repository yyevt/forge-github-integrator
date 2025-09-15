import {AsyncEvent} from "@forge/events";
import {BusinessOperations} from "../../../../../src/backend/infrastructure/di/BusinessOperations";
import {queueListener} from "../../../../../src";

jest.mock("../../../../../src/backend/infrastructure/di/BusinessOperations");

jest.mock("@forge/api", () => ({
    getAppContext: jest.fn().mockResolvedValue({environmentType: "DEVELOPMENT"}),
    webTrigger: {
        getUrl: jest.fn().mockResolvedValue("https://mock-webtrigger-url")
    }
}));

describe("queueListener", () => {
    let closeIssueMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        closeIssueMock = jest.fn();

        (BusinessOperations as jest.Mock).mockImplementation(() => ({
            closeIssue: closeIssueMock
        }));

        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should call closeIssue when given valid event", async () => {
        const event: AsyncEvent = {
            queueName: "test-queue",
            jobId: "job-123",
            eventId: "event-1",
            body: {
                issueKey: "ABC-123"
            },
        };

        await queueListener(event);

        expect(closeIssueMock).toHaveBeenCalledWith("ABC-123");
        expect(console.error).not.toHaveBeenCalled();
    });

    it("should log and return if body is invalid", async () => {
        const event: AsyncEvent = {
            queueName: "test-queue",
            jobId: "job-123",
            eventId: "event-1",
            body: {}
        };

        await queueListener(event);

        expect(closeIssueMock).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Incorrect body in event: ", "event-1", "test-queue");
    });

    it("should log and return if issueKey is missing", async () => {
        const event: AsyncEvent = {
            queueName: "test-queue",
            jobId: "job-123",
            eventId: "event-1",
            body: {
                issueKey: ""
            }
        };

        await queueListener(event);

        expect(closeIssueMock).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Empty issue number in event: ", "event-1", "test-queue");
    });

    it("should log error if closeIssue throws", async () => {
        closeIssueMock.mockRejectedValue(new Error("Failed to close issue"));

        const event: AsyncEvent = {
            queueName: "test-queue",
            jobId: "job-123",
            eventId: "event-1",
            body: {
                issueKey: "XYZ-999"
            }
        };

        await queueListener(event);

        expect(closeIssueMock).toHaveBeenCalledWith("XYZ-999");
        expect(console.error).toHaveBeenCalledWith("Failed to close issue. Event: ", "event-1", "test-queue");
    });
});
