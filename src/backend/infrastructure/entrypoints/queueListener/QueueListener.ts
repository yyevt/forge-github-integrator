import {AsyncEvent} from "@forge/events";
import {Jira} from "../../adapters/Jira/Jira";
import {Body} from "@forge/events/out/types";
import {CloseIssueUseCase} from "../../../application/usecases/CloseIssue/CloseIssueUseCase";
import {JiraApi} from "../../adapters/Jira/JiraApi";
import {ForgeMergeEventsQueueAdapter} from "../../adapters/ForgeQueue/ForgeMergeEventsQueueAdapter";
import {JiraIntegrationMapper} from "../../adapters/Jira/JiraIntegrationMapper";

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
        await new CloseIssueUseCase(new Jira(new JiraApi(), new JiraIntegrationMapper()), new ForgeMergeEventsQueueAdapter()).execute(issueKey);
    } catch (e) {
        console.error((e instanceof Error ? e.message : String(e)) + ". Event: ", event.eventId, event.queueName);
    }
}

const isIssueKeyMetadata = (body: Body): body is { issueKey: string;} => {
    return Boolean(body) && "issueKey" in body && typeof body.issueKey === "string";
}

export const queueListener = asyncEventConsumer;