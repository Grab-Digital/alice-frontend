import fetch from "node-fetch";

export async function handler(event, context) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  const body = JSON.parse(event.body);

  let message = "💌 Новая заявка:\n";
  for (let key in body) {
    message += `• <b>${key}:</b> ${body[key]}\n`;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Success" }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Telegram error" }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Fetch error", error: err.toString() }),
    };
  }
}
