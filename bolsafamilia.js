const puppeteer = require('puppeteer');
const $ = require('cheerio');

const url = 'http://www.portaldatransparencia.gov.br/beneficios/consulta?paginacaoSimples=true&tamanhoPagina=&offset=&direcaoOrdenacao=asc&de=01%2F10%2F2019&ate=31%2F10%2F2019&tipoBeneficio=1&colunasSelecionadas=linkDetalhamento%2ClinguagemCidada%2CmesAno%2Cuf%2Cmunicipio%2Cvalor&ordenarPor=mesAno&direcao=desc';

async function scrape(url_address) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url_address);
    await page.waitFor(2000);
    const html = await page.content();

    const el = await $('#lista tbody tr td.coluna-livre:nth-child(2) span', html); // select only values from a span which the only content is the string "Bolsa Família", 15 of them.

    console.log(el.length);

    browser.close();
}

scrape(url);