import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { PageIndex } from "../page-objects/PageIndex";

test.describe("API - POST user operations", () => {
  const apiUrl = String(process.env.API_BASE_URL);
  const token = String(process.env.API_TOKEN);

  test("Should create new user successfully", async ({ page }) => {
    const pageObject = new PageIndex(page);
    const newUserDataObject = pageObject.apiRequest().generateNewUserData();

    const response = await pageObject
      .apiRequest()
      .customApiRequest("POST", apiUrl, token, newUserDataObject);
    const responseBody = await response.json();

    expect(response.status()).toBe(201);
    pageObject
      .apiRequest()
      .validateResponseBodyOfSuccessfulCall(responseBody, newUserDataObject);
  });

  test("Should not create new user with incorrect email format input", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);
    const newUserDataObject = pageObject
      .apiRequest()
      .generateNewUserData({ email: "test1123" });

    const response = await pageObject
      .apiRequest()
      .customApiRequest("POST", apiUrl, token, newUserDataObject);
    const responseBody = await response.json();

    expect(response.status()).toBe(422);
    expect(responseBody[0].field).toBe("email");
    expect(responseBody[0].message).toBe("is invalid");
  });

  test("Should not create new user with incorrect gender input", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);
    const newUserDataObject = pageObject
      .apiRequest()
      .generateNewUserData({ gender: "test" });

    const response = await pageObject
      .apiRequest()
      .customApiRequest("POST", apiUrl, token, newUserDataObject);
    const responseBody = await response.json();

    expect(response.status()).toBe(422);
    expect(responseBody[0].field).toBe("gender");
    expect(responseBody[0].message).toBe(
      "can't be blank, can be male of female"
    );
  });

  test("Should not create new user with incorrect status input", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);
    const newUserDataObject = pageObject
      .apiRequest()
      .generateNewUserData({ status: "test" });

    const response = await pageObject
      .apiRequest()
      .customApiRequest("POST", apiUrl, token, newUserDataObject);
    const responseBody = await response.json();

    expect(response.status()).toBe(422);
    expect(responseBody[0].field).toBe("status");
    expect(responseBody[0].message).toBe("can't be blank");
  });

  test("Should not create new user with invalid token", async ({ page }) => {
    const pageObject = new PageIndex(page);
    const invalidToken = String(faker.number.int({ min: 1000, max: 9999 }));
    const newUserDataObject = pageObject.apiRequest().generateNewUserData();

    const response = await pageObject
      .apiRequest()
      .customApiRequest("POST", apiUrl, invalidToken, newUserDataObject);
    const responseBody = await response.json();

    expect(response.status()).toBe(401);
    expect(responseBody.message).toBe("Invalid token");
  });
});
