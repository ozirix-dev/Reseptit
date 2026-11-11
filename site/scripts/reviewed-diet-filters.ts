import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import type { RecipeDietTag, RecipeLocale } from "../src/types/content";

// Explicit editorial whitelist; never infer diet compatibility from nutrition,
// primary ingredients, text tags or existing keto/VHH labels.
// A vegan recipe is also vegetarian and compatible with pescatarian eating.
export interface ReviewedDietSource {
  tags: readonly RecipeDietTag[];
  // FI is mandatory. Only published, individually reviewed translations
  // receive optional EN/SV/TH SHA pins. Missing pins never imply approval.
  sourceBlobShas: Readonly<{ fi: string } & Partial<Record<RecipeLocale, string>>>;
}

export const reviewedDietFilters: Readonly<Record<string, ReviewedDietSource>> = {
  "karnivore-smashburger": {
    tags: ["carnivore"],
    sourceBlobShas: { fi: "9aeef01b3fd8f907f1d0ffae3c0f9d7dbb75b737" },
  },
  "karnivore-steak-and-eggs": {
    tags: ["carnivore"],
    sourceBlobShas: { fi: "5e579c3a60b1835d2bd4895c377502139bb23b91" },
  },
  "karnivore-voilohi-pannulla": {
    tags: ["carnivore"],
    sourceBlobShas: { fi: "07f5b5670af65776209493cc4dce2b897f2635b0" },
  },
  "karnivore-jauhelihakulho-munalla": {
    tags: ["carnivore"],
    sourceBlobShas: { fi: "9f294f216ac4f94dacf745e197b3d6bd3cc96451" },
  },
  hummus: {
    tags: ["vegetarian", "vegan", "pescatarian"],
    sourceBlobShas: {
      fi: "cd792d70d50753a5f8f93eeca030ec3743cfb209",
      en: "226fcc49b596963b806566d7d303f065b49ba257",
      sv: "82048ac89eb3ad107f3e1c76eab9d3a74a5d5aa5",
      th: "17cfb4760fec649a73ee27226a6ea6cddeff5249",
    },
  },
  caponata: {
    tags: ["vegetarian", "vegan", "pescatarian"],
    sourceBlobShas: {
      fi: "f8ed686e1e15fce50c36c1cfa2995ef25485819d",
      en: "117262c6b9c396ad4dc9a01d246627f9dbed377a",
      sv: "2b1534fcb425b4df56472a89df36be6f7d5d3a72",
      th: "def8d4f0777e97006590034d6bd3c36c0f59fae2",
    },
  },
  munakokkeli: {
    tags: ["vegetarian", "pescatarian"],
    sourceBlobShas: {
      fi: "9aebef80445adac268f797a7df4d5473cf361d14",
      en: "6b6b2d509a222a9d2b0096092ce47dd97a7dd5d1",
      sv: "5c6eeaaa612c3c4b0389d4182a9f9f338ee4dcf9",
      th: "30d4f51369e89f28e98e58f9581c1a853d8ce0b4",
    },
  },
  bouillabaisse: {
    tags: ["pescatarian"],
    sourceBlobShas: {
      fi: "5ba7b2fd832ac56b46e35e4c6098a746a37a9087",
      en: "664407e786425cf6348bc6afc0d03ecd07fb6654",
      sv: "05d1a733f7a308ec3be3d88b8dd22ae6b833dc1b",
      th: "1477cb4f48bc18baa2e45c1cb16492150f672aa7",
    },
  },
  "kermainen-lohipata": {
    tags: ["pescatarian"],
    sourceBlobShas: {
      fi: "b22e39b5d034debf7203b7a7129a021970cba925",
      en: "4a0eb25207e102e5a2bbb9535eb3d9aff4dd5782",
      sv: "93557e26d465775c70933afcc244e93b2bd4c9c9",
      th: "d30fda0a0b247164feff37614cc9b51bf42da639",
    },
  },
  "medu-vada": {
    tags: ["vegetarian","vegan","pescatarian"],
    sourceBlobShas: { fi: "7fac16fe748bfd12ad0ffe169cd70a7e7e850ce7", en: "88615c82096087e7c16e73604bf7820c792f8fca", sv: "663b5c18a7cac5fe2c2875bd2c65855cd9b96b80", th: "d32281e4689cd12ca5368ad70e333e6882a811ca" },
  },
  "tabbouleh": {
    tags: ["vegetarian","vegan","pescatarian"],
    sourceBlobShas: { fi: "9ee0f4e155408dc06860d2df3c25a22a34af8ac6", en: "2e4b710cac2853ad40faff0e24f03c8f2090cb88", sv: "fd8de8cfb14653b8a59a999cfc7814b971718870", th: "0c3ebfed06c22fc9056691038d6335118d556417" },
  },
  "ratatouille": {
    tags: ["vegetarian","vegan","pescatarian"],
    sourceBlobShas: { fi: "d5e4fdb23169ac793414e794d5ae0c01f10d0f47", en: "ccc3036fda3ab551d65a82236b2d8ca2b0ca3f44", sv: "179c835a6ece4f83bf313d093444f1dfd610d822", th: "639bf5b7a77d0521e0424617dfea4d1b7a9bd03b" },
  },
  "shakshuka": {
    tags: ["vegetarian","pescatarian"],
    sourceBlobShas: { fi: "e2410e391ea19081ef8c2608c5b1d24357ab6ba0", en: "9276b8b61ab7593882769c3a1172ac8f5663fa35", sv: "54d0be03ee1265a69ee7ce3fe05dd2ef40f9ac90", th: "bbe50edf34948c557069a502f02c94e00669b59a" },
  },
  "valimerellinen-farinata-aamupalaksi": {
    tags: ["vegetarian","vegan","pescatarian"],
    sourceBlobShas: { fi: "80d8926994bf1e9d808ec62be6a4a8af269c119b", en: "cf8c25a4d0c9ad82ab3095d4a022152439f6ac27", sv: "de55c04d7d1b84303026e5eeb1917fbe94d0b4f3", th: "ecf5242d150346e4cd6838f5a90f146fefff9558" },
  },
  "kiinalainen-soijamaito-aamiaisella": {
    tags: ["vegetarian","vegan","pescatarian"],
    sourceBlobShas: { fi: "2eede161a4c9a8f3b42a6dced6eaf2e133ce96c2", en: "ce537364277430f95fa0dc157def5d3769cb1dab", sv: "5d447042dc7464167674ba1d7297fbc9b6e98ef7", th: "a01273b113f6f5995ebecde4db838f7b9e0692ce" },
  },
  "lohikeitto-kuohukermalla": {
    tags: ["pescatarian"],
    sourceBlobShas: { fi: "e519f2f342cf562e5f7e6f7937e2f113001f649a", en: "7556693a7d3ca9f8dacfd32758e8f75a8e018b1b", sv: "829d5f35471a5559c820e6033e1c395440bdd13f", th: "e5ffb2455f50c8dfaca5b577a12f9b2c8210e657" },
  },
  "silakkapihvit-tilli-kermakastike": {
    tags: ["pescatarian"],
    sourceBlobShas: { fi: "d4422cd9eef7b8956fc306b95b05d73ed5b1ca8c", en: "1cb31aa71ce95e18428b92e57a151bc9f838a968", sv: "c5d233ca13d704c2e02628f366484122c33c80a2", th: "7860f30755ae6d6372854269dc0a00ad2e6dd131" },
  },
  "tonnikalamunakkaat-uunissa": {
    tags: ["pescatarian"],
    sourceBlobShas: { fi: "7ca93df2807c979e0b5179e61f12f4348a9cb8c8", en: "04fdee69544d27d0394934a4818bac437e7be835", sv: "83fb5ccc8ff5ed4c591c016cc948ef98411d25cd", th: "e09d016b9d181323743a9d08a4ef6f0dbe01b536" },
  },
  "paneer-tikka": {
    tags: ["vegetarian","pescatarian"],
    sourceBlobShas: { fi: "3ea73d0d275bc53355bdd705fc3a076ccd8099b0", en: "0db3e9fb6e9ba258cb0ec46b38add63175483aef", sv: "9037586927abd14f8c3c82a9379f44c4da345530", th: "09c5fb7fee9c9fcbe7941ba895ac0d5e7680271d" },
  },
  "gazpacho": {
    tags: ["vegetarian","pescatarian"],
    sourceBlobShas: { fi: "61b92f37817a09c4d04bdaba1acc378c1918f0a3", en: "b3a4626ab133b5d6e4d21a8948297b655dd6d9b6", sv: "81a34db194bd6ea97cfe0a9e2082a135f0d7042b", th: "0f484839ef2cba58912eb1b5bf808695c5720fe3" },
  },
  "palak-paneer": {
    tags: ["vegetarian","pescatarian"],
    sourceBlobShas: { fi: "765a16654e1700caf257e5a959e8724f630d8177", en: "5ade01c716c84c9a6e524ba8056a5b6965303e54", sv: "bc019f27d50bc0a797a8718b0e13473e02096955", th: "3272fec5e812dab58ca9a66c55dd63ed0ca1790c" },
  },
};

function gitBlobSha(buffer: Buffer): string {
  return createHash("sha1").update(`blob ${buffer.byteLength}\0`).update(buffer).digest("hex");
}

/**
 * Both the original Finnish source AND this locale's exact recipe must match
 * their reviewed versions. Missing original => no review claim, even if the
 * translation itself has not changed.
 */
/** Independently testable source-pin gate; does not infer diets. */
export async function reviewedDietTagsForVersion(
  review: ReviewedDietSource, locale: RecipeLocale, filePath: string, finnishSourcePath?: string,
): Promise<RecipeDietTag[]> {
  if (!finnishSourcePath) return [];
  const expectedLocaleSha = review.sourceBlobShas[locale];
  if (!expectedLocaleSha) return [];
  const source = await readFile(finnishSourcePath);
  if (gitBlobSha(source) !== review.sourceBlobShas.fi) return [];
  if (locale === "fi") return filePath === finnishSourcePath ? [...review.tags] : [];
  const translation = await readFile(filePath);
  return gitBlobSha(translation) === expectedLocaleSha ? [...review.tags] : [];
}

export async function reviewedDietTagsForSource(
  recipeId: string, locale: RecipeLocale, filePath: string, finnishSourcePath?: string,
): Promise<RecipeDietTag[]> {
  const review = Object.hasOwn(reviewedDietFilters, recipeId) ? reviewedDietFilters[recipeId] : undefined;
  return review ? reviewedDietTagsForVersion(review, locale, filePath, finnishSourcePath) : [];
}
