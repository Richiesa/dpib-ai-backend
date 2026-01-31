const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://richiesa.github.io",
          "X-Title": "DPIB AI Assistant"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
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
          temperature: 0.4
        })
      }
    );

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.log("OPENROUTER RAW:", JSON.stringify(data));
      return res.status(200).json({
        reply: "AI aktif namun belum memberikan jawaban."
      });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      reply: "Terjadi kesalahan server AI."
    });
  }
}
