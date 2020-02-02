const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const $ = require('cheerio');

/* Objects */
function Entry_data(month, uf, city, total) {
    // assign values for object
    this.month = month;
    this.uf = uf;
    this.city = city;
    this.total = total;
};

/* Functions */
async function main() {
    var list = [];
    var year = 2018;
    var month = ['02', '03']; // all months which data will be gathered from
    
    for (let i = 0; i < month.length; i++) {
        console.log('Mês: '+ month[i]); // pode apagar
        list_temp = await get_from_date(month[i], year); // returns a list of entries from the pages
        list.push(...list_temp);        
    }
    
    console.log('tamanho total: ' + list.length); // pode apagar
}

function save_json_file(list, name) {
    var jsonData = JSON.stringify(list);
    var fs = require('fs');
    
    fs.writeFile("data/raw/" + name + ".json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

async function get_from_date(month, year) {
    const url = 'http://www.portaldatransparencia.gov.br/beneficios/consulta?paginacaoSimples=true&tamanhoPagina=&offset=&direcaoOrdenacao=asc&de=01%2F' + month + '%2F' + year + '&ate=28%2F' + month + '%2F' + year + '&tipoBeneficio=1&colunasSelecionadas=linkDetalhamento%2ClinguagemCidada%2CmesAno%2Cuf%2Cmunicipio%2Cvalor&ordenarPor=mesAno&direcao=desc';

    puppeteerExtra.use(pluginStealth()); // incognito mode
    const browser = await puppeteerExtra.launch({
        slowMo: 10, // delays requests, preventing host to block puppeteer
        headless: false // shows browser window
    });    
    const page = await browser.newPage();
    try { 
        await page.goto(url, {waitUntil: 'load', timeout: 90000});
    } catch (error) {
        browser.close();
        console.log(error);
    }

    var pages = 1;
    var list = [];
    
    while (true) {
        await page.waitFor(2000);
        var html = await page.content();
        var list_temp = await scrape_page(html);
        list.push(...list_temp);
        
        let filename = year + '_' + month + '_' + 'page' + pages;
        save_json_file(list_temp, filename);
        pages += 1;
        
        console.log(pages + ' - ' + list.length); // pode apagar

        const next_button = '#lista_paginate ul.pagination > li:nth-child(2)';
        await page.waitForSelector(next_button + ' a');
        const next_flag = await $(next_button, html).hasClass('disabled');
       
        if ((!next_flag) && (pages < 2)) {
            try {
                await page.click(next_button + ' a');
            } catch (error) {
                console.log(error);
            }
        } else { break; }
    }

    browser.close();
    return list;
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

        lista.push(new Entry_data(m, s, c, t));
    }
    
    return lista;
}

/* * * * */

main();