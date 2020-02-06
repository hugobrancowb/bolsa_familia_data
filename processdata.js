var fs = require("fs");

var contents = fs.readFileSync("data/alldata.json");
var jsonContent = JSON.parse(contents);
var lista_year = [];

jsonContent.forEach(el => {

    let t = el.total.replace(/[.]/g, "");
    t = t.replace(/[,]/g, ".");
    let y = el.year.split('/');
    let entry = {
        uf: el.uf,
        total: parseFloat(t),  
        month: parseInt(y[0]),      
        year: parseInt(y[1])
    };

    let j = lista_year.findIndex( obj => obj.year == entry.year );

    if (j == -1) { // if year doesn't exist, add it as new element to the array
        lista_year.push(entry);
    } else { // if year already exists, sum it to the current value
        lista_year[j].total += entry.total;
    }
});

save_json_file(lista_year, 'data_per_year');

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