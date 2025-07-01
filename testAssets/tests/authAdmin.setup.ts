import { test as setup } from '@playwright/test';
import * as playgroundData from "../test-data/playground-data.json";
import HomePage from '../pages/homePage';

const adminAuthFile = 'playwright/.auth.admin.json';

setup('AuthenticateAtSetUpAdmin', async ({ page }) => {
    const homepage = new HomePage(page);
    await homepage.launchBrowserAndLoginToApp(process.env.baseUrl, process.env.emailId, process.env.password, playgroundData.buttons.login);
    await page.context().storageState({ path: adminAuthFile });
    // await page.waitForTimeout(5000);
});