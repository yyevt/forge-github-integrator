import {GithubWebhookPullMetadata} from "./GithubWebhookTypes";
import {PullRequestAction} from "../../../domain/entities/PullRequestAction";

export class GithubWebhookPullMetadataMapper {

    public mapToEntity(metadata: GithubWebhookPullMetadata): PullRequestAction {
        return new PullRequestAction({
            action: metadata.action,
            number: metadata.number,
            title: metadata.pull_request.title,
            head: {
                label: metadata.pull_request.head.label,
                ref: metadata.pull_request.head.ref
            }
        });
    }
}