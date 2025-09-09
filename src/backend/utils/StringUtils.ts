export const assertNonEmpty = (str: string | undefined | null, description: string): void => {
    if (!str || str.trim().length === 0) {
        throw new Error(description);
    }
}