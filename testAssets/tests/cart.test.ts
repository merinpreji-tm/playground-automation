import { test, expect } from "./customFixture";
import * as playgroundData from "../test-data/playground-data.json";
import * as env from "../test-data/env-test.json";

test.describe("Test the Playground web application", async () => {
  let newArrivalProductTitle = "";
  let cartItemsCount = 0;
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
});