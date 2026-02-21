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
├── render.yaml           # Config deploy Render (backend)
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

### Backend (Render)

1. **Cria conta** em [render.com](https://render.com) (free tier, sem cartão obrigatório)

2. **Liga o repositório**

   - New → Web Service
   - Conecta o teu repositório Git (GitHub/GitLab)
   - Seleciona o repositório do projeto

3. **Configura o serviço**

   - **Name:** `map-app-backend`
   - **Region:** Frankfurt ou mais próximo
   - **Runtime:** **Docker**
   - **Dockerfile Path:** `./backend/Dockerfile`
   - **Docker Context:** `./backend`
   - **Plan:** Free

4. **Deploy**

   - Clica em **Create Web Service**
   - O Render faz build a partir do Dockerfile e publica
   - Guarda o URL: `https://map-app-backend.onrender.com` (o nome pode variar)

5. **Nota Free Tier:** O serviço pode ficar inativo após ~15 min sem tráfego. O primeiro request após isso pode demorar 30–60 s (cold start).

### Opção: Deploy com Blueprint (render.yaml)

Se o repositório tiver o ficheiro `render.yaml` na raiz:

1. No Render: **New** → **Blueprint**
2. Seleciona o repositório
3. O Render lê o `render.yaml` e cria o serviço automaticamente

### Frontend (Vercel)

1. **Configura a variável de ambiente**

   - No [dashboard da Vercel](https://vercel.com/dashboard): Settings → Environment Variables
   - Adiciona: `VITE_BACKEND_URL` = `https://map-app-backend.onrender.com`
   - Substitui pelo URL real do backend no Render

2. **Deploy**

   - **Opção A (Git):** Push do repositório e liga o projeto na Vercel
   - **Opção B (CLI):**
     ```bash
     cd frontend
     vercel
     ```

3. O frontend ficará disponível em `https://teu-projeto.vercel.app`

### Checklist pós-deploy

- [ ] Backend a responder em `https://SEU-APP.onrender.com`
- [ ] Variável `VITE_BACKEND_URL` definida na Vercel com o URL do backend
- [ ] Frontend em produção a conectar ao backend (indicador "🟢 Conectado" no header)

---

## 📌 Funcionalidades

- ✅ Ecrã de boas-vindas com nome de utilizador
- ✅ Mapa em tempo real (Leaflet)
- ✅ Coordenadas próprias (Geolocation API)
- ✅ Coordenadas de todos os utilizadores conectados
- ✅ Actualização em tempo real (Socket.io)
- ✅ Indicador de ligação (Conectado/Desligado)
- ✅ Contador de utilizadores conectados
- ✅ Painel lateral com coordenadas (lat, lng)
- ✅ Marcadores com nome de utilizador
- ✅ Loading enquanto obtém localização
- ✅ Tratamento de erro se o utilizador recusar localização

## 🧠 Pontos técnicos

| Pergunta                         | Resposta                                                         |
| -------------------------------- | ---------------------------------------------------------------- |
| **Porquê WebSockets?**           | Comunicação bidireccional em tempo real, sem polling.            |
| **Onde são guardados os dados?** | Em memória (objeto `users`). Sem BD conforme pedido.             |
| **O que acontece ao sair?**      | Evento `disconnect` remove o utilizador do objeto.               |
| **Escalabilidade?**              | Single-instance. Para escalar: Redis adapter, load balancer, BD. |
