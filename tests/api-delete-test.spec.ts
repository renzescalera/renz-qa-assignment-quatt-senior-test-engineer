import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { PageIndex } from "../page-objects/PageIndex";

test.describe("API - PUT user operations", () => {
  const apiUrl = String(process.env.API_BASE_URL);
  const token = String(process.env.API_TOKEN);
  let existingUserDataObject: any;

  test.beforeEach(async ({ page }) => {
    const pageObject = new PageIndex(page);
    const newUserDataObject = pageObject
      .apiRequest()
      .generateNewUserData({ gender: "male", status: "active" });
    const response = await pageObject
      .apiRequest()
      .customApiRequest("POST", apiUrl, token, newUserDataObject);
    existingUserDataObject = await response.json();
  });

  test("Should delete an existing user successfully", async ({ page }) => {
    const pageObject = new PageIndex(page);

    const response = await pageObject
      .apiRequest()
      .customApiRequest(
        "DELETE",
        apiUrl,
        token,
        null,
        existingUserDataObject.id
      );

    expect(response.status()).toBe(204);
  });

  test("Should not delete a non-existent user", async ({ page }) => {
    const pageObject = new PageIndex(page);
    const invalidId = String(faker.number.int({ min: 1000, max: 9999 }));

    const response = await pageObject
      .apiRequest()
      .customApiRequest("DELETE", apiUrl, token, null, invalidId);

    const responseBody = await response.json();

    expect(response.status()).toBe(404);
    expect(responseBody.message).toBe("Resource not found");
  });

  test("Should not delete a user that has been already deleted", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);

    await pageObject
      .apiRequest()
      .customApiRequest(
        "DELETE",
        apiUrl,
        token,
        null,
        existingUserDataObject.id
      );

    const response = await pageObject
      .apiRequest()
      .customApiRequest(
        "DELETE",
        apiUrl,
        token,
        null,
        existingUserDataObject.id
      );

    const responseBody = await response.json();

    expect(response.status()).toBe(404);
    expect(responseBody.message).toBe("Resource not found");
  });

  test("Should not delete a user with invalid token", async ({ page }) => {
    const pageObject = new PageIndex(page);
    const invalidToken = String(faker.number.int({ min: 1000, max: 9999 }));

    const response = await pageObject
      .apiRequest()
      .customApiRequest(
        "DELETE",
        apiUrl,
        invalidToken,
        null,
        existingUserDataObject.id
      );

    const responseBody = await response.json();

    expect(response.status()).toBe(401);
    expect(responseBody.message).toBe("Invalid token");
  });
});
