/* Script for merging all data from raw folder into one single file */

var fs = require("fs");

const dir = "data/raw/";
var files = []; // name of the files inside dir
var alldata = []; // all data gathered

fs.readdirSync(dir).forEach(arq => {
    files.push(arq);
});

files.map(el => {
    var contents = fs.readFileSync(dir + el);
    var jsonContent = JSON.parse(contents); // there's 15 or 50 items in this object

    jsonContent.map(entry => {
        alldata.push(entry);
    });
});

save_json_file(alldata, 'alldata');

/* Functions */
function save_json_file(list, name) {
    let jsonData = JSON.stringify(list);
    jsonData = jsonData.replace(/\},/g, "},\n");
    let fs = require('fs');
    
    fs.writeFile("data/" + name + ".json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}