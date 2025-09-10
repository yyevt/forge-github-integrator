import React, {useCallback, useState} from "react";
import {LoadingButton} from "@forge/react";
import {showToast} from "./Utils";
import {ForgeGateway} from "../services/ForgeGateway";
import {PullPresentationDto} from "../../common/PresentationTypes";

type MergeButtonProps = {
    readonly pullRequest: PullPresentationDto;
    readonly isDisabled: boolean;
    readonly onPullMerge: () => void;
}

export const MergeButton = ({pullRequest, isDisabled, onPullMerge}: MergeButtonProps) => {
    const [isMerging, setIsMerging] = useState(false);

    const merge = useCallback(async (): Promise<void> => {
        setIsMerging(true);
        try {
            await new ForgeGateway().mergePullRequest(pullRequest);
            showToast("success", "Success!", "success", "Pull.ts request was successfully merged.");

            onPullMerge();
        } catch (e) {
            console.error(e);
            showToast("err", "Error", "error", (e instanceof Error ? e.message : `Unknown error occurred: ${e}`));
        } finally {
            setIsMerging(false);
        }
    }, [pullRequest]);

    return (
        <LoadingButton
            isLoading={isMerging}
            isDisabled={isDisabled}
            onClick={merge}
        >
            Merge
        </LoadingButton>
    );
};