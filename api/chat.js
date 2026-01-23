const knowledge = require("./knowledge");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const message = (req.query.message || "").toLowerCase();

  if (!message) {
    return res.json({
      reply: "Silakan masukkan pertanyaan seputar konstruksi bangunan."
    });
  }

  let results = [];

  for (const item of knowledge) {
    for (const key of item.keywords) {
      if (message.includes(key)) {
        results.push(item);
        break;
      }
    }
  }

  if (results.length === 0) {
    return res.json({
      reply:
        "Pertanyaan ini berkaitan dengan konstruksi bangunan, namun belum tersedia penjelasan terstruktur di basis pengetahuan saya."
    });
  }

  let reply = "Penjelasan dapat diuraikan sebagai berikut:\n\n";

  results.forEach((item, index) => {
    reply += `${index + 1}. ${item.title}\n${item.explanation}\n\n`;
  });

  reply +=
    "Dengan memahami setiap bagian tersebut, sistem konstruksi bangunan dapat direncanakan dan dilaksanakan secara aman dan efisien.";

  res.json({ reply });
};
