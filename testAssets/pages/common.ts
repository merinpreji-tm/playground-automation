import { Locator, Page, test } from "@playwright/test";
import Actions from "../../helper/actions";

export class Common {
    actions: Actions;
    liText: (value: any) => any;
    ptag: Locator;
    ptagText: (value: any) => any; 
    inputField: (value: any) => any;
    navigationMenu: (value: any) => any;
    button: (value: any) => any;
    h1Tag: Locator;
    h1Text: (value: any) => any;
    pageTitle: Locator;
    textarea: Locator;

    constructor(public page: Page){
        this.actions = new Actions(this.page);
        this.liText = (text) => this.page.locator(`//ul[contains(@class,"absolute")]//li[text()="${text}"]`);
        this.ptag = this.page.locator(`//p`);
        this.ptagText = (text) => this.page.locator(`//p[contains(text(),"${text}")]`);
        this.inputField = (value) => this.page.locator(`//input[@id="${value}"]`);
        this.navigationMenu = (menu) => this.page.locator(`//a[text()="${menu}"]`);
        this.button = (text) => this.page.locator(`//button[contains(text(),"${text}")]`);
        this.h1Tag = this.page.locator(`//h1`);
        this.h1Text = (text) => this.page.locator(`//h1[text()="${text}"]`);
        this.pageTitle = this.page.locator(`//h1[contains(@class,"font-bold")]`);
        this.textarea = this.page.locator(`//textarea`);
    }

    /**
     * Method to launch url
     * @param {string} url
    */
    async launchUrl(url: string) {
        await test.step("Launch the Playground website", async () => {
            await this.page.goto(url);
            await this.actions.waitForPageToLoad();
        });
    }

    /**
     * Method to click a button
     * @param {string}
    */
    async clickButton(text: string) {
        await this.actions.clickButton(this.button(text), `${text}`);
    }

    /**
     * Method to click navigation menu
     * @param {string} menu
    */
    async clickNavigationMenu(menu: string) {
        await this.actions.clickOn(this.navigationMenu(menu), `Navigation menu '${menu}'`);
    }
 
    /**
     * Method to get text inside a locator
     * @param {Locator} locator
     * @returns text inside the locator
    */
    async getText(locator: Locator){
        await this.actions.waitForPageToLoad();
        return await locator.innerText();
    }

    /**
     * Method to get number inside a locator
     * @param locator 
     * @returns text inside the locator as integer
     */
    async getCount(locator: Locator){
        const count = await locator.innerText();
        return parseInt(count.trim());
    }
}