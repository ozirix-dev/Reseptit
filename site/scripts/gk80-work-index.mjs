import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

const inventoryPath = "docs/nutrition/gk80-operation80-inventory.json";
const catalogPaths = [
  "docs/nutrition/glycemic-index-records.json",
  "docs/nutrition/food-records.json",
  "docs/nutrition/fineli-release-20-reference.json",
  "docs/nutrition/afcd-release-3-reference.json",
];
const sha = /^[a-f0-9]{40}$/;
const published = new Set(["PUBLISHED_SINGLE", "PUBLISHED_RANGE"]);
const proposed = new Set(["PROPOSED_SINGLE", "PROPOSED_RANGE"]);

export function buildWorkIndex({ main, inventoryHead, inventory, heads, catalog, recent, lastCheck }) {
  if (!sha.test(main) || !sha.test(inventoryHead) || inventory.main !== main) {
    throw new Error("Inventory is stale: refresh it against the verified remote main.");
  }
  const recipes = new Map(inventory.recipes.map(recipe => [recipe.recipeId, recipe]));
  if (recipes.size !== inventory.recipes.length || recipes.has(undefined)) {
    throw new Error("Inventory contains missing or duplicate recipe IDs.");
  }
  const reviewHeads = Object.entries(inventory.reviewedPrHeads);
  const changedPullRequests = reviewHeads.filter(([number, head]) => heads.get(number) !== head)
    .map(([number]) => Number(number));
  const approved = [...recipes.values()].filter(row => published.has(row.status));
  return {
    main,
    coverage: { numeric: approved.length, total: recipes.size },
    approvedVersions: [...recipes.values()].filter(row => row.ownerApproval)
      .map(({ recipeId, ownerApproval }) => ({ recipeId, ownerApproval })),
    openProposals: [...recipes.values()].filter(row => proposed.has(row.status))
      .map(({ recipeId, status }) => ({ recipeId, status })),
    inventory: { path: inventoryPath, head: inventoryHead },
    pullRequests: reviewHeads.map(([number, reviewedHead]) => ({
      number: Number(number), reviewedHead, currentHead: heads.get(number) ?? null,
    })),
    changedPullRequests,
    catalog,
    recent,
    queue: changedPullRequests.length ? [] : inventory.queue.slice(0, 10),
    next: changedPullRequests.length ? "Refresh changed PR evidence before using the queue." : inventory.nextRecipeId,
    lastSuccessfulCalculationCheck: lastCheck ?? null,
  };
}

function run(command, ...args) {
  return execFileSync(command, args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }).trim();
}

function main() {
  const pr = process.argv[2] ?? "230";
  if (!/^[1-9]\d*$/.test(pr)) throw new Error("Pass a numeric inventory PR.");
  const refs = new Map(run("git", "ls-remote", "origin", "refs/heads/main", "refs/pull/*/head")
    .split("\n").map(line => line.trim().split(/\s+/).reverse()));
  const main = refs.get("refs/heads/main");
  const inventoryHead = refs.get("refs/pull/" + pr + "/head");
  if (!sha.test(main) || !sha.test(inventoryHead)) throw new Error("Remote main or inventory PR head is unavailable.");
  const inventoryText = execFileSync("git", ["show", inventoryHead + ":" + inventoryPath],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  const inventory = JSON.parse(inventoryText);
  const heads = new Map(Object.keys(inventory.reviewedPrHeads)
    .map(number => [number, refs.get("refs/pull/" + number + "/head")]));
  const catalog = catalogPaths.map(path => ({
    path, revision: main, gitBlob: run("git", "rev-parse", main + ":" + path),
  }));
  const revisions = run("git", "log", "-11", "--format=%H", inventoryHead, "--", inventoryPath).split("\n");
  const earlier = revisions.at(-1);
  const oldStatuses = new Map(JSON.parse(run("git", "show", earlier + ":" + inventoryPath))
    .recipes.map(row => [row.recipeId, row.status]));
  const recent = inventory.recipes.filter(row => oldStatuses.get(row.recipeId) !== row.status)
    .map(row => row.recipeId).slice(0, 10);

  const repo = "ozirix-dev/Reseptit";
  const [check] = JSON.parse(run("gh", "run", "list", "-R", repo, "--workflow", "pages.yml",
    "--event", "push", "--commit", main, "--status", "success", "--limit", "1",
    "--json", "databaseId,headSha,updatedAt,url"));
  let lastCheck;
  if (check?.headSha === main) {
    const { jobs } = JSON.parse(run("gh", "run", "view", "-R", repo, String(check.databaseId), "--json", "jobs"));
    if (jobs.some(job => job.steps.some(step => step.name === "Build the publishable site" &&
      step.conclusion === "success"))) {
      lastCheck = { head: main, time: check.updatedAt, url: check.url };
    }
  }
  const index = buildWorkIndex({ main, inventoryHead, inventory, heads, catalog, recent, lastCheck });
  index.inventory.pullRequest = Number(pr);
  index.inventory.sha256 = createHash("sha256").update(inventoryText).digest("hex");
  console.log(JSON.stringify(index));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
