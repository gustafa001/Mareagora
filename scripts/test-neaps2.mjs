import { getExtremesPrediction, nearestStation } from 'neaps';

async function testStation(name, lat, lon) {
  console.log(`\n--- Testando ${name} (lat: ${lat}, lon: ${lon}) ---`);
  const station = nearestStation({ lat, lon });
  
  if (!station) {
    console.error('Nenhuma estação encontrada.');
    return;
  }

  console.log('Estação mais próxima encontrada:', station.id, station.name);

  const start = new Date();
  start.setUTCDate(start.getUTCDate() - 1);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date();
  end.setUTCDate(end.getUTCDate() + 2);

  const prediction = getExtremesPrediction({
    latitude: lat,
    longitude: lon,
    start,
    end,
    units: 'meters',
  });

  if (!prediction || !prediction.extremes || prediction.extremes.length === 0) {
    console.error('Nenhuma predição gerada.');
    return;
  }

  const events = prediction.extremes.map((e) => ({
    dt: new Date(e.time).toISOString(),
    height_m: Math.round(e.level * 100) / 100,
  }));

  console.log('Primeiros 3 eventos:');
  console.log(events.slice(0, 3));
}

async function main() {
  await testStation('Miami, FL', 25.7617, -80.1918);
  await testStation('Lisboa, PT', 38.7223, -9.1393);
  await testStation('Sydney, AU', -33.8688, 151.2093);
  await testStation('New York, NY', 40.7128, -74.0060);
}

main().catch(console.error);
