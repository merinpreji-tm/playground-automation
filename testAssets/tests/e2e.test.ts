import { test, expect } from "./customFixture";
import * as playgroundData from "../test-data/playground-data.json";
import * as env from "../test-data/env-test.json";

test.describe("Test the Playground web application", async () => {
  let cartItemsCount = 0;
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

  test("@e2e TC15 - Verify that a user is able to purchase and order_ETE flow", async ({ common, homePage, shopPage, productDetailsPage, cartPage, paymentPage }) => {
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

    await test.step("Click on 'Add to Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.addToCart);
      const cartItemCountIncreased = await homePage.hasCountIncreased(cartItemsCount, homePage.cartItemsCount);
      expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
    });

    await test.step("Navigate to cart page", async () => {
      await homePage.goToCart();
      const pageTitle = await common.getText(cartPage.pageTitle);
      expect(pageTitle, `Page title should be '${playgroundData.titles.cart}'`).toBe(playgroundData.titles.cart);
    });

    await test.step(`Check that cart contains the product '${mobileTitle}`, async () => {
      const cartItems = await cartPage.verifyCartItems(mobileTitle);
      expect(cartItems, `Cart should contain the product '${mobileTitle}`).toBe(true);
    });

    await test.step("Click on 'Proceed to Checkout' button", async () => {
      await common.clickButton(playgroundData.buttons.checkout);
      const pageTitle = await common.getText(common.pageTitle);
      expect(pageTitle, `Page heading should be ${playgroundData.titles.payment}`).toBe(playgroundData.titles.payment);
    });

    await test.step("Verify that 'Cash on Delivery' payment option is checked and disabled as it is the only payment option available", async () => {
      const isCheckedAndDisabled = await paymentPage.verifyPaymentOption();
      expect(isCheckedAndDisabled, `'Cash on Delivery' payment option should be checked and disabled`).toBe(true);
    });

    await test.step("Verify that user can place order", async () => {
      await paymentPage.placeOrder(playgroundData.contact.name, playgroundData.contact.email, playgroundData.contact.address, playgroundData.contact.phone, playgroundData.buttons.placeOrder);
      const successMessage = await common.getText(paymentPage.successMessage);
      expect(successMessage, `Success  message should be displayed as ${playgroundData.messages.orderSucces}`).toBe(playgroundData.messages.orderSucces);
    });
  });
});