import { Page } from "@playwright/test";
import { REGEXPS } from "../data/regexps";

export async function mockTestnetAuth(page: Page) {
  const mockedResponse = {
    code: "000000",
    message: null,
    messageDetail: null,
    data: null,
    success: true,
  };

  await page.route(REGEXPS.API_AUTH_V1, async (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      json: mockedResponse,
    });
  });
}

export async function mockAccountsAuth(page: Page) {
  const mockedResponse = { code: "000000", data: 60, success: true };

  await page.route(REGEXPS.API_AUTH_V1, async (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      json: mockedResponse,
    });
  });
}
