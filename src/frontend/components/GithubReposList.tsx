import {Box, EmptyState, Stack} from "@forge/react";
import React from "react";
import {RepoMainInfo} from "./RepoMainInfo";
import {RepoPullsList} from "./RepoPullsList";
import {RepositoryPresentationDto} from "../../common/PresentationTypes";

type GithubRepoListProps = {
    readonly repos: ReadonlyArray<RepositoryPresentationDto>,
    readonly onPullMerge: () => void,
}

export const GithubReposList = ({repos, onPullMerge}: GithubRepoListProps) => {
    return (
        <>
            {repos.length === 0 ? (
                <EmptyState header="Have no repositories"/>
            ) : (
                repos.map(repo => (
                    <Box key={repo.name} padding="space.300" backgroundColor="color.background.discovery">
                        <Stack>
                            <RepoMainInfo repo={repo}/>
                            <RepoPullsList
                                pulls={repo.pullRequests}
                                pullsTotalCount={repo.pullRequestsTotalCount}
                                isMergeAllowed={repo.isMergeCommitAllowed}
                                onPullMerge={onPullMerge}
                            />
                        </Stack>
                    </Box>
                ))
            )}
        </>
    );
}