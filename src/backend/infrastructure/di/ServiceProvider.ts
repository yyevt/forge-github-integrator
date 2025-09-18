import {Github} from "../adapters/Github/Github";
import {Jira} from "../adapters/Jira/Jira";
import {JiraSDK} from "../adapters/Jira/JiraSDK";
import {JiraIntegrationMapper} from "../adapters/Jira/JiraIntegrationMapper";
import {GithubSDK} from "../adapters/Github/GithubSDK";
import {GithubIntegrationMapper} from "../adapters/Github/GithubIntegrationMapper";
import {ForgeMergeEventsQueueAdapter} from "../adapters/ForgeQueue/ForgeMergeEventsQueueAdapter";
import {ForgeSecretStorage} from "../adapters/ForgeStore/ForgeSecretStorage";
import {VersionControlPlatform} from "../../application/ports/VersionControlPlatform";
import {IssueTrackingSoftware} from "../../application/ports/IssueTrackingSoftware";
import {MergeEventsQueue} from "../../application/ports/MergeEventsQueue";
import {AccessTokenStorage} from "../../application/ports/AccessTokenStorage";
import {IssueKeyExtractor} from "../../application/usecases/NotifyPullRequestIsMerged/IssueKeyExtractor";
import {JiraIssueKeyExtractor} from "../adapters/Jira/JiraIssueKeyExtractor";

export class ServiceProvider {

    public static github(): VersionControlPlatform {
      return new Github(new GithubSDK(), new GithubIntegrationMapper());
    }

    public static jira(): IssueTrackingSoftware {
        return new Jira(new JiraSDK(), new JiraIntegrationMapper());
    }

    public static jiraKeyExtractor(): IssueKeyExtractor {
        return new JiraIssueKeyExtractor();
    }

    public static forgeMergeQueue(): MergeEventsQueue {
        return new ForgeMergeEventsQueueAdapter("merge-events-queue");
    }

    public static forgeSecrets(): AccessTokenStorage {
        return new ForgeSecretStorage();
    }
}