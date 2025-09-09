import {showFlag} from "@forge/bridge";
import {FlagType} from "@forge/bridge/out/flag/flag";

export const showToast = (id: string, title: string, type: FlagType, description: string): void => {
    showFlag({
        id: `${id}_${Math.random()}`,
        title,
        type,
        description,
        isAutoDismiss: true
    });
};