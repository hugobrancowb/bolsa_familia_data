const puppeteer = require('puppeteer');
const $ = require('cheerio');

/* Objects */
function Entry_data(year, uf, city, total) {
    // assign values for object
    this.year = year;
    this.uf = uf;
    this.city = city;
    this.total = total;
};

/* Functions */
async function main() {
    var list = [];
    var year = ['2019']; // all years which data will be gathered from
    
    for (let i = 0; i < year.length; i++) {
        console.log('Ano: '+ year[i]); // pode apagar
        console.time('tempo total: ' + '_' + year[i]);
        list_temp = await get_from_date(year[i]); // returns a list of entries from the pages
        console.timeEnd('tempo total: ' + '_' + year[i]);
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

async function get_from_date(year) {
    const url = 'http://www.portaldatransparencia.gov.br/beneficios/consulta?paginacaoSimples=true&tamanhoPagina=&offset=&direcaoOrdenacao=asc&de=01%2F01%2F' + year + '&ate=31%2F12%2F' + year + '&tipoBeneficio=1&colunasSelecionadas=linkDetalhamento%2ClinguagemCidada%2CmesAno%2Cuf%2Cmunicipio%2Cvalor&ordenarPor=mesAno&direcao=desc';
    // const url = 'http://www.portaldatransparencia.gov.br/beneficios/consulta?paginacaoSimples=true&tamanhoPagina=&offset=&direcaoOrdenacao=asc&de=01%2F01%2F2015&ate=31%2F12%2F2015&tipoBeneficio=1&colunasSelecionadas=linkDetalhamento%2ClinguagemCidada%2CmesAno%2Cuf%2Cmunicipio%2Cvalor&ordenarPor=mesAno&direcao=desc';

    const browser = await puppeteer.launch({
        slowMo: 10, // delays requests, preventing host to block puppeteer
        headless: false // shows browser window
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

    try { 
        await page.goto(url, {waitUntil: 'load', timeout: 90000});
    } catch (error) {
        browser.close();
        console.log(error);
    }

    var pages = 1;
    var list = [];
    
    while (true) {
        await page.waitFor(3000);
        const next_button = '#lista_paginate ul.pagination > li:nth-child(2)';
        await page.waitForSelector(next_button);

        var html = await page.content();
        var list_temp = await scrape_page(html);
        list.push(...list_temp);
        
        let filename = year + '_' + 'page' + pages;
        save_json_file(list_temp, filename);
        
        console.log(pages + ' - ' + list.length); // pode apagar
        pages += 1;

        const next_flag = await $(next_button, html).hasClass('disabled');
       
        if ((!next_flag) && (pages < 5000)) {
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
    const year = await $('#lista tbody tr td.coluna-livre:nth-child(3) span', html);
    const state = await $('#lista tbody tr td.coluna-livre:nth-child(4) span', html);
    const city = await $('#lista tbody tr td.coluna-livre:nth-child(5) span', html);
    const total = await $('#lista tbody tr td.coluna-livre:nth-child(6) span', html);

    lista = []
    
    for (let i = 0; i < state.length; i++) {
        y_temp = $(year[i]).text();
        y_temp = y_temp.split("/");        
        t_temp = $(total[i]).text();
        t_temp = t_temp.substring(0, t_temp.length - 3).replace(".", "");
        
        const y = y_temp[1];
        const s = $(state[i]).text();
        const c = $(city[i]).text();
        const t = parseFloat(t_temp);

        lista.push(new Entry_data(y, s, c, t));
    }
    
    return lista;
}

/* * * * */

main();