/* Script for merging all data from raw folder into one single file */

var fs = require("fs");

const dir = "data/raw/";
var files = []; // name of the files inside dir
var alldata = []; // all data gathered
var name_of_files_read = []; // name of all the files that have been read
var jsonContent;

fs.readdirSync(dir).forEach(arq => {
    files.push(arq);
});

/* usar map no lugar de for */
for (let i = 0; i < files.length; i++) {
    var contents = fs.readFileSync(dir + files[i]);
    jsonContent = JSON.parse(contents);
    alldata.push(...jsonContent);
}
save_json_file(alldata, '../alldata')

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