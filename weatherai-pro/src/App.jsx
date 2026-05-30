import { useState } from 'react'

const WEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY
const BASE = 'https://api.openweathermap.org/data/2.5'

async function getCurrentWeather(city) {
  const res = await fetch(`${BASE}/weather?q=${city}&appid=${WEATHER_KEY}&units=metric&lang=fr`)
  if (!res.ok) throw new Error('Ville introuvable')
  return res.json()
}

async function askClaude(messages, weatherContext) {
const res = await fetch('https://weather-ai-chatbot-production.up.railway.app/api/chat', {    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, weatherContext })
  })
  const data = await res.json()
  return data.reply
}

const S = {
  app: { minHeight:'100vh', background:'#E6F1FB', display:'flex', flexDirection:'column', alignItems:'center', padding:'2rem', fontFamily:'system-ui, sans-serif' },
  title: { fontSize:'2rem', fontWeight:'bold', color:'#378ADD', marginBottom:'4px' },
  subtitle: { fontSize:'14px', color:'#9ca3af', marginBottom:'24px' },
  searchForm: { display:'flex', gap:'8px', width:'100%', maxWidth:'480px', marginBottom:'16px' },
  input: { flex:1, border:'1px solid #e5e7eb', borderRadius:'9999px', padding:'8px 16px', fontSize:'14px', outline:'none' },
  btnPrimary: { background:'#378ADD', color:'white', border:'none', borderRadius:'9999px', padding:'8px 16px', fontSize:'14px', cursor:'pointer', whiteSpace:'nowrap' },
  card: { background:'white', border:'1px solid #f3f4f6', borderRadius:'16px', padding:'16px', width:'100%', maxWidth:'480px', marginBottom:'16px' },
  weatherEmoji: { fontSize:'4rem', textAlign:'center', marginBottom:'8px' },
  weatherCity: { fontSize:'18px', fontWeight:'600', color:'#1f2937', textAlign:'center' },
  weatherTemp: { fontSize:'3rem', fontWeight:'bold', color:'#378ADD', textAlign:'center', margin:'12px 0' },
  weatherDesc: { fontSize:'14px', color:'#6b7280', textAlign:'center', marginBottom:'12px', textTransform:'capitalize' },
  weatherStats: { display:'flex', justifyContent:'center', gap:'24px', fontSize:'14px', color:'#9ca3af', borderTop:'1px solid #f3f4f6', paddingTop:'12px' },
  chatBox: { background:'white', border:'1px solid #f3f4f6', borderRadius:'16px', padding:'16px', width:'100%', maxWidth:'480px', display:'flex', flexDirection:'column', height:'350px' },
  messages: { flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:'10px', marginBottom:'12px' },
  bubbleBot: { background:'#f3f4f6', borderRadius:'16px', borderTopLeftRadius:'4px', padding:'10px 14px', fontSize:'13px', maxWidth:'80%', alignSelf:'flex-start', color:'#1f2937', lineHeight:'1.6' },
  bubbleUser: { background:'#378ADD', color:'white', borderRadius:'16px', borderTopRightRadius:'4px', padding:'10px 14px', fontSize:'13px', maxWidth:'80%', alignSelf:'flex-end', lineHeight:'1.6' },
  chatForm: { display:'flex', gap:'8px' },
  error: { color:'#ef4444', fontSize:'13px', marginBottom:'8px' }
}

const getEmoji = (main) => ({ Clear:'☀️', Rain:'🌧️', Clouds:'☁️', Snow:'❄️', Thunderstorm:'⛈️', Drizzle:'🌦️' }[main] || '🌤️')

export default function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [messages, setMessages] = useState([
    { role:'assistant', content:'Bonjour ! Je suis WeatherAI ☀️ Cherchez une ville et posez-moi vos questions météo !' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [error, setError] = useState(null)

 async function handleChat(e) {
  e.preventDefault()
  if (!input.trim() || chatLoading) return
  const userMsg = { role: 'user', content: input }
  const newMessages = [...messages, userMsg]
  setMessages(newMessages)
  setInput('')
  setChatLoading(true)
  try {
    const cleanMessages = newMessages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .filter(m => typeof m.content === 'string' && m.content.trim() !== '')
      .slice(-10)
      
    const reply = await askClaude(cleanMessages, weather)
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
  } catch(e) {
    setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion. Réessayez 🙏' }])
  }
  setChatLoading(false)
}

  async function handleChat(e) {
    e.preventDefault()
    if (!input.trim() || chatLoading) return
    const userMsg = { role:'user', content:input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setChatLoading(true)
    try {
      const reply = await askClaude(newMessages, weather)
      setMessages(prev => [...prev, { role:'assistant', content:reply }])
    } catch(e) {
      setMessages(prev => [...prev, { role:'assistant', content:'Erreur de connexion. Réessayez 🙏' }])
    }
    setChatLoading(false)
  }

  return (
    <div style={S.app}>
      <h1 style={S.title}>WeatherAI ☀️</h1>
      <p style={S.subtitle}>Assistant météo intelligent</p>

      <form onSubmit={handleSearch} style={S.searchForm}>
        <input value={city} onChange={e => setCity(e.target.value)}
          placeholder="Entrez une ville... ex: Tunis" style={S.input} />
        <button type="submit" style={S.btnPrimary} disabled={loading}>
          {loading ? '⏳' : '🔍 Rechercher'}
        </button>
      </form>

      {error && <p style={S.error}>{error}</p>}

      {weather && (
        <div style={S.card}>
          <div style={S.weatherEmoji}>{getEmoji(weather.weather[0].main)}</div>
          <div style={S.weatherCity}>{weather.name}, {weather.sys.country}</div>
          <div style={S.weatherTemp}>{Math.round(weather.main.temp)}°C</div>
          <div style={S.weatherDesc}>{weather.weather[0].description}</div>
          <div style={S.weatherStats}>
            <span>💧 {weather.main.humidity}%</span>
            <span>🌬️ {Math.round(weather.wind.speed * 3.6)} km/h</span>
            <span>🌡️ {Math.round(weather.main.feels_like)}°C</span>
          </div>
        </div>
      )}

      <div style={S.chatBox}>
        <div style={S.messages}>
          {messages.map((m, i) => (
            <div key={i} style={m.role === 'user' ? S.bubbleUser : S.bubbleBot}>
              {m.content}
            </div>
          ))}
          {chatLoading && <div style={S.bubbleBot}>⏳ WeatherAI réfléchit...</div>}
        </div>
        <form onSubmit={handleChat} style={S.chatForm}>
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="Posez votre question météo..." style={S.input} />
          <button type="submit" style={S.btnPrimary} disabled={chatLoading}>
            Envoyer
          </button>
        </form>
      </div>
    </div>
  )
}