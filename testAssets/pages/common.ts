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

    async launchUrl(url: string) {
        await test.step("Launch the Playground website", async () => {
            await this.page.goto(url);
            await this.actions.waitForPageToLoad();
        });
    }
}