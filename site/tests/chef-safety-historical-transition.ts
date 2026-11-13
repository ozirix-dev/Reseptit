import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

// Two previously CI-approved and merged chef corrections are reconciled
// with the frozen 326-recipe historical baseline. No additional edits qualify.
export const reviewedChefSafetyPaths = Object.freeze([
  'reseptit/paaruoat/kana-yakitori-kaalilla.md',
  'reseptit/paaruoat/pho-bo.md',
]);
// Exact editorial versions checked against the unchanged historical source.
const editorialMethods: Readonly<Record<string, readonly [string, string]>> = {
  'reseptit/aamupalat/lahi-ita-fattet-hummus.md': ['17ef3e0f7581d8aa040e23a9bc73ff0887b76777', 'e5592a7b299c89f423e8a12e4ef7ca1b3050e2013bd3c5fa12f42dd74e4c5984'],
  'reseptit/paaruoat/amritsari-kala.md': ['17ef3e0f7581d8aa040e23a9bc73ff0887b76777', '47e7de3be40b9d6f1caeba3894eb775a6590644156eb14812fe5d6f66cf3045b'],
  'reseptit/paaruoat/char-siu.md': ['17ef3e0f7581d8aa040e23a9bc73ff0887b76777', '1d07f8fa86cc9cba185e1dc0e2ccbd863ceff43943b656ed9b2c91b728ca0cab'],
  'reseptit/paaruoat/dal-makhani.md': ['17ef3e0f7581d8aa040e23a9bc73ff0887b76777', '36603564d7f196482f0a0d563a19e21417aa3cb6d3f5483ace22ec92a923b4bf'],
  'reseptit/paaruoat/broileri-kukkakaaligratiini.md': ['72da5c97fdc59f0d43bdc234bad88080a2168345', 'df3a3ab42344e39adf024062181a47444fabec51a3e6ec965b1ed9486d581e79'],
  'reseptit/paaruoat/kanakorma-kukkakaaliriisilla.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', 'c5aebce4250d0c10cbedc0d6a7ba8f2d1bc66e20f9c16e1e8a9efe603ec6bdd8'],
  'reseptit/paaruoat/kerala-kalacurry.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', '59e0549acd3540f706cdb04cb4f07388634bc00d571c76e686d56c58d786ac08'],
  'reseptit/leivonnaiset/keto-joulutortut.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', '4b3d436f943f55c956fcf7a8301ab4da6f3f0f47a31f37c4f0382aca42eac526'],
  'reseptit/alkuruoat/medu-vada.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', 'a1267b4a8eb2d91d4ff54fc77aeedb4ce682c019bf81435580d3ea06f09df677'],
  'reseptit/paaruoat/pad-kra-pao-vhh.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', '380dff4c6cb59820c8f64be2edf1bff363c6da13cdc20aa488311656f5c6aaf0'],
  'reseptit/paaruoat/pad-thai-vhh-konjac.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', 'be2fc989ceca366800b87344676099ada26aedd71a6c26d93b2eede5ba7b2091'],
  'reseptit/paaruoat/paella-valenciana.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', '9a12394a5c2e7d556fc9216667a5b9bfffbe1124745f4cdad7c5db0df2dfa35c'],
  'reseptit/paaruoat/paistettu-maksa-pekonilla.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', 'dc54fa69f2425530f3a75dadc617c01a27c7f55e0f2ebcfc0585eb5eeaf640db'],
  'reseptit/alkuruoat/pani-puri.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', '7ad741915553b5bee21fef0558df3ad3e9228928ff8d194110f249d0601873c8'],
  'reseptit/paaruoat/pekingin-ankka.md': ['2293fd1851bad0574ae89430cb9ba1b184df6b8b', '0ef958ff673e255a04ccb5b3830f2d39e6df89d6896cdf293e15ba5534216f99'],
  'reseptit/alkuruoat/spanakopita.md': ['2293fd1851bad0574ae89430cb9ba1b184df6b8b', 'dd0dc6fcbab81621d5f476611d15f8c40cb9e7c206a1bed2a7750a779909648d'],
  'reseptit/paaruoat/tandoorikana.md': ['2293fd1851bad0574ae89430cb9ba1b184df6b8b', '17ca72d9868bb2104cfa80b8f4a72ed74df3529eef47527fa97f95f8cdaf5e4d'],
  'reseptit/paaruoat/tom-yum-goong-vhh.md': ['2293fd1851bad0574ae89430cb9ba1b184df6b8b', '94b45150aac60adedee5a08cefa1a096765c99905f8523dc8ec502b6eabfeef2'],
  'reseptit/paaruoat/tunisialainen-ojja.md': ['2293fd1851bad0574ae89430cb9ba1b184df6b8b', 'c66cd12d202ae9f95e400ff01c29aecb2f22297b3f7f81c374c9ca74ea51f40f'],
  'reseptit/alkuruoat/vada-pav.md': ['2293fd1851bad0574ae89430cb9ba1b184df6b8b', 'c101da821a7a49507259bbd104f1cdb9932585996b9f258a4862e5d4684c3d7d'],
  'reseptit/paaruoat/vhh-kaalikaarryleet.md': ['2293fd1851bad0574ae89430cb9ba1b184df6b8b', '3dbc9d0a8817f2f427afc704d3e007857424767d6eef6de32f10d4c5cc91949c'],
  'reseptit/leivonnaiset/vhh-lihapiirakka.md': ['2293fd1851bad0574ae89430cb9ba1b184df6b8b', 'd12574a7923d38585d882379983a1d465dec9fd8a9a1e4ea5ae63a832d76dcd6'],
  'reseptit/leivonnaiset/vhh-runebergintortut.md': ['2293fd1851bad0574ae89430cb9ba1b184df6b8b', 'fd4c60bb937d54ae8b5d04bf763d8a19889d372a2bf5d88cc89293add24cce49'],
  'reseptit/paaruoat/khao-kha-moo-vhh.md': ['2293fd1851bad0574ae89430cb9ba1b184df6b8b', '907a2f69e71ce436054f1561a351e70def1ad38de23b95cf8a44d6af38060256'],
  'reseptit/paaruoat/khao-man-gai-vhh.md': ['2293fd1851bad0574ae89430cb9ba1b184df6b8b', '1e25c05b37753f78151fada1991efcdd682bf7ca7af92c1fe4955548c2018d1f'],
  'reseptit/alkuruoat/goi-cuon.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', '339870e73960d81ef8c6de90840b940faae96cfb2268b4f7b933e0022cb0da1f'],
  'reseptit/paaruoat/hernekeitto-savupotkalla.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', '123a06f147e4e0874bdb12387f12c60d14a01722b44edf7ef5e77810a21b1738'],
  'reseptit/paaruoat/hunaja-sinappikana-kaalilla.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', '54b95beecd582e69f504b1e2d16e5f05e6adc086a545e49ab652f4d28346a3b7'],
  'reseptit/paaruoat/japanilainen-curry-tofulla.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', '17bb0b5478b1aef5fae4e0e5cfa86041aa39497ca9d00b4cd067b02eb172a309'],
  'reseptit/aamupalat/kaakao-kookos-chia.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', 'd0a2d87fa49b2bdb9448b4f7b4d09cd259f70d36723f933aeeef85a0f0f4ef4b'],
  'reseptit/aamupalat/marjainen-chiavanukas.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', 'b02c4d4613f83fd3d045b5c72a7f5a07ae0cdfcea5691c386c5fe0c5d828d954'],
  'reseptit/jalkiruoat/marjakiisseli-vaniljakastikkeella.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', '42e3765032750d1cc35b8172f6bd25439de69cd421c64223aefa6112b2800e9c'],
  'reseptit/paaruoat/miso-lohi-paksoi.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', 'caa41d5bd1f929406cfc0d7da2590e98ec624a85a68eaede35732966b066a270'],
  'reseptit/paaruoat/okonomiyaki-kaaliletut.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', 'b00a19917b8fe8deb778b101090009b2578a9111c26f76456ea1a318176d2ebb'],
  'reseptit/jalkiruoat/pannacotta-marjakastikkeella.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', 'e40c29b6f1e30daad9231ad833376cc64d8d4080d54dc59c7a6722b4bfc4e89b'],
  'reseptit/aamupalat/savulohi-avokadokulho.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', 'f93a416a19143264ad1c2d36c7cdaef456309d2a958c2b20a137360e6a3413c2'],
  'reseptit/paaruoat/tacokulho-nauta-avokado.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', '4a5f2fc6b4af3d1fb79e64d29f55622ec555b2742ca29b89e83ea969adc62622'],
  'reseptit/jalkiruoat/vhh-juustokakku.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', 'd6d79e6e9dace0348cc7cd8d3d935ca9c5040dd08864a12a429bbd9491873573'],
  'reseptit/paaruoat/carnitas-salaattitacot.md': ['26ef2fb244908290048b9e050dd54868f1c15b2c', 'b970133d0265652fd666780b977af158fed3eda7060f91c94e97907b76332e61'],
};
export const editorialMethodHistoryPaths = Object.freeze(Object.keys(editorialMethods));
const accepted = new Set<string>(reviewedChefSafetyPaths);
const before = '7fa68e909a7dfd1920f7d8701a9669fba440d68f'; // main before #365
const after = '90278e1fdc42772241b069fe2904888fcbd38221'; // merged #365
const lf = (s: string) => s.replaceAll('\r\n', '\n');
const historical = (root: string, commit: string, file: string) =>
  lf(execFileSync('git', ['show', commit + ':' + file], {cwd: root, encoding: 'utf8'}));

export function originalForReviewedChefSafety(root: string, file: string, current: string): string {
  const method = Object.hasOwn(editorialMethods, file) ? editorialMethods[file] : undefined;
  if (method) {
    const [base, reviewedSha] = method;
    const live = lf(current);
    assert.equal(createHash('sha256').update(live).digest('hex'), reviewedSha,
      file + ': unreviewed source modification cannot inherit historical approval');
    const original = historical(root, base, file);
    const frontmatter = (source: string) => source.split('\n---\n', 1)[0];
    const originalFrontmatter = frontmatter(original);
    const expected = file === 'reseptit/alkuruoat/pani-puri.md'
      ? originalFrontmatter.replace('Noin 1/2 tl; säädä kalafondin suolaisuuden mukaan.', 'Täytteeseen ja yrttiveteen.')
      : originalFrontmatter;
    // Historical inventory compares the calculation inputs across the exact reviewed versions.
    const displayMetadata = /^(?:time_total_min: \d+\n|image:\n(?: {2,}[^\n]*\n)+)/gm;
    const coldPudding = file === 'reseptit/aamupalat/kaakao-kookos-chia.md' ||
      file === 'reseptit/aamupalat/marjainen-chiavanukas.md';
    const liveFrontmatter = coldPudding
      ? frontmatter(live).replace('cooking_method:\n  - kylmävalmistus', 'cooking_method:\n  - kypsentäminen')
      : frontmatter(live);
    const displayOnly = base === '26ef2fb244908290048b9e050dd54868f1c15b2c';
    assert.equal(
      displayOnly ? liveFrontmatter.replace(displayMetadata, '') : liveFrontmatter,
      displayOnly ? expected.replace(displayMetadata, '') : expected,
      file + ': changed protected recipe metadata',
    );
    assert.notEqual(live, original);
    return original;
  }
  if (!accepted.has(file)) return current;
  const live = lf(current);
  const reviewed = historical(root, after, file);
  assert.equal(live, reviewed, file + ': unreviewed source modification cannot inherit historical approval');
  const original = historical(root, before, file);
  const frontmatter = (s: string) => s.slice(0, s.indexOf('\n---\n', 4));
  assert.equal(frontmatter(original), frontmatter(reviewed), file + ': ingredient or metadata change');
  assert.notEqual(reviewed, original, file + ': missing reviewed chef correction');
  return original;
}
