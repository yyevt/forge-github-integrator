export interface IssueKeyExtractor {

    extract(keySource: string): string | null;

}