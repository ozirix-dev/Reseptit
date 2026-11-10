// Rajattu, toistettava kuvitus kahdelle perinnereseptille (PR #412).
// Käyttää samaa Sharp-versiota kuin sivuston kuvanrakennus.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd(), "../kuvat/jalkiruoat");
const circle = (x,y,r,fill,op=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${op}"/>`;
function strawberries(points) {
  return points.map(([x,y,s]) => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cy="16" rx="42" ry="46" fill="#bd203b" stroke="#8f1f35" stroke-width="4"/>
    <path d="M-25 -19 Q0 -37 23 -18 L11 -7 L0 -14 L-11 -8 Z" fill="#427044"/>
    <g fill="#f9e9af" opacity=".85"><ellipse cx="-16" cy="0" rx="3" ry="5"/><ellipse cx="15" cy="-1" rx="3" ry="5"/><ellipse cx="0" cy="18" rx="3" ry="5"/><ellipse cx="-17" cy="30" rx="3" ry="4"/><ellipse cx="17" cy="31" rx="3" ry="4"/></g>
    </g>`).join("");
}
const prelude=`<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
<defs>
  <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fdf0dc"/><stop offset="1" stop-color="#c7ab91"/></linearGradient>
  <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#c29a78"/><stop offset="1" stop-color="#806047"/></linearGradient>
  <linearGradient id="sponge" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#ffdf92"/><stop offset="1" stop-color="#e3a33f"/></linearGradient>
  <linearGradient id="crust" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#dba75b"/><stop offset="1" stop-color="#9c632a"/></linearGradient>
  <linearGradient id="cream" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#e4d8c8"/></linearGradient>
  <filter id="shadow"><feGaussianBlur stdDeviation="22"/></filter>
</defs>
<rect width="1536" height="1024" fill="url(#bg)"/>
<circle cx="1350" cy="140" r="220" fill="#fff8e5" opacity=".55"/>
<rect x="0" y="737" width="1536" height="287" fill="url(#wood)"/>
<path d="M0 811 Q400 779 810 811 T1536 811 M0 925 Q500 901 880 929 T1536 925" fill="none" stroke="#8f674e" stroke-width="9" opacity=".2"/>
<ellipse cx="765" cy="815" rx="595" ry="105" fill="#5f4234" opacity=".27" filter="url(#shadow)"/>
<ellipse cx="765" cy="794" rx="625" ry="110" fill="#f8f4e9" stroke="#cbbda8" stroke-width="9"/>
<ellipse cx="765" cy="784" rx="530" ry="78" fill="#fffdf5" stroke="#e9dfd0" stroke-width="6"/>`;
const spongeCrumb=Array.from({length:85},(_,i)=> {
 const x=378+(i*53)%765,y=477+(i*37)%200;
 return circle(x,y,3+(i%4),i%2?"#d6a25a":"#fff4bc",.46);
}).join("");
const sponge=`${prelude}
<g>
<path d="M285 424 Q760 319 1226 424 L1226 680 Q760 776 285 680 Z" fill="url(#crust)"/>
<path d="M342 441 Q760 369 1164 442 L1164 660 Q760 725 342 660 Z" fill="url(#sponge)"/>
${spongeCrumb}
<ellipse cx="755" cy="424" rx="472" ry="141" fill="url(#crust)" stroke="#b37c38" stroke-width="10"/>
<ellipse cx="750" cy="414" rx="421" ry="109" fill="#ddab64" opacity=".44"/>
<path d="M795 418 L1145 505 L1025 682 L770 571 Z" fill="#fcdf90" stroke="#b87b32" stroke-width="13"/>
<path d="M770 571 L1025 682 L1008 733 L753 624 Z" fill="#da9b46"/>
${Array.from({length:70},(_,i)=>circle(818+(i*27)%220,509+(i*43)%160,2+i%4,"#d69d45",.48)).join("")}
<path d="M326 590 Q460 730 645 718" fill="none" stroke="#d59a4f" stroke-width="10" opacity=".32"/>
</g>
</svg>`;
const cake=`${prelude}
<g>
<path d="M280 423 Q760 344 1237 428 L1237 688 Q760 796 280 691 Z" fill="url(#cream)" stroke="#ded4c7" stroke-width="14"/>
<ellipse cx="760" cy="421" rx="480" ry="142" fill="#fffcf4" stroke="#eee4d4" stroke-width="12"/>
<path d="M778 438 L1202 491 L1117 713 L790 676 Z" fill="#e8b75a" stroke="#f6efd9" stroke-width="20"/>
<path d="M798 519 L1175 551 L1142 582 L789 557 Z" fill="#a92547"/>
<path d="M790 580 L1142 610 L1128 634 L788 607 Z" fill="#fff9ec"/>
<path d="M795 666 L1117 710" stroke="#e4ce99" stroke-width="18"/>
<path d="M320 461 Q765 360 1206 461" fill="none" stroke="#ffffff" stroke-width="22" opacity=".9"/>
${Array.from({length:12},(_,i)=>{const x=346+(i*72),y=451+Math.sin(i*1.9)*12;return `<path d="M${x} ${y} q15 -62 33 0 q-10 30 -33 0" fill="#fffdfa" stroke="#e1d7cf" stroke-width="5"/>`}).join("")}
${strawberries([[470,340,.8],[560,310,.8],[655,334,.9],[748,303,.89],[850,329,.85],[947,311,.75],[1040,357,.75],[1160,389,.65]])}
<path d="M1120 723 q65 22 110 0" fill="none" stroke="#faf1e5" stroke-width="18"/>
</g>
</svg>`;
await fs.mkdir(root,{recursive:true});
for(const [name,svg] of [["sienikakkupohja.webp",sponge],["perinteinen-mansikkataytekakku-sienikakkupohjalla.webp",cake]]){
  const target=path.join(root,name);
  try { await fs.access(target); console.log("Säilytettiin olemassa oleva: "+name); continue; } catch{}
  await sharp(Buffer.from(svg)).webp({quality:78,effort:4}).toFile(target);
  const {width,height,format}=await sharp(target).metadata();
  if(width!==1536||height!==1024||format!=="webp") throw new Error("Kuvalaatuvirhe: "+name);
  console.log("Luotu "+name+" 1536x1024");
}
