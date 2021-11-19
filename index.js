const puppeteer = require('puppeteer')
const { reduce, min, sort } = require('ramda')

main()
// let seaweedPayedPrices = [6]
const desiredPrice = 5

async function main() {
  const connectOptions = {
    browserURL: 'http://127.0.0.1:21222',
    defaultViewport: null,
  }
  const browser = await puppeteer.connect(connectOptions)

  const pages = await browser.pages()
  const page = pages.find(page => page.url() === 'https://cointofish.io/market')

  await startBot(page)
}

const startBot = async (page) => {
  // await sortByPrice(page)
  // await filterByItems(page)
  // await filterBySeaweed(page)
  while (true) {
    await search(page)
    const currentLowestPrice = await getLowestPrice(page)

    // let lowestPayedPrice = reduce(min, +Infinity, seaweedPayedPrices)

    if (currentLowestPrice <= desiredPrice) {
      await tryToBuy(page)
      // seaweedPayedPrices.push(currentLowestPrice)
    }

    // lowestPayedPrice = reduce(min, +Infinity, seaweedPayedPrices)

    // if (currentLowestPrice === lowestPayedPrice) {
    //   const backButton = await page.$('#pagecontent > nav > button:nth-child(1)')
    //   if (backButton) {
    //     await backButton.click();
        
    //     await page.waitForSelector('#mr1004')
    //     const buttonToSell = await page.$('#mr1004')
    //     if (buttonToSell) {
    //       await buttonToSell.evaluate(button => button.click())

    //       await page.waitForSelector('#itemmarketprice')
    //       let lowestPayedPrice = reduce(min, +Infinity, seaweedPayedPrices)
    //       let priceValue = `${Number(lowestPayedPrice + 1).toString()}`
    //       await page.$eval('#itemmarketprice', (el, value) => el.value = value, priceValue)

    //       await page.waitForSelector('.confirmsellib')
    //       const sellButton = await page.$('.confirmsellib')
    //       await sellButton.evaluate(button => button.click())

    //       seaweedPayedPrices = sort((a, b) => (b - a), seaweedPayedPrices)
    //       seaweedPayedPrices.pop()
    //     }

    //     const marketButton = await page.$('#navbarNav > ul > li:nth-child(2) > a')
    //     await marketButton.evaluate(button => button.click())
    //     await sortByPrice(page)
    //     await filterByItems(page)
    //     await filterBySeaweed(page)
    //   }
    // }
  }
}

const sortByPrice = async (page) => {
  await page.select('#marketorders', '3')
}

const filterByItems = async (page) => {
  const button = await page.$('#itemsmarkets')
  await button.evaluate( button => button.click())
}

const filterBySeaweed = async (page) => {
  await page.select('#marketitems', '154')
}

const search = async (page) => {
  const button = await page.$('#searchmarketb')
  await button.evaluate( button => button.click())
}

const getLowestPrice = async (page) => {
  await page.waitForSelector('.pricefish')
  const item = await page.$('.pricefish')
  const price = await item.evaluate(item => item.textContent, item)
  return Number(price)
}

function delay(time) {
  return new Promise(function(resolve) { 
    setTimeout(resolve, time)
  })
}

const tryToBuy = async (page) => {
  await page.waitForSelector('.pricefish')
  const button = await page.$('.pricefish')
  await button.evaluate(button => button.click())

  await delay(300)
  const buyButton = await page.$('.buyitemshopmb')
  if (!buyButton) return
  await buyButton.evaluate(button => button.click())
}

const goToMyItems = async (page) => {
  const selector = '#pagecontent > div.container-fluid.fluidrework.px-0 > div > main > div > div.d-flex.justify-content-center.bd-highlight > div > div:nth-child(1) > div > span > div > a > div > div'
  const button = await page.$(selector)
  await button.evaluate( button => button.click())
} 
