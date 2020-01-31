const puppeteer = require('puppeteer');
const $ = require('cheerio');

const url = 'http://www.portaldatransparencia.gov.br/beneficios/consulta?paginacaoSimples=true&tamanhoPagina=&offset=&direcaoOrdenacao=asc&de=01%2F10%2F2019&ate=31%2F10%2F2019&tipoBeneficio=1&colunasSelecionadas=linkDetalhamento%2ClinguagemCidada%2CmesAno%2Cuf%2Cmunicipio%2Cvalor&ordenarPor=mesAno&direcao=desc';

scrape(url);

/* * * * * * * * * * * * * */

/* Objects */
function Entry_data(month, uf, city, total) {
    this.month = month;
    this.uf = uf;
    this.city = city;
    this.total = total;
};

/* Functions */
async function scrape(url_address) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url_address);
    // await page.waitFor(2000);
    const html = await page.content();

    const month = await $('#lista tbody tr td.coluna-livre:nth-child(3) span', html);
    const state = await $('#lista tbody tr td.coluna-livre:nth-child(4) span', html);
    const city = await $('#lista tbody tr td.coluna-livre:nth-child(5) span', html);
    const total = await $('#lista tbody tr td.coluna-livre:nth-child(6) span', html);

    lista = []
    
    for (let i = 0; i < state.length; i++) {
        const m = $(month[i]).text();
        const s = $(state[i]).text();
        const c = $(city[i]).text();
        t_temp = $(total[i]).text();
        t_temp = t_temp.substring(0, t_temp.length - 3).replace(".", "");
        const t = parseFloat(t_temp);

        lista.push(new Entry_data(m, s, c, t));
    }

    browser.close();
    return lista;
}