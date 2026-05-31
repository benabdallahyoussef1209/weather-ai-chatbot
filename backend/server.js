import express from 'express'
import cors from 'cors'
import Groq from 'groq-sdk'
import 'dotenv/config'
const app = express()
app.use(cors())
app.use(express.json())

const groq = new Groq({ apiKey: process.env.GROQ_KEY })

app.get('/', (req, res) => res.send('Backend Works'))

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, weatherContext } = req.body

    const weatherInfo = weatherContext
      ? `Météo: ${weatherContext.name}, ${Math.round(weatherContext.main.temp)}°C, ${weatherContext.weather[0].description}.`
      : 'Aucune ville sélectionnée.'

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: `Tu es WeatherAI Pro, assistant météo. ${weatherInfo} Réponds en français avec des emojis.`
        },
        ...messages.filter(m => m.role === 'user' || m.role === 'assistant')
      ]
    })

    res.json({ reply: response.choices[0].message.content })
  } catch(e) {
    console.error('Erreur:', e.message)
    res.status(500).json({ error: e.message })
  }
})

app.listen(3001, () => console.log('✅ Backend running on http://localhost:3001'))