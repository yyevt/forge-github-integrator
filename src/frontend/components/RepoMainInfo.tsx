import {Heading, Inline, Link, Lozenge, Tag, TagGroup, Text} from "@forge/react";
import React, {useMemo} from "react";
import {RepositoryPresentationDto} from "../../common/PresentationTypes";

export const RepoMainInfo = ({repo}: { repo: RepositoryPresentationDto }) => {
    const formattedCreatedDate = useMemo(
        () => formatDate(repo.createdAt),
        [repo]
    );

    return (
        <>
            <Heading as="h2">
                <Inline>
                    <Link href={repo.url}>{repo.name}</Link>
                    <Tag text={repo.visibility.toLowerCase()}/>
                    <Lozenge appearance={repo.isDisabled ? "removed" : "success"}>{repo.isDisabled ? "Disabled" : "Not disabled"}</Lozenge>
                    <Lozenge appearance={repo.isArchived ? "removed" : "success"}>{repo.isArchived ? "Archived" : "Not archived"}</Lozenge>
                </Inline>
            </Heading>
            <Text>Created: {formattedCreatedDate}</Text>
            <Text>Owner: {repo.ownerLogin}</Text>
            {repo.languages.length > 0 && (
                <TagGroup>
                    {repo.languages.map(lang => <Tag text={lang}/>)}
                </TagGroup>
            )}
        </>
    );
}

const formatDate = (dateValue: string) => new Date(dateValue).toDateString();