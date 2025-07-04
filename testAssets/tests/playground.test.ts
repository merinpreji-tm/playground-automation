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
      cartItemsCount = await common.getCount(homePage.cartItemsCount);
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
      cartItemsCount = await common.getCount(homePage.cartItemsCount);
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

    await test.step(`Verify that product quantity is increased`, async () => {
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

  test("TC09 - Verify if the user can reduce quantity of the same product from the cart", async ({ common, homePage, productDetailsPage, cartPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      cartItemsCount = await common.getCount(homePage.cartItemsCount);
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

    await test.step(`Verify that product quantity is increased`, async () => {
      const updatedQuantity = await cartPage.getProductQuantity(newArrivalProductTitle);
      expect(updatedQuantity, `Product quantity should be increased by ${playgroundData.cart.countToIncrease}`).toBe(productQuantity + Number(playgroundData.cart.countToIncrease));
    });
    
    await test.step(`Decrease the product quantity by ${playgroundData.cart.countToDecrease} by clicking the '-' button`, async () => {
      productQuantity = await cartPage.getProductQuantity(newArrivalProductTitle);
      await cartPage.decreaseItemCount(playgroundData.cart.countToDecrease, newArrivalProductTitle);
    });

    await test.step(`Verfy that product quantity is decreased`, async () => {
      const updatedQuantity = await cartPage.getProductQuantity(newArrivalProductTitle);
      expect(updatedQuantity, `Product quantity should be increased by ${playgroundData.cart.countToDecrease}`).toBe(productQuantity - Number(playgroundData.cart.countToDecrease));
    });

    // Resetting the cart to remove added item in cart
    await test.step("Click on 'Reset Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.resetCart);
      const cartItemCount = await homePage.hasCountBecomeZero(homePage.cartItemsCount);
      expect(cartItemCount, "Number of items in the cart should be zero").toBe(true);
    });
  });

  test("TC10 - Verify if the user can add multiple products to the cart", async ({ common, homePage, shopPage, productDetailsPage, cartPage }) => {
    await test.step(`Add a product from the category '${playgroundData.filters.category.brandToSelect.laptops}'`, async () => {
      await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
        await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
        const isShopVisible = await shopPage.verifyMenuIsVisible();
        expect(isShopVisible, "Shop text should be displayed").toBe(true);
      });

      await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.laptops}'`, async () => {
        await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.laptops);
      });

      await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.laptops}'`, async () => {
        const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.laptops);
        expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.laptops}'`).toBe(true);
      });

      await test.step(`Click on the first product and verify that product page displays the selected product`, async () => {
        const title = await shopPage.clickProduct();
        laptopTitle = await common.getText(productDetailsPage.productTitle);
        expect(title, "Selected product title should be same as title displayed in product details page").toBe(laptopTitle);
      });

      await test.step("Click on 'Add to Cart' button", async () => {
        await common.clickButton(playgroundData.buttons.addToCart);
        const cartItemCountIncreased = await homePage.hasCountIncreased(cartItemsCount, homePage.cartItemsCount);
        expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
      });
    });

    await test.step(`Add a product from the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
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
    });

    await test.step(`Verify that the products added to cart from the category '${playgroundData.filters.category.brandToSelect.laptops}' and '${playgroundData.filters.category.brandToSelect.mobiles}' are present in the cart`, async () => {
      await test.step("Navigate to cart page", async () => {
        await homePage.goToCart();
        const pageTitle = await common.getText(cartPage.pageTitle);
        expect(pageTitle, `Page title should be '${playgroundData.titles.cart}'`).toBe(playgroundData.titles.cart);
      });

      await test.step(`Check that cart contains products '${laptopTitle}' and '${mobileTitle}`, async () => {
        const cartItems = await cartPage.verifyCartItems(laptopTitle, mobileTitle);
        expect(cartItems, `Cart should contain the products '${laptopTitle}' and '${mobileTitle}`).toBe(true);
      });

      // Resetting the cart to remove added item in cart
      await test.step("Click on 'Reset Cart' button", async () => {
        await common.clickButton(playgroundData.buttons.resetCart);
        const cartItemCount = await homePage.hasCountBecomeZero(homePage.cartItemsCount);
        expect(cartItemCount, "Number of items in the cart should be zero").toBe(true);
      });
    });
  });

  test("TC11 - Verify if the user can reset the cart", async ({ common, homePage, productDetailsPage, cartPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      cartItemsCount = await common.getCount(homePage.cartItemsCount);
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

    await test.step("Click on 'Reset Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.resetCart);
      const cartItemCount = await homePage.hasCountBecomeZero(homePage.cartItemsCount);
      expect(cartItemCount, "Number of items in the cart should be zero").toBe(true);
    });
  });

  test("TC13 - Verify the Proceed to checkout button", async ({ common, homePage, productDetailsPage, cartPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      cartItemsCount = await common.getCount(homePage.cartItemsCount);
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

    await test.step("Click on 'Proceed to Checkout' button", async () => {
      await common.clickButton(playgroundData.buttons.checkout);
      const pageTitle = await common.getText(common.pageTitle);
      expect(pageTitle, `Page heading should be ${playgroundData.titles.payment}`).toBe(playgroundData.titles.payment);
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

  test("TC16 - Validate the Subtotal amount", async ({ common, homePage, shopPage, productDetailsPage, cartPage, paymentPage }) => {
    await test.step(`Add a product from the category '${playgroundData.filters.category.brandToSelect.laptops}'`, async () => {
      await test.step(`Navigate to '${playgroundData.navigationMenu.shop}' page using menu option`, async () => {
        await homePage.clickNavigationMenu(playgroundData.navigationMenu.shop);
        const isShopVisible = await shopPage.verifyMenuIsVisible();
        expect(isShopVisible, "Shop text should be displayed").toBe(true);
      });

      await test.step(`Filter the product listing by selecting the category '${playgroundData.filters.category.brandToSelect.laptops}'`, async () => {
        await shopPage.applyFilter(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.laptops);
      });

      await test.step(`Verify that the results are related to ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.laptops}'`, async () => {
        const resultsAreValid = await shopPage.verifyFilterResults(playgroundData.filters.category.sectionTitle, playgroundData.filters.category.brandToSelect.laptops);
        expect(resultsAreValid, `Products are of ${playgroundData.filters.category.sectionTitle} '${playgroundData.filters.category.brandToSelect.laptops}'`).toBe(true);
      });

      await test.step(`Click on the first product and verify that product page displays the selected product`, async () => {
        const title = await shopPage.clickProduct();
        laptopTitle = await common.getText(productDetailsPage.productTitle);
        expect(title, "Selected product title should be same as title displayed in product details page").toBe(laptopTitle);
      });

      await test.step("Click on 'Add to Cart' button", async () => {
        await common.clickButton(playgroundData.buttons.addToCart);
        const cartItemCountIncreased = await homePage.hasCountIncreased(cartItemsCount, homePage.cartItemsCount);
        expect(cartItemCountIncreased, "Number of items in the cart should be increased").toBe(true);
      });
    });

    await test.step(`Add a product from the category '${playgroundData.filters.category.brandToSelect.mobiles}'`, async () => {
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
    });

    await test.step(`Verify that the products added to cart from the category '${playgroundData.filters.category.brandToSelect.laptops}' and '${playgroundData.filters.category.brandToSelect.mobiles}' are present in the cart`, async () => {
      await test.step("Navigate to cart page", async () => {
        await homePage.goToCart();
        const pageTitle = await common.getText(cartPage.pageTitle);
        expect(pageTitle, `Page title should be '${playgroundData.titles.cart}'`).toBe(playgroundData.titles.cart);
      });

      await test.step(`Check that cart contains products '${laptopTitle}' and '${mobileTitle}`, async () => {
        laptopPrice = await cartPage.getProductPrice(laptopTitle);
        laptopQuantity = await cartPage.getProductQuantity(laptopTitle);
        mobilePrice = await cartPage.getProductPrice(mobileTitle);
        mobileQuantity = await cartPage.getProductQuantity(mobileTitle);
        sumOfPrices = laptopPrice * laptopQuantity + mobilePrice * mobileQuantity;
        const cartItems = await cartPage.verifyCartItems(laptopTitle, mobileTitle);
        expect(cartItems, `Cart should contain the products '${laptopTitle}' and '${mobileTitle}`).toBe(true);
      });
    });

    await test.step("Click on 'Proceed to Checkout' button", async () => {
      await common.clickButton(playgroundData.buttons.checkout);
      const pageTitle = await common.getText(common.pageTitle);
      expect(pageTitle, `Page heading should be ${playgroundData.titles.payment}`).toBe(playgroundData.titles.payment);
    });

    await test.step(`Verify that Subtotal amount is equal to the total price of price of '${laptopTitle}' and '${mobileTitle}'`, async () => {
      const subtotal = await paymentPage.getSubtotal();
      expect(subtotal, `The Subtotal amount should be equal to the total price of '${laptopTitle}' and '${mobileTitle}'`).toBe(sumOfPrices);
    });
  });

  test("TC17 - Verify the continue shopping button after resetting the cart", async ({ common, homePage, shopPage, productDetailsPage, cartPage }) => {
    await test.step(`Select the first product under "New Arrivals"`, async () => {
      cartItemsCount = await common.getCount(homePage.cartItemsCount);
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

    await test.step("Click on 'Reset Cart' button", async () => {
      await common.clickButton(playgroundData.buttons.resetCart);
      const cartItemCount = await homePage.hasCountBecomeZero(homePage.cartItemsCount);
      expect(cartItemCount, "Number of items in the cart should be zero").toBe(true);
    });

    await test.step("Click on 'Continue Shopping' button", async () => {
      await common.clickButton(playgroundData.buttons.continueShopping);
      const isShopVisible = await shopPage.verifyMenuIsVisible();
      expect(isShopVisible, "Shop text should be displayed").toBe(true);
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

  test.skip("TC19 - Verify if the user is able to add the product to the wishlist", async ({ common, homePage, shopPage, productDetailsPage }) => {
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
      const successMessage = await productDetailsPage.getSuccessMessage();
      expect(successMessage, `Auto-disappearing banner content displayed at the top right side of the page should be '${playgroundData.messages.wishlistSuccess}'`).toBe(playgroundData.messages.wishlistSuccess);
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

  test.skip("TC20 - Verify if the user is able to add the product to the cart which is in wishlist", async ({ common, homePage, shopPage, productDetailsPage }) => {
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
      const successMessage = await productDetailsPage.getSuccessMessage();
      expect(successMessage, `Auto-disappearing banner content displayed at the top right side of the page should be '${playgroundData.messages.wishlistSuccess}'`).toBe(playgroundData.messages.wishlistSuccess);
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

  test.skip("TC21 - Verify if the user can reset the wishlist", async ({ common, homePage, shopPage, productDetailsPage }) => {
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
      const successMessage = await productDetailsPage.getSuccessMessage();
      expect(successMessage, `Auto-disappearing banner content displayed at the top right side of the page should be '${playgroundData.messages.wishlistSuccess}'`).toBe(playgroundData.messages.wishlistSuccess);
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

  test("TC22 - Verify user is able to update their profile", async ({ common, homePage, productDetailsPage, profilePage }) => {
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
      const successMessage = await productDetailsPage.getSuccessMessage();
      expect(successMessage, `Auto-disappearing banner content displayed at the top right side of the page should be '${playgroundData.messages.success}'`).toBe(playgroundData.messages.success);
    });
  });

  test("TC23 - Verify user is able to logout", async ({ homePage, productDetailsPage }) => {
    await test.step(`Click on profile icon > Click on ${playgroundData.texts.logout} > Verify the success message displayed`, async () => {
      await homePage.logOut(playgroundData.texts.logout, playgroundData.messages.logoutAlert);
      const successMessage = await productDetailsPage.getSuccessMessage();
      expect(successMessage, `Auto-disappearing banner content displayed at the top right side of the page should be '${playgroundData.messages.logoutSuccess}'`).toBe(playgroundData.messages.logoutSuccess);
    });
  });

});