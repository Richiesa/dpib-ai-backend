export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ reply: "Method tidak diizinkan." });
  }

  const question = req.query.message;
  if (!question) {
    return res.status(400).json({ reply: "Pertanyaan kosong." });
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
                    "Kamu adalah AI konstruksi (DPIB). " +
                    "Jawab singkat, jelas, dan praktis.\n\n" +
                    question
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Maaf, AI belum bisa menjawab.";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({
      reply: "AI sedang sibuk, silakan coba lagi."
    });
  }
}
