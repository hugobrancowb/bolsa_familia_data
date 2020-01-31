const puppeteer = require('puppeteer');
const $ = require('cheerio');

/* Objects */
function Entry_data(month, uf, city, total) {
    this.month = month;
    this.uf = uf;
    this.city = city;
    this.total = total;
};

/* Functions */
async function main() {
    const url = 'http://www.portaldatransparencia.gov.br/beneficios/consulta?paginacaoSimples=true&tamanhoPagina=&offset=&direcaoOrdenacao=asc&de=01%2F10%2F2019&ate=31%2F10%2F2019&tipoBeneficio=1&colunasSelecionadas=linkDetalhamento%2ClinguagemCidada%2CmesAno%2Cuf%2Cmunicipio%2Cvalor&ordenarPor=mesAno&direcao=desc';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.goto(url, { waitUntil: 'networkidle0' });
    await page.goto(url);
    await page.waitForSelector('#lista tbody tr');
    // await page.waitFor(2000);
    const html = await page.content();
    
    listaobj = await scrape_page(html);
    console.log(listaobj.length);
    
    next_button = '#lista_paginate ul.pagination > li:nth-child(2)';
    next_flag = await $('#lista_paginate ul.pagination > li:nth-child(2)', html).hasClass('disabled');

    if (!next_flag) {
        await page.click(next_button + ' a');
        await page.waitForSelector('#lista tbody tr');
        const html2 = await page.content();
        listaobj = await scrape_page(html2);
        console.log(listaobj.length);
    }

    browser.close();
}

async function scrape_page(html) {
    const month = await $('#lista tbody tr td.coluna-livre:nth-child(3) span', html);
    const state = await $('#lista tbody tr td.coluna-livre:nth-child(4) span', html);
    const city = await $('#lista tbody tr td.coluna-livre:nth-child(5) span', html);
    const total = await $('#lista tbody tr td.coluna-livre:nth-child(6) span', html);

    lista = []
    
    for (let i = 0; i < state.length; i++) {
        m_temp = $(month[i]).text();
        m_temp = m_temp.split("/");        
        t_temp = $(total[i]).text();
        t_temp = t_temp.substring(0, t_temp.length - 3).replace(".", "");
        
        const m = new Date(m_temp[1], m_temp[0] - 1);
        const s = $(state[i]).text();
        const c = $(city[i]).text();
        const t = parseFloat(t_temp);

        console.log(t);
        lista.push(new Entry_data(m, s, c, t));
    }
    
    return lista;
}

/* * * * * * * * * * * * * */

main();