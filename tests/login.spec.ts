import { test, expect } from '../fixtures/pages';

test.describe('Login', () => {
  test('standard user can log in and land on the inventory page', async ({ page, loginPage }) => {
    const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.getCartItemCount()).resolves.toBe(0);
  });

  test('locked out user sees an error message', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(await loginPage.getErrorMessage()).toContain('locked out');
  });

  test('take screenshots', async ({ loginPage }) => {

  const inventoryPage = await loginPage.login(
    'standard_user',
    'secret_sauce'
  );

  // Full page
  await inventoryPage.takeFullPageScreenshot();

  // Inventory section only
  await inventoryPage.takeInventoryScreenshot();

  // Page with prices masked
  await inventoryPage.takeMaskedScreenshot();
});
});
