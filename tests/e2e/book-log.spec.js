const { test, expect } = require('@playwright/test');

test('home page renders and shows sorting controls', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Book Log');
  await expect(page.getByRole('heading', { name: 'Book Log', level: 1 })).toBeVisible();
  await expect(page.getByLabel('Sort by:')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add Book' })).toBeVisible();
});

test('add page renders with required form fields', async ({ page }) => {
  await page.goto('/add');

  await expect(page).toHaveTitle('Add Book');
  await expect(page.getByRole('heading', { name: 'Add a Book', level: 1 })).toBeVisible();
  await expect(page.getByLabel('Title')).toBeVisible();
  await expect(page.getByLabel('Author')).toBeVisible();
  await expect(page.getByLabel('Rating')).toBeVisible();
  await expect(page.getByLabel('Review')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Book' })).toBeVisible();
});
