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

  test("Should update all user details successfully", async ({ page }) => {
    const pageObject = new PageIndex(page);
    const newUserDataObject = pageObject
      .apiRequest()
      .generateNewUserData({ gender: "female", status: "inactive" });

    const response = await pageObject
      .apiRequest()
      .customApiRequest(
        "PUT",
        apiUrl,
        token,
        newUserDataObject,
        existingUserDataObject.id
      );
    const responseBody = await response.json();

    expect(response.status()).toBe(200);
    pageObject
      .apiRequest()
      .validateResponseBodyOfSuccessfulCall(responseBody, newUserDataObject);

    pageObject
      .apiRequest()
      .validateDataChanges(responseBody, existingUserDataObject);
  });

  test("Should not update user name with null", async ({ page }) => {
    const pageObject = new PageIndex(page);
    const invalidFulleName = {
      name: null,
    };

    const response = await pageObject
      .apiRequest()
      .customApiRequest(
        "PUT",
        apiUrl,
        token,
        invalidFulleName,
        existingUserDataObject.id
      );
    const responseBody = await response.json();

    expect(responseBody[0].field).toBe("name");
    expect(responseBody[0].message).toBe("can't be blank");
  });

  test("Should not update email with non-existent user", async ({ page }) => {
    const pageObject = new PageIndex(page);
    const invalidId = faker.number.int({ min: 1000, max: 9999 });
    const newUserEmail = {
      email: faker.internet.email(),
    };

    const response = await pageObject
      .apiRequest()
      .customApiRequest("PUT", apiUrl, token, newUserEmail, invalidId);
    const responseBody = await response.json();

    expect(response.status()).toBe(404);
    expect(responseBody.message).toBe("Resource not found");
  });

  test("Should not update user email using an email that already exists", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);
    const existingUserResponse = await pageObject
      .apiRequest()
      .customApiRequest("GET", apiUrl, token);
    const existingUserResponseBody = await existingUserResponse.json();

    let existingEmail: any;
    existingUserResponseBody.some((userData) => {
      if (userData.email !== existingUserDataObject.email) {
        existingEmail = userData.email;
        return true;
      }
      return false;
    });

    const existingUserEmail = {
      email: existingEmail,
    };

    const response = await pageObject
      .apiRequest()
      .customApiRequest(
        "PUT",
        apiUrl,
        token,
        existingUserEmail,
        existingUserDataObject.id
      );
    const responseBody = await response.json();

    expect(response.status()).toBe(422);
    expect(responseBody[0].field).toBe("email");
    expect(responseBody[0].message).toBe("has already been taken");
  });

  test("Should not update user email with incorrect format", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);
    const incorrectEmailFormat = {
      email: "playwrightTestEmail",
    };

    const response = await pageObject
      .apiRequest()
      .customApiRequest(
        "PUT",
        apiUrl,
        token,
        incorrectEmailFormat,
        existingUserDataObject.id
      );
    const responseBody = await response.json();

    expect(response.status()).toBe(422);
    expect(responseBody[0].field).toBe("email");
    expect(responseBody[0].message).toBe("is invalid");
  });

  test("Should not update user with incorrect gender type", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);
    const incorrectGenderType = {
      gender: "playwrightTestGender",
    };

    const response = await pageObject
      .apiRequest()
      .customApiRequest(
        "PUT",
        apiUrl,
        token,
        incorrectGenderType,
        existingUserDataObject.id
      );
    const responseBody = await response.json();

    expect(response.status()).toBe(422);
    expect(responseBody[0].field).toBe("gender");
    expect(responseBody[0].message).toBe(
      "can't be blank, can be male of female"
    );
  });

  test("Should not update user with incorrect status type", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);
    const incorrectStatusType = {
      status: "playwrightTestStatus",
    };

    const response = await pageObject
      .apiRequest()
      .customApiRequest(
        "PUT",
        apiUrl,
        token,
        incorrectStatusType,
        existingUserDataObject.id
      );
    const responseBody = await response.json();

    expect(response.status()).toBe(422);
    expect(responseBody[0].field).toBe("status");
    expect(responseBody[0].message).toBe("can't be blank");
  });

  test("Should not update user details with invalid token", async ({
    page,
  }) => {
    const pageObject = new PageIndex(page);
    const invalidToken = String(faker.number.int({ min: 1000, max: 9999 }));

    const newUserDataObject = pageObject
      .apiRequest()
      .generateNewUserData({ gender: "female", status: "inactive" });

    const response = await pageObject
      .apiRequest()
      .customApiRequest(
        "PUT",
        apiUrl,
        invalidToken,
        newUserDataObject,
        existingUserDataObject.id
      );
    const responseBody = await response.json();

    expect(response.status()).toBe(401);
    expect(responseBody.message).toBe("Invalid token");
  });
});
