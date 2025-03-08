import { Page, Locator } from "@playwright/test";

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

  async clickPurchaseButton() {
    await this.purchaseButton.click();
  }

  async clickPlaceOrderButton() {
    await this.placeOrderButton.click();
  }
}
