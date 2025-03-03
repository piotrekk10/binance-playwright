import { test as _test } from "@playwright/test";
import { Futures } from "../../pages";
import {
  Header,
  HotFeaturesPopUp,
  LanguageAndCurrencyMenu,
  MenuList,
  ToolTipsPopUp,
} from "../../pages/panels";
import { BTCUSDT } from "../../fixtures/data/exchangeRates";
import { FEATURES } from "../../fixtures/data/features";
import { mockAccountsAuth, mockTestnetAuth } from "../../fixtures/api/mocks";
import {
  AUTHENTICATED_USER,
  NOT_AUTHENTICATED_USER,
  SessionDataType,
} from "../../fixtures/data/sessions";
import { REGEXPS } from "../../fixtures/data/regexps";

type TestProps = {
  futures: Futures;
  header: Header;
  languageAndCurrencyMenu: LanguageAndCurrencyMenu;
  hotFeaturesPopUp: HotFeaturesPopUp;
  menuList: MenuList;
  toolTipsPopUp: ToolTipsPopUp;
};

const test = _test.extend<TestProps>({
  futures: async ({ page }, use) => {
    const futures = new Futures(page);
    await use(futures);
  },
  header: async ({ page }, use) => {
    const header = new Header(page);
    await use(header);
  },
  hotFeaturesPopUp: async ({ page }, use) => {
    const hotFeaturesPopUp = new HotFeaturesPopUp(page);
    await use(hotFeaturesPopUp);
  },
  languageAndCurrencyMenu: async ({ page }, use) => {
    const languageAndCurrencyMenu = new LanguageAndCurrencyMenu(page);
    await use(languageAndCurrencyMenu);
  },
  menuList: async ({ page }, use) => {
    const menuList = new MenuList(page);
    await use(menuList);
  },
  toolTipsPopUp: async ({ page }, use) => {
    const toolTipsPopUp = new ToolTipsPopUp(page);
    await use(toolTipsPopUp);
  },
});

[AUTHENTICATED_USER, NOT_AUTHENTICATED_USER].forEach(
  (user: SessionDataType) => {
    test.describe(`${
      user.authenticated ? "Authenticated" : "Not authenticated"
    } user`, () => {
      test.use({ storageState: user.sessionFile });
      test.setTimeout(60000);
      test.beforeEach(async ({ page }) => {
        if (user.authenticated) {
          await mockTestnetAuth(page);
          await mockAccountsAuth(page);
        }
      });

      test("should be able to display and iteract with header elements", async ({
        futures,
        header,
        isMobile,
        languageAndCurrencyMenu,
        menuList,
      }) => {
        await futures.goto(BTCUSDT.name);
        await header.assertHomeIcon();
        await header.assertLogo();
        await header.assertSlot();
        await header.assertUserInfo({ visible: user.authenticated });
        if (user.authenticated) {
          if (isMobile) {
            await header.clickUserInfo();
          } else {
            await header.hoverUserInfo();
          }
          await header.assertExpandedUserInfo({
            visible: true,
            mobile: isMobile,
          });
          if (isMobile) {
            await header.clickCloseButton();
          } else {
            await header.hoverExtra();
          }
          await header.assertExpandedUserInfo({
            visible: false,
            mobile: isMobile,
          });
        }
        if (isMobile) {
          await header.assertMenuList();
          await header.clickMenuList();
          await menuList.assertMenuList({ visible: true });
          await menuList.clickLanguageAndCurrencyMenu();
          await languageAndCurrencyMenu.assertLanguageAndCurrencyToggle();
          await menuList.clickCloseButton();
          await menuList.assertMenuList({ visible: false });
        } else {
          await header.assertBackToLiveLink();
          await header.assertExtra();
          await header.assertTheme();
          await header.clickExtra();
          await languageAndCurrencyMenu.assertLanguageAndCurrencyToggle();
        }
      });
    });
  }
);

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

test.describe("Authenticated user", () => {
  test.use({ storageState: ".auth/authUser.json" });
  test(`should be able to logout`, async ({
    futures,
    header,
    isMobile,
    page,
  }) => {
    await mockTestnetAuth(page);
    await mockAccountsAuth(page);
    await futures.goto(BTCUSDT.name);
    await header.clickUserInfo();
    await header.clickLogoutButton({ mobile: isMobile });
    await page.waitForResponse(REGEXPS.API_FUTURES);
    await header.assertUserInfo({ visible: false });
  });
});
