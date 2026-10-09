'use strict';
// Development-only browser checks; the shipped game has no package dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const results = path.join(root, 'test-results');
const allowed = new Set(['index.html','manifesto.html','engine.js','app.js','style.css','favicon.svg']);
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const file = pathname.replace(/^\/TrustMeBro\//, '') || 'index.html';
  if (!pathname.startsWith('/TrustMeBro/') || !allowed.has(file)) { res.writeHead(404); res.end(); return; }
  try { res.writeHead(200, {'Content-Type':types[path.extname(file)]}); res.end(await fs.readFile(path.join(root,file))); }
  catch { res.writeHead(500); res.end(); }
});

async function capture(page, name, fullPage = true) {
  await page.screenshot({path:path.join(results,`${name}.png`),fullPage});
  // Optional low-resolution visual review over a connector that returns text logs.
  if (process.env.TMB_CAPTURE_VISUALS === '1') {
    const jpeg = await page.screenshot({type:'jpeg',quality:65,fullPage:false});
    console.log(`TMB_VISUAL_${name}_BEGIN ${jpeg.toString('base64')} TMB_VISUAL_${name}_END`);
  }
}
async function run() {
  await fs.mkdir(results,{recursive:true});
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({headless:true,channel:process.env.TMB_CHROME_CHANNEL || 'chrome'});
  try {
    for (const viewport of [{width:1440,height:1100},{width:390,height:844},{width:320,height:720}]) {
      const context = await browser.newContext({viewport,acceptDownloads:true});
      const page = await context.newPage(); const errors = []; const requests = [];
      page.on('pageerror',error => errors.push(error.message));
      context.on('request',request => requests.push(request.url()));
      await page.goto(`${origin}/TrustMeBro/`);
      assert.equal(await page.locator('#phase-badge').innerText(),'NOT CLOCKED IN');
      assert.ok((await page.locator('#transcript').innerText()).includes('TRUTH OS'));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth),false,'game fits viewport');
      if (viewport.width !== 320) await capture(page,`terminal-${viewport.width}`);

      await page.locator('#help-button').click();
      assert.equal(await page.locator('#manual').isVisible(),true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#manual').isVisible(),false);
      assert.equal(await page.evaluate(()=>document.activeElement.id),'help-button');

      const popupPromise = page.waitForEvent('popup');
      await page.locator('.manifesto-link').click();
      const manifesto = await popupPromise; await manifesto.waitForLoadState();
      assert.ok((await manifesto.locator('h1').innerText()).includes('The Manifesto'));
      assert.equal(await manifesto.locator('.manifesto-article').count(),8);
      assert.equal(await manifesto.evaluate(()=>document.documentElement.scrollWidth > innerWidth),false,'manifesto fits viewport');
      assert.ok((await manifesto.locator('.manifesto-paper').evaluate(el=>getComputedStyle(el).backgroundImage)).includes('radial-gradient'));
      if (viewport.width !== 320) await capture(manifesto,`manifesto-${viewport.width}`,false);
      await manifesto.close();

      await page.locator('#primary-action').click();
      assert.equal(await page.locator('#phase-badge').innerText(),'IN PROCEEDINGS');
      let iterations = 0;
      while (await page.locator('#phase-badge').innerText() !== 'SHIFT COMPLETE') {
        assert.ok(iterations++ < 45,'campaign terminates through the real UI');
        const phase = await page.locator('#phase-badge').innerText();
        assert.notEqual(phase,'PATIENCE EXTINCT');
        if (phase === 'CASE CLOSED') { await page.locator('#primary-action').click(); continue; }
        const patience = parseInt(await page.locator('#patience-value').innerText(),10);
        const coffee = page.locator('[data-command="coffee"]');
        if (patience <= 82 && await coffee.isEnabled()) await coffee.click();
        const roast = page.locator('[data-command="roast"]');
        if (await roast.isEnabled()) await roast.click();
        const inspect = page.locator('[data-command="inspect"]');
        if (await inspect.isEnabled()) await inspect.click();
        const hint = await page.locator('#action-hint').innerText();
        const match = hint.match(/Recommended: (\w+)/i);
        assert.ok(match,`an inspected claim exposes its instrument: ${hint}`);
        await page.locator(`[data-command="${match[1].toLowerCase()}"]`).click();
      }
      assert.equal(await page.locator('#sanctions-value').innerText(),'6/6');
      assert.equal(await page.locator('#docket-open').innerText(),'0 OPEN CASES');
      assert.equal(await page.locator('#contempt-value').innerText(),'06');
      assert.equal(await page.locator('.log-line.stamp').count(),6);
      assert.ok((await page.locator('#outcome').innerText()).includes('Goan get farked.'));
      if (viewport.width === 1440) await capture(page,'victory');

      const input = page.locator('#command');
      await input.fill('clear'); await input.press('Enter');
      assert.equal(await page.locator('#transcript').innerText(),'');
      const downloadPromise = page.waitForEvent('download');
      await page.locator('#export-button').click();
      const download = await downloadPromise; const receiptPath = path.join(results,`receipts-${viewport.width}.txt`);
      await download.saveAs(receiptPath);
      const receipts = await fs.readFile(receiptPath,'utf8');
      assert.ok(receipts.includes('FINAL DETERMINATION / FORM GF-001'));
      assert.ok(receipts.includes('CASE TMB-001'));
      assert.ok(receipts.includes('auditor@tmb:~$ clear'));

      await page.locator('#primary-action').click();
      assert.equal(await page.locator('#phase-badge').innerText(),'NOT CLOCKED IN');
      await input.fill('<img src=x onerror=alert(1)>'); await input.press('Enter');
      assert.equal(await page.locator('#transcript img').count(),0);
      assert.ok((await page.locator('#transcript').innerText()).includes('<img src=x onerror=alert(1)>'));
      await input.press('ArrowUp'); assert.equal(await input.inputValue(),'<img src=x onerror=alert(1)>');
      await input.fill('fact'); await input.press('Tab'); assert.equal(await input.inputValue(),'factcheck');
      assert.deepEqual(errors,[],'no uncaught browser errors');
      assert.ok(requests.every(url=>url.startsWith(origin)),'no external requests from the game');
      console.log(`PASS ${viewport.width}px: subpath, full campaign, manual, manifesto, export, history, completion, literal input, no external requests.`);
      await context.close();
    }
  } finally { await browser.close(); }
}
run().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());
