module.exports = {
  clickElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      await page.click(selector);
    } catch (error) {
      throw new Error(`Selector is not clickable: ${selector}`);
    }
  },
  getText: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      return await page.$eval(selector, (link) => link.textContent);
    } catch (error) {
      throw new Error(`Text is not available for selector: ${selector}`);
    }
  },
  selectSeat: async function (page, row, seat) {
    const seatSelector = `.buying-scheme__row:nth-child(${row})
       .buying-scheme__chair:nth-child(${seat}`;
    try {
      await page.waitForSelector(seatSelector);
      await page.click(seatSelector);
    } catch (error) {
      throw new Error(`No seat selected via the selector: ${seatSelector}`);
    }
  },
};
