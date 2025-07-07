import { test, expect } from "./customFixture";
import * as playgroundData from "../test-data/playground-data.json";
import * as env from "../test-data/env-test.json";

test.describe("Test the Playground web application", async () => {
  let popWindowContent = "";
  let searchedProductTitle = "";
  let newArrivalProductTitle = "";
  
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
      type Product = { [productName: string]: string };
      const products: Product[] = playgroundData.products as Product[];
      const areProductDetailsCorrect = await shopPage.verifyProductNameAndPrice(products);
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

  test("TC14 - Verify the Contact tab", async ({ common, homePage, contactPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.contact}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.contact);
      const pageTitle = await common.getText(common.pageTitle);
      expect(pageTitle, `Page heading should be ${playgroundData.titles.contact}`).toBe(playgroundData.titles.contact);
    });

    await test.step(`Verify that the user is able to fill details like name, email and message and submit the details`, async () => {
      await contactPage.submitContactForm(playgroundData.contact.name, playgroundData.contact.email, playgroundData.contact.messages, playgroundData.buttons.post);
      const isMessageCorrect = await contactPage.verifySuccessMessage(playgroundData.contact.name, playgroundData.contact.email);
      expect(isMessageCorrect, `Success messsage should contain the name '${playgroundData.contact.name}' and email '${playgroundData.contact.email}'`).toBe(true);
    });
  });

  test("TC18 - Verify the continue shopping button in about tab", async ({ common, homePage, shopPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.about}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.about);
      const pageTitle = await common.getText(common.pageTitle);
      expect(pageTitle, `Page heading should be ${playgroundData.titles.about}`).toBe(playgroundData.titles.about);
    });

    await test.step("Click on 'Continue Shopping' button", async () => {
      await common.clickButton(playgroundData.buttons.continueShopping);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });
  });

  test("TC22 - Verify user is able to update their profile", async ({ common, homePage, profilePage }) => {
    await test.step(`Go to ${playgroundData.texts.profile} page`, async () => {
      await homePage.goTo(playgroundData.texts.profile);
      const pageTitle = await common.getText(profilePage.pageHeading);
      expect(pageTitle, `Page title should be '${playgroundData.titles.userProfile}'`).toBe(playgroundData.titles.userProfile);
    });

    await test.step("Click on 'Edit' button", async () => {
      await common.clickButton(playgroundData.buttons.edit);
      const pageTitle = await common.getText(profilePage.pageHeading);
      expect(pageTitle, `Page title should be '${playgroundData.titles.editProfile}'`).toBe(playgroundData.titles.editProfile);
    });

    await test.step(`Verify that the user is able to update full name, gender, country, bio in profile`, async () => {
      await profilePage.editProfile(playgroundData.contact.name, playgroundData.gender.female, playgroundData.country.us, playgroundData.contact.bio, playgroundData.buttons.save);
      const successMessage = await common.getText(common.successMessage);
      expect(successMessage, `Auto-disappearing banner content displayed at the top right side of the page should be '${playgroundData.messages.success}'`).toBe(playgroundData.messages.success);
    });
  });

  test("TC23 - Verify user is able to logout", async ({ common, homePage }) => {
    await test.step(`Click on profile icon > Click on ${playgroundData.texts.logout} > Verify the success message displayed`, async () => {
      await homePage.logOut(playgroundData.texts.logout, playgroundData.messages.logoutAlert);
      const successMessage = await common.getText(common.successMessage);
      expect(successMessage, `Auto-disappearing banner content displayed at the top right side of the page should be '${playgroundData.messages.logoutSuccess}'`).toBe(playgroundData.messages.logoutSuccess);
    });
  });

  test("TC25 - Verify that the default view (either list or grid) is displayed when the user navigates to the product page", async ({ homePage, shopPage }) => {
    await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
      await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
    });

    await test.step(`Verify that the default view (grid) is displayed`, async () => {
      const isDefaultViewGrid = await shopPage.isGridViewDisplayed();
      expect(isDefaultViewGrid, "Default view mode of products should be Grid").toBe(true);
    });

    await test.step(`Switch to List View and verify that list view is displayed`, async () => {
      await shopPage.changeProductView();
      const isListViewDisplayed = await shopPage.isListViewDisplayed();
      expect(isListViewDisplayed, "Products should be displayed in List View").toBe(true);
    });

    await test.step(`Switch to Grid View and verify that list view is displayed`, async () => {
      await shopPage.changeProductView();
      const isGridViewDisplayed = await shopPage.isGridViewDisplayed();
      expect(isGridViewDisplayed, "Products should be displayed in Grid View").toBe(true);
    });
  });

  test("TC26 - Verify users are able to view the ordered products in my orders page", async ({ common, homePage }) => {
    await test.step(`Go to '${playgroundData.texts.myOrders}' page`, async () => {
      await homePage.goTo(playgroundData.texts.myOrders);
      const pageTitle = await common.getText(common.h1Tag);
      expect(pageTitle, `Page title should be '${playgroundData.titles.myOrders}'`).toBe(playgroundData.titles.myOrders);
    });
  });
});