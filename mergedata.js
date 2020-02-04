/* Script for merging all data from raw folder into one single file */

var fs = require("fs");

const dir = "data/raw/";
var files = []; // name of the files inside dir
var alldata = []; // all data gathered
var count = 0;
var repeat = 0;

fs.readdirSync(dir).forEach(arq => {
    files.push(arq);
});

files.map(el => {
    var contents = fs.readFileSync(dir + el);
    var jsonContent = JSON.parse(contents); // there's 15 items in this object
    alldata.push(...jsonContent);
    count += jsonContent.length;
});

save_json_file(alldata, '../alldata');
console.log('itens: ' + count);

/* Functions */
function save_json_file(list, name) {
    var jsonData = JSON.stringify(list);
    var fs = require('fs');
    
    fs.writeFile("data/raw/" + name + ".json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}