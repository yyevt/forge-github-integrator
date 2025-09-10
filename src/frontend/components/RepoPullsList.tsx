import {ButtonGroup, DynamicTable, EmptyState, Link, Lozenge} from "@forge/react";
import React, {useMemo} from "react";
import {HeadType} from "@atlaskit/dynamic-table/types";
import {ApproveButton} from "./ApproveButton";
import {MergeButton} from "./MergeButton";
import {PullPresentationDto} from "../../common/PresentationTypes";

type RepoPullsListProps = {
    readonly pulls: ReadonlyArray<PullPresentationDto>;
    readonly pullsTotalCount: number;
    readonly isMergeAllowed: boolean;
    readonly onPullMerge: () => void;
}

export const head: HeadType = {
    cells: [
        {key: "issue", content: "Issue", isSortable: true},
        {key: "isIssueClosed", content: "Is Closed", isSortable: false},
        {key: "title", content: "Title", isSortable: true},
        {key: "author", content: "Author", isSortable: true},
        {key: "state", content: "State", isSortable: true},
        {key: "isDraft", content: "Is Draft", isSortable: false},
        {key: "isClean", content: "Is Clean", isSortable: false},
        {key: "actions", content: "Actions", isSortable: false},
    ],
};

export const RepoPullsList = ({pulls, isMergeAllowed, pullsTotalCount, onPullMerge}: RepoPullsListProps) => {
    const tableRows = useMemo(
        () => createTableRows(pulls, isMergeAllowed, onPullMerge),
        [pulls, isMergeAllowed, onPullMerge]
    );

    return <>
        {pulls.length === 0 ? (
            <EmptyState header="Have no opened pull requests"/>
        ) : (
            <DynamicTable
                caption={`Repository Open PRs: ${pullsTotalCount}`}
                head={head}
                rows={tableRows}
                rowsPerPage={10}
            />
        )}
    </>;
};

const createTableRows = (pulls: ReadonlyArray<PullPresentationDto>, isMergeAllowed: boolean, onPullMerge: () => void) => {
    return pulls.map((pull, index) => {

        const isPullNonMergeable = isPullClosed(pull)
            || isPullMerged(pull)
            || isPullDraft(pull)
            || isPullNotClean(pull)
            || isRepoDisabled(pull)
            || isRepoArchived(pull);

        return ({
            key: `row-${index}-${pull.url}`,
            cells: [
                {content: <Link href={`/browse/${pull.issueKey}`}>{pull.issueKey}</Link>},
                {content: <Lozenge appearance="moved">{pull.issueIsClosed ? "Yes" : "No"}</Lozenge>},
                {content: <Link href={pull.url}>{pull.title}</Link>},
                {content: pull.authorLogin},
                {content: <Lozenge appearance="inprogress">{pull.state}</Lozenge>},
                {content: <Lozenge appearance="moved">{isPullDraft(pull) ? "Yes" : "No"}</Lozenge>},
                {content: <Lozenge appearance="moved">{isPullNotClean(pull) ? "No" : "Yes"}</Lozenge>},
                {
                    content: (
                        <ButtonGroup>
                            <ApproveButton
                                pullRequest={pull}
                            />
                            <MergeButton
                                pullRequest={pull}
                                isDisabled={!isMergeAllowed || isPullNonMergeable}
                                onPullMerge={onPullMerge}/>
                        </ButtonGroup>
                    )
                }
            ]
        });
    });
}

const isPullClosed = (pull: PullPresentationDto) => pull.state !== 'OPEN';
const isPullMerged = (pull: PullPresentationDto) => pull.merged;
const isPullDraft = (pull: PullPresentationDto) => pull.isDraft;
const isPullNotClean = (pull: PullPresentationDto) => pull.mergeable != "MERGEABLE";
const isRepoDisabled = (pull: PullPresentationDto) => pull.repoIsDisabled;
const isRepoArchived = (pull: PullPresentationDto) => pull.repoIsArchived;
