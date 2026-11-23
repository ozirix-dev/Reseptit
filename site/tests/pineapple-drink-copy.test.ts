import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";

// Public copy includes the earlier editorial description and method corrections.
const preservedDisplay = {
  "fi": {
    "description": "Tuore ananas, sitruunamehu, kylmä vesi ja ripaus kanelia soseutuvat raikkaaksi juomaksi. Ananaksen hedelmäliha jää mukaan ja antaa juomalle rakennetta.",
    "instructionsText": [
      "Huuhtele ananas ja sitruuna ennen leikkaamista. Poista ananaksen kuori ja kova keskiosa. Paloittele ja punnitse 330 g hedelmälihaa. Purista sitruunamehu.",
      "Mittaa vesi ja sitruunamehu tehosekoittimeen. Lisää ananaspalat ja kaneli. Soseuta, kunnes juoma on mahdollisimman sileää.",
      "Jaa juoma siivilöimättä kahteen lasiin ja tarjoa kylmänä. Sekoita juoma tarvittaessa ennen tarjoilua, sillä kaneli voi laskeutua pohjalle."
    ]
  },
  "sv": {
    "description": "Mixa färsk ananas, citronsaft, kallt vatten och en nypa kanel till en frisk dryck. Fruktköttet får vara kvar och ger drycken fyllighet.",
    "instructionsText": [
      "Skölj ananasen och citronen innan du skär. Ta bort skalet och den hårda mitten av ananasen. Skär ananasen i bitar och väg upp 330 g fruktkött. Pressa citronen.",
      "Mät upp vatten och citronsaft i en mixer. Tillsätt ananasbitarna och kanelen. Mixa tills drycken är så slät som möjligt.",
      "Fördela den osilade drycken i två glas och servera kall. Rör om före servering vid behov, eftersom kanelen kan sjunka till botten."
    ]
  },
  "en": {
    "description": "Blend fresh pineapple, lemon juice, cold water and a pinch of cinnamon for a refreshing drink. The blended pineapple pulp gives it body.",
    "instructionsText": [
      "Rinse the pineapple and lemon before cutting. Remove the skin and hard center of the pineapple. Cut and weigh 330 g of pulp. Squeeze lemon juice.",
      "Measure water and lemon juice into a blender. Add the pineapple chunks and cinnamon. Puree until the drink is as smooth as possible.",
      "Divide the unstrained drink between two glasses and serve cold. If necessary, stir the drink before serving, as the cinnamon may sink to the bottom."
    ]
  },
  "th": {
    "description": "ปั่นสับปะรดสดกับน้ำเลมอน น้ำเย็น และอบเชยเล็กน้อยเป็นเครื่องดื่มรสสดชื่น เนื้อสับปะรดที่ปั่นรวมลงไปทำให้เครื่องดื่มมีเนื้อสัมผัส",
    "instructionsText": [
      "ล้างสับปะรดและเลมอนก่อนหั่น ปอกเปลือกสับปะรดและตัดแกนแข็งออก หั่นเนื้อสับปะรดแล้วชั่ง 330 กรัม จากนั้นคั้นน้ำเลมอน",
      "ตวงน้ำกับน้ำเลมอนใส่เครื่องปั่น ใส่สับปะรดที่หั่นไว้และอบเชย แล้วปั่นให้เนียนที่สุด",
      "เทเครื่องดื่มที่ไม่ได้กรองแบ่งใส่สองแก้ว แล้วเสิร์ฟเย็น หากจำเป็น ให้คนเครื่องดื่มก่อนเสิร์ฟ เพราะอบเชยอาจจมลงไปด้านล่าง"
    ]
  }
} as const;
const nutritionCopy = {
  fi: "Kanelin ravintoarvoja ei ole laskettu mukaan. Reseptissä on 0,35 g kanelia annosta kohti.",
  en: "Cinnamon is excluded from the nutrition calculation. The recipe contains 0.35 g of cinnamon per serving.",
  sv: "Kanelens näringsvärden ingår inte i beräkningen. Receptet innehåller 0,35 g kanel per portion.",
  th: "โดยไม่ได้รวมคุณค่าทางโภชนาการของอบเชย สูตรนี้ใช้อบเชย 0.35 กรัมต่อหนึ่งที่",
};

test("published pineapple drink preserves reviewed methods and explains the cinnamon omission", () => {
  const recipes = siteContent.recipes.filter(recipe => recipe.recipeId === "ananas-kanelijuoma-sitruunalla");
  assert.equal(recipes.length, 4);
  for (const recipe of recipes) {
    assert.equal(recipe.description, preservedDisplay[recipe.locale].description);
    assert.deepEqual(recipe.instructionsText, preservedDisplay[recipe.locale].instructionsText);
    assert.ok(recipe.notesHtml.includes(nutritionCopy[recipe.locale]), recipe.locale);
    assert.equal(recipe.servings, 2);
    assert.deepEqual(recipe.ingredients.map(ingredient => ingredient.amount), [330, 30, 2, 0.7]);
    assert.deepEqual(recipe.nutrition, { carbsNetG: 18.72, carbsTotalG: 20.88, proteinG: 0.87, fatG: 0.66 });
    for (const url of ["https://www.facebook.com/reel/862663536867684", "https://atelizabethstable.com/pineapple-cinnamon-wellness-shots/"]) {
      assert.ok(recipe.notesHtml.includes(`href="${url}"`), recipe.locale);
    }
    if (recipe.locale === "th") {
      assert.match(recipe.notesHtml, /โดยผสมสับปะรดกับขิง แล้วกรองเครื่องดื่ม/);
      assert.match(recipe.image?.alt ?? "", /เลมอน/);
      assert.doesNotMatch(JSON.stringify(recipe), /มะนาว|เครื่องดื่มก็เครียด/);
    }
  }
  const calculation = JSON.parse(readFileSync(path.resolve(import.meta.dirname,
    "../../docs/nutrition/calculations/ananas-kanelijuoma-sitruunalla.json"), "utf8")) as {
      servings: number;
      ingredients: Array<{ amount: number; item: string; excludedReason?: string;
        omissionImpactUpperBoundPerServing?: { netCarbohydrate: number } }>;
    };
  const cinnamon = calculation.ingredients.find(ingredient => ingredient.item === "jauhettua kanelia");
  assert.ok(cinnamon?.excludedReason);
  assert.equal(cinnamon.amount / calculation.servings, 0.35);
  assert.equal(cinnamon.omissionImpactUpperBoundPerServing?.netCarbohydrate, 0.35);
});

test("published notes and captions exclude the observed literal copy errors", () => {
  for (const recipe of siteContent.recipes) {
    assert.doesNotMatch(`${recipe.notesHtml} ${recipe.image?.alt ?? ""}`,
      /dimensions of this version|dimensionerna för denna version|เครื่องดื่มก็เครียด|practical dimensions of the recipe|receptets praktiska dimensioner|มิติในทางปฏิบัติของสูตรอาหาร/,
      `${recipe.recipeId}/${recipe.locale}`);
  }
  const cake = siteContent.recipes.filter(recipe => recipe.recipeId === "suklaa-raejuustokakku");
  assert.equal(cake.length, 4);
  assert.ok(cake.find(recipe => recipe.locale === "en")?.notesHtml.includes(
    "The pan size, number of servings, baking time and cooling times were chosen for this recipe."));
  assert.ok(cake.find(recipe => recipe.locale === "sv")?.notesHtml.includes(
    "Formens storlek, antalet portioner, gräddningstiden och tiderna för avsvalning och kylning har valts för det här receptet."));
  assert.ok(cake.find(recipe => recipe.locale === "th")?.notesHtml.includes(
    "ขนาดพิมพ์ จำนวนที่เสิร์ฟ เวลาอบ เวลาพักให้เย็น และเวลาแช่เย็นกำหนดไว้สำหรับสูตรนี้"));
});
