# bolsa_familia_data
Data scraping Brazil's Portal da Transparencia website.

## Setup
```bash
npm init -y
npm install puppeteer cheerio 
```

## How to run
### Gather the data
```bash
node bolsafamilia.js
```
This script saves 15 entries in each file and save all `.csv` files into `data/raw/` folder.

### Merge the data
```bash
node mergedata.js
```
This script merges all files from `data/raw/` folder into a single one `alldata.json`.

### Plots
```bash
node processdata.js
```
This script creates plots using `alldata.json`.