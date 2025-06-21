const fetch = require("node-fetch");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  const { name, tel } = JSON.parse(event.body || "{}");

  // 💬 Спрячь токен и chat_id в Netlify ENV
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_TOKEN || !CHAT_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Missing Telegram credentials" }),
    };
  }

  const message = `💬 Новая заявка с сайта:\n\n👤 Имя: ${name}\n📞 Телефон: ${tel}`;

  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const res = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    if (!res.ok) {
      throw new Error("Telegram API error");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending message" }),
    };
  }
};
