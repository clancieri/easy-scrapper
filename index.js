const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();

  await page.goto("https://www.easy.com.ar");

  await page.type("#SimpleSearchForm_SearchTerm", "termo");

  await page.click("#WC_CachedHeaderDisplay_button_1");
  await page.waitForSelector(".thumb-name");
  await page.waitForTimeout(2000);

  const enlaces = await page.evaluate(() => {
    const elements = document.querySelectorAll(".thumb-name a");

    const links = [];
    for (let element of elements) {
      links.push(element.href);
    }
    return links;
  });

  const termos = [];
  for (let enlace of enlaces) {
    await page.goto(enlace);
    await page.waitForSelector(".prod-title");

    const termo = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document.querySelector(".prod-title").innerText;
      tmp.price = document.querySelector(".price-e").innerText;

      return tmp;
    });
    termos.push(termo);
  }
  console.log(termos);
  await browser.close();
})();
