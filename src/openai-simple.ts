import OpenAI from "openai";
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

// Configuração do cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Interface para resposta da OpenAI
 */
export interface OpenAIResponse {
  text: string;
  success: boolean;
  error?: string;
}

/**
 * Interface para histórico de conversa
 */
export interface ConversationMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Interface para contexto da conversa
 */
export interface ConversationContext {
  chatId: string;
  contactName: string;
  timestamp: string;
  platform: string;
  messageType: string;
  isGroup: boolean;
}

/**
 * Executa um workflow do AgentKit/ChatKit usando a API da OpenAI
 * @param workflowId - ID do Workflow (wf_xxx)
 * @param userInput - Input do usuário
 * @param context - Contexto adicional para o workflow
 * @param conversationHistory - Histórico da conversa
 * @returns Promise<OpenAIResponse>
 */
export async function runAgentKitWorkflow(
  workflowId: string,
  userInput: string,
  context?: ConversationContext,
  conversationHistory?: ConversationMessage[]
): Promise<OpenAIResponse> {
  try {
    // Monta as mensagens incluindo contexto e histórico
    const messages: ConversationMessage[] = [
      {
        role: "system",
        content: `Você é um assistente útil do AgentKit. Execute o workflow ${workflowId} conforme solicitado pelo usuário.

Contexto da conversa:
- Contato: ${context?.contactName || 'Usuário'}
- Plataforma: ${context?.platform || 'whatsapp'}
- Tipo de mensagem: ${context?.messageType || 'text'}
- É grupo: ${context?.isGroup ? 'Sim' : 'Não'}
- Timestamp: ${context?.timestamp || new Date().toISOString()}

Instruções:
- Seja amigável e prestativo
- Mantenha respostas concisas (máximo 500 caracteres para WhatsApp)
- Use emojis ocasionalmente para tornar a conversa mais amigável
- Se for uma pergunta sobre AgentKit, responda com informações relevantes
- Se não souber algo, seja honesto e ofereça ajuda de outra forma
- Responda sempre em português brasileiro

Contexto adicional: ${JSON.stringify(context || {})}`
      },
      ...(conversationHistory || []),
      {
        role: "user",
        content: userInput
      }
    ];

    console.log(`🤖 Executando workflow ${workflowId}...`);

    // Chama a API do ChatKit/AgentKit via chat completions
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });

    const responseText = response.choices[0]?.message?.content || "Desculpe, não consegui processar sua solicitação.";

    console.log(`✅ Resposta recebida do workflow`);

    return {
      text: responseText,
      success: true
    };

  } catch (error) {
    console.error(`❌ Erro ao executar workflow ${workflowId}:`, error);
    return {
      text: "Desculpe, ocorreu um erro ao processar sua solicitação.",
      success: false,
      error: (error as Error).message
    };
  }
}

/**
 * Envia uma mensagem para a OpenAI e recebe uma resposta (função simplificada)
 * @param message - Mensagem do usuário
 * @param context - Contexto da conversa
 * @param conversationHistory - Histórico da conversa
 * @returns Promise<OpenAIResponse>
 */
export async function sendMessageToOpenAI(
  message: string,
  context: ConversationContext,
  conversationHistory: ConversationMessage[] = []
): Promise<OpenAIResponse> {
  // Usar o workflow padrão
  const defaultWorkflowId = process.env.WORKFLOW_ID || "wf_2V0vUNR8UYZ3xM15B9a910586940994955"; // ID do workflow do seu projeto
  return await runAgentKitWorkflow(defaultWorkflowId, message, context, conversationHistory);
}

/**
 * Cria um contexto padrão para conversas
 * @param chatId - ID do chat
 * @param contactName - Nome do contato
 * @param messageType - Tipo da mensagem
 * @param isGroup - Se é um grupo
 * @returns ConversationContext
 */
export function createConversationContext(
  chatId: string,
  contactName: string,
  messageType: string,
  isGroup: boolean = false
): ConversationContext {
  return {
    chatId,
    contactName,
    timestamp: new Date().toISOString(),
    platform: 'whatsapp',
    messageType,
    isGroup
  };
}

/**
 * Limita o histórico de conversa para evitar tokens excessivos
 * @param history - Histórico atual
 * @param maxLength - Tamanho máximo (padrão: 20)
 * @returns ConversationMessage[]
 */
export function limitConversationHistory(
  history: ConversationMessage[],
  maxLength: number = 20
): ConversationMessage[] {
  if (history.length <= maxLength) {
    return history;
  }
  
  // Mantém a mensagem do sistema e as últimas mensagens
  const systemMessage = history.find(msg => msg.role === 'system');
  const recentMessages = history.slice(-maxLength + 1);
  
  return systemMessage ? [systemMessage, ...recentMessages] : recentMessages;
}

/**
 * Testa a conexão com a OpenAI
 * @returns Promise<boolean>
 */
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: "Teste de conexão" }],
      max_tokens: 10
    });
    
    return response.choices[0]?.message?.content ? true : false;
  } catch (error) {
    console.error('Erro ao testar conexão com OpenAI:', error);
    return false;
  }
}
