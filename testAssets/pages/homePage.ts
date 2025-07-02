import { Locator, Page, test, expect } from "@playwright/test";
import { Common } from "./common";
import * as env from "../test-data/env-test.json";

class HomePage extends Common {
    profileIcon: Locator;
    searchBar: Locator;
    product: Locator;
    productTitle: Locator;
    shopNowButton: (value: any) => any;
    newArrivalProduct: Locator;
    newArrivalProductTitle: Locator;
    cartItemsCount: Locator;
    wishlistItemsCount: Locator;
    wishlistIcon: Locator;

    constructor(public page: Page){
        super(page);
        this.profileIcon = this.page.locator(`(//div[@class="relative"])[2]`);
        this.searchBar = this.page.locator(`//input[@placeholder="Search your products here"]`);
        this.product = this.page.locator(`(//div[contains(@class,"gap-8 p-10")])[1]`);
        this.productTitle = this.page.locator(`(//p[contains(@class,"font-semibold text-lg")])[1]`);
        this.shopNowButton = (category) => this.page.locator(`//h2[text()="${category}"]/..//button[text()="Shop Now"]`);
        this.newArrivalProduct = this.page.locator(`//div[text()="New Arrivals"]/..//div[@data-index="0"]`);
        this.newArrivalProductTitle = this.page.locator(`//div[text()="New Arrivals"]/..//div[@data-index="0"]//h2`);
        this.cartItemsCount = this.page.locator(`//a[@href="/cart"]//span`);
        this.wishlistItemsCount = this.page.locator(`//a[@href="/wishlist"]//span`);
        this.wishlistIcon = this.page.locator(`//a[@href="/wishlist"]`);
    }

    /**
     * Method to click profile icon in home page
    */
    async clickProfileIcon() {
        await this.actions.clickOn(this.profileIcon, "Profile Icon");
    }

    /**
     * Method to click 'Shop Now' button
     * @param category 
     */
    async clickShopNow(category: string) {
        await this.actions.clickButton(this.shopNowButton(category), "Shop Now");
    }

    /**
     * Method to click the first product under 'New Arrivals' section
     * @param productTitle 
     */
    async clickNewArrivalProduct(productTitle: string) {
        await this.actions.clickOn(this.newArrivalProduct, `First product under 'New Arrivals' section: ${productTitle}`);
    }

    /**
     * Method to type email and password
     * @param email 
     * @param password 
     */
    async enterEmailIdAndPassword(email: string, password: string) {
        await this.actions.typeText(this.inputField("email"), email, "Email Address field");
        await this.actions.typeText(this.inputField("password"), password, "Password field");
    };

    /**
     * Method to login to playground by valid email and password
     * @param {string} email
     * @param {string} password
     * @param {string} text
    */
    async logIn(email: string, password: string, text: string) {
        await this.clickProfileIcon();
        await this.actions.clickOn(this.liText(text), `${text}`);
        await this.actions.waitForPageToLoad();
        await this.enterEmailIdAndPassword(email, password);
        await this.clickButton(text);
        console.log("Logged in successfully");
        await this.actions.waitForElementToBeDisappear(this.ptagText("Login to your account"));
    };

    /**
     * Method to launch and login to the application
     * @param {string} url
     * @param {string} email
     * @param {string} password
     * @param {string} text
    */
    async launchBrowserAndLoginToApp(url: any, email: any, password: any, text: string){
        await this.launchUrl(url);
        await this.logIn(email, password, text);
    }

     /**
      * Method to check whether profile shortcut is visible
      * @param {string} text
      */
    async verifyProfileShortcutIsVisible(text: string){
        await this.actions.waitForPageToLoad();
        return await this.ptagText(text).isVisible();
    }

    /**
     * Method to select category under 'Shop by Category' in home page
     * @param {string} sideMenu
     * @param {string} category
     */
    async selectCategory(sideMenu: string, category: string){
        await this.actions.clickOn(this.ptagText(sideMenu), `${sideMenu}`);
        await this.actions.clickOn(this.liText(category), `${category}`);
    }

    /**
     * Method to search a product in the search bar
     * @param searchTerm 
     * @returns product title shown when
     */
    async searchProduct(searchTerm: string){
        await this.actions.typeText(this.searchBar, searchTerm, "Search Bar");
        const productTitle = await this.getText(this.productTitle);
        await this.actions.clickOn(this.product, "First product");
        return productTitle;
    }


    /**
     * Method to check whether cart/wishlist count has increased
     * @param previousCount 
     * @param locator 
     * @returns true if count has increased
     */
    async hasCountIncreased(previousCount: number, locator: Locator) {
        try {
            await expect.poll(
                async () => await this.getCount(locator),
                {
                    timeout: env.waitFor.HIGH,
                    message: "Waiting for count to increase"
                }
            ).toBeGreaterThan(previousCount);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Method to check whether cart/wishlist count has become zero
     * @param locator 
     * @returns true if count has become zero
     */
    async hasCountBecomeZero(locator: Locator) {
        try {
            await expect.poll(
                async () => await this.getCount(locator),
                {
                    timeout: env.waitFor.HIGH,
                    message: "Waiting for count to become zero",
                }
            ).toBe(0);
            return true;
        } catch (error) {
            return false;
        }
    }
}
export default HomePage;