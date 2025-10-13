# 📊 Relatório Técnico - AgentKit WhatsApp Bot

## 1. Visão Geral do Sistema

O **AgentKit WhatsApp Bot** é um sistema automatizado que integra o WhatsApp com a inteligência artificial da OpenAI, permitindo respostas automáticas e inteligentes para mensagens recebidas.

---

## 2. Arquitetura do Sistema

### 2.1 Componentes Principais

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO WHATSAPP                      │
└────────────────────┬────────────────────────────────────┘
                     │ Envia mensagem
                     ▼
┌─────────────────────────────────────────────────────────┐
│              WHATSAPP WEB (Puppeteer)                    │
│  - Gerencia conexão com WhatsApp                        │
│  - Captura mensagens em tempo real                      │
│  - Envia respostas                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   BOT (bot.ts)                           │
│  - Processa eventos do WhatsApp                         │
│  - Gerencia comandos especiais                          │
│  - Mantém histórico de conversas                        │
│  - Controla fluxo de mensagens                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            OPENAI HANDLER (openai-simple.ts)             │
│  - Formata mensagens para a API                         │
│  - Gerencia contexto da conversa                        │
│  - Executa workflows                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  OPENAI API (GPT-4)                      │
│  - Processa linguagem natural                           │
│  - Gera respostas inteligentes                          │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Fluxo de Funcionamento

### 3.1 Inicialização do Bot

```
1. Carrega variáveis de ambiente (.env)
   ├─ OPENAI_API_KEY: Chave de acesso à API da OpenAI
   └─ WORKFLOW_ID: ID do workflow configurado

2. Configura cliente WhatsApp
   ├─ Inicializa Puppeteer (navegador headless)
   ├─ Carrega estratégia de autenticação (LocalAuth)
   └─ Define configurações de segurança

3. Estabelece conexão
   ├─ Gera QR Code (primeira vez)
   ├─ Autentica usando sessão salva (reconexões)
   └─ Marca como "pronto" quando conectado

4. Aguarda mensagens
```

### 3.2 Processamento de Mensagens

```mermaid
┌──────────────────┐
│ Mensagem Recebida│
└────────┬─────────┘
         │
         ▼
    ┌────────────┐
    │É do bot?   │──Sim──> IGNORA
    └────┬───────┘
         │Não
         ▼
    ┌────────────┐
    │É de grupo? │──Sim──> IGNORA
    └────┬───────┘
         │Não
         ▼
    ┌────────────────┐
    │É comando (!)?  │──Sim──> Executa comando especial
    └────┬───────────┘
         │Não
         ▼
    ┌──────────────────┐
    │Obtém histórico   │
    │da conversa       │
    └────┬─────────────┘
         │
         ▼
    ┌──────────────────┐
    │Adiciona contexto │
    │(nome, plataforma)│
    └────┬─────────────┘
         │
         ▼
    ┌──────────────────┐
    │Envia para OpenAI │
    └────┬─────────────┘
         │
         ▼
    ┌──────────────────┐
    │Recebe resposta   │
    └────┬─────────────┘
         │
         ▼
    ┌──────────────────┐
    │Salva no histórico│
    └────┬─────────────┘
         │
         ▼
    ┌──────────────────┐
    │Envia para usuário│
    └──────────────────┘
```

---

## 4. Módulos Detalhados

### 4.1 bot.ts - Módulo Principal

**Responsabilidades:**
- Gerenciar conexão com WhatsApp
- Processar eventos (mensagens, QR code, autenticação)
- Filtrar mensagens (grupos, próprias mensagens)
- Executar comandos especiais
- Manter histórico de conversas por chat

**Principais Funções:**

#### `processMessage(message: Message)`
Processa mensagens normais enviando para a IA.

**Fluxo:**
1. Verifica se a OpenAI está conectada
2. Obtém histórico da conversa (máximo 20 mensagens)
3. Adiciona nova mensagem ao histórico
4. Cria contexto (nome do contato, timestamp, tipo)
5. Envia para OpenAI via `sendMessageToOpenAI()`
6. Salva resposta no histórico
7. Envia resposta ao usuário

#### `handleSpecialCommands(message: Message)`
Processa comandos especiais do bot.

**Comandos disponíveis:**
- `!help` / `!ajuda`: Mostra lista de comandos
- `!clear` / `!limpar`: Limpa histórico da conversa
- `!status`: Mostra status do bot
- `!ping`: Testa se está funcionando

**Eventos Monitorados:**
- `ready`: Bot conectado e pronto
- `qr`: QR Code gerado para autenticação
- `authenticated`: Autenticação bem-sucedida
- `auth_failure`: Falha na autenticação
- `disconnected`: Bot desconectado
- `message_create`: Nova mensagem recebida
- `error`: Erro no cliente

### 4.2 openai-simple.ts - Integração com OpenAI

**Responsabilidades:**
- Gerenciar comunicação com API da OpenAI
- Formatar mensagens no formato esperado
- Manter contexto das conversas
- Limitar histórico para economizar tokens

**Principais Funções:**

#### `runAgentKitWorkflow(workflowId, userInput, context, conversationHistory)`
Executa um workflow do AgentKit (ou usa API direta).

**Parâmetros:**
- `workflowId`: ID do workflow configurado
- `userInput`: Mensagem do usuário
- `context`: Informações sobre a conversa
- `conversationHistory`: Histórico de mensagens

**Processo:**
1. Monta array de mensagens incluindo:
   - System prompt (instruções para a IA)
   - Histórico da conversa
   - Nova mensagem do usuário
2. Envia para `openai.chat.completions.create()`
3. Usa modelo GPT-4o
4. Configurações:
   - Temperature: 0.7 (criatividade moderada)
   - Max tokens: 500 (respostas concisas)
5. Retorna resposta ou erro

#### `sendMessageToOpenAI(message, context, conversationHistory)`
Função simplificada que usa o workflow padrão.

#### `createConversationContext(chatId, contactName, messageType, isGroup)`
Cria objeto de contexto com informações da conversa:
- ID do chat
- Nome do contato
- Timestamp atual
- Plataforma (whatsapp)
- Tipo de mensagem
- Se é grupo ou não

#### `limitConversationHistory(history, maxLength)`
Limita histórico para evitar excesso de tokens.
- Mantém mensagem do sistema
- Mantém últimas N mensagens (padrão: 20)

#### `testOpenAIConnection()`
Testa se a API da OpenAI está respondendo.

---

## 5. Gerenciamento de Dados

### 5.1 Histórico de Conversas

**Estrutura:**
```typescript
Map<chatId, ConversationMessage[]>

ConversationMessage {
  role: "system" | "user" | "assistant"
  content: string
}
```

**Comportamento:**
- Armazenado em memória (RAM)
- Separado por chat ID
- Limitado a 20 mensagens por conversa
- Perdido ao reiniciar o bot
- Pode ser limpo com comando `!clear`

### 5.2 Sessão do WhatsApp

**Localização:** `./session/`

**Conteúdo:**
- Dados de autenticação
- Chaves de criptografia
- Informações de sessão do WhatsApp Web

**Comportamento:**
- Salvo automaticamente
- Permite reconexão sem QR Code
- Válido por tempo indeterminado (enquanto não desconectar no celular)

---

## 6. Configurações e Segurança

### 6.1 Variáveis de Ambiente (.env)

```env
OPENAI_API_KEY=sua_chave_aqui
WORKFLOW_ID=seu_workflow_aqui
```

**Segurança:**
- Nunca commitar .env no git
- Manter chaves em local seguro
- Renovar chaves periodicamente

### 6.2 Configuração do Puppeteer

**Argumentos de segurança:**
```javascript
'--no-sandbox'                    // Desabilita sandbox (necessário)
'--disable-setuid-sandbox'        // Segurança adicional
'--disable-dev-shm-usage'         // Evita problemas de memória
'--disable-accelerated-2d-canvas' // Desabilita aceleração
'--no-first-run'                  // Pula configuração inicial
'--no-zygote'                     // Otimização
'--disable-gpu'                   // Desabilita GPU
'--disable-extensions'            // Sem extensões
'--disable-software-rasterizer'   // Otimização de renderização
```

**Timeout:** 60 segundos para operações

**WebVersionCache:** Usa versão estável do WhatsApp Web

---

## 7. Limitações e Considerações

### 7.1 Limitações Atuais

1. **Mensagens de Grupo:** Ignoradas por padrão
2. **Histórico:** Perdido ao reiniciar
3. **Mídia:** Não processa imagens/vídeos/áudios
4. **Taxa de Mensagens:** Sem controle de rate limiting
5. **Múltiplas Conversas:** Todas processadas simultaneamente

### 7.2 Custos

**OpenAI API:**
- Modelo: GPT-4o
- Custo por mensagem: ~$0.0015 - $0.003
- Máximo 500 tokens por resposta
- Histórico aumenta custo (20 mensagens por conversa)

**Infraestrutura:**
- Requer servidor/computador rodando 24/7
- ~200MB RAM
- Conexão estável com internet

---

## 8. Casos de Uso

### 8.1 Atendimento Automatizado
- Responder FAQs
- Fornecer informações básicas
- Direcionar para atendimento humano

### 8.2 Assistente Virtual
- Agendar compromissos
- Fornecer lembretes
- Responder dúvidas sobre produtos/serviços

### 8.3 Chatbot Educacional
- Tirar dúvidas de alunos
- Fornecer materiais
- Explicar conceitos

---

## 9. Manutenção e Troubleshooting

### 9.1 Logs do Sistema

**Tipos de logs:**
- 🚀 Inicialização
- 📱 Eventos do WhatsApp
- ✅ Operações bem-sucedidas
- ❌ Erros
- 🤖 Respostas enviadas

### 9.2 Problemas Comuns

**Erro: "Protocol error (Runtime.callFunctionOn)"**
- Solução: Deletar pasta `session/` e reconectar

**Erro: "OpenAI API error"**
- Verificar API key
- Verificar créditos na conta OpenAI
- Verificar conexão com internet

**QR Code não aparece**
- Verificar se `qrcode-terminal` está instalado
- Executar `npm install`

**Bot não responde**
- Verificar se mensagem é de grupo (ignorada)
- Verificar se é mensagem própria (ignorada)
- Verificar logs de erro

---

## 10. Melhorias Futuras Sugeridas

### 10.1 Funcionalidades
- [ ] Suporte a mensagens de grupo
- [ ] Processamento de imagens
- [ ] Processamento de áudio (voz)
- [ ] Rate limiting por usuário
- [ ] Blacklist/Whitelist de contatos
- [ ] Respostas agendadas
- [ ] Integração com banco de dados
- [ ] Dashboard web de monitoramento

### 10.2 Desempenho
- [ ] Cache de respostas comuns
- [ ] Histórico persistente em banco
- [ ] Pool de conexões
- [ ] Fila de mensagens
- [ ] Compressão de histórico

### 10.3 Segurança
- [ ] Criptografia de histórico
- [ ] Autenticação de administradores
- [ ] Logs auditáveis
- [ ] Detecção de spam
- [ ] Rate limiting por IP

---

## 11. Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Node.js | 18+ | Runtime JavaScript |
| TypeScript | 5.9.3 | Linguagem de programação |
| whatsapp-web.js | 1.34.1 | Integração WhatsApp |
| OpenAI SDK | 6.3.0 | API de IA |
| Puppeteer | Incluído | Automação de navegador |
| dotenv | 17.2.3 | Variáveis de ambiente |
| qrcode-terminal | 0.12.0 | Geração de QR Code |

---

## 12. Estrutura de Arquivos

```
Whatsapp-AgentKit/
├── src/                      # Código fonte TypeScript
│   ├── bot.ts               # Lógica principal do bot
│   ├── openai-simple.ts     # Integração OpenAI
│   └── index.ts             # Ponto de entrada
│
├── dist/                     # Código compilado (JavaScript)
│   ├── bot.js
│   ├── openai-simple.js
│   └── index.js
│
├── session/                  # Sessão do WhatsApp (gerado)
│   └── session/
│       └── Default/
│
├── node_modules/             # Dependências
│
├── .env                      # Configurações sensíveis
├── package.json              # Metadados e dependências
├── tsconfig.json             # Configuração TypeScript
├── start_dev.bat             # Iniciar em modo dev
├── start_prod.bat            # Iniciar em modo produção
└── README.md                 # Documentação
```

---

## 13. Conclusão

O **AgentKit WhatsApp Bot** é um sistema robusto e escalável que combina a facilidade de uso do WhatsApp com o poder da inteligência artificial da OpenAI. Com arquitetura modular e código bem documentado, permite fácil manutenção e expansão de funcionalidades.

**Pontos Fortes:**
- ✅ Integração nativa com WhatsApp
- ✅ Respostas inteligentes usando GPT-4
- ✅ Gerenciamento de histórico por conversa
- ✅ Comandos especiais úteis
- ✅ Fácil instalação e configuração

**Pontos de Atenção:**
- ⚠️ Requer servidor rodando constantemente
- ⚠️ Custos da API OpenAI
- ⚠️ Histórico em memória (perdido ao reiniciar)

---

**Versão do Relatório:** 1.0
**Data:** 2025-10-13
**Autor:** AgentKit Team
