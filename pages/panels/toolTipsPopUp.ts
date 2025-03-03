import { Locator, Page, expect } from "@playwright/test";

export class ToolTipsPopUp {
  readonly page: Page;
  readonly toolTips: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.toolTips = page.locator(
      ".bn-trans.data-show.bn-tooltips-trans .bn-tooltips .bn-bubble-content"
    );
    this.confirmButton = this.toolTips.locator("button:has-text('Confirm')");
  }

  async assertToolTipsPopUp({ visible }: { visible: boolean }) {
    if (visible) {
      await expect(this.toolTips).toBeVisible();
      await expect(
        this.toolTips.getByText(
          "1. Go to Date, Chart Type and Chart Style features are now available on the toolbar."
        )
      ).toBeVisible();
      await expect(
        this.toolTips.getByText(
          "2. Open order, Positions, Order History, Breakeven Price is now grouped within More Settings"
        )
      ).toBeVisible();
      await expect(this.confirmButton).toBeVisible();
      await expect(this.confirmButton).toBeEnabled();
    } else {
      await expect(this.toolTips).not.toBeVisible();
    }
  }

  async clickConfirmButton() {
    await this.confirmButton.click();
  }
}
