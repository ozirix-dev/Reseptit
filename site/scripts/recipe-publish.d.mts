type GitHubRead = (endpoint: string, options?: { pages?: boolean }) => Promise<unknown>;

export function assertOrigin(remote: string): void;
export function readGitHub(endpoint: string, options?: {
  pages?: boolean;
  run?: (command: string, args: string[], options: { cwd: string; timeout: number; maxBuffer: number }) =>
    Promise<{ stdout: string }>;
  delay?: (milliseconds: number) => Promise<unknown>;
}): Promise<unknown>;
export function inspectPublish(number: number, options?: {
  get?: GitHubRead;
  live?: () => Promise<string | null>;
  head?: string;
  base?: string;
}): Promise<{ code: string; head: string }>;

export function prepareForCurrentMain(base: string, head: string, options?: {
  get?: GitHubRead;
  prepare?: (base: string, head: string) => { code: string };
}): Promise<{ code: string }>;
