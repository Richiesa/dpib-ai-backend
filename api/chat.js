export default async function handler(req, res) {
  // ===== CORS =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Pertanyaan kosong" });
  }

  try {
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    "Kamu adalah asisten AI jurusan DPIB (Desain Pemodelan dan Informasi Bangunan). " +
                    "Jawab pertanyaan konstruksi secara singkat, jelas, dan edukatif.\n\n" +
                    question
                }
              ]
            }
          ]
        })
      }
    );

    const data = await geminiResponse.json();

    // ===== DEBUG AMAN (jika Gemini kosong) =====
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, AI belum dapat menjawab pertanyaan tersebut.";

    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({
      answer: "Terjadi kesalahan saat menghubungi AI."
    });
  }
}
