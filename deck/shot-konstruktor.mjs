import { chromium } from '/Users/umidikromboev/.claude/tools/site-qa/node_modules/playwright/index.mjs';
const NEW='https://raxpro-site-git-feat-site-v3-umid-s-projects.vercel.app';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1600,height:1100},deviceScaleFactor:2});
const p=await ctx.newPage();
await p.goto(`${NEW}/ru/konstruktor`,{waitUntil:'domcontentloaded',timeout:60000});
await p.waitForTimeout(3500);
await p.screenshot({path:'shots/pages/12-konstruktor-guide.png'});
await p.click('.kon-guide .kon-btn--solid').catch(e=>console.log('гид:',e.message));
await p.waitForTimeout(1200);

await p.getByText('Паллеты', {exact:false}).first().click().catch(e=>console.log('шаг1 клик:',e.message));
await p.waitForTimeout(600);
await p.getByRole('button',{name:/Дальше/}).first().click().catch(e=>console.log('дальше1:',e.message));
await p.waitForTimeout(2000);
await p.screenshot({path:'shots/pages/09-konstruktor-step2.png'});

// заполнить размеры, если поля пустые
const inputs = await p.$$('input[type="number"], input[inputmode="numeric"]');
console.log('полей:', inputs.length);
const vals=['36','30','8'];
for (let i=0;i<inputs.length && i<vals.length;i++){ await inputs[i].fill(vals[i]).catch(()=>{}); }
await p.waitForTimeout(800);
await p.getByRole('button',{name:/Дальше|Рассчитать|Посчитать|Результат/}).first().click().catch(e=>console.log('дальше2:',e.message));
await p.waitForTimeout(6000);
await p.screenshot({path:'shots/pages/10-konstruktor-step3.png'});
await p.screenshot({path:'shots/pages/11-konstruktor-full.png', fullPage:true});
console.log('готово');
await b.close();
