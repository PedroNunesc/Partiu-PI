// services/WeatherService.ts
import fetch from 'node-fetch'; // necessário apenas para Node <18

const OPENWEATHER_API_KEY = '9937e69d524ede9dc35a077528e4e15d';
const METEOSTAT_API_KEY = '8d2fdfb836msh07acb12a0b5262bp12b12ajsnf1239ae9534b';

interface HistoricalAverage {
  date: string;
  temp_min_avg: number;
  temp_max_avg: number;
}

/**
 * Busca latitude e longitude de uma cidade + país usando OpenWeather Geocoding API
 */
async function getCityCoordinates(city: string, country: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData[0]) {
      console.error("Cidade não encontrada");
      return null;
    }

    return { lat: geoData[0].lat, lon: geoData[0].lon };
  } catch (error) {
    console.error("Erro no geocoding:", error);
    return null;
  }
}

/**
 * Calcula média histórica de tmin e tmax para um dia específico (mes/dia) entre 2020 e 2025
 */
export async function getHistoricalAverageForFuture(
  city: string,
  country: string,
  month: number,
  day: number
): Promise<HistoricalAverage | null> {
  const coords = await getCityCoordinates(city, country);
  if (!coords) return null;

  const { lat, lon } = coords;

  const startYear = 2020;
  const endYear = 2025;
  const tempsMin: number[] = [];
  const tempsMax: number[] = [];

  // Buscar dados de todos os anos em um único loop, mas agrupando requisições por ano
  for (let year = startYear; year <= endYear; year++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2,'0')}`;
    const url = `https://meteostat.p.rapidapi.com/point/daily?lat=${lat}&lon=${lon}&start=${dateStr}&end=${dateStr}&units=metric`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'meteostat.p.rapidapi.com',
          'x-rapidapi-key': METEOSTAT_API_KEY,
        }
      });

      const data = await res.json();

      if (data.data && data.data.length > 0) {
        const tmin = data.data[0].tmin;
        const tmax = data.data[0].tmax;

        if (typeof tmin === 'number') tempsMin.push(tmin);
        if (typeof tmax === 'number') tempsMax.push(tmax);
      }
    } catch (error) {
      console.error(`Erro ao buscar dados para ${dateStr}:`, error);
    }
  }

  if (tempsMin.length === 0 || tempsMax.length === 0) {
    console.error("Nenhum dado histórico disponível para esta data");
    return null;
  }

  const avgMin = tempsMin.reduce((a, b) => a + b, 0) / tempsMin.length;
  const avgMax = tempsMax.reduce((a, b) => a + b, 0) / tempsMax.length;

  return {
    date: `${month}-${day}`,
    temp_min_avg: parseFloat(avgMin.toFixed(1)),
    temp_max_avg: parseFloat(avgMax.toFixed(1))
  };
}
