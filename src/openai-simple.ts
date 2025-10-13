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

// Armazena threads por chat ID
const chatThreads = new Map<string, string>();

/**
 * Executa um workflow do AgentKit usando OpenAI Assistants API
 * @param assistantId - ID do Assistant/Workflow
 * @param userInput - Input do usuário
 * @param context - Contexto adicional para o workflow
 * @param conversationHistory - Histórico da conversa (não usado com Assistants)
 * @returns Promise<OpenAIResponse>
 */
export async function runAgentKitWorkflow(
  assistantId: string,
  userInput: string,
  context?: ConversationContext,
  conversationHistory?: ConversationMessage[]
): Promise<OpenAIResponse> {
  try {
    const chatId = context?.chatId || 'default';

    // Obtém ou cria thread para este chat
    let threadId = chatThreads.get(chatId);

    if (!threadId) {
      console.log(`🔧 Criando nova thread para chat ${chatId}`);
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      chatThreads.set(chatId, threadId);
    }

    // Adiciona contexto à mensagem se disponível
    let messageContent = userInput;
    if (context) {
      messageContent = `${userInput}\n\n[Contexto: Contato=${context.contactName}, Plataforma=${context.platform}]`;
    }

    // Adiciona mensagem do usuário à thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: messageContent
    });

    // Executa o assistant e aguarda conclusão
    console.log(`🤖 Executando assistant ${assistantId}...`);
    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId
    });

    if (run.status !== 'completed') {
      throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
    }

    // Obtém as mensagens da thread
    const messages = await openai.beta.threads.messages.list(threadId, {
      limit: 1,
      order: 'desc'
    });

    const lastMessage = messages.data[0];
    if (!lastMessage || lastMessage.role !== 'assistant') {
      throw new Error('Nenhuma resposta do assistant');
    }

    // Extrai o texto da resposta
    const textContent = lastMessage.content.find(c => c.type === 'text');
    const responseText = textContent && 'text' in textContent
      ? textContent.text.value
      : "Desculpe, não consegui processar sua solicitação.";

    console.log(`✅ Resposta recebida do assistant`);

    return {
      text: responseText,
      success: true
    };

  } catch (error) {
    console.error(`❌ Erro ao executar assistant ${assistantId}:`, error);
    return {
      text: "Desculpe, ocorreu um erro ao processar sua solicitação com o assistant.",
      success: false,
      error: (error as Error).message
    };
  }
}

/**
 * Limpa a thread de um chat específico
 * @param chatId - ID do chat
 */
export function clearChatThread(chatId: string): void {
  chatThreads.delete(chatId);
  console.log(`🗑️ Thread do chat ${chatId} removida`);
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
  const defaultWorkflowId = process.env.WORFLOW_ID || "wf_2V0vUNR8UYZ3xM15B9a910586940994955"; // ID do workflow do seu projeto
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
