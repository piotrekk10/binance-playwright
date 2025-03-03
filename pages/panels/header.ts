import { Locator, Page, expect } from "@playwright/test";
import { REGEXPS } from "../../fixtures/data/regexps";

export class Header {
  readonly page: Page;
  readonly header: Locator;
  readonly extra: Locator;
  readonly userInfo: Locator;
  readonly menuList: Locator;
  readonly expandedUserInfo: Locator;
  readonly expandedUserInfoMobile: Locator;
  readonly closeButton: Locator;
  readonly logoutButton: Locator;
  readonly logoutButtonMobile: Locator;

  constructor(page: Page) {
    this.header = page.locator("header").first();
    this.extra = this.header.locator(".header-extra svg");
    this.userInfo = this.header.locator(".header-user-info");
    this.menuList = this.header.locator(".header-menu-list-mobile svg");
    this.expandedUserInfo = this.userInfo.locator(".header-menu-overlay");
    this.expandedUserInfoMobile = page.locator(
      ".header-menu-overlay.isUserInfoMini"
    );
    this.closeButton = page.locator("svg[data-icon-name*='close-f']");
    this.logoutButton = this.expandedUserInfo.locator(
      "div>div:has(svg[data-icon-name*='log-out-f'])"
    );
    this.logoutButtonMobile = this.expandedUserInfoMobile.locator(
      "div>div:has(svg[data-icon-name*='log-out-f'])"
    );
  }

  async assertHomeIcon() {
    const homeIcon = this.header.locator(
      '[test-id="futures-header-home-icon"]'
    );
    await expect(homeIcon).toBeVisible();
    await expect(homeIcon).toHaveAttribute("href", "/");
    await expect(homeIcon.locator("img")).toHaveAttribute("src", REGEXPS.IMAGE);
  }

  async assertLogo() {
    const homeIcon = this.header.locator(".header-logo");
    await expect(homeIcon).toBeVisible();
    await expect(homeIcon).toHaveAttribute("href", "/futures/home");
    await expect(homeIcon.locator("img")).toHaveAttribute("src", REGEXPS.IMAGE);
  }

  async assertBackToLiveLink() {
    const backToLiveLink = this.header.locator(".header-children a");
    await expect(backToLiveLink).toBeVisible();
    await expect(backToLiveLink).toHaveText("Back to Live");
    await expect(backToLiveLink).toHaveAttribute("href", REGEXPS.API_PROD);
  }

  async assertUserInfo({ visible }: { visible: boolean }) {
    const userInfoSvg = this.userInfo.locator("svg");
    if (visible) {
      await expect(userInfoSvg).toBeVisible();
    } else {
      await expect(userInfoSvg).not.toBeVisible();
    }
  }

  async assertExpandedUserInfo({
    visible,
    mobile,
  }: {
    visible: boolean;
    mobile?: boolean;
  }) {
    const expandedUserInfo = mobile
      ? this.expandedUserInfoMobile
      : this.expandedUserInfo;
    if (visible) {
      const unverifiedLabel = expandedUserInfo.locator(
        "div>div>div:has(svg[data-icon-name*='id-f'])"
      );
      const userTypeLabel = expandedUserInfo.locator(
        "div>div>div:has(svg[data-icon-name*='tag-vip-s-16'])"
      );
      const linkXAccountButton = expandedUserInfo.locator(
        "div>div>div:has(svg[data-icon-name*='social-x-f'])"
      );
      if (mobile) {
        await expect(this.closeButton).toBeVisible();
        await expect(this.logoutButtonMobile).toBeVisible();
        await expect(this.logoutButtonMobile).toHaveText("Log Out");
      } else {
        await expect(this.closeButton).not.toBeVisible();
        await expect(this.logoutButton).toBeVisible();
        await expect(this.logoutButton).toHaveText("Log Out");
      }
      await expect(expandedUserInfo).toBeVisible();
      await expect(unverifiedLabel).toBeVisible();
      await expect(unverifiedLabel).toHaveText("Unverified");
      await expect(userTypeLabel).toBeVisible();
      await expect(userTypeLabel).toHaveText("Regular User");
      await expect(linkXAccountButton).toBeVisible();
      await expect(linkXAccountButton).toHaveText("Link X Account");
    } else {
      await expect(this.expandedUserInfo).not.toBeVisible();
    }
  }

  async clickCloseButton() {
    await this.closeButton.click();
  }

  async clickUserInfo() {
    await this.userInfo.click();
  }

  async hoverUserInfo() {
    await this.userInfo.hover();
  }

  async clickLogoutButton({ mobile }: { mobile?: boolean }) {
    if (mobile) {
      await this.logoutButtonMobile.click();
    } else {
      await this.logoutButton.click();
    }
  }

  async assertExtra() {
    await expect(this.extra).toBeVisible();
  }

  async clickExtra() {
    await this.extra.click();
  }

  async hoverExtra() {
    await this.extra.hover();
  }

  async assertMenuList() {
    await expect(this.menuList).toBeVisible();
  }

  async clickMenuList() {
    await this.menuList.click();
  }

  async assertSlot() {
    const slot = this.header.locator(".header-slot svg");
    await expect(slot).toBeVisible();
  }

  async assertTheme() {
    const theme = this.header.locator(".header-theme svg");
    await expect(theme).toBeVisible();
  }
}
