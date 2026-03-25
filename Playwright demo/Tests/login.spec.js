// ============================================================
// Playwright E2E Test Suite - Portfolio Project
// Target: https://practice.expandtesting.com
// Author: Sarmad
// Skills: Page Object Model, Assertions, Form Testing,
//         Navigation, Error Handling
// ============================================================

import { test, expect } from '@playwright/test';

// ─── Page Object Model ────────────────────────────────────────
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.flashMessage = page.locator('#flash');
    this.logoutButton = page.locator('a[href="/logout"]');
  }

  async goto() {
    await this.page.goto('https://practice.expandtesting.com/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getFlashMessage() {
    return await this.flashMessage.textContent();
  }
}

// ─── Test Suite 1: Login Functionality ───────────────────────
test.describe('Login Page Tests', () => {

  test('TC001 - Successful login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Verify page loads correctly
    await expect(page).toHaveTitle(/Practice/i);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();

    // Perform login
    await loginPage.login('practice', 'SuperSecretPassword!');

    // Assert successful login
    await expect(page).toHaveURL(/secure/);
    const flash = await loginPage.getFlashMessage();
    expect(flash).toContain('You logged into a secure area');
  });

  test('TC002 - Login fails with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('practice', 'wrongpassword');

    // Assert error message
    const flash = await loginPage.getFlashMessage();
    expect(flash).toContain('Your password is invalid');

    // Should NOT redirect
    await expect(page).not.toHaveURL(/secure/);
  });

  test('TC003 - Login fails with empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('', '');

    const flash = await loginPage.getFlashMessage();
    expect(flash).toContain('Your username is invalid');
  });

  test('TC004 - Logout works after successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('practice', 'SuperSecretPassword!');
    await expect(page).toHaveURL(/secure/);

    // Logout
    await loginPage.logoutButton.click();
    await expect(page).toHaveURL(/login/);

    const flash = await loginPage.getFlashMessage();
    expect(flash).toContain('You logged out');
  });

});

// ─── Test Suite 2: Navigation & UI Tests ─────────────────────
test.describe('Navigation Tests', () => {

  test('TC005 - Page has correct heading and elements', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');

    await expect(page.locator('h2')).toHaveText('Test Login Page');
    await expect(page.locator('input#username')).toBeEnabled();
    await expect(page.locator('input#password')).toBeEnabled();
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('TC006 - Password field masks input', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');

    const passwordField = page.locator('#password');
    await expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('TC007 - Page is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14
    await page.goto('https://practice.expandtesting.com/login');

    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

});

// ─── Test Suite 3: Notes App CRUD (if accessible) ─────────────
test.describe('Form Input Validation', () => {

  test('TC008 - Username field accepts alphanumeric text', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');

    const usernameInput = page.locator('#username');
    await usernameInput.fill('testuser123');
    await expect(usernameInput).toHaveValue('testuser123');
  });

  test('TC009 - Tab key navigation works correctly', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');

    await page.locator('#username').click();
    await page.keyboard.press('Tab');

    // After tab, password field should be focused
    const passwordField = page.locator('#password');
    await expect(passwordField).toBeFocused();
  });

  test('TC010 - Screenshot captured on test completion', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');
    await page.locator('#username').fill('practice');
    await page.locator('#password').fill('SuperSecretPassword!');

    // Take screenshot before submitting (evidence artifact)
    await page.screenshot({ path: 'screenshots/before-login.png', fullPage: true });

    await page.locator('button[type="submit"]').click();
    await page.screenshot({ path: 'screenshots/after-login.png', fullPage: true });

    await expect(page).toHaveURL(/secure/);
  });

});
