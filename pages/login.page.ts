import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { InventoryPage } from './inventory.page';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    // this.usernameInput = page.locator('#user-name');
    this.usernameInput = page.getByLabel('Username');

    // this.passwordInput = page.locator('#password');
    this.passwordInput = page.getByLabel('Password');

    // this.loginButton = page.locator('#login-button');
    this.loginButton = page.getByRole('button', { name: 'Login' });

    // this.errorMessage = page.locator('[data-test="error"]');
    this.errorMessage = page.getByRole('alert');
  }

  async goto(): Promise<this> {
    await this.page.goto('/');
    return this;
  }

  /**
   * Logs in with the given credentials and returns the resulting InventoryPage,
   * enabling method chaining, e.g. `await loginPage.login(user, pass).addItemToCart(...)`.
   */
  async login(username: string, password: string): Promise<InventoryPage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    return new InventoryPage(this.page);
  }

  async getErrorMessage(): Promise<string | null> {
    return this.errorMessage.textContent();
  }
}
