#!/usr/bin/env bash
set -euo pipefail

fail() {
  printf 'Recipe site revision: %s\n' "$*" >&2
  exit 1
}

sha_pattern='^[0-9a-f]{40}$'
[[ "$EVENT_SHA" =~ $sha_pattern ]] || fail 'Invalid event commit SHA'
[[ "$(git rev-parse HEAD)" == "$EVENT_SHA" ]] || fail 'Checkout differs from the event commit'
tested_sha="$EVENT_SHA"
pr_base=""

if [[ "$GITHUB_EVENT_NAME" == "pull_request" ]]; then
  [[ "$PR_HEAD" =~ $sha_pattern && "$PR_BASE_SNAPSHOT" =~ $sha_pattern ]] || fail 'Invalid PR SHAs'
  base_ref="refs/heads/$PR_BASE_REF"
  local_base="refs/recipe-site/base"
  git check-ref-format "$base_ref" || fail 'Invalid PR base ref'

  read -r original_base original_head extra < <(git show -s --format=%P "$EVENT_SHA")
  [[ -n "$original_base" && "$original_head" == "$PR_HEAD" && -z "$extra" ]] ||
    fail 'Event commit is not the expected two-parent PR merge'
  git merge-base --is-ancestor "$PR_BASE_SNAPSHOT" "$original_base" ||
    fail 'Event merge does not descend from the PR base snapshot'

  git fetch --no-tags --no-write-fetch-head origin "+$base_ref:$local_base"
  pr_base="$(git rev-parse "$local_base")"
  if [[ "$original_base" != "$pr_base" ]]; then
    git merge-base --is-ancestor "$original_base" "$pr_base" ||
      fail 'Current PR base diverged from the event merge base'
    printf 'Event base %s moved to %s. Preparing a fresh test merge.\n' "$original_base" "$pr_base"
    if ! merge_tree="$(git merge-tree --write-tree "$pr_base" "$PR_HEAD")"; then
      printf '%s\n' "$merge_tree" >&2
      fail 'Cannot merge the pinned PR head with the current base'
    fi
    [[ "$merge_tree" =~ $sha_pattern ]] || fail 'Git did not return a valid merge tree'
    git diff --quiet "$EVENT_SHA" "$merge_tree" -- .github/workflows/pages.yml .github/scripts/select-recipe-ci-revision.sh ||
      fail 'Recipe site workflow changed between the event and fresh test merge'
    tested_sha="$(git -c user.name='Recipe site CI' -c user.email='recipe-ci@users.noreply.github.com' \
      commit-tree "$merge_tree" -p "$pr_base" -p "$PR_HEAD" -m 'Recipe site test merge')"
    git checkout --detach "$tested_sha"
  fi
fi

[[ "$(git rev-parse HEAD)" == "$tested_sha" ]] || fail 'Checkout differs from the selected test commit'
printf 'pr_base=%s\ntested_sha=%s\n' "$pr_base" "$tested_sha" >> "$GITHUB_OUTPUT"
printf 'Event commit: %s\nTested commit: %s\nPR head: %s\nPR base: %s\n' \
  "$EVENT_SHA" "$tested_sha" "${PR_HEAD:-}" "$pr_base" >> "$GITHUB_STEP_SUMMARY"
