const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const {
  Given,
  When,
  Then,
  Before,
  After,
  setDefaultTimeout,
} = require("cucumber");
const { getText, selectSeat, clickElement } = require("../../lib/commands.js");

setDefaultTimeout(60000);

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on the cinema schedule page", async function () {
  return await this.page.goto("http://qamid.tmweb.ru/client/index.php", {
    timeout: 20000,
  });
});

Given(
  "user is on the cinema schedule page with a taken seat",
  async function () {
    await this.page.goto("http://qamid.tmweb.ru/client/index.php");
    await clickElement(this.page, "a:nth-child(4)");
    await clickElement(
      this.page,
      ".movie-seances__time[href='#'][data-seance-id='243']",
    );
    await clickElement(
      this.page,
      ".buying-scheme__row .buying-scheme__chair_standart:not(.buying-scheme__chair_taken)",
    );
    await clickElement(this.page, ".acceptin-button");
    await getText(this.page, ".ticket__check-title");
    await clickElement(this.page, ".acceptin-button");
    await this.page.waitForSelector(".ticket__info-qr");

    await this.page.goto("http://qamid.tmweb.ru/client/index.php");
  },
);

When(
  "user selects day {int} and the film {string} at {string}",
  async function (dayIndex, film, time) {
    let seanceId;
    if (film === "Ведьмак") {
      seanceId = 225;
    } else {
      seanceId = 243;
    }
    await clickElement(this.page, `a:nth-child(${dayIndex})`);
    await clickElement(
      this.page,
      `.movie-seances__time[href='#'][data-seance-id='${seanceId}']`,
    );
  },
);

When("user selects seat {int} in row {int}", async function (seat, row) {
  await selectSeat(this.page, row, seat);
});

When('user clicks "Забронировать"', async function () {
  await clickElement(this.page, ".acceptin-button");
});

When("user tries to select the taken seat", async function () {
  await clickElement(
    this.page,
    ".buying-scheme__row .buying-scheme__chair_taken",
  );
});

Then("{int} seats are selected", async function (expectedCount) {
  const chairSelected = await this.page.$$(
    ".buying-scheme__row .buying-scheme__chair_selected",
  );
  expect(chairSelected.length).to.equal(expectedCount);
});
Then('the "book" button is active', async function () {
  const button = await this.page.$eval(".acceptin-button", (btn) =>
    btn.hasAttribute("disabled"),
  );
  expect(button).to.equal(false);
});

Then('the "book" button is disabled', async function () {
  const button = await this.page.$eval(".acceptin-button", (btn) =>
    btn.hasAttribute("disabled"),
  );
  expect(button).to.equal(true);
});

Then("a page opens with the text {string}", async function (expectedText) {
  const actualText = await getText(this.page, ".ticket__check-title");
  expect(actualText).to.contain(expectedText);
});
