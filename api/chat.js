export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Pertanyaan kosong" });
    }

   const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 12000); // 12 detik

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
    process.env.GEMINI_API_KEY,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: controller.signal,
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text:
                "Kamu adalah asisten AI konstruksi jurusan DPIB. " +
                "Jawab secara ringkas, jelas, dan maksimal 5 paragraf pendek. " +
                "Gunakan bahasa Indonesia yang sopan dan edukatif.\n\n" +
                "Pertanyaan:\n" +
                question
            }
          ]
        }
      ]
    })
  }
);

clearTimeout(timeout);


    const data = await response.json();

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, saya belum dapat menjawab pertanyaan tersebut.";

    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
}

catch (error) {
  res.status(504).json({
    answer:
      "Maaf, AI sedang sibuk. Silakan ulangi pertanyaan dalam beberapa saat."
  });
}

