import React, {useEffect, useState} from "react";
import {SectionMessage, Spinner, Stack, Text} from "@forge/react";
import {ForgeGateway} from "../services/ForgeGateway";
import {GithubReposList} from "./GithubReposList";
import {RepositoryPresentationDto} from "../../common/PresentationTypes";

export const ConnectedScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [repos, setRepos] = useState<ReadonlyArray<RepositoryPresentationDto>>([]);
    const [fetchReposError, setFetchReposError] = useState("");

    useEffect(() => {
        (async () => {
            setFetchReposError("");
            setIsLoading(true);
            try {
                const info = await new ForgeGateway().getGithubReposWithPulls();
                setRepos(info);
            } catch (e) {
                setFetchReposError(e instanceof Error ? e.message : `Unknown error occurred: ${e}`);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading) {
        return <Spinner/>;
    }
    return (
        <Stack space="space.200">
            <SectionMessage appearance="warning">
                <Text>Only limited amount of repositories and pull-requests are shown: max 100 repos, max 100 pulls</Text>
            </SectionMessage>
            {fetchReposError && (
                <SectionMessage appearance="error">
                    <Text>{fetchReposError}</Text>
                </SectionMessage>
            )}
            <GithubReposList repos={repos}/>
        </Stack>
    );
}