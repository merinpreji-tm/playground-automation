import { test, expect } from "./customFixture";
import * as playgroundData from "../test-data/playground-data.json";
import * as env from "../test-data/env-test.json";

test.describe("Test the Playground web application", async () => {
  let popWindowContent = "";
  let searchedProductTitle = "";
  let newArrivalProductTitle = "";
  let cartItemsCount = 0;
  let wishlistItemsCount = 0;
  let productQuantity = 0;
  let laptopTitle = "";
  let mobileTitle = "";
  let laptopPrice = 0;
  let mobilePrice = 0;
  let laptopQuantity = 0;
  let mobileQuantity = 0;
  let sumOfPrices = 0;
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

  test("TC02 - Verify pop up window is displayed", async ({ common, homePage, componentsPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.components}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.components);
      const pageTitle = await common.getText(componentsPage.pageTitle);
      expect(pageTitle, `Page title should be ${playgroundData.titles.componentsPage}`).toBe(playgroundData.titles.componentsPage);
    });

    await test.step(`Click the 'Learn more' link on the '${playgroundData.cardTitles.popWindow}' tile and verify whether ${playgroundData.buttons.openPopWindow} button is visible`, async () => {
      await componentsPage.clickLearnMore(playgroundData.cardTitles.popWindow);
      const isPopWindowButtonVisible = await componentsPage.isOpenPopWindowButtonVisible(playgroundData.buttons.openPopWindow);
      expect(isPopWindowButtonVisible, `'${playgroundData.buttons.openPopWindow}' should be displayed`).toBe(true);
    });

    await test.step(`Click on the 'Open Pop Window' button and verify the pop up window content to be '${playgroundData.texts.popWindowContent}'`, async () => {
      await common.clickButton(playgroundData.buttons.openPopWindow);
      popWindowContent = await common.getText(common.ptag);
      expect(popWindowContent, `Pop Window Content should be ${playgroundData.texts.popWindowContent}`).toBe(playgroundData.texts.popWindowContent);
    });

    await test.step(`Click on the Close button and ensure the pop window is closed`, async () => {
      await common.clickButton(playgroundData.buttons.close);
      const isPopWindowButtonVisible = await componentsPage.isOpenPopWindowButtonVisible(playgroundData.buttons.openPopWindow);
      expect(isPopWindowButtonVisible, `'${playgroundData.buttons.openPopWindow}' should be displayed`).toBe(true);
    });
  });

  test("TC03 - Verify  user is able to shop by category", async ({ homePage, shopPage }) => {
    await test.step(`Click on  "Shop by Category" menu and select category ${playgroundData.filters.category.brandToSelect.mobiles}`, async () => {
      await homePage.selectCategory(playgroundData.sideMenu.shopByCategory, playgroundData.filters.category.brandToSelect.mobiles);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });
  });

  test("TC04 - Verify if the user is able to search the product using the search bar", async ({ common, homePage, productDetailsPage }) => {
    await test.step(`Search for '${playgroundData.searchTerm.laptop}' in the search bar`, async () => {
      searchedProductTitle = await homePage.searchProduct(playgroundData.searchTerm.laptop);
    });

    await test.step("Verify that product page displays the searched product", async () => {
      const productTitle = await common.getText(productDetailsPage.productTitle);
      expect(searchedProductTitle, "Searched product title should be same as title displayed in product details page").toBe(productTitle);
    });
  });

  test("TC05 - Verify if the user is able to select a product by clicking the shop now button or clicking on the product", async ({ homePage, shopPage }) => {
    await test.step(`Click on 'Shop Now' button in '${playgroundData.filters.category.brandToSelect.laptops}' card`, async () => {
      await homePage.clickShopNow(playgroundData.filters.category.brandToSelect.laptops);
      const isChecked = await shopPage.verifyAppliedFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.laptops)
      expect(isChecked, `'${playgroundData.filters.category.brandToSelect.laptops}' should be selected under 'Shop by ${playgroundData.filters.category.sectionTitle}' section`).toBe(true);
    });
  });

  test("TC06 - Verify if the user is able to  select a product by clicking on the product", async ({ common, homePage, productDetailsPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      newArrivalProductTitle = await common.getText(homePage.newArrivalProductTitle);
      await homePage.clickNewArrivalProduct(newArrivalProductTitle);
    });

    await test.step("Verify that product page displays the selected product", async () => {
      const productTitle = await common.getText(productDetailsPage.productTitle);
      expect(newArrivalProductTitle, "Selected product title should be same as title displayed in product details page").toBe(productTitle);
    });
  });

  test("TC07 - Verify if the user is able to add the product to the cart", async ({ common, homePage, productDetailsPage, cartPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      cartItemsCount = await homePage.getCount(homePage.cartItemsCount);
      newArrivalProductTitle = await common.getText(homePage.newArrivalProductTitle);
      await homePage.clickNewArrivalProduct(newArrivalProductTitle);
    });

    await test.step("Verify that product page displays the selected product", async () => {
      const productTitle = await common.getText(productDetailsPage.productTitle);
      expect(newArrivalProductTitle, "Selected product title should be same as title displayed in product details page").toBe(productTitle);
    });

    await test.step("Click on 'Add to Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.addToCart);
      const cartItemCountIncreased = await homePage.hasCountIncreased(cartItemsCount, homePage.cartItemsCount);
      expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
    });

    // Navigating to cart and Resetting the cart to remove added item in cart
    await test.step("Navigate to cart page", async () => {
      await homePage.goToCart();
      const pageTitle = await common.getText(cartPage.pageTitle);
      expect(pageTitle, `Page title should be '${playgroundData.titles.cart}'`).toBe(playgroundData.titles.cart);
    });

    await test.step("Click on 'Reset Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.resetCart);
      const cartItemCount = await homePage.hasCountBecomeZero(homePage.cartItemsCount);
      expect(cartItemCount, "Number of items in the cart should be zero").toBe(true);
    });
  });

  test("TC08 - Verify if the user can add multiple quantity of the same product to the cart", async ({ common, homePage, productDetailsPage, cartPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      cartItemsCount = await homePage.getCount(homePage.cartItemsCount);
      newArrivalProductTitle = await common.getText(homePage.newArrivalProductTitle);
      await homePage.clickNewArrivalProduct(newArrivalProductTitle);
    });

    await test.step("Verify that product page displays the selected product", async () => {
      const productTitle = await common.getText(productDetailsPage.productTitle);
      expect(newArrivalProductTitle, "Selected product title should be same as title displayed in product details page").toBe(productTitle);
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

    await test.step(`Increase the product quantity by ${playgroundData.cart.countToIncrease} by clicking the '+' button`, async () => {
      productQuantity = await cartPage.getProductQuantity(newArrivalProductTitle);
      await cartPage.increaseItemCount(playgroundData.cart.countToIncrease, newArrivalProductTitle);
    });

    await test.step(`Verfy that product quantity is increased`, async () => {
      const updatedQuantity = await cartPage.getProductQuantity(newArrivalProductTitle);
      expect(updatedQuantity, `Product quantity should be increased by ${playgroundData.cart.countToIncrease}`).toBe(productQuantity + Number(playgroundData.cart.countToIncrease));
    });

    // Resetting the cart to remove added item in cart
    await test.step("Click on 'Reset Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.resetCart);
      const cartItemCount = await homePage.hasCountBecomeZero(homePage.cartItemsCount);
      expect(cartItemCount, "Number of items in the cart should be zero").toBe(true);
    });
  });
});