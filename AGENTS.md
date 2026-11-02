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
