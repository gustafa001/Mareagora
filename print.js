const puppeteer = require('puppeteer');

(async () => {
  console.log("Iniciando browser...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 1200, height: 1600});
  
  console.log("Acessando a página...");
  await page.goto('http://localhost:3000/mare/santos', {waitUntil: 'networkidle2'});
  
  console.log("Aguardando gráficos carregarem...");
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const path = 'C:\\Users\\gusta\\.gemini\\antigravity\\brain\\7f4ab090-b24c-45ef-bfdb-19925751db39\\graficos_pro_max.png';
  console.log("Salvando print em: ", path);
  await page.screenshot({path: path, fullPage: true});
  
  await browser.close();
  console.log("Concluído!");
})();
