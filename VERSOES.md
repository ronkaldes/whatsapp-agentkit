# 🚀 Versões do Bot AgentKit WhatsApp

Este projeto possui **3 versões diferentes** de execução do workflow. Use os arquivos `.bat` correspondentes para iniciar cada versão.

---

## 📋 Resumo das Versões

| Versão | Arquivo | Método | Status | Recomendado |
|--------|---------|--------|--------|-------------|
| **V1** | `start_v1_simulation.bat` | Simulação (chat.completions) | ✅ Funcional | Para desenvolvimento |
| **V2** | `start_v2_real_workflow.bat` | Workflow Real (ChatKit API) | ⚠️ Experimental | Para testes com API |
| **V3** | `start_v3_hybrid.bat` | Híbrido (tenta real → fallback) | ✅ Recomendado | **Para produção** |

---

## 🎯 V1: Simulação via Chat Completions

### Como funciona:
- Usa endpoint: `/v1/chat/completions`
- O GPT-4o-mini **simula** o comportamento do workflow
- Workflow ID incluído no system prompt como referência
- **NÃO executa** o workflow real do Agent Builder

### Vantagens:
✅ Garantido de funcionar
✅ Não depende de APIs beta
✅ Rápido e econômico (gpt-4o-mini)
✅ Mantém contexto de conversa

### Desvantagens:
❌ Não usa lógica real do workflow
❌ Não acessa ferramentas do workflow
❌ Não executa nós/condições do Agent Builder

### Quando usar:
- Desenvolvimento e testes
- Quando API ChatKit não está disponível
- Para economizar custos

### Como executar:
```bash
start_v1_simulation.bat
```

---

## 🔧 V2: Workflow Real do ChatKit

### Como funciona:
- Usa endpoint: `/v1/chatkit/workflows/{workflow_id}/runs`
- **Executa** o workflow real criado no Agent Builder
- Usa nós, condições, ferramentas configuradas no workflow
- Requer acesso à ChatKit API (beta)

### Vantagens:
✅ Executa workflow REAL do Agent Builder
✅ Usa todas as ferramentas configuradas
✅ Respeita lógica de nós e condições
✅ Formato oficial da OpenAI

### Desvantagens:
❌ Requer API ChatKit (pode não estar disponível)
❌ Pode retornar erro 404 se não tiver acesso
❌ Workflow deve estar publicado
❌ Sem fallback (falha se API não funcionar)

### Quando usar:
- Quando você tem acesso à ChatKit API
- Para testar workflow real do Agent Builder
- Quando precisa das ferramentas do workflow

### Requisitos:
- Workflow publicado no Agent Builder
- Acesso à API ChatKit (beta)
- `WORKFLOW_ID` correto no `.env`

### Como executar:
```bash
start_v2_real_workflow.bat
```

---

## 🌟 V3: Modo Híbrido (RECOMENDADO)

### Como funciona:
1. **Primeira tentativa:** Chama workflow real (`/chatkit/workflows/{id}/runs`)
2. **Se falhar (404/400):** Automaticamente usa chat.completions (V1)
3. **Zero downtime:** Usuário não percebe a diferença

### Vantagens:
✅ **Melhor dos dois mundos**
✅ Usa workflow real se disponível
✅ Fallback automático e transparente
✅ Zero downtime
✅ Experiência otimizada
✅ Não requer mudança de código

### Desvantagens:
⚠️ Pode ter latência extra na primeira tentativa (se API não disponível)

### Quando usar:
- **PRODUÇÃO** (recomendado)
- Quando não tem certeza se API ChatKit está disponível
- Quando quer máxima confiabilidade

### Fluxo de execução:
```
Mensagem recebida
    ↓
Tenta workflow real do ChatKit
    ↓
API disponível? ─── SIM → Usa workflow real ✅
    │
    NO
    ↓
Fallback automático para chat.completions ✅
    ↓
Resposta enviada ao usuário
```

### Como executar:
```bash
start_v3_hybrid.bat
```

---

## 🔧 Configuração do .env

Para **todas as versões**, configure o `.env`:

```env
# OpenAI API Key (obrigatório)
OPENAI_API_KEY=sk-proj-seu-api-key-aqui

# ID do Workflow do Agent Builder (obrigatório)
WORKFLOW_ID=wf_68ec74bf00c08190b1e9e75997ac8f35084d479521c7ba00

# USE_REAL_WORKFLOW é definido automaticamente pelos arquivos .bat
# Não é necessário configurar manualmente
```

---

## 📊 Comparação Técnica

### V1 - Simulação
```typescript
POST /v1/chat/completions
{
  "model": "gpt-4o-mini",
  "messages": [
    { "role": "system", "content": "Execute workflow wf_xxx..." },
    { "role": "user", "content": "mensagem do usuário" }
  ]
}
```

### V2 - Workflow Real
```typescript
POST /v1/chatkit/workflows/{workflow_id}/runs
{
  "input": {
    "message": "mensagem do usuário",
    "user": {
      "name": "João",
      "platform": "WhatsApp",
      "chat_id": "5511999999999@c.us"
    }
  }
}
```

### V3 - Híbrido
```typescript
try {
  // Tenta V2 (workflow real)
  return await runRealChatKitWorkflow(...);
} catch (error) {
  // Fallback para V1 (simulação)
  return await runChatCompletions(...);
}
```

---

## 🧪 Como Testar as Versões

### Teste 1: V1 (Simulação)
1. Execute: `start_v1_simulation.bat`
2. Log esperado: `🤖 Executando workflow via chat completions...`
3. Deve funcionar sempre

### Teste 2: V2 (Workflow Real)
1. Execute: `start_v2_real_workflow.bat`
2. Se funcionar: `🎯 Chamando workflow real do ChatKit...` → `✅ Resposta do workflow real`
3. Se não funcionar: `❌ ChatKit workflow error (404)`

### Teste 3: V3 (Híbrido)
1. Execute: `start_v3_hybrid.bat`
2. Primeiro tenta workflow real
3. Se falhar, automaticamente usa simulação
4. Sempre responde ao usuário

---

## 🎯 Recomendação Final

| Cenário | Versão Recomendada |
|---------|-------------------|
| Desenvolvimento local | **V1** |
| Teste de API ChatKit | **V2** |
| Produção | **V3** ⭐ |
| Máxima confiabilidade | **V3** ⭐ |
| Sem acesso ChatKit API | **V1** |

---

## 📝 Notas Importantes

1. **Todas as versões mantêm histórico de conversa** via Map em memória no `bot.ts`
2. **O código já implementa as 3 versões** - basta escolher o arquivo `.bat`
3. **V3 é recomendada para produção** por ter fallback automático
4. **Nenhuma versão requer alteração de código** - tudo configurável via `.bat`

---

## 🆘 Troubleshooting

### V2 retorna 404
**Causa:** API ChatKit não está disponível para sua conta
**Solução:** Use V1 ou V3 (que faz fallback automaticamente)

### Bot não responde
**Causa:** Problema com `OPENAI_API_KEY` ou `WORKFLOW_ID`
**Solução:** Verifique o `.env` e certifique-se que as variáveis estão corretas

### V1 responde mas não segue workflow
**Esperado:** V1 **simula** o workflow, não executa ele realmente
**Solução:** Se precisa executar workflow real, use V2 (se disponível) ou aguarde acesso à API

---

**Criado por:** AgentKit WhatsApp Bot
**Última atualização:** Outubro 2025
