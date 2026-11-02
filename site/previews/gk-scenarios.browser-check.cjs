async (page) => {
 const initial=await page.locator('#scenario-data').textContent();
 const results=JSON.parse(initial).results;
 let selections=0;
 for(const width of [1280,768,375]){
  await page.setViewportSize({width,height:900});
  for(const locale of ['fi','en','sv','th']){
   await page.locator('#language').selectOption(locale);
   for(const r of results){
    await page.locator('#product').selectOption(r.scenarioId);
    const selected=await page.locator('#result').getAttribute('data-scenario');
    if(selected!==r.scenarioId)throw Error('Wrong product rendered');
    const body=await page.locator('#result').innerText();
    if(!body.includes(r.productName)||!body.includes('HOLD')||!body.includes('LOW'))throw Error('Missing product/uncertainty');
    const numeric=await page.locator('#result > p.big:not(.status)').innerText();
    await page.locator('#servings').fill('16');await page.locator('#servings').dispatchEvent('change');
    if(numeric!==await page.locator('#result > p.big:not(.status)').innerText())throw Error('Per-serving result changed');
    const amount=await page.locator('#result').innerText();
    if(!amount.includes('300 g')||!amount.includes('160 g'))throw Error('Batch quantities did not scale');
    await page.locator('#servings').fill('8');await page.locator('#servings').dispatchEvent('change');
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Page overflows horizontally '+width+'/'+locale+'/'+r.scenarioId);
    selections++;
   }
  }
 }
 if(initial!==await page.locator('#scenario-data').textContent())throw Error('Source DTO mutated');
 if(await page.locator('script[type="application/ld+json"],link[rel="canonical"]').count())throw Error('Unexpected SEO data');
 await page.locator('#language').selectOption('fi');await page.locator('#product').selectOption('torras-maltitol');
 await page.locator('#servings').fill('0');await page.locator('#servings').dispatchEvent('change');
 if(await page.locator('#servings').evaluate(n=>n.validity.valid))throw Error('Invalid servings accepted');
 if(await page.locator('#result p.big').count())throw Error('Stale numerical result with invalid servings');
 await page.locator('#product').selectOption('afcd-f009837');
 if(await page.locator('#result p.big').count())throw Error('Product change exposed stale numbers');
 await page.locator('#servings').fill('8');await page.locator('#servings').dispatchEvent('change');
 await page.locator('#product').selectOption('torras-maltitol');
 await page.setViewportSize({width:1280,height:900});
 return {browser:'Brave via Playwright CLI',selectionChecks:selections,widths:[1280,768,375],languages:['fi','en','sv','th'],products:4,scaling:'PASS',inputImmutable:'PASS',seo:'PASS',invalidServings:'PASS',horizontalOverflow:'NONE'};
}
