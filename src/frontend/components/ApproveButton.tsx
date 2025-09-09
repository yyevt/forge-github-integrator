import React, {useCallback, useState} from "react";
import {LoadingButton} from "@forge/react";
import {showToast} from "./Utils";
import {ForgeGateway} from "../services/ForgeGateway";
import {PullPresentationDto} from "../../common/PresentationTypes";

export const ApproveButton = ({pullRequest}: { pullRequest: PullPresentationDto }) => {
    const [isApproving, setIsApproving] = useState(false);

    const approve = useCallback(async (): Promise<void> => {
        setIsApproving(true);
        try {
            await new ForgeGateway().approvePullRequest(pullRequest);
            showToast("success", "Success!", "success", "Pull.ts request was successfully approved.");
        } catch (e) {
            console.error(e);
            showToast("err", "Error", "error", (e instanceof Error ? e.message : `Unknown error occurred: ${e}`));
        } finally {
            setIsApproving(false);
        }
    }, [pullRequest]);

    return (
        <LoadingButton
            isLoading={isApproving}
            onClick={approve}
        >
            Approve
        </LoadingButton>
    );
};