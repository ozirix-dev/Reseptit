# Repository routing

- Recipe creation, drafts and recipe nutrition calculations belong to
  `ozirix-dev/Reseptit` (local checkout: `D:\Projects\Products\Reseptit`).
- Before editing, committing or opening a recipe PR, verify `git remote get-url origin`.
  Do not infer repository identity from the Codex project label or current directory.
- `ozirix-dev/Ravinto` is a separate repository. A Codex project named Reseptit
  may incorrectly point there; use the verified Reseptit checkout or its worktree.
- Keep unfinished recipes as `status: draft` and follow the README and recipe schema.

## Parallel Codex sessions

- Give each parallel writing session its own named role, worktree, Git branch
  and bounded file scope. Read access to another session's results does not
  grant write access to its worktree or branch.
- Exactly one named session owns writes to a PR branch and its worktree.
  Research sessions hand off pinned commits or source/input-hash packages;
  the PR owner performs integration. Integration approval alone does not
  transfer branch ownership. Name any ownership transfer and stop the previous
  writer before the new writer starts.
- Before changing an owned PR branch or pushing, check the remote HEAD and PR
  stage. An unexpected change or a second writer stops writes to that branch;
  preserve your own work separately and report the conflict.
- Treat a Ready PR as a scoped release candidate. Admit only agreed fixes;
  adding a new research batch requires an explicit scope decision and planned
  integration through its owner. Follow existing user authorizations without
  asking again for permission already granted.
- Bind approval, review and CI claims to the exact content and HEAD they
  cover. Content approval or Ready status does not itself grant merge/deploy
  authority. Check generated local outputs after branch changes or reverts;
  a clean Git status does not prove ignored outputs are current.
- repo_guard verifies repository identity and destinations; it is not a
  session/branch lock. Continue using its required guarded operations.
- Detailed project workflow and handoff format:
  [Rinnakkaisten Codex-ajojen toimintatapa](docs/rinnakkaiset-codex-ajot.md).

## Continuous repository hygiene

- Keep repository hygiene as a continuous, separately scoped maintenance lane
  alongside recipe, translation and feature development. Before each cleanup,
  inspect the latest `main`, active PRs and file owners; do not duplicate work
  already in progress or expand another session's write scope.
- At the end of each development task, check for newly generated artifacts,
  obsolete temporary outputs and possible branch/worktree leftovers **read-only**.
  Record out-of-scope follow-ups rather than silently changing other files.
- Prefer small, auditable cleanup PRs. Preserve recipe data, F25 gates, GK
  evidence/history, approvals and review fixtures unless they are the explicitly
  authorized scope of a separate reviewed change.
- A clean Git status alone never proves a worktree safe to remove. Check tracked,
  untracked and ignored files, locks, active use, open PRs and the relevant
  `main` ancestry. Unknown evidence means **KEEP**; `MANUAL_REVIEW` is only a
  candidate for human verification, not deletion permission.
- Scheduled GitHub hygiene and local worktree inventories are **read-only**.
  Do not automatically delete branches/worktrees, use force deletion, rewrite
  history or clear caches containing uncertain local state. Any deletion needs
  separate explicit authorization, ownership checks and a guarded procedure.
- CI optimizations must preserve the required `Recipe site / build`, tested-SHA
  verification and applicable F25, GK, translation and publication safeguards.
  Compare like-for-like timings; a narrower test selection is not proof of a
  faster full test run.

## Recipe translation quality

- Publish recipe translations after automated checks and a Codex comparison
  against the Finnish source pass, with no known material error.
- Require human review only if material safety or content uncertainty remains
  unresolved. Triage reported errors and correct them by risk.
- Review new published translations and refresh the review for substantive
  changes to either language file. Save the two semantic hashes, review date,
  reference and findings in `meta/kaannokset/codex-review-evidence.json`.
- Start with unresolved P0/P1 findings and changed pairs. Use the existing
  review queue and continue from its recorded state.
- Record the checked scope and results. Follow the
  [translation review policy](docs/translation-review-policy.md) for checks,
  severity levels and feedback handling.
## Web/UI visual guidance

- Read [Reseptit UI and accessibility guidance](docs/ulkoasu-ja-kaytettavyys.md) before changing layout, typography, content hierarchy or site-wide visuals.
- Use the private `ozirix-dev/Ossi` web-design foundation as **background guidance**, not this project's source of truth; consult only relevant topics and do not copy Ossi research or assets into this public repository.
- Preserve the site's existing styling by default; fix observed issues with narrowly scoped changes. Check concurrent PR file ownership before starting.
