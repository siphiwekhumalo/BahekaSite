import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section', async ({ page }) => {
    await expect(page.getByText('Building the')).toBeVisible();
    await expect(page.getByText('Future')).toBeVisible();
    await expect(page.getByText('of Technology')).toBeVisible();
  });

  test('should display company description', async ({ page }) => {
    await expect(page.getByText(/craft cutting-edge software solutions/i)).toBeVisible();
  });

  test('should display call-to-action buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'View Our Work' })).toBeVisible();
  });

  test('should navigate to contact page when clicking Get Started', async ({ page }) => {
    await page.getByRole('button', { name: 'Get Started' }).click();
    await expect(page).toHaveURL('/contact');
  });

  test('should navigate to portfolio page when clicking View Our Work', async ({ page }) => {
    await page.getByRole('button', { name: 'View Our Work' }).click();
    await expect(page).toHaveURL('/portfolio');
  });

  test('should display services section', async ({ page }) => {
    await expect(page.getByText('Our Services')).toBeVisible();
    await expect(page.getByText('Software Development')).toBeVisible();
    await expect(page.getByText('UI/UX Design & Engineering')).toBeVisible();
    await expect(page.getByText('Cloud Infrastructure')).toBeVisible();
    await expect(page.getByText('Automation & Consulting')).toBeVisible();
  });

  test('should display team statistics', async ({ page }) => {
    await expect(page.getByText('Projects Delivered')).toBeVisible();
    await expect(page.getByText('Happy Clients')).toBeVisible();
    await expect(page.getByText('Years Experience')).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Building the')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText('Building the')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByText('Building the')).toBeVisible();
  });
});