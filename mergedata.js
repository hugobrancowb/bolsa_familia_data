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
    var jsonContent = JSON.parse(contents); // there's 15 or 50 items in this object

    jsonContent.map(entry => {
        if (alldata.length > 0) {
            var flag = 0; // if true, this is new data

            alldata.map(data => {
                if ((entry.city == data.city) && (entry.uf == data.uf) && (entry.total == data.total) && (entry.year == data.year)) {
                    flag += 1;
                }
            });
            
            if(flag == 0) {
                alldata.push(entry);
                count += 1;
            } else {
                repeat += 1;
            }
        } else {
            alldata.push(entry);
            count += 1;
        }
    });
});

save_json_file(alldata, 'alldata');
console.log('itens: ' + count);
console.log('repetidos: ' + repeat);

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