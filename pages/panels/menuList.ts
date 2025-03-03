import { Locator, Page, expect } from "@playwright/test";

export class MenuList {
  readonly page: Page;
  readonly menuList: Locator;
  readonly closeButton: Locator;
  readonly languageAndCurrencyMenu: Locator;

  constructor(page: Page) {
    this.menuList = page.locator(".container");
    this.closeButton = this.menuList.locator(".header");
    this.languageAndCurrencyMenu = this.menuList.locator(
      'div.header-base-menu:has-text("English")'
    );
  }

  async assertMenuList({ visible }: { visible: boolean }) {
    if (visible) {
      const themeTogglerLabel = this.menuList.locator(
        'div.header-base-menu:has(svg[data-icon-name*="theme-f"])'
      );
      const themeTogglerSwitch = this.menuList.locator("div.bn-switch");
      const themeTogglerSwitchLeft = themeTogglerSwitch.locator(
        "div.bn-switch__content-left"
      );
      const themeTogglerSwitchRight = themeTogglerSwitch.locator(
        "div.bn-switch__content-right"
      );

      await expect(this.menuList).toBeVisible();
      await expect(this.closeButton).toBeVisible();
      await expect(themeTogglerLabel).toBeVisible();
      await expect(themeTogglerLabel).toHaveText("Theme");
      await expect(themeTogglerSwitch).toBeVisible();
      await expect(themeTogglerSwitchLeft).toBeVisible();
      await expect(themeTogglerSwitchRight).toBeVisible();
      await expect(themeTogglerSwitch).not.toHaveClass("checked");
      await themeTogglerSwitchLeft.click();
      await expect(themeTogglerSwitch).not.toHaveClass("checked");
      await expect(this.languageAndCurrencyMenu).toBeVisible();
    }
  }

  async clickCloseButton() {
    await this.closeButton.click();
  }

  async clickLanguageAndCurrencyMenu() {
    await this.languageAndCurrencyMenu.click();
  }
}
