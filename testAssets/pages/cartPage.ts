import { Locator, Page, expect } from "@playwright/test";
import { Common } from "./common";
import * as env from "../test-data/env-test.json";

class CartPage extends Common {
    pageTitle: Locator;
    quantity: (value: any) => any;
    plusButton: (value: any) => any;
    minusButton: (value: any) => any;
    price: (value: any) => any;
    productTitles: Locator;

    constructor(public page: Page){
        super(page);
        this.pageTitle = this.page.locator(`//h1[contains(@class,"text-primeColor")]`);
        this.quantity = (productName) => this.page.locator(`(//h1[text()="${productName}"]/../..//p)[1]`);
        this.price = (productName) => this.page.locator(`(//h1[text()="${productName}"]/../..//p)[2]`);
        this.plusButton = (productName) => this.page.locator(`//h1[text()="${productName}"]/../..//span[text()="+"]`);
        this.minusButton = (productName) => this.page.locator(`//h1[text()="${productName}"]/../..//span[text()="-"]`);
        this.productTitles = this.page.locator(`//h1[@class="font-titleFont font-semibold"]`);
    }

    /**
     * Method to click + button
     * @param productName 
     */
    async clickPlusButton(productName: string) {
        await this.actions.clickButton(this.plusButton(productName), "+");
    }

    /**
     * Method to click - button
     * @param productName 
     */
    async clickMinusButton(productName: string) {
        await this.actions.clickButton(this.minusButton(productName), "-");
    }

    /**
     * Method to get quantity of product
     * @param productName 
     * @returns quantity of product as integer
     */
    async getProductQuantity(productName: string){
        const productQuantity = await this.quantity(productName).innerText();
        return parseInt(productQuantity);
    }

    /**
     * Method to get the price of a product
     * @param productName 
     * @returns price price of the product as a number (float)
     */
    async getProductPrice(productName: string){
        const priceText = await this.price(productName).innerText();
        const productPrice = parseFloat(priceText.replace(/[^\d.]/g, ""));
        return productPrice;
    }

    /**
     * Method to increase quantity of a product
     * @param count 
     * @param productName 
     */
    async increaseItemCount(count: number, productName: string) {
        const initialQuantity = await this.getProductQuantity(productName);
        for (let i = 0; i < count; i++) {
            await this.clickPlusButton(productName);
            // Wait until quantity increases
            await expect.poll(async () => {
                return await this.getProductQuantity(productName);
            }, {
                timeout: env.waitFor.HIGH,
                message: `Product quantity did not increase after clicking '+'`
            }).toBe(initialQuantity + i + 1);
        }
    }

    /**
     * Method to decrease quantity of a product
     * @param count 
     * @param productName 
     */
    async decreaseItemCount(count: number, productName: string) {
        const initialQuantity = await this.getProductQuantity(productName);
        for (let i = 0; i < count; i++) {
            await this.clickMinusButton(productName);
            // Wait until quantity decreases
            await expect.poll(async () => {
                return await this.getProductQuantity(productName);
            }, {
                timeout: env.waitFor.HIGH,
                message: `Product quantity did not decrease after clicking '-'`
            }).toBe(initialQuantity - i - 1);
        }
    }

    /**
     * Method to check items added in cart
     * @param expectedProducts 
     * @returns 
     */
    async verifyCartItems(...expectedProducts: string[]) {
        const actualTitles = await this.productTitles.allInnerTexts();
        return expectedProducts.every(expected => actualTitles.some(title => title.includes(expected)));
    }
}
export default CartPage;