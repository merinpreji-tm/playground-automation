import { Locator, Page, test } from "@playwright/test";
import { Common } from "./common";

class PaymentPage extends Common {
    checkbox: Locator;
    nameField: Locator;
    emailField: Locator;
    addressField: Locator;
    phoneNumberField: Locator;
    successMessage: Locator;
    subtotal: Locator;

    constructor(public page: Page){
        super(page);
        this.checkbox = this.page.locator(`//input[@type="checkbox"]`);
        this.nameField = this.page.locator(`//input[@name="fullName"]`);
        this.emailField = this.page.locator(`//input[@name="email"]`);
        this.phoneNumberField = this.page.locator('//input[@name="phone"]');
        this.successMessage = this.page.locator('//div[contains(@class, "text-green-700")]/span');
        this.subtotal = this.page.locator(`//span[text()="Subtotal:"]/following-sibling::span`);
    }

    /**
     * Method to place order. Enter 'Name', 'Email', 'Address', 'Phone' and click on 'Place Order'
     * @param name 
     * @param email 
     * @param address 
     * @param phone 
     * @param button 
     */
    async placeOrder(name: string, email: string, address: string, phone: string, button: string){
        await this.actions.typeText(this.nameField, name, "Name field");
        await this.actions.typeText(this.emailField, email, "Email Address field");
        await this.actions.typeText(this.textarea, address, "Address field");
        await this.actions.typeText(this.phoneNumberField, phone, "Phone Number field");
        await this.clickButton(button);
    }

    /**
     * Method to check whether the 'Cash on Delivery' payment option in Payment Gateway is checked and disabled
     * @returns true if 'Cash on Delivery' payment option in Payment Gateway is checked and disabled
     */
    async verifyPaymentOption() {
        const isChecked = await this.checkbox.isChecked();
        const isDisabled = await this.checkbox.isDisabled();
        return isChecked && isDisabled;
    }

    async getSubtotal(){
        return await test.step(`Get the subtotal of cart items`, async () => {
            await this.actions.waitForPageToLoad();
            const subtotalText = await this.subtotal.innerText();
            const subtotal = parseFloat(subtotalText.replace(/[^\d.]/g, ""));
            return subtotal;
        })
    }
    
}
export default PaymentPage;