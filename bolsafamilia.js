const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
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

    puppeteerExtra.use(pluginStealth());
	const browser = await puppeteerExtra.launch({slowMo: 10});
    const page = await browser.newPage();
    try { 
        await page.goto(url, {waitUntil: 'load', timeout: 60000});
    } catch (error) {
        browser.close();
        console.log(error);
    }
    await page.waitForSelector('#lista tbody tr');
    let html = await page.content();
    let listaobj = []
    let pages = 0;
    
    while (true) {
        await page.waitFor(1500);
        let lista_temp = await scrape_page(html);
        listaobj.push(...lista_temp);
        pages += 1;
        
        const next_button = '#lista_paginate ul.pagination > li:nth-child(2)';
        await page.waitForSelector(next_button + ' a');
        const next_flag = $(next_button, html).hasClass('disabled');
        if ((!next_flag) && (pages < 10)) {
            try {
                await page.click(next_button + ' a');
                await page.waitForSelector('#lista tbody tr');
                html = await page.content();
            } catch (error) {
                console.log(error);
            }
        } else { break; }
    }
    
    console.log(listaobj.length);
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

        // console.log(t);
        lista.push(new Entry_data(m, s, c, t));
    }
    
    return lista;
}

/* * * * * * * * * * * * * */

main();