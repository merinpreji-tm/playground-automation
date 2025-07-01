import { Locator, Page, test } from "@playwright/test";
import { Common } from "./common";

class ShopPage extends Common {
    menu: Locator;
    filter: (value: any) => any;
    filterOption: (value: any) => any;
    product: Locator;
    productTitle: Locator;
    productPrice: Locator;
    productViewIcon: Locator;
    productsDiv: Locator;

    constructor(public page: Page) {
        super(page);
        this.menu = this.page.locator(`//span[text()="shop"]`);
        this.filter = (value) => this.page.locator(`//span[contains(text(),"${value}")]`);
        this.filterOption = (option) => this.page.locator(`//label[text()="${option}"]`);
        this.product = this.page.locator(`//div[@class="w-full"]//img`);
        this.productTitle = this.page.locator(`//div[@class="w-full"]//h2`);
        this.productPrice = this.page.locator(`//div[@class="w-full"]//p[contains(@class,"text-xl")]`);
        this.productViewIcon = this.page.locator(`//button[contains(@class,"rounded-lg bg-gray-200")]`);
        this.productsDiv = this.page.locator(`//div[@class="w-full"]/parent::div[contains(@class,"grid")]`);
    }

    async clickFilter(filter: string) {
        await this.actions.clickDropdown(this.filter(filter), `Shop by ${filter}`);
    }

    /**
     * Method to verify the selected menu is displayed
     * @returns true if selected menu text is visible
    */
    async verifyMenuIsVisible() {
        await this.actions.waitForPageToLoad();
        return await this.menu.isVisible();
    }

    /**
     * Method to verify the name and price of products displayed
     * @param {Array} products
     * @returns true if name and price of product matches
    */
    async verifyProductNameAndPrice(products: { [key: string]: string }[]) {
        let allMatch = true;
        let index = 0;
        for (const obj of products) {
            for (const [key, value] of Object.entries(obj)) {
                const actualName = await this.productTitle.nth(index).innerText();
                const actualPrice = await this.productPrice.nth(index).innerText();
                if (!actualName.includes(key) || !actualPrice.includes(value)) {
                    allMatch = false;
                }
                index++;
            }
        }
        return allMatch;
    }

    /**
     * Method to apply filter in shop section
     * @param {string} filter
     * @param {string} option
    */
    async applyFilter(filter: string, option: string) {
        await test.step(`Select '${option}' under ${filter} filter`, async () => {
            await this.clickFilter(filter);
            await this.actions.scrollDownToTargetLocator(this.filterOption(option));
            await this.actions.clickCheckBox(this.filterOption(option), `${option}`);
        });
    }

     /**
     * Method to verify the products are displayed according to applied filter
     * @param {string} filter
     * @param {string} option
     * @returns true if tite of the product contains the selected filter option
    */
    async verifyFilterResults(filter: string, option: string) {
        return await test.step(`Verify that products are of ${filter} '${option}'`, async () => {
            const titleCount = await this.productTitle.count();

            for (let i = 0; i < titleCount; i++) {
                const titleText = await this.productTitle.nth(i).innerText();

                if (!titleText.includes(option)) {
                    return false;
                }
            }
            return true;
        });
    }
    
    /**
     * Method to verify filter applied in shop section
     * @param {string} filter
     * @param {string} option
    */
    async verifyAppliedFilter(filter: string, option: string) {
        await this.clickFilter(filter);
        await this.actions.scrollDownToTargetLocator(this.filterOption(option));
        const checkBox = await this.filterOption(option);
        return await checkBox.isChecked();
    }
}
export default ShopPage;