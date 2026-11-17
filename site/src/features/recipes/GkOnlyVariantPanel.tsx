import { formatRecipeIngredient } from "./servings";
import { EstimateConfidence } from "../glycemic-load/GlycemicLoadEvidence";
import { publicGkOnlySourceNote } from "./gk-only-public-note";
import { gkCopy } from "../glycemic-load/glycemic-load-copy";
import {Link} from 'react-router-dom';
import type {RecipeLocale, RecipeEntry} from '@/types/content';
import type {GkOnlyVariant} from './gk-only-types';
import {glycemicLoadPath} from './recipe-i18n';
import { gkVariantScope } from './gk-estimate-scope';

export const gkOnlyUi={
 fi:{title:'Vakioidun version GK',scope:'Arvio koskee vain alla ilmoitettuja määriä ja valmistustarkennuksia. Tälle versiolle ei ole vahvistettu omia ravintoarvoja.',a:'Laskettu GK',b:'Mallinnettu GK-arvio',low:'Luottamus: matala. Ainesosista johdettu arvio, ei valmiin ruoan mittaus.',per:'/ annos',details:'Erillisversion määrät ja valmistus',original:'alkuperäisen ohjeen määrä',prepare:'Valmista alkuperäisen ohjeen mukaan näillä tarkennuksilla.',omission:'Imeytyvää hiilihydraattia ilman vastaavaa GI-arvoa jäi laskelman ulkopuolelle enintään',omissionEnd:'g/annos. Pois jätetyn osuuden vaikutusta ei tulkita nollaksi.',range:'Väli kuvaa vain nimettyjä vertailuskenaarioita. Se ei ole koko ruoan biologinen vaihteluväli tai luottamusväli.',plant:'Kookosmaidolle oletetaan GI-arvo 50. Arvoa ei ole mitattu, eikä lähde rajaa oletuksen epävarmuutta.',trace:'Menetelmä B käyttää erikseen nimetyille pienille mauste- ja siemenmäärille oletettua GI-arvoa 50. Arvoa ei ole mitattu.',sensitivity:'Oletusherkkyys',sensitivityNote:'Koe käyttää valituille epävarmoille osuuksille GI-oletuksia 0–150. Se ei aseta fysiologista ylärajaa eikä kuvaa tilastollista luottamusväliä.',sources:'Lähteet ja rajaukset',method:'GK-menetelmä',coverage:'Kotireseptit, joilla on numeerinen GK alkuperäiselle ohjeelle tai erillisversiolle',aCount:'laskettu arvio (A)',bCount:'mallinnettu arvio (B)',cCount:'vain GK-luokka (C)',missing:'numeerinen GK puuttuu',methodText:'Erillisversion GK-arvio ja alkuperäisen reseptin ravintoarvot koskevat eri ohjeita. Menetelmässä A ainesosan voi jättää pois, jos sille ei löydy vastaavaa GI-arvoa ja siitä tulee alle 1 g imeytyvää hiilihydraattia annosta kohti. Pois jätetyistä aineksista saa kertyä yhteensä alle 2 g imeytyvää hiilihydraattia annosta kohti. Menetelmä B sisällyttää malliin myös erikseen nimetyt pienet määrät. Lähteisiin perustuvat vertailut ja oletusherkkyys esitetään erikseen. Ruokaryhmän yleinen GI-keskiarvo ei yksin riitä erillisversion arvion perusteeksi. Kukin resepti lasketaan kattavuuteen vain kerran.'},
 en:{title:'GL for the specified version',scope:'This estimate applies only to the amounts and preparation details below. Nutrition values for this version have yet to be verified.',a:'Calculated GL',b:'Modeled GL estimate',low:'Confidence: low. An ingredient-based estimate, not a measurement of the prepared meal.',per:'/ serving',details:'Separate version amounts and preparation',original:'amount in the original recipe',prepare:'Use the original method with these details.',omission:'Available carbohydrate left out for lack of a matching GI value, up to',omissionEnd:'g/serving. Its effect is not assumed to be zero.',range:'The range describes only named comparator scenarios. It is not a biological range or confidence interval for the whole meal.',plant:'The estimate uses an assumed GI of 50 for coconut milk. This is not a measured value, and the source does not quantify the uncertainty.',trace:'Method B uses an assumed GI of 50 for the specified small amounts of spices and seeds. This value has not been measured.',sensitivity:'Assumption sensitivity',sensitivityNote:'This experiment assigns GI values from 0 to 150 to selected ingredients with uncertain GI. It is neither a physiological upper bound nor a statistical confidence interval.',sources:'Sources and limitations',method:'GL method',coverage:'Home recipes with a numeric GL for the original recipe or a separate version',aCount:'calculated estimate (A)',bCount:'modelled estimate (B)',cCount:'GL category only (C)',missing:'without numeric GL',methodText:'The GL estimate for the separate version and the original recipe’s nutrition values apply to different preparations. Method A can leave out an ingredient if it has no matching GI value and contributes less than 1 g of available carbohydrate per serving. All ingredients left out must contribute less than 2 g of available carbohydrate per serving in total. Method B models the specified small amounts as well. Comparisons based on sources and sensitivity to assumptions are shown separately. A broad food-group GI average is insufficient on its own to estimate GL for a separate version. Each recipe is counted once.'},
 sv:{title:'GL för den angivna versionen',scope:'Uppskattningen gäller endast mängderna och tillagningsdetaljerna nedan. Näringsvärdena för den här versionen är ännu inte verifierade.',a:'Beräknad GL',b:'Modellerad GL-uppskattning',low:'Tillförlitlighet: låg. En ingrediensbaserad uppskattning, inte en mätning av den färdiga måltiden.',per:'/ portion',details:'Den separata versionens mängder och tillagning',original:'mängden i grundreceptet',prepare:'Följ grundreceptet med dessa detaljer.',omission:'Utelämnade tillgängliga kolhydrater utan GI-träff, högst',omissionEnd:'g/portion. Effekten antas inte vara noll.',range:'Intervallet beskriver endast namngivna jämförelsescenarier. Det är inte ett biologiskt intervall eller konfidensintervall för hela måltiden.',plant:'Uppskattningen använder ett antaget GI-värde på 50 för kokosmjölk. Värdet är inte uppmätt och källan anger inget mått på osäkerheten.',trace:'Metod B använder ett antaget GI-värde på 50 för de angivna små mängderna kryddor och frön. Värdet är inte uppmätt.',sensitivity:'Känslighet för antaganden',sensitivityNote:'Experimentet använder antagna GI-värden på 0–150 för valda osäkra mängder. Det är varken en fysiologisk övre gräns eller ett statistiskt konfidensintervall.',sources:'Källor och begränsningar',method:'GL-metod',coverage:'Hemrecept med numeriskt GL för grundreceptet eller en separat version',aCount:'beräknad uppskattning (A)',bCount:'modellerad uppskattning (B)',cCount:'endast GL-kategori (C)',missing:'utan numerisk GL',methodText:'GL-uppskattningen för den separata versionen och grundreceptets näringsvärden gäller olika tillagningar. Metod A får utelämna en ingrediens som saknar ett motsvarande GI-värde och ger mindre än 1 g tillgängliga kolhydrater per portion. Alla utelämnade ingredienser ska tillsammans ge mindre än 2 g tillgängliga kolhydrater per portion. Metod B tar också med de angivna små mängderna i modellen. Källbaserade jämförelser och känslighet för antaganden visas separat. Ett allmänt GI-medelvärde för en livsmedelsgrupp räcker inte som enda underlag för en separat version. Varje recept räknas en gång.'},
 th:{title:'ค่า GL ของสูตรเวอร์ชันที่ระบุ',scope:'ค่านี้ใช้เฉพาะปริมาณและวิธีปรุงของสูตรเวอร์ชันแยกด้านล่าง ยังไม่ได้ยืนยันข้อมูลโภชนาการของสูตรเวอร์ชันนี้',a:'ค่า GL จากการคำนวณ',b:'ค่า GL ประมาณจากแบบจำลอง',low:'ความเชื่อมั่นต่ำ เป็นค่าจากวัตถุดิบ ไม่ใช่การวัดอาหารที่ปรุงเสร็จ',per:'/ หนึ่งที่',details:'ปริมาณและวิธีปรุงของสูตรเวอร์ชันแยก',original:'ปริมาณตามสูตรเดิม',prepare:'ทำตามวิธีเดิมโดยใช้รายละเอียดต่อไปนี้',omission:'คาร์โบไฮเดรตที่ใช้ได้ซึ่งไม่มี GI และไม่รวมในการคำนวณ ไม่เกิน',omissionEnd:'กรัมต่อหนึ่งที่ ไม่ได้สมมติว่าผลของส่วนนี้เป็นศูนย์',range:'ช่วงนี้แสดงเฉพาะสถานการณ์ของอาหารเทียบเคียงที่ระบุ ไม่ใช่ช่วงทางชีวภาพหรือช่วงความเชื่อมั่นของทั้งมื้อ',plant:'การประเมินใช้สมมติฐานว่ากะทิมีค่า GI เท่ากับ 50 ค่านี้ไม่ได้มาจากการวัด และแหล่งข้อมูลไม่ได้ระบุขอบเขตความไม่แน่นอน',trace:'วิธี B ใช้ค่า GI สมมติเท่ากับ 50 สำหรับเครื่องเทศและเมล็ดพืชปริมาณเล็กน้อยที่ระบุไว้ ค่านี้ไม่ได้มาจากการวัด',sensitivity:'ความไวต่อสมมติฐาน',sensitivityNote:'การทดสอบนี้ลองสมมติค่า GI ตั้งแต่ 0 ถึง 150 สำหรับวัตถุดิบที่มีค่าไม่แน่นอนบางรายการ ช่วงนี้ไม่ใช่ขีดจำกัดทางสรีรวิทยาหรือช่วงความเชื่อมั่นทางสถิติ',sources:'แหล่งข้อมูลและข้อจำกัด',method:'วิธีคำนวณ GL',coverage:'สูตรทำที่บ้านที่มีค่า GL เป็นตัวเลขสำหรับสูตรเดิมหรือสูตรที่ปรับแยกต่างหาก',aCount:'ค่าประมาณจากการคำนวณ (A)',bCount:'ค่าประมาณจากแบบจำลอง (B)',cCount:'มีเฉพาะระดับ GL (C)',missing:'ยังไม่มีค่า GL เป็นตัวเลข',methodText:'ค่าประมาณ GL ของสูตรที่ปรับแยกต่างหากและข้อมูลโภชนาการของสูตรเดิมใช้กับวิธีทำคนละแบบ วิธี A อาจไม่นำวัตถุดิบมาคำนวณเมื่อไม่มีค่า GI ที่ตรงกันและวัตถุดิบนั้นให้คาร์โบไฮเดรตที่ร่างกายดูดซึมได้ต่ำกว่า 1 กรัมต่อหนึ่งที่ วัตถุดิบที่ไม่นำมาคำนวณทั้งหมดต้องให้คาร์โบไฮเดรตที่ดูดซึมได้รวมต่ำกว่า 2 กรัมต่อหนึ่งที่ วิธี B รวมวัตถุดิบปริมาณเล็กน้อยที่ระบุไว้ในแบบจำลอง ผลเปรียบเทียบจากแหล่งข้อมูลแสดงแยกจากการทดสอบความไวต่อสมมติฐาน ค่า GI เฉลี่ยของกลุ่มอาหารอย่างเดียวไม่พอสำหรับประเมิน GL ของสูตรที่ปรับแยกต่างหาก นับสูตรแต่ละสูตรเพียงครั้งเดียว'}
};
export const gkScopeUi={
 fi:{tiny:'laskettu osuus alle 1',partial:'Tämä koskee vain laskettua osuutta. Pois jätetty hiilihydraatti voi kasvattaa kokonais-GK:ta; sen vaikutusta ei ole laskettu tähän lukuun.',originalCoverage:'Numeerinen GK alkuperäisohjeelle',originalMissing:'Alkuperäisohjeen GK puuttuu',versionMissing:'Kotireseptit, joilta puuttuu numeerinen GK',studyCoverage:'Erilliset tutkimusannosvertailut',originalNutrition:'Alkuperäisohjeen ravintoarvot annosta kohti',macroNotice:'Alla olevat ravintoarvot koskevat alkuperäistä reseptiä. Erillisversion ravintoarvoja ei ole vielä vahvistettu.'},
 en:{tiny:'calculated part below 1',partial:'This refers only to the calculated part. Omitted carbohydrate may increase total GL; its effect is not included in this number.',originalCoverage:'Numeric GL for the original recipe',originalMissing:'Original recipe GL unavailable',versionMissing:'Home recipes without a numeric GL',studyCoverage:'Separate study serving comparisons',originalNutrition:'Original recipe nutrition per serving',macroNotice:'The values below apply to the original recipe. Nutrition values for the version used to estimate GL have yet to be verified.'},
 sv:{tiny:'beräknad del under 1',partial:'Detta gäller bara den beräknade delen. Utelämnade kolhydrater kan öka total GL; deras effekt ingår inte i siffran.',originalCoverage:'Numerisk GL för grundreceptet',originalMissing:'Grundreceptets GL saknas',versionMissing:'Hemrecept utan numeriskt GL',studyCoverage:'Separata jämförelser med studieportioner',originalNutrition:'Grundreceptets näringsvärden per portion',macroNotice:'Näringsvärdena nedan gäller grundreceptet. För versionen som används för GL-uppskattningen är näringsvärdena ännu inte verifierade.'},
 th:{tiny:'ส่วนที่คำนวณต่ำกว่า 1',partial:'ค่านี้ใช้เฉพาะส่วนที่คำนวณ คาร์โบไฮเดรตที่ละไว้อาจเพิ่ม GL รวม และยังไม่ได้รวมผลนั้นในตัวเลขนี้',originalCoverage:'GL เป็นตัวเลขสำหรับสูตรเดิม',originalMissing:'ยังไม่มี GL ของสูตรเดิม',versionMissing:'สูตรทำที่บ้านที่ยังไม่มีค่า GL เป็นตัวเลข',studyCoverage:'ส่วนอาหารจากงานวิจัยที่ใช้เปรียบเทียบแยกต่างหาก',originalNutrition:'สารอาหารของสูตรเดิมต่อที่',macroNotice:'ข้อมูลโภชนาการด้านล่างเป็นของสูตรเดิม ส่วนสูตรที่ใช้ประเมิน GL ยังไม่มีข้อมูลโภชนาการที่ยืนยันแล้ว'}
};
export function gkOnlyValue(v:GkOnlyVariant,locale:RecipeLocale){
 if(!v.scenarioRange&&v.point!==null&&v.point<1)return gkScopeUi[locale].tiny;
 const n=new Intl.NumberFormat(locale,{maximumFractionDigits:2});
 if(v.scenarioRange&&v.rangeDisplay==='OUTWARD_INTEGER') {
  return `${n.format(Math.floor(v.scenarioRange.min))}–${n.format(Math.ceil(v.scenarioRange.max))}`;
 }
 return v.scenarioRange?`${n.format(Math.floor(v.scenarioRange.min*10)/10)}–${n.format(Math.ceil(v.scenarioRange.max*10)/10)}`:`≈ ${n.format(v.point!)}`;
}
/** Display-only native units. A millilitre quantity never acquires a gram mass here. */
export function gkOnlyQuantity(v:GkOnlyVariant,index:number,servings=v.servings){
 const ingredient=v.ingredients[index];
 if(!ingredient||!Number.isInteger(servings)||servings<=0||!Number.isInteger(v.servings)||v.servings<=0)throw Error('Invalid GK-only quantity/servings');
 if(v.quantityContract!==undefined&&v.quantityContract!=='GK_ONLY_NATIVE_UNITS_V1')throw Error('Unknown GK-only quantity contract');
 const native=ingredient.quantity;
 if(native&&(v.quantityContract!=='GK_ONLY_NATIVE_UNITS_V1'||ingredient.grams!==null||!['ml','tbsp'].includes(native.unit)))throw Error('Invalid native GK-only quantity contract');
 const amount=native?native.amount:ingredient.grams;
 if(amount===null)return null;
 if(!Number.isFinite(amount)||amount<0)throw Error('Invalid GK-only quantity');
 return {amount:amount*servings/v.servings,unit:native?.unit??'g'};
}
const quantityUnit=(unit:string,locale:RecipeLocale)=>unit==='tbsp'?{fi:'rkl',en:'tbsp',sv:'msk',th:'ช้อนโต๊ะ'}[locale]:unit==='ml'&&locale==='th'?'มล.':unit;
export function gkOnlyPreparation(v:GkOnlyVariant,locale:RecipeLocale,servings=v.servings){
 const n=new Intl.NumberFormat(locale,{maximumFractionDigits:3});
 return v.preparation[locale].replace(/\{\{(servings|amount:(\d+))\}\}/g,(_match,token,index)=>{
  if(token==='servings')return n.format(servings);
  const quantity=gkOnlyQuantity(v,Number(index),servings);if(quantity===null)throw Error('Invalid GK-only preparation amount');
  return n.format(quantity.amount);
 });
}
export const studyServingTitle = {
 fi: 'Tutkimusannoksen GK',
 en: 'GL for the study serving',
 sv: 'GL för studieportionen',
 th: 'ค่า GL ของอาหารทดลองหนึ่งส่วน',
};

export function GkOnlyVariantPanel({variant:v,locale,servings,compact=false,originalHasGk=false,originalRecipe}:{variant:GkOnlyVariant;locale:RecipeLocale;servings?:number;compact?:boolean;originalHasGk?:boolean;originalRecipe?:Pick<RecipeEntry,'ingredients'|'kitchenIngredients'|'instructionsText'|'servings'>}){
 const t=gkOnlyUi[locale],n=new Intl.NumberFormat(locale,{maximumFractionDigits:3}),Heading=compact?'h4':'h2';
 const text = gkCopy[locale];
 const study = gkVariantScope(v) === 'STUDY_COMPARISON';
 const displayedServings = study ? v.servings : (servings ?? v.servings);
 const modelAssumptions = <>
  {v.codingKinds.includes('PLANT50') ? <p>{t.plant}</p> : null}
  {v.codingKinds.includes('TRACE50') ? <p>{t.trace}</p> : null}
 </>;
 return <section className={compact?'gk-only-variant':'recipe-panel gk-only-variant'} data-gk-version={v.versionId} data-gk-scope={study ? 'STUDY_COMPARISON' : 'RECIPE_VARIANT'} data-gk-level={v.level} data-macro-scope={v.macroScope} data-gk-quantity-contract={v.quantityContract}>
  <Heading>{study ? studyServingTitle[locale] : text.modified}</Heading>
  {!compact && !originalHasGk ? <p className="gk-evidence__scope">{gkScopeUi[locale].originalMissing}</p> : null}
  {v.limitation ? <p data-gk-limitation="exact-version">{study ? v.limitation[locale] : text.variantLimit}</p> : null}
  <p className="gk-evidence__value"><strong>{study || v.level === 'A' ? t.a : t.b} · {gkOnlyValue(v, locale)} {t.per}</strong></p>
  <EstimateConfidence locale={locale} confidence={v.confidence} />
  {study ? null : <p>{v.level === 'A' ? text.modifiedA : text.modifiedB}{v.omittedCho > 0 ? ` ${text.omitted}` : ''}</p>}
  {v.point !== null && v.point < 1 && v.omittedCho > 0 ? <p>{gkScopeUi[locale].partial}</p> : null}
  {v.scenarioRange ? <p>{t.range}</p> : null}
  <details className="gk-evidence__details" open={!compact}>
    <summary>{text.how}</summary>
    {study ? null : <p>{t.scope}</p>}
    {v.limitation && !study ? <p><strong>{v.limitation[locale]}</strong></p> : null}
    {v.omittedCho > 0 ? <p data-gk-omission="available-cho">{t.omission} {n.format(Math.ceil(v.omittedCho * 10) / 10)} {t.omissionEnd}</p> : null}
    {study ? null : <p>{t.low}</p>}
    {v.sources.some((source) => source.kind === 'HUMAN_GI') ? <p>{text.kinds.published}</p> : null}
    {v.sources.some((source) => source.kind === 'PUBLISHED_CODING' || source.kind === 'B_CODING') ? <p>{text.kinds.model}</p> : null}
    {!study && originalRecipe ? <div data-gk-original-comparison="amounts-and-preparation">
      <p><strong>{{fi:'Alkuperäisen reseptin määrät ja valmistus',en:'Original recipe amounts and preparation',sv:'Originalreceptets mängder och tillagning',th:'ปริมาณและวิธีปรุงของสูตรเดิม'}[locale]}</strong></p>
      <ul>{(originalRecipe.kitchenIngredients ?? originalRecipe.ingredients).map((ingredient,index) => <li key={index}>{formatRecipeIngredient(ingredient, displayedServings, originalRecipe.servings, locale)}</li>)}</ul>
      <p>{originalRecipe.instructionsText.join(' ')}</p>
    </div> : null}
    <p data-gk-differences="amounts-and-preparation"><strong>{t.details}</strong></p>
    <p>{{fi:'Ainesluettelon annosmäärä',en:'Servings for these amounts',sv:'Portioner för dessa mängder',th:'จำนวนที่สำหรับปริมาณนี้'}[locale]} · {n.format(displayedServings)}</p>
    <ul>{v.ingredients.map((ingredient, index) => {
      const quantity = gkOnlyQuantity(v, index, displayedServings);
      return <li key={index}>{quantity ? `${n.format(quantity.amount)} ${quantityUnit(quantity.unit, locale)}` : t.original} · {ingredient.name[locale]}</li>;
    })}</ul>
    {v.standalonePreparation ? null : <p>{t.prepare}</p>}
    <p>{gkOnlyPreparation(v, locale, displayedServings)}</p>
  </details>
  <details className="gk-evidence__details gk-evidence__technical">
    <summary>{text.sources}</summary>
    <p>{text.technicalNote}</p>
    <p>{t.sources} · <code>{v.level}</code></p>
    {modelAssumptions}
    {v.sensitivity ? <details><summary>{t.sensitivity}</summary>
      <p>{n.format(Math.floor(v.sensitivity.min * 1000) / 1000)}–{n.format(Math.ceil(v.sensitivity.max * 1000) / 1000)} {t.per}</p>
      <p>{t.sensitivityNote}</p>
    </details> : null}
    <ul>{v.sources.map((source, index) => <li key={index}>
      {source.url.startsWith('#')
        ? <Link to={`${glycemicLoadPath(locale)}${source.url}`}>{source.title}</Link>
        : <a href={source.url} rel="noopener noreferrer">{source.title}</a>}
      {" · "}{publicGkOnlySourceNote(source)}
      <small>{source.kind}</small>
    </li>)}</ul>
  </details>
  {!compact?<p><Link to={`${glycemicLoadPath(locale)}#${v.recipeId}`}>{t.method} ↗</Link></p>:null}
 </section>;
}
