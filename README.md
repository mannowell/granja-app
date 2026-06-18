# GranjaApp

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/mannowell/granja-app)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-orange)](https://github.com/mannowell/granja-app/releases)
[![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-17.0.2-61DAFB?logo=react)](https://reactjs.org/)

Sistema web completo para gerenciamento de granjas de suínos, com controle de lotes, silos, registros sanitários, manutenção e dashboard de indicadores.

---

## 🛠️ Tecnologias

- **Frontend:** React 17, React Router DOM, Framer Motion, React Toastify, Font Awesome
- **Backend:** Node.js, Express.js
- **Banco de Dados:** SQLite 3
- **Ferramentas:** Concurrently, Cross-env, Nodemon, Jest

---

## ✨ Funcionalidades

- **Dashboard** — Visão geral com indicadores de animais, lotes, alertas e silos
- **Gestão de Lotes** — Controle completo de lotes e pavilhões
- **Controle de Silos** — Monitoramento de ração, recarga e alertas de reabastecimento
- **Registro Sanitário** — Vacinações, tratamentos e histórico de saúde
- **Manutenção** — Solicitações e acompanhamento de tarefas de manutenção
- **Mortalidade** — Registro e acompanhamento de índices de mortalidade
- **API REST** — Backend completo com rotas para todas as operações

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) >= 14.0.0
- [npm](https://www.npmjs.com/) >= 6.0.0

---

## 🚀 Instalação e Execução

```bash
# Clonar o repositório
git clone https://github.com/mannowell/granja-app.git
cd granja-app

# Instalar dependências
npm install

# Inicializar o banco de dados
npm run init-db

# Popular o banco com dados de exemplo (opcional)
npm run seed-db

# Executar frontend + backend simultaneamente
npm run dev
```

O frontend estará disponível em `http://localhost:3000` e o backend em `http://localhost:3002`.

### Executar separadamente:

```bash
# Apenas o backend
npm run server

# Apenas o frontend
npm start
```

---

## 📁 Estrutura do Projeto

```
granja-app/
├── database/                  # Arquivos do banco SQLite
│   ├── database.sqlite
│   └── database_bckp.sqlite
├── public/                    # Arquivos públicos do React
├── scripts/                    # Scripts de inicialização do BD
│   ├── init-db.js
│   └── seed-db.js
├── src/
│   ├── App.js                 # Componente principal com rotas
│   ├── index.js               # Ponto de entrada do React
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── GestaoLotes.js
│   │   ├── Manutencao.js
│   │   ├── MortalidadeLotes.js
│   │   ├── RegistroSanitario.js
│   │   ├── Silos.js
│   │   ├── indicadores/      # Componentes de indicadores
│   │   ├── lotes/            # Controle de lotes
│   │   ├── manutencao/       # Gestão de manutenção
│   │   ├── sanitario/        # Registros sanitários
│   │   └── silos/            # Controle de silos
│   ├── hooks/
│   │   └── useApi.js
│   ├── services/
│   │   └── api.js
│   ├── server/
│   │   ├── index.js           # Servidor Express
│   │   ├── controllers/       # Controladores
│   │   ├── database/          # Configuração do SQLite
│   │   ├── routes/            # Rotas da API
│   │   ├── services/          # Serviços (ex: consumo ração)
│   │   └── schedulers/        # Tarefas agendadas
│   └── styles/                # Arquivos CSS
├── package.json
└── suinos.json                 # Dados de exemplo
```

---

## 📖 Uso

Após iniciar o sistema, acesse `http://localhost:3000` e navegue pelo menu lateral:

1. **Dashboard** — Visualize indicadores gerais da granja
2. **Lotes** — Gerencie lotes e pavilhões
3. **Mortalidade** — Acompanhe índices de mortalidade
4. **Silos** — Controle o estoque de ração nos silos
5. **Registro Sanitário** — Registre vacinações e tratamentos
6. **Manutenção** — Gerencie solicitações de manutenção

---

## 🔌 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/status` | Status da API |
| `GET` | `/api/dashboard` | Dados do dashboard |
| `GET` | `/api/lotes` | Listar todos os lotes |
| `GET` | `/api/lotes/:id` | Detalhes de um lote |
| `POST` | `/api/lotes` | Criar novo lote |
| `PUT` | `/api/lotes/:id` | Atualizar lote |
| `DELETE` | `/api/lotes/:id` | Remover lote |
| `GET` | `/api/pavilhoes` | Listar pavilhões |
| `GET` | `/api/pavilhoes/:id` | Detalhes de um pavilhão |
| `GET` | `/api/silos` | Listar silos |
| `POST` | `/api/silos` | Criar novo silo |
| `PUT` | `/api/silos/:id` | Atualizar silo |
| `GET` | `/api/sanitario` | Listar registros sanitários |
| `POST` | `/api/sanitario` | Criar registro sanitário |
| `GET` | `/api/manutencao` | Listar manutenções |
| `POST` | `/api/manutencao` | Criar solicitação de manutenção |
| `PATCH` | `/api/manutencao/:id` | Atualizar status de manutenção |

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 👤 Autor

**Wellison Oliveira (mannowell)**

- GitHub: [@mannowell](https://github.com/mannowell)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
