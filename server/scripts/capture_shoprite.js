import fs from 'fs';
import { chromium } from 'playwright';

(async () => {
  const url = 'https://www.shoprite.com/sm/planning/rsid/604/digital-coupon?srsltid=AfmBOopnt47IvhPBIakCm8TL6XeQkCo6K3Ywrr8S4Cp3Z9LPI1xoiQyS';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const calls = [];

  page.on('requestfinished', async (req) => {
    try {
      const r = req;
      const url = r.url();
      const resourceType = r.resourceType();
      if (resourceType === 'xhr' || resourceType === 'fetch' || /api|coupon|digital|coupon/i.test(url)) {
        let resp = null;
        try {
          const response = await r.response();
          if (response) {
            const ct = response.headers()['content-type'] || '';
            if (ct.includes('application/json')) {
              resp = await response.json();
            } else {
              resp = await response.text();
            }
          }
        } catch (e) {
          resp = `error reading response: ${String(e)}`;
        }

        calls.push({ url, resourceType, response: resp });
      }
    } catch (e) {
      // ignore
    }
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    // still capture content
  }

  const html = await page.content();
  fs.writeFileSync('/tmp/shoprite_rendered.html', html, 'utf8');
  fs.writeFileSync('/tmp/shoprite_network.json', JSON.stringify(calls, null, 2), 'utf8');

  console.log('Saved /tmp/shoprite_rendered.html and /tmp/shoprite_network.json');
  await browser.close();
})();
