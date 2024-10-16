import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Mathler');
});

test('has all elements', async ({ page }) => {
  await page.goto('/');

  const board = page.locator('[data-testid=board]');
  const boardPieces = page.locator('[data-testid*=boardpiece]');
  const keyboard = page.locator('[data-testid=keyboard]');
  const keyboardKeys = page.locator('[data-testid*=keyboard-key]');

  await expect(board).toBeVisible();
  await expect(boardPieces).toHaveCount(36);
  await expect(keyboard).toBeVisible();
  await expect(keyboardKeys).toHaveCount(16);
});
