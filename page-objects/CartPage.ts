import { Page, Locator, expect } from "@playwright/test";

export class CartPage {
  private readonly page: Page;
  private readonly nameField: Locator;
  private readonly countryField: Locator;
  private readonly cityField: Locator;
  private readonly creditCardField: Locator;
  private readonly monthField: Locator;
  private readonly yearField: Locator;
  private readonly purchaseButton: Locator;
  private readonly placeOrderButton: Locator;
  private readonly productRows: Locator;
  private readonly purchaseDialogBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameField = page.locator("#name");
    this.countryField = page.locator("#country");
    this.cityField = page.locator("#city");
    this.creditCardField = page.locator("#card");
    this.monthField = page.locator("#month");
    this.yearField = page.locator("#year");
    this.purchaseButton = page.getByRole("button", { name: "Purchase" });
    this.placeOrderButton = page.getByRole("button", { name: "Place Order" });
    this.productRows = page.locator("#tbodyid tr");
    this.purchaseDialogBox = page.locator(".sweet-alert");
  }

  async fillPlaceOrderForm(object) {
    const { name, country, city, creditCard, month, year } = object;

    await this.nameField.fill(name);
    await this.countryField.fill(country);
    await this.cityField.fill(city);
    await this.creditCardField.fill(creditCard);
    await this.monthField.fill(month);
    await this.yearField.fill(year);
  }

  getPurchaseButton() {
    return this.purchaseButton;
  }

  getPlaceOrderButton() {
    return this.placeOrderButton;
  }

  async numberOfProductInCart() {
    return await this.productRows.count();
  }

  async validateProductsInCart(productData) {
    for (const product of productData) {
      const productRow = await this.page.locator(`#tbodyid tr`, {
        hasText: product.product,
      });

      // Assert that the row exists and contains the product name
      await expect(productRow).toContainText(product.product);
    }
  }

  getSuccessfulPurchaseDialogBox() {
    return this.purchaseDialogBox;
  }
}
