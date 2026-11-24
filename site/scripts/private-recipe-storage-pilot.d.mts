type Recipe = { id: string; version: number; title: string; note: string };
type Input = { id?: string; version?: number; title?: string; note?: string };
type SaveError = 'UNAUTHORIZED' | 'INVALID_REQUEST' | 'IDEMPOTENCY_CONFLICT' |
  'VERSION_CONFLICT' | 'NOT_FOUND' | 'STORAGE_ERROR';

export function openSyntheticRecipeStore(file: string): {
  load(owner: string, id: string): { code: 'FOUND'; recipe: Recipe } |
    { code: 'UNAUTHORIZED' | 'INVALID_REQUEST' | 'NOT_FOUND' };
  save(owner: string, requestKey: string, input: Input): { code: 'SAVED'; recipe: Recipe } |
    { code: SaveError };
  close(): void;
};
