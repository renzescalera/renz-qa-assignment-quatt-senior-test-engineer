import { Page, expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";

export class Api {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async customApiRequest(
    method: "GET" | "POST" | "PUT" | "DELETE",
    apiUrl: string,
    token: string,
    requestBody: object | null = null,
    id: number | string = ""
  ) {
    const context = await request.newContext();

    const options: any = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    // Add requestBody only for POST and PUT requests
    if (requestBody && (method === "POST" || method === "PUT")) {
      options.data = requestBody;
    }

    // Perform the request using the specified method
    let response;
    switch (method) {
      case "GET":
        response = await context.get(`${apiUrl}${id}`, options);
        break;
      case "POST":
        response = await context.post(apiUrl, options);
        break;
      case "PUT":
        response = await context.put(`${apiUrl}${id}`, options);
        break;
      case "DELETE":
        response = await context.delete(`${apiUrl}${id}`, options);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response;
  }

  generateNewUserData(overrides = {}) {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      gender: faker.person.sex(),
      status: faker.helpers.arrayElement(["active", "inactive"]),
      ...overrides,
    };
  }
}
