import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display header navigation', async ({ page }) => {
    await expect(page.getByText('Baheka Tech')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Portfolio' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Contact' })).toBeVisible();
  });

  test('should navigate to all pages', async ({ page }) => {
    // Navigate to About
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL('/about');
    await expect(page.getByText('About Baheka Tech')).toBeVisible();

    // Navigate to Services
    await page.getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL('/services');
    await expect(page.getByText('Our Services')).toBeVisible();

    // Navigate to Portfolio
    await page.getByRole('link', { name: 'Portfolio' }).click();
    await expect(page).toHaveURL('/portfolio');
    await expect(page.getByText('Portfolio & Case Studies')).toBeVisible();

    // Navigate to Blog
    await page.getByRole('link', { name: 'Blog' }).click();
    await expect(page).toHaveURL('/blog');
    await expect(page.getByText('Latest Insights')).toBeVisible();

    // Navigate to Contact
    await page.getByRole('button', { name: 'Contact' }).click();
    await expect(page).toHaveURL('/contact');
    await expect(page.getByText('Get In Touch')).toBeVisible();

    // Navigate back to Home
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Building the')).toBeVisible();
  });

  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu button is visible
    const menuButton = page.getByRole('button').first();
    await expect(menuButton).toBeVisible();
    
    // Open mobile menu
    await menuButton.click();
    
    // Check if navigation items are visible in mobile menu
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Portfolio' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Blog' })).toBeVisible();
  });

  test('should highlight active page', async ({ page }) => {
    // Go to about page
    await page.getByRole('link', { name: 'About' }).click();
    
    // Check if About link is highlighted
    const aboutLink = page.getByRole('link', { name: 'About' });
    await expect(aboutLink).toHaveClass(/text-deep-green/);
  });

  test('should display footer', async ({ page }) => {
    await expect(page.getByText('© 2024 Baheka Tech. All rights reserved.')).toBeVisible();
  });

  test('should handle 404 pages', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.getByText('404')).toBeVisible();
  });
});