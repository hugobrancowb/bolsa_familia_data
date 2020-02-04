var fs = require("fs");

var contents = fs.readFileSync("data/alldata.json");
var jsonContent = JSON.parse(contents);
var lista_year = [];

jsonContent.forEach(el => {
    let entry = {...el}; // copy elements

    let i = lista_year.findIndex( obj => (obj.uf == entry.uf) && (obj.year == entry.year) );
    
    /* select and sum same year and state */
    if (i == -1) {
        delete entry.city; // won't be using city in this context. might as well delete it.
        lista_year.push(entry);
    } else {
        lista_year[i].total += entry.total;
    }
});

save_json_file(lista_year, 'data_per_state_year');

/* same function as in bolsafamilia.js */
function save_json_file(list, name) {
    var jsonData = JSON.stringify(list);
    var fs = require('fs');
    fs.writeFile("data/" + name + ".json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}