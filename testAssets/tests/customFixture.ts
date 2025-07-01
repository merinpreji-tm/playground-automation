import { test as base, expect, Page } from "@playwright/test";
import { Common } from "../pages/common";
import HomePage from "../pages/homePage";
import ShopPage from "../pages/shopPage";

type CustomFixture = {
    page: Page;
    common: Common;
    homePage: HomePage;
    shopPage: ShopPage;
}

export const test = base.extend <CustomFixture> ({
    common: async ({ page }, use) => {
        const common = new Common(page);
        await use(common);
    },
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    shopPage: async ({ page }, use) => {
        const shopPage = new ShopPage(page);
        await use(shopPage);
    },
});

export { expect };