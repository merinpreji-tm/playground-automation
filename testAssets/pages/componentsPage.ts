import { Locator, Page} from "@playwright/test";
import { Common } from "./common";

class ComponentsPage extends Common {
    pageTitle: Locator;
    learnMoreLink: (value: any) => any;

    constructor(public page: Page){
        super(page);
        this.pageTitle = this.page.locator(`//h1`);
        this.learnMoreLink = (cardTitle) => this.page.locator(`//h2[text()="${cardTitle}"]/following-sibling::a[text()="Learn more"]`);
    }

    /**
     * Method to click 'Learn More' in card
     * @param cardTitle 
     */
    async clickLearnMore(cardTitle: string){
        await this.actions.clickOn(this.learnMoreLink(cardTitle), `${cardTitle}`);
    }

    /**
     * Method to verify that 'Open Pop Window' button is displayed
     * @param text
     * @returns 
     */
    async isOpenPopWindowButtonVisible(text: string) {
        await this.actions.waitForPageToLoad();
        return await this.button(text).isVisible();
    }
}
export default ComponentsPage;