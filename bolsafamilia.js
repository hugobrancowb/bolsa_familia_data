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
    var year = ['2019', '2018', '2017', '2016', '2015', '2014', '2013']; // all years which data will be gathered from
    
    for (let i = 0; i < year.length; i++) {
        console.log('Ano: '+ year[i]); // pode apagar
        console.time('tempo total: ' + year[i]);
        await get_from_date(year[i]); // returns a list of entries from the pages
        console.timeEnd('tempo total: ' + year[i]);
    }
}

function save_json_file(list, name) {
    var jsonData = JSON.stringify(list);
    jsonData = jsonData.replace(/\},/g, "},\n");
    var fs = require('fs');
    
    fs.writeFile("data/raw/" + name + ".json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

async function get_from_date(year) {
    const url = 'http://www.portaldatransparencia.gov.br/beneficios/consulta?paginacaoSimples=true&tamanhoPagina=&offset=&direcaoOrdenacao=asc&de=01%2F01%2F' + year + '&ate=31%2F12%2F' + year + '&tipoBeneficio=1&colunasSelecionadas=linkDetalhamento%2ClinguagemCidada%2CmesAno%2Cuf%2Cmunicipio%2Cvalor&ordenarPor=mesAno&direcao=desc';

    const browser = await puppeteer.launch({
        // headless: false, // shows browser window
        'defaultViewport' : { 'width': 1440, 'height': 800 },
        slowMo: 10 // delays requests, preventing host to block puppeteer
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

    try { 
        await page.goto(url, {waitUntil: 'load', timeout: 90000});
    } catch (error) {
        browser.close();
        console.log(error);
    }

    let site = await page.content();
    // shows pagination numbers
    await page.waitFor(2000);
    await page.waitForSelector('div.botao__gera_paginacao_completa');
    await page.click('div.botao__gera_paginacao_completa');
    await page.waitForSelector('#lista tr.even', {visible: true, timeout: 30000});
    site = await page.content();
    
    let handle = [];
    while( handle.length < 50 ) { // avoids getting only 15 items per page
        await page.waitFor(2000);
        await page.waitForSelector('select.form-control', {visible: true, timeout: 90000});
        await page.select('select.form-control', '50');
        await page.waitForSelector('#lista tbody tr', {visible: true, timeout: 90000});
        site = await page.content();
        handle = await page.$$('#lista tbody tr', site);
    }
    delete site;
    delete handle;

    var size = 0;
    
    while ( true ) {
        let html = '';
        let list = [];
        let pagefield = [];
        while( (pagefield.length != 1) || (list.length == 0) ) {  // avoids pages not fully loaded
            await page.waitForSelector('#lista tbody tr', {visible: true, timeout: 90000});
            await page.waitFor(500);
            html = await page.content();
            list = await scrape_page(html);
            pagefield = await page.$$('#paginas-selecao-1-lista', html);
        }

        /* clean and format page numbers */
        let p = await $('div#lista_info', html);
        let ps = p.text().split(" ");
        let pv = ps.map(e => e.replace(/[.]/g, ""));
        let pages = parseInt(pv[1]);
    
        /* define max number of pages */
        if (typeof pagemax === 'undefined') {
            var pagemax = parseInt(pv[3]);
        }

        let filename = year + '_' + 'page' + pages;
        save_json_file(list, filename); // saves file
        
        size += list.length;
        console.log(pages + ' - ' + size);
        
        /* if it's not the last page... */
        if(pages < pagemax) {
            await page.focus('#paginas-selecao-1-lista');
            for (let index = 0; index < 4; index++) {                
                await page.keyboard.press('Backspace');
            }
            let n = pages + 1;
            let s = n.toString();
            await page.keyboard.type(s);
            await page.waitFor(500);
            await page.click('#botao-ir-para-a-pagina-lista');
        } else {
            break;
        }
    }

    await browser.close();
}

async function scrape_page(html) {
    const year = await $('#lista tbody tr td.coluna-livre:nth-child(3) span', html);
    const state = await $('#lista tbody tr td.coluna-livre:nth-child(4) span', html);
    const city = await $('#lista tbody tr td.coluna-livre:nth-child(5) span', html);
    const total = await $('#lista tbody tr td.coluna-livre:nth-child(6) span', html);

    lista = []
    
    for (let i = 0; i < state.length; i++) {            
        const y = $(year[i]).text();
        const s = $(state[i]).text();
        const c = $(city[i]).text();
        const t = $(total[i]).text();
        lista.push(new Entry_data(y, s, c, t));
    }
    
    return lista;
}

main();