var fs = require("fs");

var contents = fs.readFileSync("data/alldata.json");
var jsonContent = JSON.parse(contents);
var lista_month = [];
var lista_year = [];

jsonContent.forEach(el => {
    let entry1 = {...el}; // copy elements
    let entry2 = {...el};
    entry1.month = new Date(entry1.month);
    entry2.month = new Date(entry2.month);
    // console.log(typeof entry2.total);

    let i = lista_month.findIndex( obj => (obj.uf == entry1.uf) && (obj.month.getYear() == entry1.month.getYear()) && (obj.month.getMonth() == entry1.month.getMonth()));
    let j = lista_year.findIndex( obj => (obj.uf == entry2.uf) && (obj.year == entry2.month.getYear() + 1900));
    
    /* select and sum same month-year and state */
    if (i == -1) {
        delete entry1.city; // won't be using city in this context. might as well delete it.
        lista_month.push(entry1);
    } else {
        lista_month[i].total += entry1.total;
    }
    
    /* select and sum same year and state */
    if (j == -1) {
        delete entry2.city; // won't be using city in this context. might as well delete it.
        entry2.year = entry2.month.getYear() + 1900;
        delete entry2.month;
        lista_year.push(entry2);
    } else {
        lista_year[j].total += entry2.total;
    }
});
save_json_file(lista_month, 'data_per_state_month');
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

// console.log(jsonContent);