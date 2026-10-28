import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { CartPage } from './cart.page';

export class InventoryPage extends BasePage {
  private readonly inventoryItems: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    // structural container - no semantic role/text identifies "an inventory item" as a group
    this.inventoryItems = page.locator('.inventory_item');

    // this.cartLink = page.locator('.shopping_cart_link');
    // the cart link exposes its state via an accessible name, e.g. "Cart, empty" / "Cart, 1 items"
    this.cartLink = page.getByRole('button', { name: /^Cart,/ });
  }

  private itemCard(itemName: string): Locator {
    // this.inventoryItems.filter({ has: this.page.locator('.inventory_item_name', { hasText: itemName } ) });
    return this.inventoryItems.filter({ has: this.page.getByText(itemName, { exact: true }) });
  }

  private addToCartButton(itemName: string): Locator {
    // this.itemCard(itemName).locator('button', { hasText: 'Add to cart' });
    return this.itemCard(itemName).getByRole('button', { name: 'Add to cart' });
  }

  private removeButton(itemName: string): Locator {
    // this.itemCard(itemName).locator('button', { hasText: 'Remove' });
    return this.itemCard(itemName).getByRole('button', { name: 'Remove' });
  }

  /** Adds an item to the cart by its displayed product name and returns this page for chaining. */
  async addItemToCart(itemName: string): Promise<this> {
    await this.addToCartButton(itemName).click();
    return this;
  }

  /** Removes an item from the cart by its displayed product name and returns this page for chaining. */
  async removeItemFromCart(itemName: string): Promise<this> {
    await this.removeButton(itemName).click();
    return this;
  }

  async getCartItemCount(): Promise<number> {
    // const cartBadge = this.page.locator('.shopping_cart_badge');
    // if (await cartBadge.count() === 0) return 0;
    // const text = await cartBadge.textContent();
    // return Number(text ?? '0');
    const accessibleName = (await this.cartLink.getAttribute('aria-label')) ?? '';
    const match = accessibleName.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  async goToCart(): Promise<CartPage> {
    await this.cartLink.click();
    return new CartPage(this.page);
  }
}
