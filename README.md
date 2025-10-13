# 🤖 AgentKit WhatsApp Bot

Bot do WhatsApp com IA da OpenAI usando a biblioteca [whatsapp-web.js](https://wwebjs.dev/).

## ✨ Funcionalidades

- 🤖 **Respostas automáticas** usando inteligência artificial da OpenAI
- 📱 **Interface WhatsApp** nativa através do WhatsApp Web
- 🔄 **Histórico de conversas** mantido por chat
- 🎯 **Comandos especiais** para controle do bot
- 🔐 **Autenticação segura** com QR Code
- 📊 **Logs detalhados** para monitoramento
- 🛡️ **Tratamento de erros** robusto

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ 
- NPM ou Yarn
- Conta OpenAI com API Key

### Passos

1. **Clone o repositório:**
```bash
git clone https://github.com/pedroherpeto/Whatsapp-ChatKIT-OpenAi-ChatGPT
cd Whatsapp-ChatKIT-OpenAi-ChatGPT
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure a API Key da OpenAI:**
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione sua chave da OpenAI:
```env
OPENAI_API_KEY=sua_chave_da_openai_aqui
WORFLOW_ID=seu_workflow_aqui
```

4. **Compile o TypeScript:**
```bash
npm run build
```

## 🎯 Como Usar

### Iniciar o Bot

```bash
# Modo desenvolvimento (TypeScript)
npm run dev

# Modo produção (JavaScript compilado)
npm start
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
wwebjs/
├── src/
│   ├── bot.ts          # Bot principal do WhatsApp
│   ├── openai-simple.ts # Integração com a API da OpenAI
│   └── index.ts        # Arquivo de entrada
├── dist/               # Arquivos compilados (gerado automaticamente)
├── session/            # Sessão do WhatsApp (gerado automaticamente)
├── config.ts           # Configurações do projeto
├── package.json        # Dependências e scripts
├── tsconfig.json       # Configuração do TypeScript
└── README.md           # Este arquivo
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Executa em modo desenvolvimento

# Produção
npm run build        # Compila TypeScript para JavaScript
npm start           # Executa versão compilada

# Testes
npm test            # Executa testes (quando implementados)
```

## 🔒 Segurança

- ✅ **Sessão local**: Dados de autenticação armazenados localmente
- ✅ **API Key segura**: Chave da OpenAI em variáveis de ambiente
- ✅ **Logs controlados**: Informações sensíveis não são logadas
- ✅ **Tratamento de erros**: Falhas não expõem dados internos

## 🐛 Solução de Problemas

### Bot não conecta
- Verifique se o Node.js está na versão 18+
- Confirme se a API Key da OpenAI está correta
- Tente deletar a pasta `session/` e reconectar

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

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

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
