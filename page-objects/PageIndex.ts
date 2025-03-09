import { Page } from "@playwright/test";
import { Api } from "../page-objects/Api";
import { CartPage } from "../page-objects/CartPage";
import { HomePage } from "../page-objects/HomePage";
import { ProductPage } from "../page-objects/ProductPage";

export class PageIndex {
  private readonly page: Page;
  private readonly cartPage: CartPage;
  private readonly homePage: HomePage;
  private readonly productPage: ProductPage;
  private readonly api: Api;

  constructor(page: Page) {
    this.page = page;
    this.cartPage = new CartPage(this.page);
    this.homePage = new HomePage(this.page);
    this.productPage = new ProductPage(this.page);
    this.api = new Api(this.page);
  }

  apiRequest() {
    return this.api;
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
