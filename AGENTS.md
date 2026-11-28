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

## RECIPAVO-AUTONOMIA-V1

- The owner has authorized routine Recipavo development within the existing
  role, scope and ownership rules. Do not ask the user again for routine
  branch work, guarded writes, commits, pushes, PRs, tests, CI or reviews
  covered by the [standing decision](https://github.com/ozirix-dev/Reseptit/issues/969#issuecomment-7212803624).
- Chat 1 coordinates one main integration at a time and makes routine Ready,
  merge and release decisions. Kokki-Codex 1 is the primary local operator.
  Only publish an approved revision through the existing release process.
  An explicit user HOLD or prohibition remains in force, including #1020.
- Keep repository identity, one writer per branch, Repo Guard reservations,
  risk-based independent review, revision-bound evidence, required CI,
  food safety, publication approvals and production verification. Reuse
  evidence for unchanged content and review material deltas. Verify both
  the content and the resulting Git blob if line endings are normalized.
- A mandatory system approval or denied technical gate still controls the
  operation. Stop the affected action and continue independent work.
  Do not switch tools, identities or execution routes to get around a denial.
  User decisions outside normal scope follow section 4 of the standing decision.
- GitHub holds decisions, ownership and queue status. ReportHub is a parallel
  view. If a work cycle is scheduled, carry this decision into its existing
  instructions and record any management-tool blocker in the work queue.

## Parallel ChatGPT sessions (Chat 1–n)

- Every active ChatGPT work session must identify itself as `Chat N` where
  `N` is a **user-assigned positive integer with no fixed maximum**.
  Examples: Chat 1, Chat 5, Chat 12, Chat 100. Never guess or self-assign a
  missing number. Confirm it with the user before starting GitHub writes.
- Before writing, check the repository, latest `main`, open PRs and changed
  file ownership. **Exactly one chat owns writes to each PR branch.**
- For new work use `chat<N>/<task>-<date>` as the branch prefix when possible.
  Put `[Chat N]` in every new PR title and **`Työn omistaja: Chat N` in
  the PR description**, plus scope, branch, affected paths and dependencies.
  The chat must write these fields itself even when a GitHub connector or API
  does not automatically apply the PR template.
- When resuming an existing PR created before this rule, the responsible chat
  adds its own `Työn omistaja: Chat N` and scope in a PR comment at its next
  update. Do not rename working branches or claim another chat's PR.
- If a branch HEAD changes unexpectedly or two sessions need to write the
  same file, stop and coordinate a single owner. An ownership comment does
  not transfer authenticated permissions or bypass SHA checks, Repo Guard,
  CI, F25/GK, translation, nutrition or publication gates.
- See [parallel ChatGPT ownership guidance](docs/rinnakkaisten-chatien-omistajuus.md)
  and [the PR description template](.github/pull_request_template.md).

## Named Codex worker: Kokki-Codex

- The user-assigned technical worker is **Kokki-Codex**. This is a
  **separate role**, not a numbered `Chat N` session and not a GitHub
  authentication identity. Do not assign Kokki-Codex a Chat number.
- For new Codex-owned GitHub work, use `[Kokki-Codex]` in the PR title,
  `Työn omistaja: Kokki-Codex` in the PR body and, when possible,
  `kokki-codex/<task>-<date>` for the branch. Preserve existing branch
  names and their owners; do not relabel old PRs automatically.
- Kokki-Codex may conduct architecture studies, targeted code fixes,
  tests and handoffs only within the user's authorized task scope.
  A read-only audit is read-only; it does not authorize code or GitHub
  writes, PR creation, Ready, merge or deployment.
- **Chat-1 (Pääkokki) alone coordinates Ready transitions, merging and
  post-merge main CI** in the current Reseptit workflow. Kokki-Codex
  prepares its own scoped PR as Draft and hands it over with exact
  HEAD/base SHA, test results, blockers and affected paths. No implicit
  transfer of another Chat's PR branch or ownership.
- Chat-2–6 retain their own existing tasks and PR branches. Coordinate
  overlapping files with the owning chat before any new writes. This
  naming convention does not alter Repo Guard, GitHub protections,
  F25/GK/nutrition/translation reviews, HOLD or release requirements.
- See [parallel ChatGPT ownership guidance](docs/rinnakkaisten-chatien-omistajuus.md)
  for the collaboration and notification rule.

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

## Riskiperusteinen PR-katselmointi – yksi riittävä tarkistus

- Luokittele PR muuttuneiden tiedostojen **vaikutuksen**, ei vain PR-otsikon perusteella. Pieni dokumentti-/tutkimusmuistio-PR voidaan käsitellä kevyesti vain, jos se **ei muuta julkaistavaa sisältöä, reseptin tilaa, ravintoarvoja, GK:ta, käännöksiä, turvallisuuskäytäntöjä, portteja tai tuotantojulkaisua**. Jos dokumentti muuttaa normatiivisia turvallisuus-/laskentasääntöjä tai antaa uuden julkaisuhyväksynnän, käsittele sitä korkeamman riskin muutoksena.
- Kevyt PR: **yksi todellinen, rajattu sisältökatselmointi** riittää. Sen voi kirjata yhteen GitHub-katselmointiin **tai** PR-kommenttiin; älä teetä samaa vertailua useassa chatissa, äläkä avaa erillisiä pelkkiä hyväksyntä-PR:iä. Katselmoija tarkistaa muuttuneet tiedostot, alkuperän ja sisäisen johdonmukaisuuden sekä esittää tuloksen, rajaukset, löydökset ja tarkistetun HEAD-SHA:n. Laskentamuistiossa tarkista ainesosat, määrät, annosjako ja laskut; erottele laskutoimituksen oikeellisuus ulkoisten lähteiden itsenäisestä varmentamisesta. Pelkkä botin 'no findings' tai vihreä CI ei korvaa sisällöllistä tarkistusta.
- Jos pätevä, versioon sidottu katselmointi on jo kirjattu eikä aineisto ole sen jälkeen olennaisesti muuttunut, **Chat-1 ei toista katselmointia**: tarkista vain katselmoinnin kattavuus, uudet kommentit, täsmällinen nykyinen HEAD/base, CI, GitHubin vaaditut hyväksynnät ja Repo Guardin preflight; yhdistä vain suojatun menettelyn kautta. Jos branch protection vaatii muodollisen `APPROVE`-hyväksynnän, tavallinen kommentti ei korvaa sitä.
- Materiaaliset ruoka-/elintarviketurvallisuus-, allergeeni-, ravinto-, GI/GK-, F25-, karanteeni-, lähde- ja käännösmuutokset sekä julkaisu- tai CI-porttien muutokset **eivät saa kevyen dokumentti-PR:n poikkeusta**. Noudata edelleen niiden todellisia riippumattomia evidenssi- ja hyväksyntävaatimuksia. Avoin P0/P1, vanhentunut evidenssi tai ratkaisematon lähderistiriita = HOLD. FI-lähdekatselmoinnin oma riippumaton päätösvaatimus (#369) säilyy.
- HEADin muuttuessa arvioi, koskeeko muutos aiemmin tarkistettua sisältöä; uusi asiamuutos vaatii päivitetyn katselmoinnin. Pakollinen `Recipe site / build`, muut soveltuvat tarkistukset, täsmä-SHA, yksi kirjoittaja/haara, Repo Guardin paikallinen suostumus ja sovellettavat julkaisuhyväksynnät **säilyvät**. Älä käytä kevennystä suojauksen kiertämiseen.
- Kirjaa lyhyesti **yksi päätös ja jäljelle jääneet HOLDit** samaan PR:ään. Ei useita osittain päällekkäisiä raportteja, hyväksyntäkierroksia tai ylimääräisiä CI-ajokertoja, ellei tarkistus paljasta konkreettista korjattavaa.

## Recipe review without an in-house test kitchen

- An in-house test kitchen is not available. Do **not** make the author's own
  physical cooking trial a blanket condition for publication. A recipe may
  advance on documented independent published preparation evidence, preferably
  a tested recipe by an identified cook/author, with quantities, ingredient
  states, timing and method independently cross-checked against food-safety
  guidance where relevant.
- Record the recipe author's/source's tested claim separately from Recipavo's
  editorial adaptation: **never** claim Recipavo prepared, tasted, weighed or
  laboratory-tested a dish without that evidence. Distinguish source-backed
  steps from newly invented proportions or changed cooking methods.
- A missing in-house test is **not by itself** a HOLD. Materially unsupported
  quantities, unsafe handling, unverified fermentation, incompatibility between
  method and source, or unsupported nutrition/GK remain HOLD; do not bypass
  quarantine, translation, image, evidence or Repo Guard release gates.
- For issue #404's five held drafts, follow the source-evidence review and
  explicit discrepancies in
  `docs/reviews/issue404-b-five-draft-recipes/source-review-without-kitchen.md`.

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

## Named GI/GK batch work: laskeGK

- A user instruction `laskeGK N` (N = 1–30, default 10) selects the reusable
  project skill [`laske-gk`](.agents/skills/laske-gk/SKILL.md).
  In Codex, explicitly invoke it with `$laske-gk N`. The number is a maximum
  count of distinct current **original-recipe identities** to review in one
  batch, not a quota of numerical GK results or CI runs.
- Reuse current review queues and evidence, batch similar cases, test targeted
  changes locally before pushing, and update ReportHub once per completed
  stage. Resume from the owned branch/committed evidence after interruption.
- Keep all GK/F25/nutrition/history/review/translation controls and the
  existing one-writer-per-branch rule. A batch command never grants merge,
  deployment or ownership of another session's active PR.
