import { test as _test } from "@playwright/test";
import { Futures } from "../../pages";
import { HotFeaturesPopUp, ToolTipsPopUp } from "../../pages/panels";
import { BTCUSDT } from "../../fixtures/data/exchangeRates";
import { FEATURES } from "../../fixtures/data/features";
import { mockAccountsAuth, mockTestnetAuth } from "../../fixtures/api/mocks";

type TestProps = {
  futures: Futures;
  hotFeaturesPopUp: HotFeaturesPopUp;
  toolTipsPopUp: ToolTipsPopUp;
};

const test = _test.extend<TestProps>({
  futures: async ({ page }, use) => {
    const futures = new Futures(page);
    await use(futures);
  },
  hotFeaturesPopUp: async ({ page }, use) => {
    const hotFeaturesPopUp = new HotFeaturesPopUp(page);
    await use(hotFeaturesPopUp);
  },
  toolTipsPopUp: async ({ page }, use) => {
    const toolTipsPopUp = new ToolTipsPopUp(page);
    await use(toolTipsPopUp);
  },
});

test.describe("Not authenticated user", () => {
  test.use({ storageState: ".auth/notAuthUserWithToolbar.json" });
  test("should be able to see toolbar", async ({ futures, toolTipsPopUp }) => {
    await futures.goto(BTCUSDT.name);
    await toolTipsPopUp.assertToolTipsPopUp({ visible: true });
    await toolTipsPopUp.clickConfirmButton();
    await toolTipsPopUp.assertToolTipsPopUp({ visible: false });
  });
});

test.describe("Authenticated user", () => {
  test.use({ storageState: ".auth/authUserWithHotFeatures.json" });
  test(`should see hot features`, async ({
    futures,
    hotFeaturesPopUp,
    isMobile,
    page,
  }) => {
    await mockTestnetAuth(page);
    await mockAccountsAuth(page);
    await futures.goto(BTCUSDT.name);
    await hotFeaturesPopUp.assertHotFeaturesPopUpIsVisible(true);
    for (const itemData of FEATURES) {
      await hotFeaturesPopUp.assertFeatureItem(itemData);
      await hotFeaturesPopUp.assertFeatureImage({
        id: itemData.id,
        mobile: isMobile,
      });
      if (!isMobile) {
        await hotFeaturesPopUp.assertNextButton({ id: itemData.id });
        await hotFeaturesPopUp.assertPreviousButton({ id: itemData.id });
        await hotFeaturesPopUp.clickNextButton();
      }
    }
    if (isMobile) {
      await hotFeaturesPopUp.assertNextButton({ mobile: isMobile });
      await hotFeaturesPopUp.clickNextButton();
    }
    await hotFeaturesPopUp.assertHotFeaturesPopUpIsVisible(false);
  });
});
