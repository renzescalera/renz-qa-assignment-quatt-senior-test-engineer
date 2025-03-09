import { Page, Locator, expect } from "@playwright/test";
import { ProductPage } from "./ProductPage";

export class HomePage extends ProductPage {
  private readonly categoryType: Locator;
  private readonly productItem: Locator;
  private readonly cartButton: Locator;
  private readonly homeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.categoryType = page.locator(".list-group-item");
    this.productItem = page.locator(".card-title");
    this.cartButton = page.locator("#cartur");
    this.homeButton = page.locator(".nav-link").getByText("Home");
  }

  async clickCartButton() {
    await this.cartButton.click();
  }

  async clickHomeButton() {
    await this.homeButton.click();
  }

  async selectProduct(category: string, product: string) {
    await this.categoryType.getByText(category).click();
    await this.productItem.getByText(product).click();
  }

  async addProductToCart(productDataArray) {
    for (const product of productDataArray) {
      await this.selectProduct(product.category, product.product);
      await this.clickAddToCartButton();
      await this.acceptAlertBox();

      await expect(this.getPage().locator("h2")).toHaveText(product.product);
      await this.clickHomeButton();
    }

    await this.clickCartButton();
  }
}
