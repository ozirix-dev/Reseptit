/** The two B21 method corrections are now in canonical FI Markdown.
 * Preserve this adapter for existing build imports. Any future migration
 * must use its own reviewed source/SHA gate.
 */
export const material21MethodPaths: readonly string[] = Object.freeze([]);
export function projectMaterial21MethodsFi(_relativePath: string, input: string): string {
  return input;
}
