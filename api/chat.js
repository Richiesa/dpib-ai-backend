const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
  // ===== CORS =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // ===============

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method tidak diizinkan." });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "Pesan kosong." });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "HTTP-Referer": "https://richiesa.github.io",
          "X-Title": "DPIB AI Assistant"
        },
        body: JSON.stringify({
          model: "qwen/qwen3-next-80b-a3b-instruct:free",
          messages: [
            {
              role: "system",
              content:
                "Kamu adalah asisten AI jurusan DPIB yang ahli konstruksi bangunan, struktur, RAB, dan gambar teknik."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 512,
          temperature: 0.4,
          stream: false
        })
      }
    );

    const data = await response.json();

    console.log("OPENROUTER RESPONSE:", JSON.stringify(data));

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(200).json({
        reply: "AI backend aktif, namun model belum mengembalikan jawaban."
      });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({
      reply: "Terjadi kesalahan pada server AI."
    });
  }
}


