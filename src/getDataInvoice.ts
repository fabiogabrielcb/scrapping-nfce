import puppeteer from "puppeteer"
import { puppeteerArgs } from "./puppeteerArgs"

export async function getDataInvoice(invoiceNumber: string) {
	// Start the timer
	console.time()

	if (invoiceNumber.length !== 44) throw new Error("Invalid invoice number")

	const browser = await puppeteer.launch({
		args: puppeteerArgs,
	})
	const page = await browser.newPage()

	await page.goto(
		`http://www4.fazenda.rj.gov.br/consultaNFCe/QRCode?p=${invoiceNumber}|2|1|1|d6a14779b9504cef8546b3d32a02a32a86076883`
	)
	await page.waitForNavigation()

	const totalValue = await page.$eval(
		".totalNumb.txtMax",
		(el) => (el as HTMLElement).innerText
	)
	const totalProducts = await page.$$("#tabResult tr")

	console.log(`Número da nota: ${invoiceNumber}`)
	console.log(`QTD de produtos: ${totalProducts?.length}`)
	console.log(`Total: R$${totalValue}\n`)

	// End the timer, to execute the code above
	console.timeEnd()

	await browser.close()
}
