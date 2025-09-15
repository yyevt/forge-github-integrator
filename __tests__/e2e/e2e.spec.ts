import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import * as dotenv from "dotenv";

dotenv.config();

const ATLASSIAN_URL = process.env.ATLASSIAN_URL!;
const ATLASSIAN_EMAIL = process.env.ATLASSIAN_EMAIL!;
const ATLASSIAN_PASSWORD = process.env.ATLASSIAN_PASSWORD!;

jest.setTimeout(60000);

/**
 * N.B! Not all use cases are tested
 */
describe("Forge-Github Integrator Token setup page", () => {

    let driver: WebDriver;

    beforeAll(async () => {
        const options = new chrome.Options();
        driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("should log in and find Forge app message", async () => {
        await driver.get(ATLASSIAN_URL);

        const usernameInput = await driver.wait(until.elementLocated(By.name("username")), 15000);
        await driver.wait(until.elementIsVisible(usernameInput), 5000)
            .sendKeys(ATLASSIAN_EMAIL);

        await driver.findElement(By.id("login-submit"))
            .click();

        const passwordInput = await driver.wait(until.elementLocated(By.id("password")), 15000);
        await driver.wait(until.elementIsVisible(passwordInput), 5000)
            .sendKeys(ATLASSIAN_PASSWORD);

        await driver.findElement(By.id("login-submit"))
            .click();

        await driver.wait(until.urlContains("/jira/settings/apps/"), 20000);
        await driver.wait(until.titleContains("Forge GitHub Integrator"), 5000);

        const label = await driver.wait(until.elementLocated(By.xpath("//label[contains(text(), 'GitHub token')]")), 5000);
        expect(await label.isDisplayed()).toBe(true);

        const tokenInput = await driver.wait(until.elementLocated(By.name("token")), 5000);
        expect(await tokenInput.isDisplayed()).toBe(true);
        await tokenInput.sendKeys("ghp_111111111111111111111111111111111111");

        const saveButton = await driver.wait(until.elementLocated(By.xpath("//form//button")), 5000);
        expect(await saveButton.isDisplayed()).toBe(true);
        expect(await saveButton.getText()).toBe("Save");
        await saveButton.click();

        const alertDiv = await driver.wait(until.elementLocated(By.css("div[role='alert']")), 10000);
        await driver.wait(until.elementIsVisible(alertDiv), 5000);
    });
});
