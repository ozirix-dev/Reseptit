import sharp from "sharp";
import {mkdir,access} from "node:fs/promises";
import {join,dirname} from "node:path";
const output=join(process.cwd(),"..","kuvat");
let z=19930701;const rnd=()=>((z=(Math.imul(z,1664525)+1013904223)>>>0)/4294967296);
const ellipse=(x,y,rx,ry,fill,stroke="none",sw=0)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
const circ=(x,y,r,fill)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'"/>';
const shape=(d,fill,stroke="none",sw=0)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>';
function backdrop(col="#f9e9d7"){
 return '<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000" viewBox="0 0 1500 1000">'+
 '<defs><linearGradient id="w" x2="1" y2="1"><stop stop-color="'+col+'"/><stop offset="1" stop-color="#c5a18a"/></linearGradient>'+
 '<linearGradient id="b" x2=".8" y2="1"><stop stop-color="#e2b372"/><stop offset=".55" stop-color="#bd7b3d"/><stop offset="1" stop-color="#8c4a2b"/></linearGradient>'+
 '<linearGradient id="c" x2="1" y2=".8"><stop stop-color="#fff0b9"/><stop offset="1" stop-color="#e5b765"/></linearGradient>'+
 '<filter id="shadow"><feGaussianBlur stdDeviation="25"/></filter></defs>'+
 '<rect width="1500" height="1000" fill="url(#w)"/>'+circ(1320,135,175,"#fff5d8")+
 '<rect y="710" width="1500" height="290" fill="#ad8266"/>'+shape("M0 814 Q450 789 1000 816 T1500 810 M0 925 Q530 902 1000 933 T1500 918","none","#a0785b",8)+
 ellipse(745,784,602,105,"#664b3b")+ellipse(745,773,613,93,"#fff9ef","#dccdba",12);
}
function specs(cx,cy,rx,ry,n,fill="#dca25d",r=4){
 let s="";for(let i=0;i<n;i++){let a=rnd()*6.283,rr=Math.sqrt(rnd());s+=ellipse(Math.round(cx+Math.cos(a)*rx*rr),Math.round(cy+Math.sin(a)*ry*rr),r+rnd()*2,r/2+rnd()*2,fill)}return s;
}
function seeds(cx,cy,rx,ry,n){
 let s="";for(let i=0;i<n;i++){let a=rnd()*6.283,rr=Math.sqrt(rnd());s+=ellipse(Math.round(cx+Math.cos(a)*rx*rr),Math.round(cy+Math.sin(a)*ry*rr),6,3,rnd()<.5?"#f0ddad":"#76542f")}return s;
}
function loaf(){z=13;return backdrop()+
 shape("M275 462 Q293 276 610 289 L1067 318 Q1190 342 1206 520 L1191 683 Q752 770 312 691 Z","url(#b)","#894523",14)+
 shape("M325 494 Q724 442 1161 495 L1150 676 Q758 739 335 660 Z","url(#c)","#b37737",12)+
 specs(733,557,382,88,210,"#d4a15a",4)+ellipse(742,367,470,125,"#c0833e","#96572c",12)+seeds(728,356,427,108,210)+
 shape("M812 438 L1160 506 L1119 695 L797 626 Z","url(#c)","#a86537",15)+specs(976,572,134,75,120,"#d49e58",3.5)+
 shape("M807 633 L1105 702 L1070 743 L767 679 Z","#c38a49","#90552b",8)+"</svg>"}
function rolls(){z=24;let s=backdrop("#f8eada");const buns=[[431,461,196,150],[775,377,193,147],[1089,472,202,150],[652,635,194,136],[980,650,190,140]];
 for(const a of buns){let [x,y,rx,ry]=a;s+=ellipse(x,y+ry*.62,rx*1.1,ry*.53,"#a66c3e")+ellipse(x,y,rx,ry,"url(#b)","#8e532c",12)+ellipse(x-11,y-30,rx*.84,ry*.67,"#e1ad6c")+seeds(x,y,rx*.77,ry*.72,85)}return s+"</svg>"}
function pizza(){z=35;let s=backdrop("#f7e6d7")+ellipse(750,544,512,301,"url(#b)","#94542f",25)+ellipse(754,538,448,241,"#c74d35","#a73b2c",13)+specs(752,543,420,224,180,"#e87b50",9);
 for(let i=0;i<18;i++){let x=423+rnd()*667,y=366+rnd()*319;s+=ellipse(x,y,30+rnd()*26,17+rnd()*15,"#fff6d5","#e7dbb0",4)}
 for(let i=0;i<16;i++){let x=412+rnd()*682,y=360+rnd()*325;s+=ellipse(x,y,25,20,"#e16a53","#b43d31",4)+circ(x,y,6,"#f5bb72")}
 for(let i=0;i<14;i++){let x=419+rnd()*700,y=358+rnd()*338;s+=shape("M"+x+" "+(y-22)+" Q"+(x+24)+" "+y+" "+x+" "+(y+23)+" Q"+(x-24)+" "+y+" "+x+" "+(y-22),"#3f733b","#2f5a30",3)}
 s+=shape("M759 526 L1160 565 L1076 714 L753 658 Z","#f5d391","#9f5a31",13)+specs(941,603,136,46,36,"#fff3ce",6);
 return s+"</svg>"}
function sponge(){z=46;return backdrop("#fff0d8")+shape("M311 411 Q760 337 1182 410 L1185 676 Q738 755 309 680 Z","url(#b)","#985c31",15)+
 shape("M333 463 Q754 404 1160 466 L1160 651 Q750 724 330 648 Z","url(#c)","#c9934f",10)+specs(743,563,375,100,240,"#fff1be",3)+
 ellipse(745,410,438,136,"#dfab61","#996136",12)+ellipse(743,398,401,106,"#ebbf80")+
 shape("M769 413 L1123 515 L996 682 L754 565 Z","url(#c)","#ab6e43",14)+specs(914,556,109,64,130,"#d5a05c",3)+
 shape("M748 565 L989 684 L961 734 L727 626 Z","#d59a4e","#aa682f",8)+"</svg>"}
function pancake(){z=57;let s=backdrop("#f9e8d7")+shape("M241 387 L1184 378 L1284 735 L291 758 Z","#faf9f2","#c2b09c",23)+shape("M285 419 L1140 415 L1219 699 L320 715 Z","#dca75e","#9e612f",12)+specs(750,553,424,119,270,"#a66a2e",5)+shape("M783 549 L1191 544 L1206 684 L818 687 Z","url(#c)","#af763c",11);
 for(const [x,y,color] of [[916,525,"#cf4455"],[982,543,"#b53d47"],[1015,509,"#ce344a"],[1082,556,"#496aa6"],[1131,500,"#365b99"],[955,586,"#516eae"]])s+=circ(x,y,24,color);
 s+=ellipse(1103,638,68,31,"#fff9ed","#e2d7c8",4)+shape("M1045 637 Q1064 557 1099 607 Q1131 551 1161 635","#fff9ed","#e8dfd3",5);return s+"</svg>"}
const images=[
 ["leivonnaiset/gluteeniton-siemenvuokaleipa.webp",loaf],
 ["leivonnaiset/gluteenittomat-kauralesesampylat.webp",rolls],
 ["leivonnaiset/gluteeniton-durrapizzapohja.webp",pizza],
 ["jalkiruoat/gluteeniton-perunajauhokakkupohja.webp",sponge],
 ["jalkiruoat/gluteeniton-uunipannukakku.webp",pancake]
];
for(const [relative,render] of images){
 const destination=join(output,relative);
 try{await access(destination);console.log("Existing file; no overwrite "+relative);continue}catch{}
 await mkdir(dirname(destination),{recursive:true});
 await sharp(Buffer.from(render())).webp({quality:85,effort:4}).toFile(destination);
 const m=await sharp(destination).metadata();
 if(m.width!==1500 || m.height!==1000 || m.format!=="webp")throw Error("WebP verification failed");
 console.log("Created "+relative+" (1500x1000)");
}
