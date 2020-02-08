# bolsa_familia_data (work in progress)
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
This script saves multiple 50 entries `.json` files into `data/raw/` folder accordingly to its year.

### Merge the data
```bash
node mergedata.js
```
This script merges all `.json` files from `data/raw/` folder into a single one called `alldata.json`.

### Plots
```bash
node processdata.js
```
This script creates plots using `alldata.json`.