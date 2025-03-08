import { Page, Locator, expect } from "@playwright/test";
import { ProductPage } from "./ProductPage";

export class HomePage extends ProductPage {
  private readonly categoryType: Locator;
  private readonly productItem: Locator;

  constructor(page: Page) {
    super(page);
    this.categoryType = page.locator(".list-group-item");
    this.productItem = page.locator(".card-title");
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
      await this.getPage().locator(".nav-link").getByText("Home").click();
    }

    await this.getPage().locator("#cartur").click(); // Selector for Cart base Element - TODO: Move to POM
  }
}
