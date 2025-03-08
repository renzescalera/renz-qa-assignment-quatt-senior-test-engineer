import { test, expect } from "@playwright/test";
import { PageIndex } from "../page-objects/PageIndex";

test.describe("Product Purchase Flow", () => {
  const customerOrderDataObject = {
    name: "Test codeZner",
    country: "Netherlands",
    city: "Amsterdam",
    creditCard: "12354123123",
    month: "12",
    year: "2035",
  };

  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.demoblaze.com/"); // TODO: Fix and use an env var
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

    // assertions
    const firstProductRow = await page.locator("#tbodyid tr:nth-child(1) td");
    await expect(firstProductRow.nth(1)).toHaveText(
      productDataObject[0].product
    );
    await expect(firstProductRow.nth(2)).toHaveText(productDataObject[0].price);

    const numberOfProductRow = await page.locator("#tbodyid tr").count();
    console.log("number of rows: ", numberOfProductRow);

    pageObject.cart().clickPlaceOrderButton();
    pageObject.cart().fillPlaceOrderForm(customerOrderDataObject);
    pageObject.cart().clickPurchaseButton();

    const successfulPurchaseDialogBox = page.locator(".sweet-alert");
    await expect(successfulPurchaseDialogBox).toBeVisible();
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

    for (const product of productDataObject) {
      const productRow = page.locator(`#tbodyid tr`, {
        hasText: product.product,
      });

      // Assert that the row exists and contains the product name
      await expect(productRow).toContainText(product.product);
    }

    await pageObject.cart().clickPlaceOrderButton();
    await pageObject.cart().fillPlaceOrderForm(customerOrderDataObject);
    await pageObject.cart().clickPurchaseButton();

    const successfulPurchaseDialogBox = page.locator(".sweet-alert");
    await expect(successfulPurchaseDialogBox).toBeVisible();
  });
});
