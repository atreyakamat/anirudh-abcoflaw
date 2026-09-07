import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const viewports = [
  { name: '320px', width: 320, height: 812 },
  { name: '375px', width: 375, height: 812 },
  { name: '390px', width: 390, height: 844 },
  { name: '430px', width: 430, height: 932 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '1366px', width: 1366, height: 768 },
  { name: '1440px', width: 1440, height: 900 },
];

const routes = [
  '/',
  '/about',
  '/services',
  '/blog',
  '/faq',
  '/contact',
  '/book',
  '/privacy',
  '/terms',
  '/portal',
];

async function runVisualAudit() {
  const browser = await chromium.launch();
  const outputDir = path.join(process.cwd(), 'scratch', 'screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results = [];
  console.log('Starting Visual Regression & Responsive Layout Audit...\n');

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    for (const route of routes) {
      try {
        const response = await page.goto(`http://localhost:3000${route}`, {
          waitUntil: 'networkidle',
        });
        const status = response ? response.status() : 0;

        // Check horizontal overflow
        const overflowData = await page.evaluate(() => {
          const scrollWidth = document.documentElement.scrollWidth;
          const clientWidth = document.documentElement.clientWidth;
          const hasOverflow = scrollWidth > clientWidth;
          
          // Find elements causing overflow
          const overflowElements = [];
          if (hasOverflow) {
            const all = document.querySelectorAll('*');
            for (const el of all) {
              const rect = el.getBoundingClientRect();
              if (rect.right > clientWidth + 1) {
                overflowElements.push({
                  tag: el.tagName,
                  class: el.className ? el.className.toString().slice(0, 50) : '',
                  right: rect.right,
                  clientWidth,
                });
              }
            }
          }
          return { scrollWidth, clientWidth, hasOverflow, overflowElements: overflowElements.slice(0, 5) };
        });

        // Screenshot for 375px, 768px, 1440px
        let screenshotPath = null;
        if (['375px', '768px', '1440px'].includes(vp.name)) {
          const cleanRoute = route === '/' ? 'home' : route.replace('/', '');
          screenshotPath = path.join(outputDir, `${cleanRoute}_${vp.name}.png`);
          await page.screenshot({ path: screenshotPath, fullPage: true });
        }

        results.push({
          viewport: vp.name,
          route,
          status,
          scrollWidth: overflowData.scrollWidth,
          clientWidth: overflowData.clientWidth,
          hasOverflow: overflowData.hasOverflow,
          overflowElements: overflowData.overflowElements,
          consoleErrors: [...consoleErrors],
          screenshotPath,
        });

      } catch (err) {
        results.push({
          viewport: vp.name,
          route,
          status: 'ERROR',
          error: err.message,
        });
      }
    }
    await context.close();
  }

  await browser.close();

  fs.writeFileSync(
    path.join(process.cwd(), 'scratch', 'visual_audit_results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('Visual audit complete. Results saved to scratch/visual_audit_results.json');
}

runVisualAudit();
