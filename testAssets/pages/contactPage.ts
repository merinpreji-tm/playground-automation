import { Locator, Page } from "@playwright/test";
import { Common } from "./common";

class ContactPage extends Common {
    nameField: Locator;
    emailField: Locator;
    successMessage: Locator;

    constructor(public page: Page){
        super(page);
        this.nameField = this.page.locator(`//p[text()="Name"]/following-sibling::input`);
        this.emailField = this.page.locator(`//input[@type="email"]`);
        this.successMessage = this.page.locator('//p[contains(@class,"text-green-500")]');
    }

    /**
     * Method to submit contact details by clicking 'Post' button after entering name, email and message
     * @param name 
     * @param email 
     * @param messages 
     * @param button 
     */
    async submitContactForm(name: string, email: string, messages: string, button: string){
        await this.actions.typeText(this.nameField, name, "Name field");
        await this.actions.typeText(this.emailField, email, "Email Address field");
        await this.actions.typeText(this.textarea, messages, "Messages field");
        await this.clickButton(button);
    }

    /**
     * Method to verify success message contains the submitted name and email
     * @param name 
     * @param email 
     * @returns true if success message contains the submitted name and email
     */
    async verifySuccessMessage(name: string, email: string){
        const successMessage = await this.successMessage.innerText();
        return successMessage.includes(name) && successMessage.includes(email);
    }
    
}
export default ContactPage;