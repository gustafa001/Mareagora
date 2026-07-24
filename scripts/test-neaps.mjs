import { getExtremesPrediction, nearestStation } from 'neaps';

async function main() {
  const lat = 25.7617;
  const lon = -80.1918;

  console.log(`[TESTE NEAPS] Iniciando busca para lat: ${lat}, lon: ${lon} (Miami)...`);

  const station = nearestStation({ lat, lon });
  
  if (!station) {
    console.error('Nenhuma estação encontrada.');
    process.exit(1);
  }

  console.log('Estação mais próxima encontrada:', station.id, station.name, `(lat: ${station.lat}, lon: ${station.lon})`);

  const start = new Date();
  start.setUTCDate(start.getUTCDate() - 1);
  start.setUTCHours(0, 0, 0, 0);
  
  const end = new Date();
  end.setUTCDate(end.getUTCDate() + 7);

  console.log(`Calculando de ${start.toISOString()} a ${end.toISOString()}...`);

  const prediction = getExtremesPrediction({
    latitude: lat,
    longitude: lon,
    start,
    end,
    units: 'meters',
  });

  if (!prediction || !prediction.extremes || prediction.extremes.length === 0) {
    console.error('Nenhuma predição gerada.');
    process.exit(1);
  }

  console.log('Total de eventos gerados:', prediction.extremes.length);
  
  const events = prediction.extremes.map((e) => ({
    dt: new Date(e.time).toISOString(),
    height_m: Math.round(e.height * 100) / 100,
  }));

  console.log('Primeiros 5 eventos:');
  console.log(events.slice(0, 5));
}

main().catch(console.error);
