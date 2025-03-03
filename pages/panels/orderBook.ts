import { Locator, Page, expect } from "@playwright/test";
import { ExchangeRateDataType } from "../../fixtures/data/exchangeRates";

export class OrderBook {
  readonly page: Page;
  readonly orderBook: Locator;
  readonly toolTipsButton: Locator;
  readonly closeButton: Locator;
  readonly header: Locator;
  readonly orderListHeader: Locator;
  readonly tickSize: Locator;
  readonly tickSizeExpanded: Locator;
  readonly orderAskList: Locator;
  readonly orderTicker: Locator;
  readonly orderBidList: Locator;
  readonly toolTipsExpanded: Locator;
  readonly displayRatio: Locator;

  constructor(page: Page) {
    this.orderBook = page.locator('.react-grid-item>div[name*="orderbook"]');
    this.toolTipsButton = this.orderBook.locator(
      "div:has-text('Order book') .bn-tooltips-ele"
    );
    this.closeButton = this.orderBook.locator(".trading-page-close-button");
    this.header = this.orderBook.locator(".orderbook-header");
    this.orderListHeader = this.orderBook.locator(".orderbook-tbheader");
    this.tickSize = this.header.locator(".orderbook-tickSize");
    this.tickSizeExpanded = this.tickSize.locator(".bn-bubble-content");
    this.orderAskList = this.orderBook.locator(".orderbook-ask");
    this.orderTicker = this.orderBook.locator(".orderbook-ticker");
    this.orderBidList = this.orderBook.locator(".orderbook-bid");
    this.toolTipsExpanded = this.orderBook.locator(
      ".bn-bubble-content:has-text('Orderbook Preference')"
    );
    this.displayRatio = this.toolTipsExpanded.locator("#displayRatio");
  }

  async assertOrderBook({ visible }: { visible: boolean }) {
    const orderBook = this.orderBook.getByText("Order Book", { exact: true });
    if (visible) {
      await expect(orderBook).toBeVisible();
      await expect(this.toolTipsButton).toBeVisible();
      await this.orderBook.hover();
      await expect(this.closeButton).toBeVisible();
    } else {
      await expect(orderBook).not.toBeVisible();
    }
  }
  
  async clickCloseButton() {
    await this.closeButton.click();
  }

  async assertToolTipsExpanded({ visible }: { visible: boolean }) {
    if (visible) {
      const title = this.toolTipsExpanded.locator(
        ".order-book-preference-title"
      );
      const label = this.displayRatio.locator(".order-book-preference-item");
      await expect(this.toolTipsExpanded).toBeVisible();
      await expect(title).toBeVisible();
      await expect(title).toHaveText("Orderbook Preference");
      await expect(
        this.displayRatio.locator(".bn-checkbox-icon svg")
      ).toBeVisible();
      await expect(label).toBeVisible();
      await expect(label).toHaveText("Show Buy/Sell Ratio");
    } else {
      await expect(this.toolTipsExpanded).not.toBeVisible();
    }
  }

  async clickShowBuySellRatio() {
    await this.displayRatio.click();
  }

  async assertBuySellRatio({ visible }: { visible: boolean }) {
    const buySellRatio = this.orderBook.locator(".orderbook-compare");
    if (visible) {
      const compareDirectionBuy = buySellRatio.locator(
        '.compare-direction:has-text("B")'
      );
      const compareDirectionSell = buySellRatio.locator(
        '.compare-direction:has-text("S")'
      );
      await expect(compareDirectionBuy).toBeVisible();
      await expect(compareDirectionBuy).toHaveText(/B\d{1,2}\.\d{1,2}%/);
      await expect(compareDirectionSell).toBeVisible();
      await expect(compareDirectionSell).toHaveText(/\d{1,2}\.\d{1,2}%S/);
      await expect(buySellRatio).toBeVisible();
    } else {
      await expect(buySellRatio).not.toBeVisible();
    }
  }

  async assertBuySellRatioToggler() {
    await this.clickToolTipsButton();
    await this.assertToolTipsExpanded({ visible: true });
    await this.clickShowBuySellRatio();
    await this.assertBuySellRatio({ visible: true });
    await this.clickShowBuySellRatio();
    await this.assertBuySellRatio({ visible: false });
    await this.clickToolTipsButton();
    await this.assertToolTipsExpanded({ visible: false });
  }

  async assertOrderBookHeader({ tickSizeValue }: { tickSizeValue: string }) {
    const defaultModeButton = this.header.getByTestId("defaultModeButton");
    const buyModeButton = this.header.getByTestId("buyModeButton");
    const sellModeButton = this.header.getByTestId("sellModeButton");

    await expect(this.header).toBeVisible();
    await expect(defaultModeButton).toBeVisible();
    await expect(buyModeButton).toBeVisible();
    await expect(sellModeButton).toBeVisible();
    await expect(this.tickSize).toBeVisible();
    await expect(this.tickSize).toHaveText(tickSizeValue);
  }

  async assertTickSizeExpanded({
    visible,
    exchangeRate,
  }: {
    visible: boolean;
    exchangeRate: ExchangeRateDataType;
  }) {
    if (visible) {
      const label = this.displayRatio.locator(".order-book-preference-item");
      await expect(this.tickSizeExpanded).toBeVisible();
      for (const tickSize of exchangeRate.tickSizes) {
        await expect(
          this.tickSizeExpanded
            .locator(".ob-ticksize-item")
            .getByText(tickSize, { exact: true })
        ).toBeVisible();
      }
    } else {
      await expect(this.tickSizeExpanded).not.toBeVisible();
    }
  }

  async clickTickSize() {
    await this.tickSize.click();
  }

  async chooseLastTickSize() {
    await this.tickSizeExpanded.locator(".ob-ticksize-item").last().click();
  }

  async assertTickSizeToggler({
    exchangeRate,
  }: {
    exchangeRate: ExchangeRateDataType;
  }) {
    await this.clickTickSize();
    await this.assertTickSizeExpanded({
      visible: true,
      exchangeRate: exchangeRate,
    });
    await this.chooseLastTickSize();
    await this.assertTickSizeExpanded({
      visible: false,
      exchangeRate: exchangeRate,
    });
  }

  async assertOrderBookTableHeader({
    exchangeRate,
  }: {
    exchangeRate: ExchangeRateDataType;
  }) {
    await expect(
      this.orderListHeader.locator(
        `.item:has-text("Price(${exchangeRate.secondCurrency})")`
      )
    ).toBeVisible();
    await expect(
      this.orderListHeader.locator(
        `.item:has-text("Size(${exchangeRate.firstCurrency})")`
      )
    ).toBeVisible();
    await expect(
      this.orderListHeader.locator(
        `.item:has-text("Sum(${exchangeRate.firstCurrency})")`
      )
    ).toBeVisible();
  }

  async assertOrderBookTable() {
    const contractPrice = this.orderTicker.locator(".contractPrice");
    const markPrice = this.orderTicker.locator(".markPrice");
    await expect(contractPrice).toBeVisible();
    await expect(contractPrice).toHaveText(/\d{1,6}\.\d/);
    await expect(markPrice).toBeVisible();
    await expect(markPrice).toHaveText(/\d{1,6}\.\d/);
  }

  async assertOrderListItems({
    mode,
    tickSizeValue,
  }: {
    mode: "default" | "ask" | "bid";
    tickSizeValue: string;
  }) {
    const listItems = await this.orderBook
      .locator(`.orderbook-${mode} .orderbook-progress`)
      .all();
    for (const item of listItems) {
      const price = item.locator(`.${mode}-light`);
      const size = item.locator(".text").first();
      const sum = item.locator(".text").last();
      const decimalPlaces = tickSizeValue.includes(".")
        ? tickSizeValue.split(".")[1].length
        : 0;
      await expect(item.locator(".progress-bar")).toBeVisible();
      await expect(price).toBeVisible();
      await expect(price).toHaveText(
        new RegExp(
          `^\\d{1,6}${decimalPlaces > 0 ? `\\.\\d{${decimalPlaces}}` : ""}$`
        )
      );
      await expect(size).toBeVisible();
      await expect(size).toHaveText(/(\d{1,3},)*\d{1,3}\.\d{1,3}/);
      await expect(sum).toBeVisible();
      await expect(sum).toHaveText(/(\d{1,3},)*\d{1,3}\.\d{1,3}/);
    }
  }

  async assertOrderList({
    mode,
    tickSizeValue,
  }: {
    mode: "default" | "ask" | "bid";
    tickSizeValue: string;
  }) {
    if (mode === "default") {
      await expect(this.orderBook.locator(`.orderbook-ask`)).toBeVisible();
      await expect(this.orderBook.locator(`.orderbook-bid`)).toBeVisible();
      await this.assertOrderListItems({ mode: "ask", tickSizeValue });
      await this.assertOrderListItems({ mode: "bid", tickSizeValue });
    } else if (mode === "ask") {
      await expect(this.orderBook.locator(`.orderbook-bid`)).not.toBeVisible();
      await this.assertOrderListItems({ mode, tickSizeValue });
    } else if (mode === "bid") {
      await expect(this.orderBook.locator(`.orderbook-ask`)).not.toBeVisible();
      await this.assertOrderListItems({ mode, tickSizeValue });
    }
  }

  async clickModeButton({ mode }: { mode: "default" | "ask" | "bid" }) {
    if (mode === "ask") {
      await this.header.getByTestId("sellModeButton").click();
    } else if (mode === "bid") {
      await this.header.getByTestId("buyModeButton").click();
    } else {
      await this.header.getByTestId("defaultModeButton").click();
    }
  }

  async assertModeToggler({
    exchangeRate,
  }: {
    exchangeRate: ExchangeRateDataType;
  }) {
    await this.clickModeButton({ mode: "ask" });
    await this.assertOrderList({
      mode: "ask",
      tickSizeValue: exchangeRate.tickSizes[0],
    });
    await this.clickModeButton({ mode: "bid" });
    await this.assertOrderList({
      mode: "bid",
      tickSizeValue: exchangeRate.tickSizes[0],
    });
  }

  async clickToolTipsButton() {
    await this.toolTipsButton.click();
  }
}
