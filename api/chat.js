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

    if (!message || message.trim().length < 3) {
      return res.status(400).json({
        reply: "Pertanyaan terlalu singkat.",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    "Kamu adalah asisten AI khusus bidang konstruksi bangunan (DPIB). " +
                    "Jawab secara teknis, jelas, dan edukatif.\n\n" +
                    message,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // LOG PENTING (biar jelas kalau error lagi)
    console.log("Gemini API response:", JSON.stringify(data));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI tidak dapat memberikan jawaban dari Gemini.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      reply: "Terjadi kesalahan server AI.",
    });
  }
}
