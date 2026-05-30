const KEY = import.meta.env.VITE_OPENWEATHER_KEY
const BASE = 'https://api.openweathermap.org/data/2.5'

export async function getCurrentWeather(city) {
  const res = await fetch(
    `${BASE}/weather?q=${city}&appid=${KEY}&units=metric&lang=fr`
  )
  if (!res.ok) throw new Error('Ville introuvable')
  return res.json()
}