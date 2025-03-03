import { Locator, Page, expect } from "@playwright/test";
import { LANGUAGES } from "../../fixtures/data/languages";
import { CURRENCIES } from "../../fixtures/data/currencies";

export class LanguageAndCurrencyMenu {
  readonly page: Page;
  readonly languageAndCurrencyMenu: Locator;
  readonly menuLanguageOption: Locator;
  readonly menuCurrencyOption: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.languageAndCurrencyMenu = page.locator(
      "div:has(div:has(div:has(>div#ba-choose-language-region):has(>div#ba-choose-currency)))"
    );
    this.menuLanguageOption = this.languageAndCurrencyMenu.locator(
      "#ba-choose-language-region"
    );
    this.menuCurrencyOption = this.languageAndCurrencyMenu.locator(
      "#ba-choose-currency"
    );
    this.closeButton = this.languageAndCurrencyMenu.locator("div>div>svg");
  }
  async assertLanguageAndCurrencyToggle() {
    await this.assertLanguageAndCurrencyMenu({
      visible: true,
    });
    await this.clickCloseButton();
    await this.assertLanguageAndCurrencyMenu({
      visible: false,
    });
  }

  async assertLanguageAndCurrencyMenu({ visible }: { visible: boolean }) {
    if (visible) {
      await expect(this.languageAndCurrencyMenu).toBeVisible();
      await this.assertMenuLanguageOption();
      await this.assertMenuCurrencyOption();
      await this.assertCloseButton();
      await this.assertLanguageOptions();
      await this.clickMenuCurrencyOption();
      await this.assertCurrencyOptions();
    } else {
      await expect(this.languageAndCurrencyMenu).not.toBeVisible();
    }
  }

  async assertMenuLanguageOption() {
    await expect(this.menuLanguageOption).toBeVisible();
    await expect(this.menuLanguageOption).toHaveText("Language Region");
  }

  async assertMenuCurrencyOption() {
    await expect(this.menuCurrencyOption).toBeVisible();
    await expect(this.menuCurrencyOption).toHaveText("Currency");
  }

  async clickMenuCurrencyOption() {
    await this.menuCurrencyOption.click();
  }

  async assertCloseButton() {
    await expect(this.closeButton).toBeVisible();
  }

  async clickCloseButton() {
    await this.closeButton.click();
  }

  async assertLanguageOptions() {
    await expect(
      this.languageAndCurrencyMenu.locator(
        ">div:has-text('Choose a language and region')"
      )
    ).toBeVisible();
    for (const language of LANGUAGES) {
      const button = this.languageAndCurrencyMenu.locator(
        `button#fiatlngdialog_ba-language-region-${language.id}`
      );
      await expect(button).toBeVisible();
      await expect(button).toHaveText(language.name);
    }
  }

  async assertCurrencyOptions() {
    await expect(
      this.languageAndCurrencyMenu.locator(">div:has-text('Choose a currency')")
    ).toBeVisible();
    for (const currrency of CURRENCIES) {
      const button = this.languageAndCurrencyMenu.locator(
        `button#fiatlngdialog_ba-currency-${currrency.id}`
      );
      await expect(button).toBeVisible();
      await expect(button).toHaveText(`${currrency.id} - ${currrency.sign}`);
    }
  }
}
