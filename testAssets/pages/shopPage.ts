import { Locator, Page} from "@playwright/test";
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

    /**
     * Method to click a filter dropdown
     * @param filter 
     */
    async clickFilter(filter: string) {
        await this.actions.clickDropdown(this.filter(filter), `Shop by ${filter}`);
    }

    /**
     * Method to click on a product
     * @returns title of the product
     */
    async clickProduct() {
        const title = await this.productTitle.nth(1).innerText();
        await this.actions.clickOn(this.product.nth(1), `Product: ${title}`);
        return title;
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
        await this.clickFilter(filter);
        await this.actions.scrollDownToTargetLocator(this.filterOption(option));
        await this.actions.clickCheckBox(this.filterOption(option), `${option}`);
    }

     /**
     * Method to verify the products are displayed according to applied filter
     * @param {string} filter
     * @param {string} option
     * @returns true if tite of the product contains the selected filter option
    */
    async verifyFilterResults(filter: string, option: string) {
        const titleCount = await this.productTitle.count();
        for (let i = 0; i < titleCount; i++) {
            const titleText = await this.productTitle.nth(i).innerText();
            if (!titleText.includes(option)) {
                return false;
            }
        }
        return true;
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

    /**
     * Method to verify that products are displayed in Grid view
     * @returns true if products are displayed in Grid view
     */
    async isGridViewDisplayed() {
        const classAttribute = await this.productsDiv.getAttribute("class");
        if (!classAttribute) return false;
        const expectedClasses = ["md:grid-cols-2", "xl:grid-cols-3", "gap-6"];
        const isGridView = expectedClasses.every(cls => classAttribute.includes(cls));
        return isGridView;
    }

    /**
     * Method to verify that products are displayed in List view
     * @returns true if products are displayed in List view
     */
    async isListViewDisplayed() {
        const classAttribute = await this.productsDiv.getAttribute("class");
        if (!classAttribute) return false;
        const expectedClasses = ["gap-4"];
        const isListView = expectedClasses.every(cls => classAttribute.includes(cls));
        return isListView;
    }

    /**
     * Method to toggle the product view between List and Grid
     */
    async changeProductView() {
        const isCurrentlyGrid = await this.isGridViewDisplayed();
        const targetView = isCurrentlyGrid ? "List" : "Grid";
        await this.actions.clickOn(this.productViewIcon, `${targetView} View Icon`);
    }
}
export default ShopPage;