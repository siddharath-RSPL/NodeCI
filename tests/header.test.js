const puppeteer = require("puppeteer");

let browser, page;

beforeEach(async () => {
  jest.setTimeout(30000);

  browser = await puppeteer.launch({
    headless: false,
    args:['--no-sandbox']
  });
  page = await browser.newPage();
  await page.goto("localhost:3000");
});

afterEach(async () => {
 // await browser.close();
});

test("the header has the correct text", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
}, 10000);

test('clicking login starts oauth flow',async ()=>{
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);

})
test('when signed in, shows logout button',async ()=>{
    const id = '5f0e6c5f5c9b9d1c3c3b6d9f';
    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport:{
            user:id
        }
    }
    const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

    const Keygrip = require('keygrip');
    const keys = require('../config/keys');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session='+sessionString);

    await page.setCookie({name:'session',value:sessionString});
    await page.setCookie({name:'session.sig',value:sig});
    await page.goto('localhost:3000');
    await page.waitFor('a[href="/auth/logout"]');
    const text = await page.$eval('a[href="/auth/logout"]',el=>el.innerHTML);
    expect(text).toEqual('Logout');
});






