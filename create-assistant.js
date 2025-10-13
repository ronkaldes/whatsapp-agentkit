const OpenAI = require('openai').default;
require('dotenv').config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function createAssistant() {
  try {
    const assistant = await client.beta.assistants.create({
      name: "AgentKit WhatsApp Bot",
      instructions: `Você é um assistente inteligente do AgentKit para WhatsApp.

Instruções:
- Seja amigável e prestativo
- Mantenha respostas concisas (máximo 500 caracteres para WhatsApp)
- Use emojis ocasionalmente
- Responda sempre em português brasileiro
- Se não souber algo, seja honesto
- Se precisar buscar informações atualizadas, use web search`,
      model: "gpt-4o",
      tools: [
        // Descomente as ferramentas que você quiser:
        // { type: "code_interpreter" },
        // { type: "file_search" }
      ]
    });

    console.log('\n✅ Assistant criado com sucesso!\n');
    console.log(`ID: ${assistant.id}`);
    console.log(`Nome: ${assistant.name}`);
    console.log(`Modelo: ${assistant.model}`);
    console.log('\n💡 Copie este ID para o arquivo .env:\n');
    console.log(`WORKFLOW_ID=${assistant.id}\n`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createAssistant();
