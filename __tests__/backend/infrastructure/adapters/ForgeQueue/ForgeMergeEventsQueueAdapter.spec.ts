import {Queue} from "@forge/events";
import {ForgeMergeEventsQueueAdapter} from "../../../../../src/backend/infrastructure/adapters/ForgeQueue/ForgeMergeEventsQueueAdapter";

jest.mock("@forge/events");

/**
 * N.B! Not all methods and classes are tested, only important ones
 */
describe("ForgeMergeEventsQueueAdapter", () => {

    let queueMock: jest.Mock;
    let pushMock: jest.Mock;
    let getJobMock: jest.Mock;
    let getStatsMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        pushMock = jest.fn().mockResolvedValue({jobId: "job-123"});
        getStatsMock = jest.fn().mockResolvedValue({success: 10, inProgress: 2, failed: 1});
        getJobMock = jest.fn(() => ({getStats: getStatsMock}));
        queueMock = jest.fn(() => ({push: pushMock, getJob: getJobMock}));

        (Queue as jest.Mock) = queueMock;
    });

    it("should create Queue instance with given key", () => {
        new ForgeMergeEventsQueueAdapter("my-queue-key");

        expect(queueMock).toHaveBeenCalledWith({key: "my-queue-key"});
    });

    it("push should call queue.push and getJob.getStats, returning correct stats", async () => {
        const adapter = new ForgeMergeEventsQueueAdapter("test-queue");

        const result = await adapter.push({foo: "bar"});

        expect(pushMock).toHaveBeenCalledWith({body: {foo: "bar"}});
        expect(getJobMock).toHaveBeenCalledWith("job-123");
        expect(getStatsMock).toHaveBeenCalled();

        expect(result).toEqual({success: 10, inProgress: 2, failed: 1});
    });

    it("should throw if queueKey is empty", () => {
        expect(() => new ForgeMergeEventsQueueAdapter(""))
            .toThrow("Queue key must be provided");
    });
});
