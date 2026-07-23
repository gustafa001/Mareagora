const fs = require('fs');
const content = fs.readFileSync('c:/Users/gusta/Desktop/files/Mareagora/lib/ports.ts', 'utf8');
const STATE_MAP = { SP: 'sao-paulo', RJ: 'rio-de-janeiro', SC: 'santa-catarina', PR: 'parana', RS: 'rio-grande-do-sul', ES: 'espirito-santo', BA: 'bahia', SE: 'sergipe', AL: 'alagoas', PE: 'pernambuco', PB: 'paraiba', RN: 'rio-grande-do-norte', CE: 'ceara', PI: 'piaui', MA: 'maranhao', PA: 'para', AP: 'amapa', ANT: 'antartida' };
const redirects = [];
const matches = [...content.matchAll(/slug:\s*'([^']+)',\s*state:\s*'([^']+)'/g)];
for (const match of matches) {
  const slug = match[1];
  const state = match[2];
  const estado = STATE_MAP[state] || state.toLowerCase();
  redirects.push({ source: `/mare/${slug}`, destination: `/mare/${estado}/${slug}`, permanent: true });
  redirects.push({ source: `/operacoes-portuarias/${slug}`, destination: `/operacoes-portuarias/${estado}/${slug}`, permanent: true });
}
fs.writeFileSync('c:/Users/gusta/Desktop/files/Mareagora/redirects.json', JSON.stringify(redirects, null, 2));
