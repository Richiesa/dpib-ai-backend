export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Pertanyaan kosong" });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
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
                    "Kamu adalah AI konstruksi DPIB. " +
                    "Jawab ringkas, teknis, dan profesional.\n\n" +
                    question
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, AI belum dapat menjawab.";

    res.status(200).json({ answer });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghubungi Gemini API" });
  }
}
