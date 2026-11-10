/** B21 #02/#40/#63 were migrated into canonical FI recipes.
 * Keep the no-op adapter until all build/test callers can remove this import.
 * Nutrition / GK approvals remain separate from the method-text migration.
 */
export const material21FiPaths: readonly string[] = Object.freeze([]);

export function projectMaterial21FiDisplay(_relativePath: string, input: string): string {
  return input;
}
