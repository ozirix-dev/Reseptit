type RecipeVersion = { path: string; locale: string; slug: string };
type Candidate = { id: string; published: RecipeVersion[]; drafts: RecipeVersion[]; evidence: string[] };

export function collectCandidates(entries: { file: string; read: () => string }[]): {
  groups: Candidate[];
  shared: string[];
  excluded: string[];
};
export function templateFromIndex(file: string, directory?: string): {
  source_sha256: string;
  decision: 'hold';
  reviewed_by: 'UNREVIEWED';
};
