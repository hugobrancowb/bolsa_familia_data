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

### Filtered data
```bash
node processdata.js
```
This script sorts and filters `alldata.json` into 3 other files: `data_per_estado_2019`, `data_per_year`, and `regioes_2019`.