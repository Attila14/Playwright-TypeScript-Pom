import { test, expect } from '../fixtures/pages';

const ITEM = 'Sauce Labs Backpack';

test.describe('Cart', () => {
  test('adding an item updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart(ITEM);

    await expect(inventoryPage.getCartItemCount()).resolves.toBe(1);
  });

  test('removing an item clears the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart(ITEM);
    await expect(inventoryPage.getCartItemCount()).resolves.toBe(1);

    await inventoryPage.removeItemFromCart(ITEM);

    await expect(inventoryPage.getCartItemCount()).resolves.toBe(0);
  });

  test('cart page lists the added item', async ({ inventoryPage }) => {
    const cartPage = await inventoryPage.addItemToCart(ITEM).then((page) => page.goToCart());

    await expect(cartPage.isItemInCart(ITEM)).resolves.toBe(true);
    await expect(cartPage.getCartItemNames()).resolves.toEqual([ITEM]);
    await expect(cartPage.getCartItemCount()).resolves.toBe(1);
  });
});
