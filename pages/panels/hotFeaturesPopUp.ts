import { Locator, Page, expect } from "@playwright/test";
import { FeatureDataType, FEATURES } from "../../fixtures/data/features";
import { REGEXPS } from "../../fixtures/data/regexps";

export class HotFeaturesPopUp {
  readonly page: Page;
  readonly hotFeatures: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    this.hotFeatures = page.locator('.main-container:has-text("Hot Features")');
    this.nextButton = this.hotFeatures.locator("button");
    this.previousButton = this.hotFeatures.locator(".previous-btn");
  }

  async assertHotFeaturesPopUpIsVisible(visible: boolean) {
    if (visible) {
      await expect(this.hotFeatures).toBeVisible();
    } else {
      await expect(this.hotFeatures).not.toBeVisible();
    }
  }

  async assertFeatureItem(featureItem: FeatureDataType) {
    const item = this.hotFeatures.locator(`[data-index*="${featureItem.id}"]`);
    const itemTitleIndex = item.locator(".step-title div").first();
    const itemTitle = item.locator(".step-title div").last();
    const itemContent = item.locator(".step-content div");

    await expect(itemTitleIndex).toBeVisible();
    await expect(itemTitleIndex).toHaveText(`${featureItem.id + 1}`);
    await expect(itemTitle).toBeVisible();
    await expect(itemTitle).toHaveText(featureItem.title);
    await expect(itemContent).toBeVisible();
    await expect(itemContent).toHaveText(featureItem.content);

    if (featureItem.link) {
      const itemLink = item.locator(".step-content a");
      await expect(itemLink).toBeVisible();
      await expect(itemLink).toHaveText(featureItem.link.name);
      await expect(itemLink).toHaveAttribute("href", featureItem.link.href);
    }
  }

  async assertFeatureImage({ id, mobile }: { id: number; mobile: boolean }) {
    const itemImage = this.hotFeatures.locator(
      mobile
        ? `[data-index*="${id}"] .img-item.mobile img`
        : `.img-item[data-index*='${id}'] img`
    );
    await expect(itemImage).toBeVisible();
    await expect(itemImage).toHaveAttribute("src", REGEXPS.API_ASSETS);
  }

  async assertNextButton({ id, mobile }: { id?: number; mobile?: boolean }) {
    await expect(this.nextButton).toBeVisible();
    if (id === FEATURES.length - 1 || mobile) {
      await expect(this.nextButton).toHaveText("Start Trading");
    } else {
      await expect(this.nextButton).toHaveText("Next");
    }
    await expect(this.nextButton).toBeEnabled();
  }

  async assertPreviousButton({ id }: { id?: number }) {
    if (id === 0) {
      await expect(this.previousButton).not.toBeVisible();
    } else {
      await expect(this.previousButton).toBeVisible();
      await expect(this.previousButton).toHaveText("Previous");
      await expect(this.previousButton).toBeEnabled();
    }
  }

  async clickNextButton() {
    await this.nextButton.click();
  }
}
