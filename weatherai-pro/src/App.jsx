import { useState } from 'react'

const KEY = import.meta.env.VITE_OPENWEATHER_KEY
const BASE = 'https://api.openweathermap.org/data/2.5'
const API = 'https://weather-ai-chatbot-production.up.railway.app/api/chat'

async function getWeather(city) {
  const r = await fetch(`${BASE}/weather?q=${city}&appid=${KEY}&units=metric&lang=fr`)
  if (!r.ok) throw new Error('err')
  return r.json()
}

async function chat(msgs, ctx) {
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: msgs, weatherContext: ctx })
  })
  const d = await r.json()
  return d.reply
}

export default function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [msgs, setMsgs] = useState([{ role: 'assistant', content: 'Bonjour ! Je suis WeatherAI. Cherchez une ville !' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    if (!city.trim()) return
    setLoading(true); setError(null)
    try {
      const data = await getWeather(city)
      setWeather(data)
      setMsgs(p => [...p, { role: 'assistant', content: `Meteo a ${data.name}: ${Math.round(data.main.temp)}C, ${data.weather[0].description}` }])
    } catch { setError('Ville introuvable.') }
    setLoading(false)
  }

  async function handleChat(e) {
    e.preventDefault()
    if (!input.trim() || chatLoading) return
    const newMsgs = [...msgs, { role: 'user', content: input }]
    setMsgs(newMsgs); setInput(''); setChatLoading(true)
    try {
      const reply = await chat(newMsgs.slice(-10), weather)
      setMsgs(p => [...p, { role: 'assistant', content: reply }])
    } catch {
      setMsgs(p => [...p, { role: 'assistant', content: 'Erreur. Reessayez.' }])
    }
    setChatLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#E6F1FB', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#378ADD', marginBottom: '4px' }}>WeatherAI</h1>
      <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>Assistant meteo intelligent</p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '480px', marginBottom: '16px' }}>
        <input value={city} onChange={e => setCity(e.target.value)} placeholder="Entrez une ville... ex: Tunis"
          style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '9999px', padding: '8px 16px', fontSize: '14px', outline: 'none' }} />
        <button type="submit" disabled={loading}
          style={{ background: '#378ADD', color: 'white', border: 'none', borderRadius: '9999px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}>
          {loading ? '...' : 'Rechercher'}
        </button>
      </form>

      {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px' }}>{error}</p>}

      {weather && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px', width: '100%', maxWidth: '480px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>{weather.name}, {weather.sys.country}</div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#378ADD', margin: '12px 0' }}>{Math.round(weather.main.temp)}C</div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>{weather.weather[0].description}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '14px', color: '#9ca3af' }}>
            <span>Hum: {weather.main.humidity}%</span>
            <span>Vent: {Math.round(weather.wind.speed * 3.6)} km/h</span>
            <span>Res: {Math.round(weather.main.feels_like)}C</span>
          </div>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '16px', padding: '16px', width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', height: '350px' }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ background: m.role === 'user' ? '#378ADD' : '#f3f4f6', color: m.role === 'user' ? 'white' : '#1f2937', borderRadius: '16px', padding: '10px 14px', fontSize: '13px', maxWidth: '80%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.content}
            </div>
          ))}
          {chatLoading && <div style={{ background: '#f3f4f6', borderRadius: '16px', padding: '10px 14px', fontSize: '13px' }}>...</div>}
        </div>
        <form onSubmit={handleChat} style={{ display: 'flex', gap: '8px' }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Posez votre question meteo..."
            style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '9999px', padding: '8px 16px', fontSize: '14px', outline: 'none' }} />
          <button type="submit" disabled={chatLoading}
            style={{ background: '#378ADD', color: 'white', border: 'none', borderRadius: '9999px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}>
            Envoyer
          </button>
        </form>
      </div>
    </div>
  )
}