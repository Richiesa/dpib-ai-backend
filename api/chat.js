export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      process.env.AIzaSyAESfa1QuwMErv9MeZtpfz9FD6ZsHLS8Gw,
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
                  "Kamu adalah asisten AI konstruksi jurusan DPIB. Jawablah dengan bahasa Indonesia yang sopan dan edukatif.\n\nPertanyaan:\n" +
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
}

