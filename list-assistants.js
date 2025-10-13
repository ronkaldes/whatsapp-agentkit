const OpenAI = require('openai').default;
require('dotenv').config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function listAssistants() {
  try {
    const response = await client.beta.assistants.list({ limit: 10 });

    console.log('\n📋 Assistants disponíveis:\n');

    if (response.data.length === 0) {
      console.log('❌ Nenhum assistant encontrado.');
      console.log('\n💡 Crie um em: https://platform.openai.com/assistants\n');
    } else {
      response.data.forEach(assistant => {
        console.log(`✅ ID: ${assistant.id}`);
        console.log(`   Nome: ${assistant.name || 'Sem nome'}`);
        console.log(`   Modelo: ${assistant.model}`);
        console.log(`   Tools: ${assistant.tools.map(t => t.type).join(', ') || 'Nenhuma'}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

listAssistants();
