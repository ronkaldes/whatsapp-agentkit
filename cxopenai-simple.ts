function assertEnv(key: string) {
  const val = process.env[key];
  if (!val) throw new Error(`Env ${key} is required`);
  return val;
}

export type ChatKitUser = {
  name: string;
  platform: string;
  chat_id: string;
};

export type ChatKitRunInput = {
  input: {
    message: string;
    user: ChatKitUser;
    // You can extend with additional fields your workflow expects
  };
};

export async function runRealChatKitWorkflow(
  workflowId: string,
  userMessage: string,
  from: string
) {
  const apiKey = assertEnv("OPENAI_API_KEY");
  const url = `https://api.openai.com/v1/chatkit/workflows/${workflowId}/runs`;

  const body: ChatKitRunInput = {
    input: {
      message: userMessage,
      user: {
        name: from,
        platform: "WhatsApp",
        chat_id: from,
      },
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    let details: unknown;
    try {
      details = JSON.parse(text);
    } catch {
      details = text;
    }
    throw new Error(
      `ChatKit workflow error (${res.status}): ${JSON.stringify(details)}`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON from ChatKit workflow");
  }
}

// Example usage (optional): run with: node -e "import('./src/openai-simple.js').then(m=>m.demo?.())"
export async function demo() {
  const workflowId = process.env.CHATKIT_WORKFLOW_ID ??
    'wf_68ec74bf00c08190b1e9e75997ac8f35084d479521c7ba00';

  if (!process.env.OPENAI_API_KEY) {
    console.error("Set OPENAI_API_KEY in env before running demo.");
    return;
  }

  const from = "555492670394@c.us";
  const message = "Olá, preciso de ajuda com meu pedido.";

  try {
    const result = await runRealChatKitWorkflow(workflowId, message, from);
    console.log("Workflow result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Workflow call failed:", err);
  }
}

