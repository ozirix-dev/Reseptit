# Repository routing

- Recipe creation, drafts and recipe nutrition calculations belong to
  `ozirix-dev/Reseptit` (local checkout: `D:\Projects\Products\Reseptit`).
- Before editing, committing or opening a recipe PR, verify `git remote get-url origin`.
  Do not infer repository identity from the Codex project label or current directory.
- `ozirix-dev/Ravinto` is a separate repository. A Codex project named Reseptit
  may incorrectly point there; use the verified Reseptit checkout or its worktree.
- Keep unfinished recipes as `status: draft` and follow the README and recipe schema.

## Autonomous Task Completion

- Read the canonical workstation `AGENTS.md` at
  `D:/Projects/_Hub/Master/AGENTS.md` where available and follow its Autonomous
  Execution policy. Continue safe, authorized implementation, review, testing
  and integration until the delegated objective is complete. A completed PR,
  test or report may be an intermediate checkpoint.
- Record blockers and continue independent, authorized work. Preserve the
  approved scope, Repo Guard, required CI, branch and worktree ownership,
  F25/GK approvals and deployment boundaries.

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

## Continuous Repository Hygiene

- Keep repository hygiene part of ongoing recipe, translation and feature
  development. Before a separate cleanup task, inspect the latest `main`,
  active PRs and file ownership. Coordinate with the existing owners.
- As part of each task, perform a read-only check for cleanup needs in the
  touched area, such as generated artifacts, temporary outputs and worktrees.
  Record findings outside the task scope for separate follow-up.
- Make cleanup changes in separate, narrowly scoped, auditable tasks.
  Preserve recipe data, F25 gates, GK evidence and history, nutrition
  calculations, existing approvals, and review and publication safeguards.
- A clean Git status alone never proves a worktree safe to remove. Check tracked,
  untracked and ignored files, locks, active use, open PRs and the relevant
  `main` ancestry. Missing or uncertain evidence means `KEEP`.
  `MANUAL_REVIEW` is a suggestion for separate verification and carries no
  deletion authority.
- Scheduled GitHub hygiene and local worktree inventories are **read-only**.
  Do not automatically delete branches/worktrees, use force deletion, rewrite
  history or clear caches containing uncertain local state. Any deletion needs
  separate explicit authorization, ownership checks and a guarded procedure.
  Follow the [worktree lifecycle](docs/worktree-lifecycle.md).
- CI optimizations must preserve the required `Recipe site / build`, tested-SHA
  verification, and applicable F25, GK, nutrition, translation and publication
  safeguards. Measure timings for equivalent check sets.

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
