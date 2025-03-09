import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { PageIndex } from "../page-objects/PageIndex";

test.describe("API - GET user operations", () => {
  const apiUrl = String(process.env.API_BASE_URL);
  const token = String(process.env.API_TOKEN);

  test("Should retrieve all users successfully", async ({ page }) => {
    const pageObject = new PageIndex(page);

    const response = await pageObject
      .apiRequest()
      .customApiRequest("GET", apiUrl, token);
    const responseBody = await response.json();

    expect(response.status()).toBe(200);
    expect(responseBody.length > 0).toBe(true);

    responseBody.forEach((user) => {
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("gender");
      expect(user).toHaveProperty("status");
    });
  });

  test("Should retrieve new user by id successfully", async ({ page }) => {
    const pageObject = new PageIndex(page);
    const newUserDataObject = pageObject.apiRequest().generateNewUserData();

    const newUserResponse = await pageObject
      .apiRequest()
      .customApiRequest("POST", apiUrl, token, newUserDataObject);

    const newUserResponseBody = await newUserResponse.json();
    const newUserId = newUserResponseBody.id;

    // GET REQUEST
    const response = await pageObject
      .apiRequest()
      .customApiRequest("GET", apiUrl, token, null, newUserId);

    const responseBody = await response.json();

    expect(response.status()).toBe(200);
    expect(responseBody.id).toBe(newUserId);
    expect(responseBody.name).toBe(newUserDataObject.name);
    expect(responseBody.email).toBe(newUserDataObject.email);
    expect(responseBody.gender).toBe(newUserDataObject.gender);
    expect(responseBody.status).toBe(newUserDataObject.status);
  });

  test("Should not be able to retrieve a user with invalid id", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);
    const invalidId = faker.number.int({ min: 1000, max: 9999 });

    const response = await pageObject
      .apiRequest()
      .customApiRequest("GET", apiUrl, token, null, invalidId);

    const responseBody = await response.json();

    expect(response.status()).toBe(404);
    expect(responseBody.message).toBe("Resource not found");
  });

  test("Should not be able to retrieve a users with invalid token", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);
    const invalidToken = String(faker.number.int({ min: 1000, max: 9999 }));

    const response = await pageObject
      .apiRequest()
      .customApiRequest("GET", apiUrl, invalidToken);

    const responseBody = await response.json();

    expect(response.status()).toBe(401);
    expect(responseBody.message).toBe("Invalid token");
  });
});
