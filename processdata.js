var fs = require("fs");

var contents = fs.readFileSync("data/alldata.json");
var jsonContent = JSON.parse(contents);
var lista_estados_year = [];
var lista_year = [];
var dezembros = []
var count = 1;

jsonContent.forEach(el => {

    let t = el.total.replace(/[.]/g, "");
    t = t.replace(/[,]/g, ".");
    let y = el.year.split('/');

    let entry1 = {
        uf: el.uf,
        total: parseFloat(t),  
        year: parseInt(y[1])
    };

    let entry2 = {
        total: parseFloat(t),  
        year: parseInt(y[1])
    };
    
    let entry3 = {
        total: parseFloat(t),  
        month: parseInt(y[0]),
        year: parseInt(y[1])
    };

    /* ARRAY: pagamentos a cada estado durante 2019 */
    if (entry1.year == 2019) {
        let i = lista_estados_year.findIndex( obj => (obj.year == entry1.year) && (obj.uf == entry1.uf) );
        if (i == -1) { // if year doesn't exist, add it as new element to the array
        lista_estados_year.push(entry1);
        } else { // if year already exists, sum it to the current value
            lista_estados_year[i].total += entry1.total;
        }
    }
    
    /* ARRAY: pagamentos para o país inteiro a cada ano */
    let j = lista_year.findIndex( obj => (obj.year == entry2.year) );
    if (j == -1) { // if year doesn't exist, add it as new element to the array
        lista_year.push(entry2);
    } else { // if year already exists, sum it to the current value
        lista_year[j].total += entry2.total;
    }

    /* ARRAY: pagamentos para o país inteiro a cada dezembro/ano */
    if (entry3.month == 12) {
        let k = dezembros.findIndex( obj => (obj.year == entry3.year) );
        if (k == -1) { // if year doesn't exist, add it as new element to the array
            dezembros.push(entry3);
        } else { // if year already exists, sum it to the current value
            dezembros[k].total += entry3.total;
        }
    }
    
    console.log(count + '/467826');
    count += 1;
});

/* ARRAY: total em cada região durante 2019 */
var regioes_2019 = {n: 0, ne: 0, se: 0, s: 0, co: 0};

lista_estados_year.map(e => {
    /* centro oeste */
    if ((e.uf == 'DF') || (e.uf == 'GO') || (e.uf == 'MS') || (e.uf == 'MT')) {
        regioes_2019.co += e.total;
    }

    /* nordeste */
    if ((e.uf == 'AL') || (e.uf == 'BA') || (e.uf == 'CE') || (e.uf == 'MA') || (e.uf == 'PB') || (e.uf == 'PE') || (e.uf == 'PI') || (e.uf == 'RN') || (e.uf == 'SE')) {
        regioes_2019.ne += e.total;
    }

    /* norte */
    if ((e.uf == 'AC') || (e.uf == 'AM') || (e.uf == 'AP') || (e.uf == 'PA') || (e.uf == 'RO') || (e.uf == 'RR') || (e.uf == 'TO')) {
        regioes_2019.n += e.total;
    }

    /* sudeste */
    if ((e.uf == 'ES') || (e.uf == 'MG') || (e.uf == 'RJ') || (e.uf == 'SP')) {
        regioes_2019.se += e.total;
    }

    /* sul */
    if ((e.uf == 'PR') || (e.uf == 'RS') || (e.uf == 'SC')) {
        regioes_2019.s += e.total;
    }
});

save_json_file(lista_estados_year, 'data_per_estado_2019');
save_json_file(lista_year, 'data_per_year');
save_json_file(regioes_2019, 'regioes_2019');
save_json_file(dezembros, 'dezembros_anos');

/* same function as in bolsafamilia.js */
function save_json_file(list, name) {
    var jsonData = JSON.stringify(list);
    jsonData = jsonData.replace(/\},/g, "},\n");
    var fs = require('fs');
    fs.writeFile("data/" + name + ".json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}