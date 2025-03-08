import { Page, expect } from "@playwright/test";
import { CartPage } from "../page-objects/CartPage";
import { HomePage } from "../page-objects/HomePage";
import { ProductPage } from "../page-objects/ProductPage";

export class PageIndex {
  private readonly page: Page;
  private readonly cartPage: CartPage;
  private readonly homePage: HomePage;
  private readonly productPage: ProductPage;

  constructor(page: Page) {
    this.page = page;
    this.cartPage = new CartPage(this.page);
    this.homePage = new HomePage(this.page);
    this.productPage = new ProductPage(this.page);
  }

  cart() {
    return this.cartPage;
  }

  home() {
    return this.homePage;
  }

  product() {
    return this.productPage;
  }
}
