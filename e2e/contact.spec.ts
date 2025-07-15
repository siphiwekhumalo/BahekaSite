import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should display contact form', async ({ page }) => {
    await expect(page.getByText('Get In Touch')).toBeVisible();
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(page.getByLabel('Last Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Service')).toBeVisible();
    await expect(page.getByLabel('Message')).toBeVisible();
  });

  test('should display contact information', async ({ page }) => {
    await expect(page.getByText('Let\'s Start a Conversation')).toBeVisible();
    await expect(page.getByText('Email Us')).toBeVisible();
    await expect(page.getByText('info@bahekatech.com')).toBeVisible();
  });

  test('should display social media links', async ({ page }) => {
    await expect(page.getByText('Follow Us')).toBeVisible();
    // Social media links should be present
    const socialLinks = page.locator('[href="#"]');
    await expect(socialLinks).toHaveCount(3); // LinkedIn, Twitter, GitHub
  });

  test('should submit contact form successfully', async ({ page }) => {
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Email').fill('john.doe@example.com');
    await page.getByLabel('Service').selectOption('software-development');
    await page.getByLabel('Message').fill('I need help with my project');

    await page.getByRole('button', { name: 'Send Message' }).click();

    // Check for success message or redirect
    await expect(page.getByText(/thank you|success|submitted/i)).toBeVisible({ timeout: 10000 });
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Send Message' }).click();
    
    // Check for validation errors
    await expect(page.getByText(/required|invalid/i)).toBeVisible({ timeout: 5000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Service').selectOption('software-development');
    await page.getByLabel('Message').fill('Test message');

    await page.getByRole('button', { name: 'Send Message' }).click();

    // Check for email validation error
    await expect(page.getByText(/invalid.*email/i)).toBeVisible({ timeout: 5000 });
  });

  test('should display FAQ section', async ({ page }) => {
    await expect(page.getByText('Frequently Asked Questions')).toBeVisible();
    await expect(page.getByText('How long does a typical project take?')).toBeVisible();
    await expect(page.getByText('Do you work with startups?')).toBeVisible();
    await expect(page.getByText('What\'s your development process?')).toBeVisible();
  });

  test('should display response time guarantee', async ({ page }) => {
    await expect(page.getByText('Quick Response Guarantee')).toBeVisible();
    await expect(page.getByText('4 Hours')).toBeVisible();
    await expect(page.getByText('24 Hours')).toBeVisible();
    await expect(page.getByText('48 Hours')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check for proper label associations
    const firstNameInput = page.getByLabel('First Name');
    await expect(firstNameInput).toBeVisible();
    
    // Check for proper button accessibility
    const submitButton = page.getByRole('button', { name: 'Send Message' });
    await expect(submitButton).toBeVisible();
  });
});