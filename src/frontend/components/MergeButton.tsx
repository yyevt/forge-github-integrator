import React, {useCallback, useState} from "react";
import {LoadingButton} from "@forge/react";
import {showToast} from "./Utils";
import {ForgeGateway} from "../services/ForgeGateway";
import {PullPresentationDto} from "../../common/PresentationTypes";

export const MergeButton = ({pullRequest, isDisabled}: { pullRequest: PullPresentationDto, isDisabled: boolean }) => {
    const [isMerging, setIsMerging] = useState(false);

    const merge = useCallback(async (): Promise<void> => {
        setIsMerging(true);
        try {
            await new ForgeGateway().mergePullRequest(pullRequest);
            showToast("success", "Success!", "success", "Pull.ts request was successfully merged.");
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