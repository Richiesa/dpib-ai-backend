module.exports = (req, res) => {
  // ===== CORS HEADER (WAJIB) =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { message } = req.query;

  if (!message) {
    return res.status(400).json({
      reply: "Pesan tidak boleh kosong."
    });
  }

  const text = message.toLowerCase();
  let reply = "Pertanyaan di luar ruang lingkup konstruksi DPIB.";

  if (text.includes("rab")) {
    reply =
      "RAB (Rencana Anggaran Biaya) adalah perhitungan biaya konstruksi yang mencakup material, upah, dan pekerjaan.";
  } else if (text.includes("kolom")) {
    reply =
      "Kolom adalah elemen struktur tekan vertikal yang menyalurkan beban ke pondasi.";
  } else if (text.includes("render")) {
    reply =
      "Rendering digunakan untuk menampilkan visual bangunan secara realistis.";
  } else if (text.includes("drafting")) {
    reply =
      "Drafting adalah proses penggambaran teknis bangunan sesuai standar kerja.";
  }

  res.status(200).json({ reply });
};
