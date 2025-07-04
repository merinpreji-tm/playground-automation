import { Locator, Page} from "@playwright/test";
import { Common } from "./common";

class ProductDetailsPage extends Common {
    productTitle: Locator;

    constructor(public page: Page){
        super(page);
        this.productTitle = this.page.locator(`//h1[contains(@class,"font-extrabold")]`);
    }

    /**
     * Method to verify that the success message is one of the expected messages
     * @param validMessages 
     * @returns true if success message matches one of the expected messages
     */
    async verifySuccessMessage(validMessages: string[]) {
        const actualMessage = await this.getText(this.successMessage);
        const isValid = validMessages.some(msg => actualMessage.includes(msg));
        return isValid;
    }
}
export default ProductDetailsPage;