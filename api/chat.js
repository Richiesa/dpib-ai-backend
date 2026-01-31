export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Pertanyaan kosong" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "Kamu adalah asisten AI konstruksi bangunan jurusan DPIB. " +
                    "Jawablah dengan bahasa Indonesia yang sopan, edukatif, dan mudah dipahami siswa. " +
                    "Fokus pada struktur bangunan, RAB, gambar kerja, drafting, dan proses konstruksi. " +
                    "Jangan memberikan perhitungan teknis detail.\n\n" +
                    "Pertanyaan:\n" +
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
      "Maaf, saya belum dapat menjawab pertanyaan tersebut.";

    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
}
