type Payload = Record<string, unknown>;

export async function notifyLead(kind: string, payload: Payload) {
  const tasks: Promise<unknown>[] = [];
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    tasks.push(sendTelegram(kind, payload));
  }
  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
    tasks.push(sendEmail(kind, payload));
  }
  try {
    await Promise.all(tasks);
  } catch (e) {
    console.error("notifyLead error", e);
  }
}

async function sendTelegram(kind: string, payload: Payload) {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const chat = process.env.TELEGRAM_CHAT_ID!;
  const text = `Новая заявка (${kind}):\n${JSON.stringify(payload, null, 2)}`;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text }),
  });
}

async function sendEmail(kind: string, payload: Payload) {
  const apiKey = process.env.RESEND_API_KEY!;
  const from = process.env.RESEND_FROM!;
  const to = 'Latvbelfruits@mail.ru';
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Magic berry: новая заявка (${kind})`,
      html: `<pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre>`,
    }),
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]!));
}


