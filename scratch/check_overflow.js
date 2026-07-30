import { chromium } from '@playwright/test';

async function checkOverflow() {
  const browser = await chromium.launch();
  const routes = ['/', '/about', '/services', '/blog', '/faq', '/contact', '/book', '/privacy', '/terms', '/portal'];
  const widths = [320, 375, 768, 1440];
  
  console.log('--- STARTING ACCURATE OVERFLOW AUDIT ---');
  let totalOverflows = 0;

  for (const w of widths) {
    const context = await browser.newContext({ viewport: { width: w, height: 800 } });
    const page = await context.newPage();
    for (const r of routes) {
      await page.goto('http://localhost:3000' + r, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => {
        const sw = document.documentElement.scrollWidth;
        const cw = document.documentElement.clientWidth;
        const badEls = [];
        if (sw > cw) {
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > cw + 1) {
              badEls.push({ 
                tag: el.tagName, 
                id: el.id || '',
                class: (el.className || '').toString().slice(0, 60), 
                right: Math.round(rect.right), 
                cw 
              });
            }
          }
        }
        return { sw, cw, overflow: sw > cw, badEls: badEls.slice(0, 5) };
      });

      if (overflow.overflow) {
        totalOverflows++;
        console.log(`[FAIL] OVERFLOW at ${w}px on ${r}: scrollWidth=${overflow.sw}, clientWidth=${overflow.cw}`);
        console.log('       Elements causing overflow:', JSON.stringify(overflow.badEls, null, 2));
      } else {
        console.log(`[PASS] ${r} at ${w}px (scrollWidth=${overflow.sw}, clientWidth=${overflow.cw})`);
      }
    }
    await context.close();
  }
  await browser.close();
  console.log(`--- COMPLETED OVERFLOW AUDIT: ${totalOverflows} OVERFLOW ISSUES FOUND ---`);
}

checkOverflow();
