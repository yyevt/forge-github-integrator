import {WebTriggerRequest, WebTriggerResponse} from "@forge/api/out/webTrigger";
import {GithubWebhookPullMetadata} from "./GithubWebhookTypes";
import {StatusCodes} from "http-status-codes";
import {getAppContext, webTrigger} from "@forge/api";
import {GithubWebhookPullMetadataMapper} from "./GithubWebhookPullMetadataMapper";
import {BusinessOperations} from "../../di/BusinessOperations";

if (getAppContext().environmentType === "DEVELOPMENT") {
    webTrigger.getUrl("github-merge-events-webtrigger")
        .then(webTriggerUrl => console.log("** WEB TRIGGER URL ** : ", webTriggerUrl));
}

const businessOperations = new BusinessOperations();

const webhookHandler = async (req: WebTriggerRequest): Promise<WebTriggerResponse> => {
    if (!req.body) {
        return sendTextResponse(StatusCodes.BAD_REQUEST, "Empty body provided");
    }

    const body = JSON.parse(req.body);
    if (!isGithubWebhookPullMetadata(body)) {
        return sendTextResponse(StatusCodes.BAD_REQUEST, "No valid body provided");
    }

    if (body.action !== "closed") {
        return sendTextResponse(StatusCodes.OK, "Event action is not closed");
    }

    const pull = body.pull_request;
    if (!pull || pull.state !== "closed" || !pull.merged) {
        return sendTextResponse(StatusCodes.OK, "Event pull state is not merged");
    }

    const pullAction = new GithubWebhookPullMetadataMapper().mapToEntity(body);
    try {
        await businessOperations.notifyPullIsMerged(pullAction);
    } catch (e) {
        return sendTextResponse(StatusCodes.INTERNAL_SERVER_ERROR, (e instanceof Error ? e.message : String(e)));
    }

    return sendTextResponse(StatusCodes.OK, "Event is processed");
}

const isGithubWebhookPullMetadata = (body: unknown): body is GithubWebhookPullMetadata => {
    if (typeof body !== "object"
        || body === null
        || !("action" in body)
        || !("pull_request" in body)) {
        return false;
    }

    const pr = (body as Record<string, unknown>)["pull_request"];
    return !(typeof pr !== "object" || pr === null || Array.isArray(pr) || !("state" in pr) || !("title" in pr) || !("head" in pr));
}

const sendTextResponse = (statusCode: StatusCodes, body: string): WebTriggerResponse => {
    return {
        statusCode: statusCode,
        headers: {"Content-Type": ["text/plain"]},
        body: body
    };
}

export const githubWebhookHandler = webhookHandler;