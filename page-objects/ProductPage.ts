import { Page, Locator, expect } from "@playwright/test";

export class ProductPage {
  protected readonly page: Page;
  private readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator(".col-sm-12 .btn");
  }

  getPage() {
    return this.page;
  }

  async clickAddToCartButton() {
    await this.addToCartButton.click();
  }

  async acceptAlertBox() {
    this.page.on("dialog", (dialog) => {
      expect(dialog.message()).toEqual("Product added");
      dialog.accept();
    });
  }
}
