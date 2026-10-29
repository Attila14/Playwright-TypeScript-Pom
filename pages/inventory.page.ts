import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { CartPage } from './cart.page';

export class InventoryPage extends BasePage {
  private readonly inventoryItems: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);

    // All inventory items
    this.inventoryItems = page.locator('.inventory_item');

    // Cart button
    this.cartLink = page.getByRole('button', { name: /^Cart,/ });
  }

  private itemCard(itemName: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.getByText(itemName, { exact: true })
    });
  }

  private addToCartButton(itemName: string): Locator {
    return this.itemCard(itemName).getByRole('button', {
      name: 'Add to cart'
    });
  }

  private removeButton(itemName: string): Locator {
    return this.itemCard(itemName).getByRole('button', {
      name: 'Remove'
    });
  }

  /**
   * Adds an item to the cart.
   */
  async addItemToCart(itemName: string): Promise<this> {
    await this.addToCartButton(itemName).click();
    return this;
  }

  /**
   * Removes an item from the cart.
   */
  async removeItemFromCart(itemName: string): Promise<this> {
    await this.removeButton(itemName).click();
    return this;
  }

  /**
   * Returns the number of items currently displayed in the cart.
   */
  async getCartItemCount(): Promise<number> {
    const accessibleName =
      (await this.cartLink.getAttribute('aria-label')) ?? '';

    const match = accessibleName.match(/\d+/);

    return match ? Number(match[0]) : 0;
  }

  /**
   * Opens the cart.
   */
  async goToCart(): Promise<CartPage> {
    await this.cartLink.click();
    return new CartPage(this.page);
  }

  // -----------------------------------
  // SCREENSHOTS
  // -----------------------------------

  /**
   * Takes a screenshot of the entire Inventory page.
   */
  async takeFullPageScreenshot(): Promise<void> {
    await this.page.screenshot({
      path: 'shots/home.png',
      fullPage: true
    });
  }

  /**
   * Takes a screenshot of the inventory list only.
   */
  async takeInventoryScreenshot(): Promise<void> {
    await this.page
      .getByTestId('inventory-container')
      .screenshot({
        path: 'shots/list.png'
      });
  }

  /**
   * Takes a screenshot while hiding/masking product prices.
   */
  async takeMaskedScreenshot(): Promise<void> {
    await this.page.screenshot({
      path: 'shots/cart.png',
      mask: [
        this.page.getByTestId('inventory-item-price')
      ]
    });
  }
}