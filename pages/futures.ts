import { Page } from "@playwright/test";

export class Futures {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(exchangeRate: string) {
    await this.page.goto(`/en/futures/${exchangeRate}`);
  }
}
