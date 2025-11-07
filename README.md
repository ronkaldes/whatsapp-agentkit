# 🤖 AgentKit WhatsApp Bot

Bot do WhatsApp com IA da OpenAI usando a biblioteca [whatsapp-web.js](https://wwebjs.dev/).

## ✨ Funcionalidades

- 🤖 **Respostas automáticas** usando inteligência artificial da OpenAI
- 📱 **Interface WhatsApp** nativa através do WhatsApp Web
- 🔄 **Histórico de conversas** mantido por chat
- 🎯 **Comandos especiais** para controle do bot
- 🔐 **Autenticação segura** com QR Code
- 📊 **Dashboard Web** com monitoramento em tempo real
- 💬 **Visualização de mensagens** com busca e filtros
- 📈 **Estatísticas detalhadas** por conversa
- 🗄️ **Persistência no Supabase** de todas as mensagens
- 🛡️ **Tratamento de erros** robusto

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ 
- NPM ou Yarn
- Conta OpenAI com API Key

### Passos

1. **Clone o repositório:**
```bash
git clone https://github.com/inematds/whatsapp-agentkit
cd whatsapp-agentkit
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto:
   ```env
   OPENAI_API_KEY=sua_chave_da_openai_aqui
   WORKFLOW_ID=seu_workflow_aqui
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_publica_do_supabase
   ```

   **Importante:** As credenciais do Supabase já estão configuradas. Você só precisa adicionar suas chaves da OpenAI.

4. **Compile o TypeScript:**
```bash
npm run build
```

## 🎯 Como Usar

### Iniciar o Bot e Dashboard

#### 🚀 Método Rápido (2 Terminais)

**Terminal 1 - Bot:**
```bash
npm run dev
```

**Terminal 2 - Dashboard:**
```bash
npm run dev:frontend
```

Depois acesse: `http://localhost:5173`

#### 🪟 Windows - Usando arquivos .bat

Basta dar duplo clique nos arquivos:

- **`start_dev.bat`** - Inicia o bot em modo desenvolvimento
- **`start_prod.bat`** - Compila e inicia em modo produção

#### 🐧 Linux/Mac - Usando scripts shell

```bash
./START_BOT.sh          # Inicia o bot
./START_DASHBOARD.sh    # Inicia o dashboard (em outro terminal)
```

#### 💻 Via linha de comando

```bash
# Bot - Modo desenvolvimento
npm run dev

# Bot - Modo produção
npm start

# Dashboard - Modo desenvolvimento
npm run dev:frontend

# Dashboard - Preview produção
npm run preview
```

### Primeira Execução

1. **Execute o bot:**
```bash
npm run dev
```

2. **Escaneie o QR Code:**
   - O bot exibirá um QR Code no terminal
   - Abra o WhatsApp no seu celular
   - Vá em Configurações > Dispositivos conectados
   - Toque em "Conectar um dispositivo"
   - Escaneie o QR Code

3. **Pronto!** O bot estará funcionando e responderá às mensagens

## 📊 Dashboard Web

O projeto inclui um dashboard web moderno para monitorar o bot em tempo real.

### Acessar o Dashboard

1. Inicie o dashboard em um terminal separado:
```bash
npm run dev:frontend
```

2. Abra seu navegador em: `http://localhost:5173`

### Funcionalidades do Dashboard

**Dashboard Tab:**
- Status do bot em tempo real (online/offline/connecting)
- Estatísticas rápidas (mensagens totais, mensagens de hoje, chats ativos)
- QR Code para autenticação (quando o bot está conectando)
- Visualização das mensagens mais recentes

**Messages Tab:**
- Lista completa de todas as mensagens
- Atualizações em tempo real conforme novas mensagens chegam
- Busca por conteúdo ou nome do contato
- Filtros (todas/usuários/bot)
- Timestamp e chat ID de cada mensagem

**Statistics Tab:**
- Visão geral de métricas (mensagens totais, por usuário, por bot, chats únicos)
- Estatísticas detalhadas por conversa
- Contadores de mensagens de usuário vs bot
- Horário da última atividade por chat
- Ordenação por mais mensagens ou mais recente

### Tecnologias do Dashboard

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime subscriptions
- **Styling**: Custom CSS com design system

Para mais informações sobre o dashboard, consulte `DASHBOARD.md`

## 📱 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `!help` ou `!ajuda` | Mostra a lista de comandos |
| `!clear` ou `!limpar` | Limpa o histórico da conversa |
| `!status` | Mostra o status do bot |
| `!ping` | Testa se o bot está funcionando |

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configuração da OpenAI
OPENAI_API_KEY=sua_chave_da_openai_aqui

# Configuração do Bot
BOT_NAME=AgentKit WhatsApp Bot
BOT_DESCRIPTION=Bot do WhatsApp com IA da OpenAI

# Configuração do Ambiente
NODE_ENV=development
```

### Personalização

Edite o arquivo `config.ts` para personalizar:

- **Modelo da OpenAI**: Altere o modelo usado
- **Temperatura**: Controle a criatividade das respostas
- **Máximo de tokens**: Limite o tamanho das respostas
- **Histórico**: Quantas mensagens manter na memória

## 📁 Estrutura do Projeto

```
whatsapp-agentkit/
├── src/                       # Código fonte do bot
│   ├── bot.ts                # Bot principal do WhatsApp
│   ├── openai-simple.ts      # Integração com a API da OpenAI
│   └── index.ts              # Arquivo de entrada
├── frontend/                  # Dashboard web
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── lib/             # Utilitários (Supabase client)
│   │   ├── App.tsx          # Componente principal
│   │   └── main.tsx         # Entry point
│   ├── index.html           # Template HTML
│   └── .env                 # Variáveis de ambiente do frontend
├── dist/                     # Bot compilado (gerado automaticamente)
├── dist-frontend/           # Dashboard compilado (gerado automaticamente)
├── session/                 # Sessão do WhatsApp (gerado automaticamente)
├── start_dev.bat           # 🪟 Iniciar bot (desenvolvimento)
├── start_prod.bat          # 🪟 Iniciar bot (produção)
├── START_BOT.sh            # 🐧 Iniciar bot (Linux/Mac)
├── START_DASHBOARD.sh      # 🐧 Iniciar dashboard (Linux/Mac)
├── vite.config.ts          # Configuração do Vite
├── package.json            # Dependências e scripts
├── tsconfig.json           # Configuração do TypeScript
├── .env                    # Variáveis de ambiente
├── .env.example            # Exemplo de variáveis de ambiente
├── README.md               # Este arquivo
├── DASHBOARD.md            # Documentação do dashboard
├── GETTING_STARTED.md      # Guia de início rápido
└── RELATORIO_SISTEMA.md    # Documentação técnica completa
```

## 🛠️ Scripts Disponíveis

```bash
# Bot - Desenvolvimento
npm run dev              # Executa bot em modo desenvolvimento

# Bot - Produção
npm run build           # Compila bot e frontend
npm start              # Executa versão compilada do bot

# Dashboard - Desenvolvimento
npm run dev:frontend    # Inicia dashboard em http://localhost:5173

# Dashboard - Produção
npm run build:frontend  # Compila apenas o frontend
npm run preview        # Preview do dashboard em produção

# Testes
npm test               # Executa testes (quando implementados)
```

## 🚀 Deploy em Produção

### Preparando para Deploy

1. **Compile o projeto:**
```bash
npm run build
```

Isso irá:
- Compilar o código TypeScript do bot para `dist/`
- Construir o frontend otimizado em `dist-frontend/`

2. **Configure variáveis de ambiente:**

Certifique-se de que as seguintes variáveis estejam configuradas no ambiente de produção:

```env
OPENAI_API_KEY=sua_chave_da_openai
WORKFLOW_ID=seu_workflow_id
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica_do_supabase
```

### Deploy do Bot

Execute o bot compilado:

```bash
npm start
```

Recomendações para produção:
- Use um gerenciador de processos como PM2: `pm2 start dist/bot.js --name whatsapp-bot`
- Configure logs persistentes
- Implemente reinício automático em caso de falhas
- Configure backups da pasta `session/` para evitar reautenticação

### Deploy do Dashboard

O dashboard em `dist-frontend/` é uma aplicação estática que pode ser hospedada em:

**Netlify:**
1. Conecte seu repositório
2. Configure build command: `npm run build:frontend`
3. Configure publish directory: `dist-frontend`
4. Adicione variáveis de ambiente no painel da Netlify

**Vercel:**
1. Importe o projeto
2. Configure root directory como `frontend`
3. Build command: `vite build`
4. Output directory: `../dist-frontend`
5. Adicione variáveis de ambiente no painel da Vercel

**Servidor próprio com Nginx:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    root /caminho/para/dist-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Considerações de Segurança em Produção

- Nunca exponha a chave `OPENAI_API_KEY` no código frontend
- Use HTTPS para o dashboard em produção
- Configure CORS apropriadamente no Supabase
- Implemente rate limiting se necessário
- Monitore o uso da API da OpenAI

## 🔒 Segurança

- ✅ **Sessão local**: Dados de autenticação armazenados localmente
- ✅ **API Key segura**: Chave da OpenAI em variáveis de ambiente
- ✅ **Logs controlados**: Informações sensíveis não são logadas
- ✅ **Tratamento de erros**: Falhas não expõem dados internos
- ✅ **Database seguro**: Row Level Security (RLS) habilitado nas tabelas Supabase

## 🐛 Solução de Problemas

### Bot não conecta
- Verifique se o Node.js está na versão 18+
- Confirme se a API Key da OpenAI está correta
- Tente deletar a pasta `session/` e reconectar

### Dashboard mostra página em branco
- **Causa:** Falta o arquivo `frontend/.env` com as credenciais do Supabase
- **Solução:** Crie o arquivo `frontend/.env` e copie as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` do arquivo `.env` da raiz
- Exemplo:
  ```bash
  cat .env | grep VITE > frontend/.env
  ```
- Reinicie o servidor de desenvolvimento: `npm run dev:frontend`

### QR Code não aparece
- Verifique se o `qrcode-terminal` está instalado
- Execute `npm install` novamente

### Respostas não funcionam
- Confirme se a API Key da OpenAI tem créditos
- Verifique os logs para erros específicos
- Teste com `!ping` para verificar se o bot está ativo

### Erro de compilação
- Execute `npm run build` para ver erros detalhados
- Verifique se todas as dependências estão instaladas

## 📊 Logs

O bot gera logs detalhados para monitoramento:

```
🚀 Iniciando bot AgentKit WhatsApp...
📱 QR Code recebido! Escaneie com seu WhatsApp:
✅ Cliente WhatsApp está pronto!
🤖 Bot AgentKit iniciado com sucesso!
📱 Aguardando mensagens...
📱 Mensagem recebida de João: Olá!
🤖 Resposta enviada: Olá! Como posso ajudá-lo hoje?
```

## 🤖 Desenvolvimento com IA

Este projeto foi desenvolvido com assistência de IA e pode ser facilmente melhorado usando:

### Claude Code
Ferramenta oficial da Anthropic para desenvolvimento assistido por IA.

```bash
# Instale o Claude Code
npm install -g @anthropic/claude-code

# Ou use via VS Code Extension
# https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code
```

**Comandos úteis com Claude Code:**
- `/help` - Ajuda sobre comandos disponíveis
- `/review` - Revisar código
- `/optimize` - Otimizar performance
- `/test` - Gerar testes automatizados
- `/docs` - Gerar documentação

### GitHub Copilot
Alternativa para desenvolvimento assistido por IA.

```bash
# Use via VS Code Extension
# https://marketplace.visualstudio.com/items?itemName=GitHub.copilot
```

### 💡 Dicas para usar IA no projeto:

1. **Adicionar novas funcionalidades**
   ```
   "Adicione suporte para mensagens de áudio"
   "Implemente rate limiting por usuário"
   ```

2. **Melhorar código existente**
   ```
   "Otimize o gerenciamento de histórico"
   "Adicione testes unitários para bot.ts"
   ```

3. **Debugar problemas**
   ```
   "Por que o bot não está respondendo em grupos?"
   "Como posso reduzir o uso de tokens da OpenAI?"
   ```

4. **Documentação**
   ```
   "Gere documentação JSDoc para todas as funções"
   "Crie um guia de contribuição"
   ```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

**Dica:** Use Claude Code ou GitHub Copilot para acelerar o desenvolvimento!

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- [whatsapp-web.js](https://wwebjs.dev/) - Biblioteca para integração com WhatsApp
- [OpenAI](https://openai.com/) - API de inteligência artificial
- [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal) - Geração de QR Code no terminal

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato:

- **GitHub Issues**: [Link para issues]
- **Email**: suporte@agentkit.com.br
- **Discord**: [Link do servidor]

---

**Desenvolvido com ❤️ pela equipe AgentKit**
