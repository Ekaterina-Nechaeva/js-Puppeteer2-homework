const { expect } = require("chai");
const {
  clickElement,
  getText,
  selectSeat,
} = require("./lib/commands.js");


let page;

describe("Qamid.tmweb.ru tests", () => {
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://qamid.tmweb.ru/client/index.php");
    await page.setDefaultNavigationTimeout(0);
  });
  afterEach(() => {
    page.close();
  });

  test("Active booking button when selecting seats", async () => {
    await clickElement(page, "a:nth-child(3)");
    await clickElement(
      page,
      ".movie-seances__time[href='#'][data-seance-id='225']",
    );
    await selectSeat(page, 7, 5);
    await selectSeat(page, 7, 6);
    const chairSelected = await page.$$(
      ".buying-scheme__row .buying-scheme__chair_selected",
    );
    expect(chairSelected.length).to.equal(2);
    const button = await page.$eval(".acceptin-button", (btn) =>
      btn.hasAttribute("disabled"),
    );
    expect(button).to.equal(false);
  });

  test("Proceed to ticket confirmation", async () => {
    await clickElement(page, "a:nth-child(2)");
    await clickElement(
      page,
      ".movie-seances__time[href='#'][data-seance-id='225']",
    );
    await selectSeat(page, 7, 5);
    await selectSeat(page, 7, 6);
    await clickElement(page, ".acceptin-button");
    const actual = await getText(page, ".ticket__check-title");
    expect(actual).to.contain("Вы выбрали билеты:");
  });

  test("Cannot select an already taken seat", async () => {
    await clickElement(page, "a:nth-child(4)");
    await clickElement(
      page,
      ".movie-seances__time[href='#'][data-seance-id='243']",
    );
    await clickElement(
      page,
      ".buying-scheme__row .buying-scheme__chair_standart:not(.buying-scheme__chair_taken)",
    );
    await clickElement(page, ".acceptin-button");
    await getText(page, ".ticket__check-title");
    await clickElement(page, ".acceptin-button");
    await page.waitForSelector(".ticket__info-qr");

    await page.goto("http://qamid.tmweb.ru/client/index.php");
    await clickElement(page, "a:nth-child(4)");
    await clickElement(
      page,
      ".movie-seances__time[href='#'][data-seance-id='243']",
    );
    await clickElement(page, ".buying-scheme__row .buying-scheme__chair_taken");
    const chairSelected = await page.$$(
      ".buying-scheme__row .buying-scheme__chair_selected",
    );
    expect(chairSelected.length).to.equal(0);
    const button = await page.$eval(".acceptin-button", (btn) =>
      btn.hasAttribute("disabled"),
    );
    expect(button).to.equal(true);
  });
});
