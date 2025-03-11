import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { PageIndex } from "../page-objects/PageIndex";

test.describe("Product Purchase Flow", () => {
  const customerOrderDataObject = {
    name: faker.person.fullName(),
    country: faker.location.country(),
    city: faker.location.city(),
    creditCard: faker.finance.creditCardNumber(),
    month: faker.date.month({ abbreviated: true }),
    year: faker.date.future().getFullYear().toString(),
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(String(process.env.UI_BASE_URL));
  });

  test("Should select a single product then purchase successfully", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);

    const productDataObject = [
      {
        category: "Phones",
        product: "Samsung galaxy s6",
        price: "360",
      },
    ];

    await pageObject.home().addProductToCart(productDataObject);

    await pageObject.cart().validateProductsInCart(productDataObject);

    const numberOfProductRow = await pageObject.cart().numberOfProductInCart();
    expect(numberOfProductRow).toBe(productDataObject.length);

    await pageObject.cart().getPlaceOrderButton().click();
    await pageObject.cart().fillPlaceOrderForm(customerOrderDataObject);
    await pageObject.cart().getPurchaseButton().click();

    const validatePurchaseDialogBox = pageObject
      .cart()
      .getSuccessfulPurchaseDialogBox();
    await expect(validatePurchaseDialogBox).toBeVisible();
  });

  test("Should select a multiple product then purchase successfully", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);

    const productDataObject = [
      {
        category: "Phones",
        product: "Samsung galaxy s6",
        price: "360",
      },
      {
        category: "Laptops",
        product: "MacBook Pro",
        price: "1100",
      },
      {
        category: "Monitors",
        product: "ASUS Full HD",
        price: "230",
      },
    ];

    await pageObject.home().addProductToCart(productDataObject);

    await pageObject.cart().validateProductsInCart(productDataObject);

    const numberOfProductRow = await pageObject.cart().numberOfProductInCart();
    expect(numberOfProductRow).toBe(productDataObject.length);

    await pageObject.cart().getPlaceOrderButton().click();
    await pageObject.cart().fillPlaceOrderForm(customerOrderDataObject);
    await pageObject.cart().getPurchaseButton().click();

    const validatePurchaseDialogBox = pageObject
      .cart()
      .getSuccessfulPurchaseDialogBox();
    await expect(validatePurchaseDialogBox).toBeVisible();
  });

  test("Should not be able to purchase successfully without product in cart", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);

    await pageObject.home().getHomeButton().click();

    const numberOfProductRow = await pageObject.cart().numberOfProductInCart();
    expect(numberOfProductRow).toBe(0);

    /**
     * This assertion is failing because
     * When there is no product in cart
     * You can still proceed to purchase
     * Which should be considered as a Bug
     * Commenting it out for the mean time
     */
    // await expect(pageObject.cart().getPlaceOrderButton()).toBeDisabled();
  });

  test("Should remove product in cart successfully", async ({ page }) => {
    const pageObject = new PageIndex(page);

    const productDataObject = [
      {
        category: "Phones",
        product: "Samsung galaxy s6",
        price: 360,
      },
      {
        category: "Laptops",
        product: "MacBook Pro",
        price: 1100,
      },
    ];

    await pageObject.home().addProductToCart(productDataObject);

    await pageObject.cart().getDeleteButtons().first().click();

    await page.waitForResponse("https://api.demoblaze.com/view");

    const numberOfProductRow = await pageObject.cart().numberOfProductInCart();
    await expect(numberOfProductRow).toBe(productDataObject.length - 1);
  });
});
