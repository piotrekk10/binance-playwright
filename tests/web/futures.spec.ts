import { test as _test } from "@playwright/test";
import { Futures } from "../../pages";
import { OrderBook } from "../../pages/panels";
import {
  EXCHANGE_RATES,
  ExchangeRateDataType,
} from "../../fixtures/data/exchangeRates";
import { mockAccountsAuth, mockTestnetAuth } from "../../fixtures/api/mocks";

type TestProps = {
  futures: Futures;
  orderBook: OrderBook;
};

const test = _test.extend<TestProps>({
  futures: async ({ page }, use) => {
    const futures = new Futures(page);
    await use(futures);
  },
  orderBook: async ({ page }, use) => {
    const orderBook = new OrderBook(page);
    await use(orderBook);
  },
});

test.describe("Authenticated user", () => {
  test.use({ storageState: ".auth/authUser.json" });
  EXCHANGE_RATES.forEach((exchangeRate: ExchangeRateDataType) => {
    test(`should see futures site for ${exchangeRate.name} exchange rate and interact with order book panel`, async ({
      futures,
      orderBook,
      page,
    }) => {
      await futures.goto(exchangeRate.name);
      await mockTestnetAuth(page);
      await mockAccountsAuth(page);
      await orderBook.assertOrderBook({ visible: true });
      await orderBook.assertOrderBookHeader({
        tickSizeValue: exchangeRate.tickSizes[0],
      });
      await orderBook.assertOrderBookTableHeader({ exchangeRate });
      await orderBook.assertOrderBookTable();
      await orderBook.assertOrderList({
        mode: "default",
        tickSizeValue: exchangeRate.tickSizes[0],
      });
      await orderBook.assertBuySellRatioToggler();
      await orderBook.assertModeToggler({ exchangeRate });
      await orderBook.assertTickSizeToggler({ exchangeRate });

      await orderBook.clickCloseButton();
      await orderBook.assertOrderBook({ visible: false });
    });
  });
});
