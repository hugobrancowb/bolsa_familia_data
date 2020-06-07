# MINERAÇÃO DE DADOS DO PORTAL DA TRANSPARÊNCIA

Códigos em JavaScript utilizados para minerar dados do Portal da Transparência referentes aos repasses do Programa Bolsa Família entre os anos de 2013 e 2019.

No Portal da Transparência, os repasses são exibidos em tabelas de, no máximo, 50 linhas por página mas o fato de que o conteúdo é carregado através de eventos de JavaScript torna o processo de mineração automatizada muito mais complicado.

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

## Keywords
Javascript, Data Mining, Mineração de Dados, Bolsa Família
