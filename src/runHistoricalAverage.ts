// src/runHistoricalAverage.ts
import fetch from 'node-fetch';

const OPENWEATHER_API_KEY = '9937e69d524ede9dc35a077528e4e15d';
const METEOSTAT_API_KEY = '8d2fdfb836msh07acb12a0b5262bp12b12ajsnf1239ae9534b';

async function getCityCoordinates(city: string, country: string): Promise<{ lat: number; lon: number } | null> {
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
  const geoRes = await fetch(geoUrl);
  const geoData = await geoRes.json();

  if (!geoData[0]) {
    console.error("Cidade não encontrada");
    return null;
  }

  return { lat: geoData[0].lat, lon: geoData[0].lon };
}

async function getHistoricalAverageForFuture(city: string, country: string, month: number, day: number) {
  const coords = await getCityCoordinates(city, country);
  if (!coords) return null;

  const { lat, lon } = coords;
  const startYear = 2020;
  const endYear = 2025;
  const tempsMin: number[] = [];
  const tempsMax: number[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2,'0')}`;
    const url = `https://meteostat.p.rapidapi.com/point/daily?lat=${lat}&lon=${lon}&start=${dateStr}&end=${dateStr}&units=metric`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'meteostat.p.rapidapi.com',
        'x-rapidapi-key': METEOSTAT_API_KEY,
      }
    });

    const data = await res.json();
    if (data.data && data.data.length > 0) {
      tempsMin.push(data.data[0].tmin);
      tempsMax.push(data.data[0].tmax);
    }
  }

  const avgMin = tempsMin.reduce((a,b) => a+b,0) / tempsMin.length;
  const avgMax = tempsMax.reduce((a,b) => a+b,0) / tempsMax.length;

  return {
    date: `${day}/${month}`,
    temp_min_avg: avgMin,
    temp_max_avg: avgMax
  };
}

(async () => {
  console.log("Calculando média histórica...");

const avg = await getHistoricalAverageForFuture("Novo Hamburgo", "Brasil", 10, 30);

  if (!avg) {
    console.log("Nenhum dado encontrado.");
  } else {
    console.log(`Média histórica em ${avg.date}`);
    console.log("Temperatura mínima média:", avg.temp_min_avg.toFixed(1), "°C");
    console.log("Temperatura máxima média:", avg.temp_max_avg.toFixed(1), "°C");
  }
})();
