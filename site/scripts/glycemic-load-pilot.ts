import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FoodRecord } from "./nutrition-model";
import { calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadRecipeInput } from "./glycemic-load-model";
import { glycemicLoadInputHash, recipeBindingHash, recipeBindingMatches } from "./glycemic-load-recipe-binding";
import { siteContent } from "../src/generated/content.generated";

const siteDir = path.resolve(import.meta.dirname, "..");
const root = path.resolve(siteDir, "..");
const expectedRecipeIds = [
  "munakokkeli", "munakasmuffinit", "munakasrulla-pinaatti-tuorejuustolla", "munatacot-huevos-rancheros",
  "paprikauunimunakkaat", "shakshuka", "uunimuna-avokadot", "uunimunat-pinaatilla", "tortilla-de-patatas", "vhh-lihamureke",
  "hummus", "chili-con-carne-kukkakaaliriisi", "ratatouille", "vhh-kaalikaarryleet", "jauheliha-kaalikeitto-vhh",
  "taytetyt-paprikat-vhh", "vhh-kaalilaatikko", "munakoiso-jauhelihavuoka-vhh", "valimerellinen-kikherne-yrttiaamiainen", "lahi-ita-kikherne-shakshuka", "massaman-curry-kanalla-vhh",
  "chole-bhature", "gulab-jamun", "samosa", "aloo-paratha", "vada-pav", "pani-puri", "jauheliha-makaronilaatikko",
  "medu-vada", "lohikeitto-kuohukermalla", "butter-chicken", "punainen-kanacurry-vhh", "thai-vihrea-curry-kanalla-vhh",
  "panang-curry-kanalla-vhh", "menemen", "lihapullat-kermakastikkeessa-vhh", "kanakorma-kukkakaaliriisilla",
  "uunikanapasta-kesakurpitsa", "khao-kha-moo-vhh", "larb-moo-vhh", "jauhelihakastike-kesakurpitsanuudeleilla",
  "pizza-margherita", "meheva-suklaakakku", "marjakiisseli-vaniljakastikkeella",
  "pannacotta-marjakastikkeella", "caponata", "siemengranola-jogurtilla",
  "koshari", "baozi", "marokkolainen-couscous", "pasta-alla-norma", "bulgogi",
  "congee-riisipuuro", "tomaatti-kananmuna-wokki", "harira", "kreikkalainen-moussaka",
  "doner-kebab", "souvlaki", "gazpacho", "spanakopita", "tabbouleh",
  "poronkaristys-kukkakaalimuusilla", "liha-juureskeitto-perunaton", "vhh-omenapiirakka",
  "chettinad-kana", "vhh-raparperipiirakka", "vhh-mansikkakakku", "kermainen-kanasienipannu",
  "raejuusto-pesto-kasviskulho", "kana-parmesaanipannu-parsakaali", "vhh-juustokakku",
  "vhh-brita-kakku", "rahkapiirakka-vhh", "vhh-letut", "vhh-lihapiirakka",
  "vhh-runebergintortut", "keto-korvapuustit", "vhh-korvapuustit", "keto-mutakakku",
  "keto-suklaakeksit", "vhh-mokkapalat",
  "maksalaatikko-kukkakaalilla", "paistettu-maksa-pekonilla", "khao-man-gai-vhh", "keltainen-kanacurry-vhh",
  "kesakurpitsalasagne-vhh", "pad-thai-vhh-konjac", "rahka-marjakerroskulho", "vhh-lohikeitto-kukkakaalilla",
  "valimerellinen-tortilla-espanola-aamupalaksi", "kana-fajita-pelti", "italian-pata", "kukkakaaligratiini-pekonilla",
  "valimerellinen-menemen-fetalla", "khao-soi-vhh-konjac", "broileri-kukkakaaligratiini", "som-tam-vhh-kurkkuna",
  "kanakeitto-pinaatti-sitruuna", "pad-kra-pao-vhh", "pohjoisafrikkalainen-maakouda", "kermainen-lohipata",
  "gai-yang-vhh", "tom-yum-goong-vhh", "pad-kee-mao-vhh-konjac", "paahdettu-aamiaismunakoiso", "vhh-mustikkapiirakka",
  "ketopizza-pofiber-pohjalla", "tom-kha-gai-vhh", "marjainen-chiavanukas", "halloumimunakas", "pad-see-ew-vhh-konjac",
  "raejuusto-uunimunakas", "keto-kauralesesampylat", "jauhelihapihvit-vhh-kermakastikkeella", "keto-pannukakku", "kaakao-kookos-chia",
  "parsakaali-sinihomejuustofrittata", "yum-woon-sen-vhh", "keto-pinaattiletut", "kurkku-oliivi-aamiaiskulho", "uunilohi-smetanakuorrutteella",
  "moo-ping-vhh", "uuniporsas-kermakastikkeessa-vhh", "kai-jiew-vhh", "savulohi-avokadokulho", "tonnikalamunakkaat-uunissa",
  "hyderabadi-kanabiryani", "bun-cha-hanoi", "bibimbap", "chow-mein", "dan-dan-nuudelit", "goi-cuon", "hapanimela-porsas",
  "idli-sambar", "indonesialainen-bubur-sumsum", "intialainen-rava-uttapam", "intialainen-aloo-paratha",
  "indonesialainen-bubur-ayam-kanariisipuuro", "indonesialainen-nasi-goreng-aamiaisriisi", "indonesialainen-serabi-kookospannukakku", "dim-sum",
  "yangzhou-paistettu-riisi", "lanttulaatikko-kermainen", "uunimakkara-sipulipedilla", "nakkikeitto-kukkakaalilla",
  "amritsari-kala", "lindstrominpihvit-kaalilla", "kana-yakitori-kaalilla", "paprikainen-vhh-gulassi",
  "kana-enchilada-kukkakaalivuoka", "nakkikastike-kukkakaalimuusi", "ropa-vieja", "karjalanpaisti-vhh",
  "kerala-kalacurry", "kanapyorykat-tomaattikastike", "silakkapihvit-tilli-kermakastike", "kantonilainen-hoyrytetty-kala",
  "tacokulho-nauta-avokado", "kanasalaatti-pesto-mozzarella", "sitruuna-yrttikana-parsa", "pho-bo",
  "karibia-kookosriisi-pavuilla", "thai-khao-tom-katkaravuilla", "lahi-ita-kikhernejauho-yrttilettu",
  "korealainen-yachaejuk-kasvisjuk", "malesialainen-congee-inkivaarilla", "kiinalainen-tomaattimunakas-riisilla",
  "kiinalainen-riisipuuro-kananmunalla", "thai-jok-kanalla", "thai-porsasjok", "lahi-ita-fattet-hummus",
  "pohjoisafrikkalainen-lablabi", "jerk-kana", "tangyuan", "paella-valenciana", "rendang-padang",
  "malesialainen-apam-balik", "malesialainen-kookos-banaanikulho", "meksikolainen-kurpitsapuuro-piloncillolla",
  "indonesialainen-pisang-goreng-aamiaiseksi", "nasi-lemak",
  "char-siu", "hernekeitto-savupotkalla", "lanzhou-naudanliha-nuudelikeitto", "roujiamo",
  "intialainen-ven-pongal", "korealainen-kongjuk-soijapapu-riisipuuro", "indialainen-poha-maapahkinoilla",
  "meksikolainen-aamiais-tacot-mustapavuilla", "meksikolainen-paputostada-aamupalaksi", "intialainen-mannasuurimoupma",
  "intialainen-pesarattu-mungpavuista", "falafel", "masala-dosa", "intialainen-idli-kookoschutneylla",
  "pohjoisafrikkalainen-baghrir", "intialainen-masala-dosa", "pohjoisafrikkalainen-msemen-hunajalla",
  "malesialainen-roti-canai-dhalilla", "pohjoisafrikkalainen-bissara", "lahi-ita-ful-medames",
  "meksikolainen-chilaquiles-verdes", "meksikolainen-huevos-divorciados", "meksikolainen-molletes-pico-de-gallolla",
  "korealainen-bindaetteok-aamiaiseksi", "vietnamilainen-banh-cuon-sienilla", "vietnamilainen-banh-xeo-aamiaisletut",
  "intialainen-besan-chilla", "vietnamilainen-chao-ga-kanapuuro", "korealainen-gyeranbap-riisikulho",
  "pohjoisafrikkalainen-harcha-juustolla", "vietnamilainen-hu-tieu-aamiaiskeitto", "kiinalainen-bao-munalla",
  "karibia-maissipuuro-kookoksella", "japanilainen-soba-aamiaiskeitto", "kiinalainen-jianbing-munaletty",
  "karibia-johnny-cake", "lahi-ita-taatelipuuro-tahinilla", "indonesialainen-ketoprak-aamiaiskulho",
  "thai-kookosriisi-mangolla", "korealainen-bataatti-riisikulho",
  "vietnamilainen-papaija-kookospuuro", "japanilainen-tamago-kake-gohan", "indonesialainen-tempeh-munakulho",
  "lahi-ita-zaatar-munat", "keto-joulutortut", "vietnamilainen-kahvijogurtti-banaanilla",
  "valimerellinen-jogurttikulho-hunajalla", "kiinalainen-soijamaito-aamiaisella", "thai-kananmunat-kookoscurryssa",
  "japanilainen-miso-tofu-paksoi", "japanilainen-curry-tofulla", "kanaviillokki-kukkakaalilla",
  "kookos-lime-kanacurry", "kimchi-jjigae", "sate-ayam", "janssoninkiusaus-juuriselleri", "okonomiyaki-kaaliletut",
  "valimerellinen-ricotta-persikkakulho", "paneer-tikka", "meksikolainen-huevos-a-la-mexicana",
  "meksikolainen-quesadilla-sienilla", "valimerellinen-appelsiini-aamiaiskakku", "vietnamilainen-banh-bao-kananmunalla",
  "japanilainen-dashimaki-tamago-aamiaislautasella", "valimerellinen-halloumi-tomaattileipa", "indonesialainen-bakwan-maissifritter",
  "japanilainen-kabocha-puuro", "malesialainen-kaya-paahtoleipa", "valimerellinen-farinata-aamupalaksi",
  "korealainen-kimchi-jeon-aamiaiseksi", "korealainen-tofu-kimchi-aamiaiskulho", "korealainen-jumeokbap-merilevalla",
  "valimerellinen-tahinipuuro", "malesialainen-kuih-seri-muka", "malesialainen-laksa-lemak-aamiaiseksi",
  "indonesialainen-lontong-sayur-aamiaiseksi", "lahi-ita-manakish-zaatarilla", "pohjoisafrikkalainen-minttutee-kaurapuuro",
  "malesialainen-mee-goreng-aamunuudeleilla", "meksikolainen-atole-maissipuuro",
  "vietnamilainen-banh-mi-munalla", "pohjoisafrikkalainen-kuskus-aamiaiskulho", "malesialainen-nasi-lemak-aamiaisella",
  "indonesialainen-nasi-uduk-aamiaisella", "japanilainen-natto-riisikulho", "japanilainen-okayu-umeboshipluumulla",
  "japanilainen-onigiri-lohella", "japanilainen-yaki-onigiri-misolla", "kiinalainen-hirssipuuro-taateleilla",
  "vietnamilainen-pho-ga-aamuksi", "thai-riisinuudelikeitto-aamuksi", "vietnamilainen-xoi-maapahkinalla",
  "malesialainen-roti-jala-currykanalla", "thai-roti-munalla-banaanilla", "karibia-saltfish-fritterit",
  "kiinalainen-kevatsipulipannukakku", "thai-maissifritterit", "kiinalainen-katkarapu-wontonkeitto", "jiaozi", "xiaolongbao",
  "karibia-bammy-kassavaleipa", "kiinalainen-musta-seesamipuuro", "meksikolainen-munakokkeli-pico-de-gallolla",
  "karibia-mango-limejogurtti", "thai-papaijajogurtti", "intialainen-pinaatti-paneer-chilla",
  "lahi-ita-pistaasijogurtti", "karibia-plantain-aamiaislautanen", "pohjoisafrikkalainen-taatelipuuro-appelsiinilla",
  "korealainen-mandu-keitto-aamiaiseksi", "tunisialainen-brik", "dal-makhani", "kung-pao-kana", "mala-xiang-guo",
  "mapo-tofu", "bouillabaisse", "pav-bhaji", "pekingin-ankka", "sichuan-hot-pot", "tunisialainen-ojja",
  "karibia-ackee-ja-suolakala", "karibia-callaloo-munakas", "korealainen-gyeran-mari-kasviksilla",
  "japanilainen-hojicha-jogurtti-persimonilla", "karibia-jamaikalainen-munakokkeli", "lahi-ita-labneh-kulho-zaatarilla",
  "pellava-puuro-pahkinoilla", "lahi-ita-menemen-sumakilla", "pohjoisafrikkalainen-harissa-shakshuka",
  "valimerellinen-pinaatti-fetashakshuka", "kiinalainen-teehaudutetut-munat", "thai-kai-jiao-yrteilla",
  "yrttituorejuusto-kinkkurullat", "carnitas-salaattitacot", "rogan-josh", "kreikkalainen-kanavuoka-oliiveilla",
  "kana-tagine-sitruunalla", "miso-lohi-paksoi", "palak-paneer", "shoyu-kanakeitto-konjac",
  "hunaja-sinappikana-kaalilla", "siskonmakkarakeitto-juurekset", "tandoorikana", "vhh-pyttipannu",
];
const recipeCategories: Record<string, string> = {
  "tortilla-de-patatas": "paaruoat", "vhh-lihamureke": "paaruoat", hummus: "alkuruoat",
  "chili-con-carne-kukkakaaliriisi": "paaruoat", ratatouille: "paaruoat", "vhh-kaalikaarryleet": "paaruoat",
  "jauheliha-kaalikeitto-vhh": "paaruoat", "taytetyt-paprikat-vhh": "paaruoat", "vhh-kaalilaatikko": "paaruoat",
  "munakoiso-jauhelihavuoka-vhh": "paaruoat", "valimerellinen-kikherne-yrttiaamiainen": "aamupalat",
  "lahi-ita-kikherne-shakshuka": "aamupalat",
  "massaman-curry-kanalla-vhh": "paaruoat",
  "chole-bhature": "paaruoat", "gulab-jamun": "jalkiruoat", samosa: "alkuruoat", "aloo-paratha": "paaruoat",
  "vada-pav": "alkuruoat", "pani-puri": "alkuruoat", "jauheliha-makaronilaatikko": "paaruoat", "medu-vada": "alkuruoat",
  "lohikeitto-kuohukermalla": "paaruoat", "butter-chicken": "paaruoat", "punainen-kanacurry-vhh": "paaruoat",
  "thai-vihrea-curry-kanalla-vhh": "paaruoat", "panang-curry-kanalla-vhh": "paaruoat", menemen: "paaruoat",
  "lihapullat-kermakastikkeessa-vhh": "paaruoat", "kanakorma-kukkakaaliriisilla": "paaruoat",
  "uunikanapasta-kesakurpitsa": "paaruoat", "khao-kha-moo-vhh": "paaruoat", "larb-moo-vhh": "paaruoat",
  "jauhelihakastike-kesakurpitsanuudeleilla": "paaruoat",
  "pizza-margherita": "paaruoat", "meheva-suklaakakku": "jalkiruoat",
  "marjakiisseli-vaniljakastikkeella": "jalkiruoat", "pannacotta-marjakastikkeella": "jalkiruoat",
  caponata: "alkuruoat", "siemengranola-jogurtilla": "aamupalat",
  koshari: "paaruoat", baozi: "paaruoat", "marokkolainen-couscous": "paaruoat",
  "pasta-alla-norma": "paaruoat", bulgogi: "paaruoat", "congee-riisipuuro": "paaruoat",
  "tomaatti-kananmuna-wokki": "paaruoat", harira: "paaruoat", "kreikkalainen-moussaka": "paaruoat",
  "doner-kebab": "paaruoat", souvlaki: "paaruoat", gazpacho: "alkuruoat",
  spanakopita: "alkuruoat", tabbouleh: "alkuruoat",
  "poronkaristys-kukkakaalimuusilla": "paaruoat", "liha-juureskeitto-perunaton": "paaruoat",
  "vhh-omenapiirakka": "jalkiruoat", "chettinad-kana": "paaruoat", "vhh-raparperipiirakka": "jalkiruoat",
  "vhh-mansikkakakku": "jalkiruoat", "kermainen-kanasienipannu": "paaruoat",
  "raejuusto-pesto-kasviskulho": "aamupalat", "kana-parmesaanipannu-parsakaali": "paaruoat",
  "vhh-juustokakku": "jalkiruoat", "vhh-brita-kakku": "jalkiruoat", "rahkapiirakka-vhh": "jalkiruoat",
  "vhh-letut": "jalkiruoat", "vhh-lihapiirakka": "leivonnaiset", "vhh-runebergintortut": "leivonnaiset",
  "keto-korvapuustit": "leivonnaiset", "vhh-korvapuustit": "jalkiruoat", "keto-mutakakku": "jalkiruoat",
  "keto-suklaakeksit": "jalkiruoat", "vhh-mokkapalat": "jalkiruoat",
  "maksalaatikko-kukkakaalilla": "paaruoat", "paistettu-maksa-pekonilla": "paaruoat",
  "khao-man-gai-vhh": "paaruoat", "keltainen-kanacurry-vhh": "paaruoat", "kesakurpitsalasagne-vhh": "paaruoat",
  "pad-thai-vhh-konjac": "paaruoat", "rahka-marjakerroskulho": "aamupalat", "vhh-lohikeitto-kukkakaalilla": "paaruoat",
  "valimerellinen-tortilla-espanola-aamupalaksi": "aamupalat", "kana-fajita-pelti": "paaruoat", "italian-pata": "paaruoat",
  "kukkakaaligratiini-pekonilla": "paaruoat", "valimerellinen-menemen-fetalla": "aamupalat", "khao-soi-vhh-konjac": "paaruoat",
  "broileri-kukkakaaligratiini": "paaruoat", "som-tam-vhh-kurkkuna": "alkuruoat", "kanakeitto-pinaatti-sitruuna": "paaruoat",
  "pad-kra-pao-vhh": "paaruoat", "pohjoisafrikkalainen-maakouda": "aamupalat", "kermainen-lohipata": "paaruoat",
  "gai-yang-vhh": "paaruoat", "tom-yum-goong-vhh": "paaruoat", "pad-kee-mao-vhh-konjac": "paaruoat",
  "paahdettu-aamiaismunakoiso": "aamupalat", "vhh-mustikkapiirakka": "jalkiruoat", "ketopizza-pofiber-pohjalla": "paaruoat",
  "tom-kha-gai-vhh": "paaruoat", "marjainen-chiavanukas": "aamupalat", "halloumimunakas": "aamupalat",
  "pad-see-ew-vhh-konjac": "paaruoat", "raejuusto-uunimunakas": "paaruoat", "keto-kauralesesampylat": "leivonnaiset",
  "jauhelihapihvit-vhh-kermakastikkeella": "paaruoat", "keto-pannukakku": "jalkiruoat", "kaakao-kookos-chia": "aamupalat",
  "parsakaali-sinihomejuustofrittata": "paaruoat", "yum-woon-sen-vhh": "alkuruoat", "keto-pinaattiletut": "paaruoat",
  "kurkku-oliivi-aamiaiskulho": "aamupalat", "uunilohi-smetanakuorrutteella": "paaruoat",
  "moo-ping-vhh": "paaruoat", "uuniporsas-kermakastikkeessa-vhh": "paaruoat", "kai-jiew-vhh": "paaruoat",
  "savulohi-avokadokulho": "aamupalat", "tonnikalamunakkaat-uunissa": "aamupalat", "hyderabadi-kanabiryani": "paaruoat",
  "bun-cha-hanoi": "paaruoat", bibimbap: "paaruoat", "chow-mein": "paaruoat", "dan-dan-nuudelit": "paaruoat",
  "goi-cuon": "alkuruoat", "hapanimela-porsas": "paaruoat", "idli-sambar": "paaruoat",
  "indonesialainen-bubur-sumsum": "aamupalat", "intialainen-rava-uttapam": "aamupalat", "intialainen-aloo-paratha": "aamupalat",
  "indonesialainen-bubur-ayam-kanariisipuuro": "aamupalat", "indonesialainen-nasi-goreng-aamiaisriisi": "aamupalat",
  "indonesialainen-serabi-kookospannukakku": "aamupalat", "dim-sum": "alkuruoat",
  "yangzhou-paistettu-riisi": "paaruoat", "lanttulaatikko-kermainen": "paaruoat", "uunimakkara-sipulipedilla": "paaruoat",
  "nakkikeitto-kukkakaalilla": "paaruoat", "amritsari-kala": "paaruoat", "lindstrominpihvit-kaalilla": "paaruoat",
  "kana-yakitori-kaalilla": "paaruoat", "paprikainen-vhh-gulassi": "paaruoat", "kana-enchilada-kukkakaalivuoka": "paaruoat",
  "nakkikastike-kukkakaalimuusi": "paaruoat", "ropa-vieja": "paaruoat", "karjalanpaisti-vhh": "paaruoat",
  "kerala-kalacurry": "paaruoat", "kanapyorykat-tomaattikastike": "paaruoat", "silakkapihvit-tilli-kermakastike": "paaruoat",
  "kantonilainen-hoyrytetty-kala": "paaruoat", "tacokulho-nauta-avokado": "paaruoat", "kanasalaatti-pesto-mozzarella": "paaruoat",
  "sitruuna-yrttikana-parsa": "paaruoat", "pho-bo": "paaruoat",
  "karibia-kookosriisi-pavuilla": "aamupalat", "thai-khao-tom-katkaravuilla": "aamupalat",
  "lahi-ita-kikhernejauho-yrttilettu": "aamupalat", "korealainen-yachaejuk-kasvisjuk": "aamupalat",
  "malesialainen-congee-inkivaarilla": "aamupalat", "kiinalainen-tomaattimunakas-riisilla": "aamupalat",
  "kiinalainen-riisipuuro-kananmunalla": "aamupalat", "thai-jok-kanalla": "aamupalat", "thai-porsasjok": "aamupalat",
  "lahi-ita-fattet-hummus": "aamupalat", "pohjoisafrikkalainen-lablabi": "aamupalat",
  "jerk-kana": "paaruoat", tangyuan: "jalkiruoat", "paella-valenciana": "paaruoat", "rendang-padang": "paaruoat",
  "malesialainen-apam-balik": "aamupalat", "malesialainen-kookos-banaanikulho": "aamupalat",
  "meksikolainen-kurpitsapuuro-piloncillolla": "aamupalat", "indonesialainen-pisang-goreng-aamiaiseksi": "aamupalat",
  "nasi-lemak": "paaruoat",
  "char-siu": "paaruoat", "hernekeitto-savupotkalla": "paaruoat", "lanzhou-naudanliha-nuudelikeitto": "paaruoat",
  roujiamo: "paaruoat", "intialainen-ven-pongal": "aamupalat", "korealainen-kongjuk-soijapapu-riisipuuro": "aamupalat",
  "indialainen-poha-maapahkinoilla": "aamupalat", "meksikolainen-aamiais-tacot-mustapavuilla": "aamupalat",
  "meksikolainen-paputostada-aamupalaksi": "aamupalat", "intialainen-mannasuurimoupma": "aamupalat",
  "intialainen-pesarattu-mungpavuista": "aamupalat", falafel: "paaruoat", "masala-dosa": "paaruoat",
  "intialainen-idli-kookoschutneylla": "aamupalat", "pohjoisafrikkalainen-baghrir": "aamupalat",
  "intialainen-masala-dosa": "aamupalat", "pohjoisafrikkalainen-msemen-hunajalla": "aamupalat",
  "malesialainen-roti-canai-dhalilla": "aamupalat", "pohjoisafrikkalainen-bissara": "aamupalat",
  "lahi-ita-ful-medames": "aamupalat",
  "meksikolainen-chilaquiles-verdes": "aamupalat", "meksikolainen-huevos-divorciados": "aamupalat",
  "meksikolainen-molletes-pico-de-gallolla": "aamupalat", "korealainen-bindaetteok-aamiaiseksi": "aamupalat",
  "vietnamilainen-banh-cuon-sienilla": "aamupalat", "vietnamilainen-banh-xeo-aamiaisletut": "aamupalat",
  "intialainen-besan-chilla": "aamupalat", "vietnamilainen-chao-ga-kanapuuro": "aamupalat",
  "korealainen-gyeranbap-riisikulho": "aamupalat", "pohjoisafrikkalainen-harcha-juustolla": "aamupalat",
  "vietnamilainen-hu-tieu-aamiaiskeitto": "aamupalat", "kiinalainen-bao-munalla": "aamupalat",
  "karibia-maissipuuro-kookoksella": "aamupalat", "japanilainen-soba-aamiaiskeitto": "aamupalat",
  "kiinalainen-jianbing-munaletty": "aamupalat", "karibia-johnny-cake": "aamupalat",
  "lahi-ita-taatelipuuro-tahinilla": "aamupalat", "indonesialainen-ketoprak-aamiaiskulho": "aamupalat",
  "vietnamilainen-papaija-kookospuuro": "aamupalat", "japanilainen-tamago-kake-gohan": "aamupalat",
  "indonesialainen-tempeh-munakulho": "aamupalat", "lahi-ita-zaatar-munat": "aamupalat",
  "keto-joulutortut": "leivonnaiset", "vietnamilainen-kahvijogurtti-banaanilla": "aamupalat",
  "valimerellinen-jogurttikulho-hunajalla": "aamupalat", "kiinalainen-soijamaito-aamiaisella": "aamupalat",
  "thai-kananmunat-kookoscurryssa": "aamupalat", "japanilainen-miso-tofu-paksoi": "aamupalat",
  "japanilainen-curry-tofulla": "paaruoat", "kanaviillokki-kukkakaalilla": "paaruoat",
  "kookos-lime-kanacurry": "paaruoat", "kimchi-jjigae": "paaruoat", "sate-ayam": "paaruoat",
  "janssoninkiusaus-juuriselleri": "paaruoat", "okonomiyaki-kaaliletut": "paaruoat",
  "valimerellinen-ricotta-persikkakulho": "aamupalat", "paneer-tikka": "alkuruoat",
  "meksikolainen-huevos-a-la-mexicana": "aamupalat",
  "thai-kookosriisi-mangolla": "aamupalat", "korealainen-bataatti-riisikulho": "aamupalat",
  "meksikolainen-quesadilla-sienilla": "aamupalat", "valimerellinen-appelsiini-aamiaiskakku": "aamupalat",
  "vietnamilainen-banh-bao-kananmunalla": "aamupalat", "japanilainen-dashimaki-tamago-aamiaislautasella": "aamupalat",
  "valimerellinen-halloumi-tomaattileipa": "aamupalat", "indonesialainen-bakwan-maissifritter": "aamupalat",
  "japanilainen-kabocha-puuro": "aamupalat", "malesialainen-kaya-paahtoleipa": "aamupalat",
  "valimerellinen-farinata-aamupalaksi": "aamupalat", "korealainen-kimchi-jeon-aamiaiseksi": "aamupalat",
  "korealainen-tofu-kimchi-aamiaiskulho": "aamupalat", "korealainen-jumeokbap-merilevalla": "aamupalat",
  "valimerellinen-tahinipuuro": "aamupalat", "malesialainen-kuih-seri-muka": "aamupalat",
  "malesialainen-laksa-lemak-aamiaiseksi": "aamupalat", "indonesialainen-lontong-sayur-aamiaiseksi": "aamupalat",
  "lahi-ita-manakish-zaatarilla": "aamupalat", "pohjoisafrikkalainen-minttutee-kaurapuuro": "aamupalat",
  "malesialainen-mee-goreng-aamunuudeleilla": "aamupalat", "meksikolainen-atole-maissipuuro": "aamupalat",
  "vietnamilainen-banh-mi-munalla": "aamupalat", "pohjoisafrikkalainen-kuskus-aamiaiskulho": "aamupalat",
  "malesialainen-nasi-lemak-aamiaisella": "aamupalat", "indonesialainen-nasi-uduk-aamiaisella": "aamupalat",
  "japanilainen-natto-riisikulho": "aamupalat", "japanilainen-okayu-umeboshipluumulla": "aamupalat",
  "japanilainen-onigiri-lohella": "aamupalat", "japanilainen-yaki-onigiri-misolla": "aamupalat",
  "kiinalainen-hirssipuuro-taateleilla": "aamupalat", "vietnamilainen-pho-ga-aamuksi": "aamupalat",
  "thai-riisinuudelikeitto-aamuksi": "aamupalat", "vietnamilainen-xoi-maapahkinalla": "aamupalat",
  "malesialainen-roti-jala-currykanalla": "aamupalat", "thai-roti-munalla-banaanilla": "aamupalat",
  "karibia-saltfish-fritterit": "aamupalat", "kiinalainen-kevatsipulipannukakku": "aamupalat",
  "thai-maissifritterit": "aamupalat", "kiinalainen-katkarapu-wontonkeitto": "aamupalat", jiaozi: "alkuruoat", xiaolongbao: "alkuruoat",
  "karibia-bammy-kassavaleipa": "aamupalat", "kiinalainen-musta-seesamipuuro": "aamupalat",
  "meksikolainen-munakokkeli-pico-de-gallolla": "aamupalat", "karibia-mango-limejogurtti": "aamupalat",
  "thai-papaijajogurtti": "aamupalat", "intialainen-pinaatti-paneer-chilla": "aamupalat",
  "lahi-ita-pistaasijogurtti": "aamupalat", "karibia-plantain-aamiaislautanen": "aamupalat",
  "pohjoisafrikkalainen-taatelipuuro-appelsiinilla": "aamupalat", "korealainen-mandu-keitto-aamiaiseksi": "aamupalat",
  "tunisialainen-brik": "alkuruoat", "dal-makhani": "paaruoat", "kung-pao-kana": "paaruoat",
  "mala-xiang-guo": "paaruoat", "mapo-tofu": "paaruoat", bouillabaisse: "paaruoat",
  "pav-bhaji": "paaruoat", "pekingin-ankka": "paaruoat", "sichuan-hot-pot": "paaruoat", "tunisialainen-ojja": "paaruoat",
  "karibia-ackee-ja-suolakala": "aamupalat", "karibia-callaloo-munakas": "aamupalat",
  "korealainen-gyeran-mari-kasviksilla": "aamupalat", "japanilainen-hojicha-jogurtti-persimonilla": "aamupalat",
  "karibia-jamaikalainen-munakokkeli": "aamupalat", "lahi-ita-labneh-kulho-zaatarilla": "aamupalat",
  "pellava-puuro-pahkinoilla": "aamupalat", "lahi-ita-menemen-sumakilla": "aamupalat",
  "pohjoisafrikkalainen-harissa-shakshuka": "aamupalat", "valimerellinen-pinaatti-fetashakshuka": "aamupalat",
  "kiinalainen-teehaudutetut-munat": "aamupalat", "thai-kai-jiao-yrteilla": "aamupalat",
  "yrttituorejuusto-kinkkurullat": "aamupalat", "carnitas-salaattitacot": "paaruoat", "rogan-josh": "paaruoat",
  "kreikkalainen-kanavuoka-oliiveilla": "paaruoat", "kana-tagine-sitruunalla": "paaruoat", "miso-lohi-paksoi": "paaruoat",
  "palak-paneer": "paaruoat", "shoyu-kanakeitto-konjac": "paaruoat", "hunaja-sinappikana-kaalilla": "paaruoat",
  "siskonmakkarakeitto-juurekset": "paaruoat", "tandoorikana": "paaruoat", "vhh-pyttipannu": "paaruoat",
};
const recipeFileNames: Record<string, string> = { "vhh-kaalilaatikko": "kaalilaatikko", "vhh-pyttipannu": "pyttipannu-vhh" };

const [input, foodRecords, giSource] = await Promise.all([
  readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8").then((text) => JSON.parse(text)),
  readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8").then((text) => JSON.parse(text) as FoodRecord[]),
  readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8").then((text) => JSON.parse(text)),
]);
const recipeBindings = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-load-recipe-bindings.json"), "utf8")) as {
  baselineCommit: string;
  recipes: Record<string, string | null>;
  calculationInputs: Record<string, string | null>;
};
const recipeAliases = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-load-recipe-aliases.json"), "utf8")) as {
  aliases: Record<string, { canonical: string; evidence: string }>;
};
for (const [alias, value] of Object.entries(recipeAliases.aliases)) {
  if (!alias.trim() || !value.canonical.trim() || !value.evidence.trim()) throw new Error(`Recipe ingredient alias requires canonical identity and evidence: ${alias}`);
}

const inputs = input.recipes as GlycemicLoadRecipeInput[];
const actualIds = inputs.map((recipe) => recipe.recipeId);
if (actualIds.length !== expectedRecipeIds.length || new Set(actualIds).size !== actualIds.length
    || expectedRecipeIds.some((id) => !actualIds.includes(id))) {
  throw new Error(`Glycemic-load pilot input must contain exactly the ${expectedRecipeIds.length} selected recipes.`);
}

const giRecords = giSource.records as GlycemicIndexRecord[];
if (!Array.isArray(giSource.sources) || new Set(giRecords.map((record) => record.id)).size !== giRecords.length) {
  throw new Error("GI source catalog and uniquely identified GI records are required.");
}
for (const record of giRecords) {
  if (record.referenceScale !== "GLUCOSE_100" || !record.source?.url || !record.source.qualityEvidence
      || !["STRONG", "SUPPLEMENTARY"].includes(record.qualityTier)) {
    throw new Error(`GI record has incomplete provenance or quality tier: ${record.id}`);
  }
  if (record.qualityTier === "STRONG" && (!record.source.published || !record.source.iso26642Confirmed)) {
    throw new Error(`Strong GI record must be published and ISO 26642-confirmed: ${record.id}`);
  }
}
const sourceHashes = Object.fromEntries(await Promise.all(expectedRecipeIds.map(async (recipeId) => {
  const category = recipeCategories[recipeId] ?? "aamupalat";
  const recipePath = path.join(root, "reseptit", category, `${recipeFileNames[recipeId] ?? recipeId}.md`);
  const contents = (await readFile(recipePath, "utf8")).replaceAll("\r\n", "\n");
  return [recipeId, recipeBindingHash(contents, recipeAliases.aliases)];
})));

const rawResults = inputs.map((recipe) => calculateGlycemicLoad(recipe, foodRecords, giRecords));
const calculationInputHashes = Object.fromEntries(inputs.map((recipe) => [recipe.recipeId, glycemicLoadInputHash(recipe)]));
const results = rawResults.map((result) => {
  const boundHash = recipeBindings.recipes[result.recipeId];
  const recipeChanged = !recipeBindingMatches(boundHash, sourceHashes[result.recipeId]);
  const inputChanged = !recipeBindingMatches(recipeBindings.calculationInputs[result.recipeId], calculationInputHashes[result.recipeId]);
  if (recipeChanged || inputChanged) {
    return {
      ...result,
      status: "INSUFFICIENT SOURCE DATA" as const,
      glycemicLoadPerServing: null,
      glycemicLoadRangePerServing: null,
      confidence: null,
      blockers: [
        ...result.blockers,
        ...(recipeChanged ? [`${result.recipeId}: recipe structure differs from the last GL review (${recipeBindings.baselineCommit}); ingredient mapping and calculation must be reviewed again.`] : []),
        ...(inputChanged ? [`${result.recipeId}: GI/food mapping, portion, conversion, source evidence or calculation assumptions differ from the last GL review; the input must be reviewed again.`] : []),
      ],
    };
  }
  return result;
});
const report = {
  generatedAt: new Date().toISOString(),
  scope: "Internal provenance report for ingredient-based per-serving estimates. These are not measurements of prepared meals or individual glucose responses.",
  formula: "sum(GI_i × available carbohydrate_i per serving) / 100",
  fineliEvidence: input.fineliEvidence,
  additionalCarbohydrateEvidence: input.additionalCarbohydrateEvidence ?? null,
  massEvidence: input.massEvidence,
  selectionNotes: input.selectionNotes ?? {},
  giSourcePolicy: "Published, traceable glucose-scale GI values may support a public ingredient estimate as a direct match, justified analogue, or category mean. Match quality is separate from study quality: analogues and category means force LOW confidence. A missing GI match for an individual contribution below 1 g available carbohydrate per serving may be omitted only while all such recipe contributions sum to less than 1 g per serving; larger known carbohydrate contributions require GI evidence.",
  recipeBindingBaseline: recipeBindings.baselineCommit,
  recipeBindingMismatches: expectedRecipeIds.filter((recipeId) => !recipeBindingMatches(recipeBindings.recipes[recipeId], sourceHashes[recipeId])),
  calculationInputMismatches: expectedRecipeIds.filter((recipeId) => !recipeBindingMatches(recipeBindings.calculationInputs[recipeId], calculationInputHashes[recipeId])),
  previousPublicBaseline: { sourceCommit: "b1c2bd3e036f0a17b3f61a560c39b5df56e1d8d5", calculated: 190, insufficientSourceData: 135, zeroTotals: 21, changedRecipeInputsAmongCalculated: 21 },
  giSourceCatalog: giSource.sources,
  sourceHashes,
  results,
  summary: {
    recipes: results.length,
    calculated: results.filter((result) => result.status === "CALCULATED").length,
    insufficientSourceData: results.filter((result) => result.status === "INSUFFICIENT SOURCE DATA").length,
  },
};

const outputDir = path.join(root, "tmp/nutrition");
await mkdir(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "glycemic-load-pilot.json");
await writeFile(outputPath, JSON.stringify(report, null, 2) + "\n");
const isFixtureBuild = process.env.RECIPE_SOURCE_ROOT !== undefined;
const publicResults = results.flatMap((result) => {
  // This recipe already has a dedicated central-page explanation for why its
  // earlier provisional total is withheld; keep its ingredient audit internal.
  if (result.recipeId === "maksalaatikko-kukkakaalilla") return [];
  const recipe = siteContent.recipes.find((entry) => entry.recipeId === result.recipeId && entry.locale === "fi");
  if (!recipe) {
    // Image-pipeline tests build a tiny one-recipe fixture. Keep that build
    // independent of the production-only GL pilot corpus, while still failing
    // a normal site build if any selected Finnish recipe disappears.
    if (isFixtureBuild) return [];
    throw new Error(`Finnish published recipe is missing for GL pilot item: ${result.recipeId}`);
  }
  const sourceReferences: Array<{ title: string; url: string; matchKind: "EXACT" | "ANALOG" | "CATEGORY_MEAN" | "CALCULATION_POLICY"; confidence: "HIGH" | "MEDIUM" | "LOW"; note: string }> = result.status === "CALCULATED"
    ? [...new Set(result.ingredients.flatMap((ingredient) => ingredient.giRecordId ? [ingredient.giRecordId] : []))]
      .map((recordId) => giRecords.find((record) => record.id === recordId))
      .filter((record): record is GlycemicIndexRecord => record !== undefined)
      .map((record) => ({
        title: record.source.title,
        url: record.source.url,
        matchKind: record.matchKind ?? "EXACT",
        confidence: record.confidence ?? (record.qualityTier === "STRONG" ? "HIGH" : "LOW"),
        note: record.note ?? record.source.qualityEvidence,
      }))
    : [];
  if (result.status === "CALCULATED" && result.omittedAvailableCarbohydratePerServingG > 0 && sourceReferences.length === 0) {
    sourceReferences.push({
      title: "Documented small-contribution editorial tolerance",
      url: "/glykeeminen-kuorma/",
      matchKind: "CALCULATION_POLICY",
      confidence: "LOW",
      note: `Unmatched portions totalling ${result.omittedAvailableCarbohydratePerServingG.toFixed(3)} g available carbohydrate per serving were omitted within the cumulative 1 g editorial tolerance.`,
    });
  }
  const incompleteReasons = result.blockers.map((blocker) => {
    const detail = blocker.startsWith(`${result.recipeId}: `) ? blocker.slice(result.recipeId.length + 2) : blocker;
    const separator = detail.indexOf(": ");
    const ingredient = separator >= 0 ? detail.slice(0, separator) : "";
    const reason = separator >= 0 ? detail.slice(separator + 2) : detail;
    const category = /GI/i.test(reason) ? "GI"
      : /food-specific mass conversion|food-specific.*mass|portion mass|gram conversion/i.test(reason) ? "PORTION"
      : /allows materially different|alternative|selected liquid|variant/i.test(reason) ? "VARIANT"
      : /amount|quantity|mass is missing|unweighed|implausible|unit or decimal/i.test(reason) ? "AMOUNT"
      : "SOURCE";
    const ingredientIndex = recipe.ingredients.findIndex((entry) => entry.item === ingredient);
    const translations = siteContent.recipes.filter((entry) => entry.recipeId === result.recipeId);
    const ingredientNames = Object.fromEntries(translations.map((entry) => [entry.locale, ingredientIndex >= 0 ? entry.ingredients[ingredientIndex]?.item : undefined]));
    return { ingredientIndex, ingredientNames, category };
  });
  return {
    recipeId: result.recipeId,
    title: recipe.title,
    routePath: recipe.routePath,
    localeRoutes: Object.fromEntries(siteContent.recipes.filter((entry) => entry.recipeId === result.recipeId).map((entry) => [entry.locale, { title: entry.title, routePath: entry.routePath }])),
    status: result.status,
    incompleteReasons,
    glycemicLoadPerServing: result.glycemicLoadPerServing,
    glycemicLoadRangePerServing: result.glycemicLoadRangePerServing,
    omittedAvailableCarbohydratePerServingG: result.omittedAvailableCarbohydratePerServingG,
    confidence: result.confidence,
    carbohydrateSources: [...new Set(result.ingredients.flatMap((ingredient) => ingredient.fineliRecordId ? [ingredient.fineliRecordId] : []))]
      .map((recordId) => foodRecords.find((record) => record.id === recordId))
      .filter((record): record is FoodRecord => record !== undefined)
      .map((record) => ({
        title: record.name,
        url: record.sourceUrl,
        note: record.id.startsWith("afcd-")
          ? "Available-carbohydrate value from AFCD Release 3; FSANZ attribution and CC BY-SA 3.0 Australia terms apply."
          : "Available-carbohydrate value from THL Fineli Rel20; CC BY 4.0.",
      })),
    sourceReferences,
  };
});
const expectedPublicResultCount = expectedRecipeIds.length - 1;
if (!isFixtureBuild && publicResults.length !== expectedPublicResultCount) {
  throw new Error(`Production GL pilot page must include all ${expectedPublicResultCount} publishable entries.`);
}
const publicModule = `/* Generated by scripts/glycemic-load-pilot.ts. Public-safe summary only. */\nexport interface GlycemicLoadPilotPublicResult { recipeId: string; title: string; routePath: string; localeRoutes: Partial<Record<"fi" | "en" | "sv" | "th", { title: string; routePath: string }>>; status: "CALCULATED" | "INSUFFICIENT SOURCE DATA"; incompleteReasons: Array<{ ingredientIndex: number; ingredientNames: Partial<Record<"fi" | "en" | "sv" | "th", string>>; category: "GI" | "SOURCE" | "PORTION" | "VARIANT" | "AMOUNT" }>; glycemicLoadPerServing: number | null; glycemicLoadRangePerServing: { min: number; max: number } | null; omittedAvailableCarbohydratePerServingG: number; confidence: "HIGH" | "MEDIUM" | "LOW" | null; carbohydrateSources: Array<{ title: string; url: string; note: string }>; sourceReferences: Array<{ title: string; url: string; matchKind: "EXACT" | "ANALOG" | "CATEGORY_MEAN" | "CALCULATION_POLICY"; confidence: "HIGH" | "MEDIUM" | "LOW"; note: string }>; }\nexport const glycemicLoadPilotReviewedRecipeCount = ${expectedRecipeIds.length};\nexport const glycemicLoadPilotResults: GlycemicLoadPilotPublicResult[] = ${JSON.stringify(publicResults, null, 2)};\n`;
await writeFile(path.join(siteDir, "src/generated/glycemic-load-pilot.generated.ts"), publicModule, "utf8");
console.log(JSON.stringify({ ...report.summary, output: path.relative(root, outputPath), blockers: results.map((result) => ({ recipeId: result.recipeId, count: result.blockers.length })) }, null, 2));
