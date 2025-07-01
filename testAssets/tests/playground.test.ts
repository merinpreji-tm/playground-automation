import { test, expect } from "./customFixture";
import * as playgroundData from "../test-data/playground-data.json";
import * as env from "../test-data/env-test.json";

test.describe("Test the Playground web application", async () => {
  test.beforeEach(async ({ page, common, homePage }) => {
    await test.step("Launch the website and verify that home page is displayed", async () => {
      await common.launchUrl(env.baseUrl);
      await expect(page).toHaveTitle(playgroundData.titles.homePage);
    });

    await test.step("Login to the e-commerce by clicking on profile icon dropdown on top right side of the screen and verify that profile shortcut is displayed", async () => {
      await homePage.logIn(env.userName, env.password, playgroundData.buttons.login);
      const isProfileShorcutVisible = await homePage.verifyProfileShortcutIsVisible(playgroundData.texts.profile);
      expect(isProfileShorcutVisible, "Profile shortcut should be visible").toBe(true);
    });
  });

  test("TC01 - Verify user is able to filter product by brand", async ({ homePage, shopPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });

    await test.step(`Verify the name and price of the products listed`, async () => {
      const areProductDetailsCorrect = await shopPage.verifyProductNameAndPrice(playgroundData.products);
      expect(areProductDetailsCorrect, "Product names and prices should match").toBe(true);
    });

    await test.step(`Filter the product listing by selecting '${playgroundData.filters.brand.brandToSelect}' under '${playgroundData.filters.brand.sectionTitle}'`, async () => {
      await shopPage.applyFilter(playgroundData.filters.brand.sectionTitle, playgroundData.filters.brand.brandToSelect);
    });

    await test.step(`Verify that the results are related to ${playgroundData.filters.brand.sectionTitle} '${playgroundData.filters.brand.brandToSelect}'`, async () => {
      const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.brand.sectionTitle, playgroundData.filters.brand.brandToSelect);
      expect(resultsAreValid, `Products are of ${playgroundData.filters.brand.sectionTitle} '${playgroundData.filters.brand.brandToSelect}'`).toBe(true);
    });
  });
});