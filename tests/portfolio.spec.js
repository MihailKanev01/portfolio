import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test.describe('portfolio smoke tests', () => {
  test('home page renders core sections and has no horizontal overflow', async ({ page }) => {
    await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1.hero-title')).toContainText('I build software');
    for (const id of ['home', 'about', 'what-i-build', 'skills', 'projects', 'contact']) {
      await expect(page.locator('#' + id)).toHaveCount(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
  });

  test('navigation and project filters work', async ({ page }) => {
    await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    await page.locator('a[href="#projects"]').first().click();
    await expect(page).toHaveURL(/#projects$/);
    await page.locator('#projects').scrollIntoViewIfNeeded();

    await page.locator('.project-filter[data-filter="software"]').click();
    await expect(page.locator('.project-filter[data-filter="software"]')).toHaveAttribute('aria-pressed', 'true');
    const softwareHidden = await page.locator('#projects-grid .project-card.is-hidden').count();
    const softwareVisible = await page.locator('#projects-grid .project-card:not(.is-hidden)').count();
    expect(softwareHidden).toBeGreaterThan(0);
    expect(softwareVisible).toBeGreaterThan(0);

    await page.locator('.project-filter[data-filter="game"]').click();
    await expect(page.locator('.project-filter[data-filter="game"]')).toHaveAttribute('aria-pressed', 'true');
    const gameVisible = await page.locator('#projects-grid .project-card:not(.is-hidden)').count();
    expect(gameVisible).toBeGreaterThan(0);

    await page.locator('.project-filter[data-filter="all"]').click();
    expect(await page.locator('#projects-grid .project-card:not(.is-hidden)').count()).toBe(
      await page.locator('#projects-grid .project-card').count()
    );
  });

  test('theme toggle changes and persists', async ({ page }) => {
    await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.removeItem('theme'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    const toggle = page.locator('#theme-toggle');
    expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');
    expect(await toggle.getAttribute('aria-pressed')).toBe('false');
    expect(await toggle.getAttribute('aria-label')).toBe('Switch to light theme');

    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark theme');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('contact form validates input including Cyrillic names', async ({ page }) => {
    await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });

    await page.locator('#name').fill('Иван Иванов');
    await page.locator('#email').fill('ivan@example.com');
    await page.locator('#message').fill('Здравей, това е тестово съобщение.');

    await page.evaluate(() => {
      window.emailjs = { send: async () => ({ status: 200, text: 'OK' }) };
    });

    await page.locator('#contact-form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    await expect(page.locator('.form-status-container .alert-success')).toBeVisible();
    await expect(page.locator('#message-count')).toHaveText('0 / 500');

    await page.locator('#name').fill('И');
    await page.locator('#email').fill('bad-email');
    await page.locator('#message').fill('x');
    await page.locator('#contact-form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    await expect(page.locator('#name')).toHaveClass(/is-invalid/);
    await expect(page.locator('#email')).toHaveClass(/is-invalid/);
    await expect(page.locator('#message')).toHaveClass(/is-invalid/);
  });

  test('footer links and secondary pages exist', async ({ page }) => {
    await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('a[href="privacy-policy.html"]')).toHaveCount(1);
    await expect(page.locator('a[href="terms-of-service.html"]')).toHaveCount(1);

    await page.goto(BASE + '/privacy-policy.html', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Privacy Policy/);
    await expect(page.locator('a[href="index.html#home"]')).toHaveCount(2);

    await page.goto(BASE + '/terms-of-service.html', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Terms of Service/);
    await expect(page.locator('a[href="index.html#home"]')).toHaveCount(2);
  });

  test('mobile layout stays usable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
    await page.locator('.navbar-toggler').click();
    await expect(page.locator('.navbar-collapse')).toHaveClass(/show/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.navbar-collapse')).not.toHaveClass(/show/);
  });

  test('internal links resolve and no placeholder/debug content remains', async ({ page }) => {
    await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    for (const url of ['privacy-policy.html', 'terms-of-service.html']) {
      await page.goto(BASE + '/' + url, { waitUntil: 'domcontentloaded' });
      expect(await page.locator('body').innerText()).not.toContain('info@example.com');
      expect(await page.locator('body').innerText()).not.toContain('replace with your actual contact email');
    }
    const mainJs = await (await page.request.get(BASE + '/main.js')).text();
    expect(mainJs).not.toMatch(/console\.(log|error|warn)\s*\(/);

    await page.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    const internalLinks = await page.locator('a[href]').evaluateAll(links =>
      [...new Set(links.map(a => a.getAttribute('href')))]
        .filter(href => href && (href.startsWith('index.html') || href.endsWith('.html')))
    );
    for (const href of internalLinks) {
      const response = await page.request.get(new URL(href.split('#')[0], BASE + '/').toString());
      expect(response.ok(), href).toBeTruthy();
    }
  });
});
