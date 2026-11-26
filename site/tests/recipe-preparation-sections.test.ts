import assert from "node:assert/strict";
import { test } from "node:test";
import { recipePreparationSections } from "../scripts/build-content";

test("preserves separate storage and safety sections in document order", () => {
  for (const lineEnding of ["\n", "\r\n"]) {
    for (const title of ["Säilytys ja turvallisuus", "Storage and safety", "Förvaring och säkerhet",
      "การเก็บและความปลอดภัย", "การเก็บรักษาและความปลอดภัย"]) {
      const markdown = [
        "## Instructions", "Cook.", `## ${title}`, "First safety instruction.",
        "## Notes", "Serving note.", `## ${title}`, "Second safety instruction.",
        "## Sources", "Source evidence.",
      ].join(lineEnding);
      assert.deepEqual(recipePreparationSections(markdown), {
        instructions: "Cook.",
        notes: [`### ${title}\n\nFirst safety instruction.`, "Serving note.",
          `### ${title}\n\nSecond safety instruction.`].join("\n\n"),
      });
    }
  }
});

test("preserves recognized notes under both Finnish spellings", () => {
  const markdown = "## Valmistus\nValmista.\n## Huomioita\nEnsimmäinen.\n## Huomiot\nToinen.";
  assert.deepEqual(recipePreparationSections(markdown), {
    instructions: "Valmista.",
    notes: "Ensimmäinen.\n\nToinen.",
  });
});