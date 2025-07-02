import { test as base, expect, Page } from "@playwright/test";
import { Common } from "../pages/common";
import HomePage from "../pages/homePage";
import ShopPage from "../pages/shopPage";
import ComponentsPage from "../pages/componentsPage";
import ProductDetailsPage from "../pages/productDetailsPage";
// import CartPage from "../pages/cartPage";
// import ContactPage from "../pages/contactPage";
// import PaymentPage from "../pages/PaymentPage";
// import ProfilePage from "../pages/profilePage";
// import SignUpPage from "../pages/signUpPage";

type CustomFixture = {
    page: Page;
    common: Common;
    homePage: HomePage;
    shopPage: ShopPage;
    componentsPage: ComponentsPage;
    productDetailsPage: ProductDetailsPage;
    // cartPage: CartPage;
    // contactPage: ContactPage;
    // paymentPage: PaymentPage;
    // profilePage: ProfilePage;
    // signUpPage: SignUpPage;
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
    componentsPage: async ({ page }, use) => {
        const componentsPage = new ComponentsPage(page);
        await use(componentsPage);
    },
    productDetailsPage: async ({ page }, use) => {
        const productDetailsPage = new ProductDetailsPage(page);
        await use(productDetailsPage);
    },
    // cartPage: async ({ page }, use) => {
    //     const cartPage = new CartPage(page);
    //     await use(cartPage);
    // },
    // contactPage: async ({ page }, use) => {
    //     const contactPage = new ContactPage(page);
    //     await use(contactPage);
    // },
    // paymentPage: async ({ page }, use) => {
    //     const paymentPage = new PaymentPage(page);
    //     await use(paymentPage);
    // },
    // profilePage: async ({ page }, use) => {
    //     const profilePage = new ProfilePage(page);
    //     await use(profilePage);
    // },
    // signUpPage: async ({ page }, use) => {
    //     const signUpPage = new SignUpPage(page);
    //     await use(signUpPage);
    // }
});

export { expect };