export default async function handler(req, res) {
  // Hanya izinkan GET
  if (req.method !== "GET") {
    return res.status(405).json({ answer: "Method tidak diizinkan." });
  }

  const question = req.query.message;

  if (!question) {
    return res.status(400).json({
      answer: "Pertanyaan tidak boleh kosong."
    });
  }

  // Timeout controller (12 detik)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "Kamu adalah asisten AI konstruksi jurusan DPIB. " +
                    "Jawab secara ringkas, jelas, dan edukatif. " +
                    "Maksimal 5 paragraf pendek. " +
                    "Gunakan bahasa Indonesia yang sopan dan mudah dipahami.\n\n" +
                    "Pertanyaan:\n" +
                    question
                }
              ]
            }
          ]
        })
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return res.status(500).json({
        answer: "AI gagal memproses permintaan."
      });
    }

    const data = await response.json();

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, AI tidak dapat memberikan jawaban saat ini.";

    return res.status(200).json({ reply: answer });
  } catch (error) {
    clearTimeout(timeoutId);

    // Jika timeout
    if (error.name === "AbortError") {
      return res.status(504).json({
        reply:
          "AI sedang sibuk atau koneksi lambat. Silakan ulangi pertanyaan."
      });
    }

    // Error lain
    return res.status(500).json({
      reply:
        "Terjadi kesalahan pada server AI. Silakan coba lagi."
    });
  }
}
