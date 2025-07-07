import { test, expect } from "./customFixture";
import * as playgroundData from "../test-data/playground-data.json";
import * as env from "../test-data/env-test.json";

test.describe("Test the Playground web application", async () => {
  let cartItemsCount = 0;
  let wishlistItemsCount = 0;
  let mobileTitle = "";
  
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

  test("TC19 - Verify if the user is able to add the product to the wishlist", async ({ common, homePage, shopPage, productDetailsPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });

    await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
    });

    await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
      expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`).toBe(true);
    });

    await test.step(`Click on the first product and verify that product page displays the selected product`, async () => {
      const title = await shopPage.clickProduct();
      mobileTitle = await common.getText(productDetailsPage.productTitle);
      expect(title, "Selected product title should be same as title displayed in product details page").toBe(mobileTitle);
    });

    await test.step("Click on 'Add to Wishlist' button and verify the success message displayed", async () => {
      wishlistItemsCount = await common.getCount(homePage.wishlistItemsCount);
      await common.clickButton(playgroundData.buttons.addToWishlist);
      const validMessages = [playgroundData.messages.wishlistSuccess, playgroundData.messages.wishlistItemExists];
      const isValid = await productDetailsPage.verifySuccessMessage(validMessages);
      expect(isValid, `Auto-disappearing banner content displayed at the top right side of the page should be one of: '${validMessages.join("' or '")}'`).toBe(true);
    });

    await test.step("Verify that the wishlist shows the number of products added", async () => {
      const wishlistItemCountIncreased = await homePage.hasCountIncreased(wishlistItemsCount, homePage.wishlistItemsCount);
      expect(wishlistItemCountIncreased, "Number of items in the wishlist should be increased").toBe(true);
    });

    // Removing item from wishlist
    await test.step("Navigate to wishlist", async () => {
      await homePage.goToWishlist();
      const pageTitle = await common.getText(common.pageTitle);
      expect(pageTitle, `Page title should be '${playgroundData.titles.wishlist}'`).toBe(playgroundData.titles.wishlist);
    });

    await test.step("Click on 'Reset Wishlist' button", async () => {
      await common.clickButton(playgroundData.buttons.resetWishlist);
      const wishlistItemCount = await homePage.hasCountBecomeZero(homePage.wishlistItemsCount);
      expect(wishlistItemCount, "Number of items in the wishlist should be zero").toBe(true);
    });
  });

  test("TC20 - Verify if the user is able to add the product to the cart which is in wishlist", async ({ common, homePage, shopPage, productDetailsPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });

    await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
    });

    await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
      expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`).toBe(true);
    });

    await test.step(`Click on the first product and verify that product page displays the selected product`, async () => {
      const title = await shopPage.clickProduct();
      mobileTitle = await common.getText(productDetailsPage.productTitle);
      expect(title, "Selected product title should be same as title displayed in product details page").toBe(mobileTitle);
    });

    await test.step("Click on 'Add to Wishlist' button and verify the success message displayed", async () => {
      wishlistItemsCount = await common.getCount(homePage.wishlistItemsCount);
      await common.clickButton(playgroundData.buttons.addToWishlist);
      const validMessages = [playgroundData.messages.wishlistSuccess, playgroundData.messages.wishlistItemExists];
      const isValid = await productDetailsPage.verifySuccessMessage(validMessages);
      expect(isValid, `Auto-disappearing banner content displayed at the top right side of the page should be one of: '${validMessages.join("' or '")}'`).toBe(true);
    });

    await test.step("Verify that the wishlist shows the number of products added", async () => {
      const wishlistItemCountIncreased = await homePage.hasCountIncreased(wishlistItemsCount, homePage.wishlistItemsCount);
      expect(wishlistItemCountIncreased, "Number of items in the wishlist should be increased").toBe(true);
    });

    await test.step("Navigate to wishlist", async () => {
      await homePage.goToWishlist();
      const pageTitle = await common.getText(common.pageTitle);
      expect(pageTitle, `Page title should be '${playgroundData.titles.wishlist}'`).toBe(playgroundData.titles.wishlist);
    });

    await test.step("Click on 'Add to Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.addToCart);
      const cartItemCountIncreased = await homePage.hasCountIncreased(cartItemsCount, homePage.cartItemsCount);
      expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
    });

    // Removing item from wishlist
    await test.step("Click on 'Reset Wishlist' button", async () => {
      await common.clickButton(playgroundData.buttons.resetWishlist);
      const wishlistItemCount = await homePage.hasCountBecomeZero(homePage.wishlistItemsCount);
      expect(wishlistItemCount, "Number of items in the wishlist should be zero").toBe(true);
    });
  });

  test("TC21 - Verify if the user can reset the wishlist", async ({ common, homePage, shopPage, productDetailsPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });

    await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
    });

    await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
      const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.mobiles);
      expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.mobiles}'`).toBe(true);
    });

    await test.step(`Click on the first product and verify that product page displays the selected product`, async () => {
      const title = await shopPage.clickProduct();
      mobileTitle = await common.getText(productDetailsPage.productTitle);
      expect(title, "Selected product title should be same as title displayed in product details page").toBe(mobileTitle);
    });

    await test.step("Click on 'Add to Wishlist' button and verify the success message displayed", async () => {
      wishlistItemsCount = await common.getCount(homePage.wishlistItemsCount);
      await common.clickButton(playgroundData.buttons.addToWishlist);
      const validMessages = [playgroundData.messages.wishlistSuccess, playgroundData.messages.wishlistItemExists];
      const isValid = await productDetailsPage.verifySuccessMessage(validMessages);
      expect(isValid, `Auto-disappearing banner content displayed at the top right side of the page should be one of: '${validMessages.join("' or '")}'`).toBe(true);
    });

    await test.step("Verify that the wishlist shows the number of products added", async () => {
      const wishlistItemCountIncreased = await homePage.hasCountIncreased(wishlistItemsCount, homePage.wishlistItemsCount);
      expect(wishlistItemCountIncreased, "Number of items in the wishlist should be increased").toBe(true);
    });

    await test.step("Navigate to wishlist", async () => {
      await homePage.goToWishlist();
      const pageTitle = await common.getText(common.pageTitle);
      expect(pageTitle, `Page title should be '${playgroundData.titles.wishlist}'`).toBe(playgroundData.titles.wishlist);
    });

    await test.step("Click on 'Reset Wishlist' button", async () => {
      await common.clickButton(playgroundData.buttons.resetWishlist);
      const wishlistItemCount = await homePage.hasCountBecomeZero(homePage.wishlistItemsCount);
      expect(wishlistItemCount, "Number of items in the wishlist should be zero").toBe(true);
    });
  });
});