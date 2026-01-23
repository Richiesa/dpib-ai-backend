module.exports = (req, res) => {
  const { message } = req.query;

  if (!message) {
    return res.status(400).json({
      error: "Pesan tidak boleh kosong"
    });
  }

  const text = message.toLowerCase();
  let reply = "Maaf, pertanyaan ini diluar konteks konstruksi. Saya sebagai asisten DPIB hanya melayani pertanyaan seputar konstruksi.";

  // ===== RAB =====
  if (text.includes("rab")) {
    reply =
      "RAB (Rencana Anggaran Biaya) adalah perhitungan total biaya konstruksi yang meliputi pekerjaan persiapan, struktur, arsitektur, MEP, material, dan upah tenaga kerja.";
  }
  else if (text.includes("analisa harga satuan")) {
    reply =
      "Analisa Harga Satuan Pekerjaan (AHSP) digunakan untuk menentukan biaya satu item pekerjaan berdasarkan koefisien tenaga, bahan, dan alat.";
  }
  else if (text.includes("volume pekerjaan")) {
    reply =
      "Volume pekerjaan dihitung berdasarkan gambar kerja, misalnya panjang × lebar × tinggi atau luas × tebal, sesuai jenis pekerjaannya.";
  }

  // ===== STRUKTUR =====
  else if (text.includes("kolom")) {
    reply =
      "Kolom merupakan elemen struktur tekan vertikal yang berfungsi menyalurkan beban dari balok dan pelat menuju pondasi.";
  }
  else if (text.includes("balok")) {
    reply =
      "Balok berfungsi menahan beban lentur dan meneruskannya ke kolom. Balok umumnya bekerja bersama pelat lantai.";
  }
  else if (text.includes("pondasi")) {
    reply =
      "Pondasi berfungsi meneruskan beban bangunan ke tanah. Jenis pondasi ditentukan oleh beban bangunan dan daya dukung tanah.";
  }

  // ===== DRAFTING =====
  else if (text.includes("drafting")) {
    reply =
      "Drafting adalah proses penggambaran teknis bangunan secara detail menggunakan standar gambar, skala, dan notasi yang jelas.";
  }
  else if (text.includes("autocad")) {
    reply =
      "AutoCAD digunakan untuk membuat gambar kerja 2D seperti denah, tampak, potongan, dan detail konstruksi.";
  }

  // ===== RENDERING =====
  else if (text.includes("render") || text.includes("rendering")) {
    reply =
      "Rendering digunakan untuk menampilkan visual bangunan secara realistis dengan pencahayaan, material, dan lingkungan.";
  }
  else if (text.includes("sketchup")) {
    reply =
      "SketchUp digunakan untuk pemodelan 3D bangunan sebelum dilakukan rendering.";
  }
  if (text.length < 5) {
  reply = "Mohon jelaskan pertanyaan dengan lebih lengkap.";
  }


  res.status(200).json({ reply });
};

