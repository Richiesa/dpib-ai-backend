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
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
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

    const data = await groqRes.json();

    // 🔑 PARSING AMAN
    const reply =
      data &&
      data.choices &&
      data.choices.length > 0 &&
      data.choices[0].message &&
      data.choices[0].message.content;

    if (!reply) {
      console.log("Groq response:", JSON.stringify(data));
      return res
        .status(200)
        .json({ reply: "AI tidak dapat memberikan jawaban (response kosong)." });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      reply: "Terjadi kesalahan server AI."
    });
  }
}
