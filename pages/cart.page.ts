import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    // structural container - no semantic role/text identifies "a cart item" as a group
    this.cartItems = page.locator('.cart_item');

    // this.checkoutButton = page.locator('#checkout');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  private itemCard(itemName: string): Locator {
    // this.cartItems.filter({ has: this.page.locator('.inventory_item_name', { hasText: itemName } ) });
    return this.cartItems.filter({ has: this.page.getByText(itemName, { exact: true }) });
  }

  async getCartItemNames(): Promise<string[]> {
    // this.cartItems.locator('.inventory_item_name').allTextContents();
    // no accessible role distinguishes "item name" text from the rest of the card content
    return this.cartItems.locator('.inventory_item_name').allTextContents();
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async isItemInCart(itemName: string): Promise<boolean> {
    return (await this.itemCard(itemName).count()) > 0;
  }

  /** Removes an item directly from the cart page and returns this page for chaining. */
  async removeItem(itemName: string): Promise<this> {
    // this.itemCard(itemName).locator('button', { hasText: 'Remove' }).click();
    await this.itemCard(itemName).getByRole('button', { name: 'Remove' }).click();
    return this;
  }

  async goToCheckout(): Promise<this> {
    await this.checkoutButton.click();
    return this;
  }
}
