export const assertNonEmpty = (str: string | undefined, description: string): void => {
    if (!str || str.trim().length === 0) {
        throw new Error(description);
    }
}