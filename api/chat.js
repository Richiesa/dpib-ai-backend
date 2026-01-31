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

    if (!message) {
      return res.status(400).json({ reply: "Pesan kosong." });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "Kamu adalah asisten AI bidang konstruksi bangunan (DPIB). " +
                    "Jawab dengan bahasa teknis, jelas, dan mudah dipahami.\n\n" +
                    message,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Maaf, AI belum dapat memberikan jawaban.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      reply: "Terjadi kesalahan pada server AI.",
    });
  }
}
