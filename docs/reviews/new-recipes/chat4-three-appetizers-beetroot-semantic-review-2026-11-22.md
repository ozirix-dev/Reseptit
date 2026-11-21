# Chat-4 – punajuuricarpaccion, sillikaviaarin ja nokkoslettujen kielivertailu

Päiväys: 2026-11-22
Työn omistaja: Chat 4
Lähtö-main: `7abaf77fed6b00b1124d8f4e8f0069fd24f3ca30`

## Katselmoinnin rajaus

FI-lähteiden ja yhdeksän EN/SV/TH-draft-käännöksen ainesosat, annokset, valmistusvaiheet, lämpötilat, ajat, kieltomuodot ja turvallisuuden keskeiset kohdat on verrattu. Tämä on **ChatGPT Chat-4:n kirjallinen tekstikatselmointi**, ei Codex-työnkulun virallinen hyväksyntä eikä riippumaton ihmistarkistus.

| Resepti | FI blob | EN blob | SV blob | TH blob | Tulos |
| --- | --- | --- | --- | --- | --- |
| `punajuuricarpaccio-vuohenjuustolla` | `94eec711a5694193dd545bd0f45eb45b474626f0` | `79e5e7c70ed2bf4f5e2c5bddb4a00a496d56d27d` | `bda8479b04f4683cd7cfd2ccfc50ecb65cb1713b` | `6384568068efe8439430fbe5d0a1ccc227c69a47` | 200 °C, 45–60 min paahto, ohuet siivut, oliiviöljy, etikka, hunaja, vuohenjuusto, pähkinät ja timjami vastaavat FI-lähdettä; TH murentamisohje täsmennetty |
| `sillikaviaari-ruisnapeilla` | `2dba4e4d69002b062f1fbbf412d7db44b76e0221` | `5fa4cb0f4f2a1bc50f976b2abdd869d473fa1b08` | `a7ff2882f35df36abf2ec98b28631c9143ccf95c` | `734c03514795478c0ed5dec0cb14c35f42bfc712` | Valmis silli, kovaksi keitetyt munat, kylmä säilytys, ruisnapit vasta tarjoillessa; ei oikeaa mätiä |
| `nokkosletut-puolukoilla` | `5fca94393011a52b9cdfc5c25dcb99c7572ff28a` | `d0fa169e727bd2124d1ebc6c989455fcbeeb7893` | `cb091d2b138097469cff287b6a6cca87544a670e` | `97e4891f8bd6c5cd37ec8b67ba3a7e637dadf076` | Puhtaalta alueelta kerätyt nokkoset, 5 min keittäminen, taikinan 30 min lepo, läpikypsät letut ja puolukat vastaavat; nitraattivaroitukset säilyvät |

## Korjaus

Punajuuricarpaccion TH-vaiheessa 4 ilmaus `บิชีสนมแพะเนื้อนุ่มลงบนบีตรูต` täsmennettiin `บิชีสนมแพะเนื้อนุ่มเป็นชิ้นเล็ก ๆ โรยลงบนบีตรูต`, jotta pehmeän vuohenjuuston murentaminen ja ripottelu tarkoittavat yksiselitteisesti samaa kuin FI `Murusta juusto päälle`. Lisätty rajattu regressiotesti.

## Julkaisupäätös

- Kaikki 9 katselmoitua käännöstä ovat edelleen `draft`; muutkaan alkuruokien EN/SV/TH-käännökset eivät muutu.
- Aiempi TH-blob yllä on **lähtöversio**, ei muutoksen jälkeinen SHA.
- `meta/kaannokset/codex-review-evidence.json`-rekisteriin ei kirjoiteta Codex-hyväksyntää, jota tämä katselmointi ei ole suorittanut.
- Ei muutoksia FI-resepteihin, numeeriseen ravintolaskentaan, GK-arvoihin tai Cloudflare-julkaisuun.
