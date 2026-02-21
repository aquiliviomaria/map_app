# 🗺️ Map App - Coordenadas em Tempo Real

Aplicação web que mostra um mapa com as coordenadas (latitude e longitude) de todos os utilizadores conectados em tempo real. Cada utilizador identifica-se pelo nome antes de partilhar a sua localização.

## 🛠 Stack

- **Frontend:** React + Vite, Leaflet, Socket.io-client
- **Backend:** Node.js + Express + Socket.io
- **Tempo real:** WebSockets (Socket.io)
- **Mapa:** Leaflet + OpenStreetMap

## 📁 Estrutura

```
map_app/
├── backend/              # Node.js + Socket.io
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── fly.toml
│   └── .dockerignore
├── frontend/             # React + Leaflet
│   ├── src/
│   │   ├── App.jsx
│   │   ├── UsernameScreen.jsx
│   │   ├── MapComponent.jsx
│   │   └── socket.js
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
└── README.md
```

## 🚀 Executar em Local

### 1. Backend

```bash
cd backend
npm install
npm start
```

O backend corre em `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend corre em `http://localhost:3000`.

### 3. Usar

1. Insere o teu nome
2. Permite o acesso à localização no browser
3. Abre em vários browsers (ou em modo anónimo) para ver vários utilizadores no mapa em tempo real

---

## 🌍 Deploy

### Backend (Fly.io)

1. **Instala o Fly CLI**

   ```bash
   # Linux/macOS
   curl -L https://fly.io/install.sh | sh
   ```

2. **Autenticação**

   ```bash
   fly auth login
   ```

3. **Deploy**

   ```bash
   cd backend
   fly launch
   ```

   - Nome da app: `map-app-backend`
   - Região:`ams` 

4. **Publicar**

   ```bash
   fly deploy
   ```

5. **Guarda o URL** (ex: `https://map-app-backend.fly.dev`)

### Frontend (Vercel)

1. **Instala o Vercel CLI** (opcional)

   ```bash
   npm i -g vercel
   ```

2. **Configura a variável de ambiente**

   - No [dashboard da Vercel](https://vercel.com/dashboard): Settings → Environment Variables
   - Adiciona: `VITE_BACKEND_URL` = `https://SEU-APP-BACKEND.fly.dev`
   - Substitui pelo URL real do backend no Fly.io

3. **Deploy**

   - **Opção A (Git):** Faz push do repositório e liga o projeto na Vercel. O build usa `npm run build` automaticamente.
   - **Opção B (CLI):**
     ```bash
     cd frontend
     vercel
     ```
     Configura a variável `VITE_BACKEND_URL` quando solicitado ou no dashboard.

4. O frontend ficará disponível em `https://teu-projeto.vercel.app`

### Checklist pós-deploy

- [ ] Backend a responder em `https://SEU-APP.fly.dev`
- [ ] Variável `VITE_BACKEND_URL` definida na Vercel com o URL do backend
- [ ] Frontend em produção a conectar ao backend (indicador "🟢 Conectado" no header)

---

## 📌 Funcionalidades

- ✅ Ecrande boas-vindas com nome de utilizador
- ✅ Mapa em tempo real (Leaflet)
- ✅ Coordenadas próprias (Geolocation API)
- ✅ Coordenadas de todos os utilizadores conectados
- ✅ Actualização em tempo real (Socket.io)
- ✅ Indicador de ligação (Online)
- ✅ Contador de utilizadores conectados
- ✅ Painel lateral com coordenadas (lat, lng)
- ✅ Marcadores com nome de utilizador
- ✅ Loading enquanto obtém localização
- ✅ Tratamento de erro se o utilizador recusar localização


