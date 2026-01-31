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

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    "Kamu adalah asisten AI khusus bidang konstruksi bangunan (DPIB). " +
                    "Jawab pertanyaan secara teknis, jelas, dan edukatif.\n\n" +
                    message,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();

    // DEBUG LOG (PENTING)
    console.log("Gemini raw response:", JSON.stringify(data));

    let reply = "Maaf, AI belum dapat memberikan jawaban.";

    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      reply = data.candidates[0].content.parts[0].text;
    }

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({
      reply: "Terjadi kesalahan saat memproses AI.",
    });
  }
}
