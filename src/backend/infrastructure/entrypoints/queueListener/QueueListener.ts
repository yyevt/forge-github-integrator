import {AsyncEvent} from "@forge/events";
import {Body} from "@forge/events/out/types";
import {BusinessOperations} from "../../di/BusinessOperations";

const businessOperations = new BusinessOperations();

const asyncEventConsumer = async (event: AsyncEvent): Promise<void> => {
    const body = event.body;
    if (!body || !isIssueKeyMetadata(body)) {
        console.error("Incorrect body in event: ", event.eventId, event.queueName);
        return;
    }

    const issueKey = body.issueKey;
    if (!issueKey) {
        console.error("Empty issue number in event: ", event.eventId, event.queueName);
        return;
    }

    try {
        await businessOperations.closeIssue(issueKey);
    } catch (e) {
        console.error((e instanceof Error ? e.message : String(e)) + ". Event: ", event.eventId, event.queueName);
    }
}

const isIssueKeyMetadata = (body: Body): body is { issueKey: string; } => {
    return Boolean(body) && "issueKey" in body && typeof body.issueKey === "string";
}

export const queueListener = asyncEventConsumer;