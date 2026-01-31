import fetch from "node-fetch";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method tidak diizinkan." });
  }

  try {
    const { message } = req.body;

    if (!message || message.length < 2) {
      return res.status(400).json({
        reply: "Pertanyaan terlalu singkat.",
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah asisten AI bidang konstruksi bangunan dan DPIB. " +
              "Jawab secara teknis, jelas, dan mudah dipahami.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "AI tidak dapat memberikan jawaban.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      reply: "Terjadi kesalahan server AI.",
    });
  }
}
