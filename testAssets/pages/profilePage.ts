import { Locator, Page, test } from "@playwright/test";
import { Common } from "./common";

class ProfilePage extends Common {
    pageHeading: Locator;
    nameField: Locator;
    genderDropdown: Locator;
    countryField: Locator;
    bioField: Locator;

    constructor(public page: Page){
        super(page);
        this.pageHeading = this.page.locator(`//h2[contains(@class,"font-bold")]`);
        this.nameField = this.page.locator(`//input[@name="fullName"]`);
        this.genderDropdown = this.page.locator(`//select[@name="gender"]`);
        this.countryField = this.page.locator(`//input[@name="country"]`);
        this.bioField = this.page.locator(`//textarea[@name="bio"]`);
    }

    /**
     * Method to check whether gender is selected
     * @param option 
     * @returns 
     */
    async isGenderSelected(option: string) {
        const selectedOption = await this.genderDropdown.inputValue();
        return selectedOption === option;
    }

    /**
     * Method to select a particular gender
     * @param gender 
     */
    async selectGender(gender: string) {
        await test.step(`Select '${gender}' from the gender dropdown`, async () => {
            const isGenderSelected = await this.isGenderSelected(gender);
            if(isGenderSelected === false){
                await this.genderDropdown.selectOption(gender);
            }
        });
    }

    /**
     * Method to edit name, email, country and bio in profile
     * @param name 
     * @param gender 
     * @param country 
     * @param bio 
     * @param button 
     */
    async editProfile(name: string, gender: string, country: string, bio: string, button: string){
        await this.actions.clearAndType(this.nameField, name, "Name field");
        await this.selectGender(gender)
        await this.actions.clearAndType(this.countryField, country, "Country field");
        await this.actions.clearAndType(this.bioField, bio, "Bio field");
        await this.clickButton(button);
    }
}
export default ProfilePage;