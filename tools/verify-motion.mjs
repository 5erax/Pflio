// Optional browser QA: install Playwright separately or supply its module URL.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_PATH || 'playwright');
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.PREVIEW_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
  const posterCenter = await page.locator('.world-poster').evaluate(async image => {
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    return [...context.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data];
  });
  assert.ok(posterCenter[0] > 150 && posterCenter[1] > 200 && posterCenter[2] < 90, 'The open A must replace the old filled-center asterisk, including cached fallback art');
  const seek = async progress => {
    await page.evaluate(value => scrollTo({ top: value * (document.documentElement.scrollHeight - innerHeight), behavior: 'instant' }), progress);
    await page.waitForTimeout(1100);
    return page.evaluate(() => ({
      bands: [...document.querySelectorAll('.name-band')].map(el => new DOMMatrix(getComputedStyle(el).transform).m41),
      time: document.querySelector('video').currentTime,
      paused: document.querySelector('video').paused,
    }));
  };
  const start = await seek(0);
  const split = await seek(0.017);
  const aligned = await seek(0.036);
  const reversed = await seek(0.017);
  const reset = await seek(0);
  assert.ok(split.bands.some(x => Math.abs(x) > 80), 'Lettering must visibly separate');
  assert.ok(aligned.bands.every(x => Math.abs(x) < 1), 'Lettering must reassemble before the hero unpins');
  split.bands.forEach((x, index) => assert.ok(Math.abs(x - reversed.bands[index]) < 1, 'Reverse scroll must retrace each cut'));
  assert.ok(split.time > start.time + 1 && Math.abs(reset.time - start.time) < 0.1, 'Video must seek forward and back');
  assert.ok([start, split, aligned, reversed, reset].every(sample => sample.paused), 'The video must never autoplay');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => !document.querySelector('main').classList.contains('cinematic'));
  assert.equal(await page.locator('video').getAttribute('src'), null);
  assert.ok((await seek(0)).bands.every(x => x === 0), 'Mode changes must remove timeline transforms');
  assert.equal(await page.locator('.chapter-seam').first().isVisible(), false);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForFunction(() => document.querySelector('main').classList.contains('cinematic'));
  await page.getByRole('button', { name: 'Work', exact: true }).click();
  await page.waitForTimeout(1600);
  await page.locator('.work-gallery').focus();
  await page.keyboard.press('End');
  await page.waitForTimeout(1600);
  assert.equal(await page.locator('.project-caption h3').textContent(), 'FinGenie');
  await page.getByRole('button', { name: 'Open project', exact: true }).click();
  assert.equal(await page.locator('#case-study-title').textContent(), 'FinGenie');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobile.goto(process.env.PREVIEW_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
  assert.equal(await mobile.locator('video').getAttribute('src'), null);
  const toggle = mobile.getByRole('button', { name: /Tap to (unfold|reassemble) the astraa mark/ });
  await toggle.tap();
  assert.equal(await toggle.getAttribute('aria-pressed'), 'true');
  await toggle.tap();
  assert.equal(await toggle.getAttribute('aria-pressed'), 'false');
  await mobile.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await toggle.isVisible(), false);
  assert.deepEqual(errors, []);
  console.log('PASS: cut lettering, reassembly, reverse seek, live motion preference, real projects, native dialogs and mobile unfold.');
} finally { await browser.close(); }
