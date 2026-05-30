# WeatherAI 🌤️

Assistant météo intelligent propulsé par l'IA.

## 🔗 Demo

👉 [weatherai-pro-bay.vercel.app](https://weatherai-pro-bay.vercel.app)

## ✨ Fonctionnalités

- 🌡️ Météo en temps réel pour n'importe quelle ville
- 🤖 Chatbot IA conversationnel (Groq — LLaMA 3)
- 👗 Conseils vêtements, sport, hydratation
- ⚡ Alertes météo automatiques
- 📱 Interface responsive

## 🛠️ Stack technique

| Partie | Technologie |
|--------|-------------|
| Frontend | React + Vite |
| Données météo | OpenWeatherMap API |
| IA | Groq API (LLaMA 3.3 70B) |
| Backend | Node.js + Express |
| Déploiement Frontend | Vercel |
| Déploiement Backend | Railway |

## 🚀 Installation locale

### Prérequis
- Node.js 18+
- Clé API OpenWeatherMap (gratuit)
- Clé API Groq (gratuit)

### 1. Cloner le projet

```bash
git clone https://github.com/benabdallahyoussef1209/weather-ai-chatbot.git
cd weather-ai-chatbot
```

### 2. Lancer le backend

```bash
cd backend
npm install
```

Créez un fichier `.env` :

```
GROQ_KEY=votre_cle_groq
```

```bash
npm run dev
```

### 3. Lancer le frontend

```bash
cd weatherai-pro
npm install
```

Créez un fichier `.env` :

```
VITE_OPENWEATHER_KEY=votre_cle_openweather
```

```bash
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173)

## 📁 Structure du projet

```
weather-ai-chatbot/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
└── weatherai-pro/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── .env
```

## 🌍 Déploiement

- **Frontend** → [Vercel](https://vercel.com)
- **Backend** → [Railway](https://railway.app)

## 👤 Auteur

**Youssef Benabdallah**
- GitHub: [@benabdallahyoussef1209](https://github.com/benabdallahyoussef1209)
