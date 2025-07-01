import { test as base, expect, Page } from "@playwright/test";
import { Common } from "../pages/common";
import HomePage from "../pages/homePage";

type CustomFixture = {
    page: Page;
    common: Common;
    homePage: HomePage;
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
});

export { expect };