module.exports = (req, res) => {
  const { message } = req.query;

  if (!message) {
    return res.status(400).json({
      error: "Pesan tidak boleh kosong"
    });
  }

  let response = "Pertanyaan belum dikenali.";

  const text = message.toLowerCase();

  if (text.includes("rab")) {
    response =
      "RAB (Rencana Anggaran Biaya) adalah perhitungan biaya konstruksi yang mencakup pekerjaan, material, dan upah tenaga kerja.";
  } 
  else if (text.includes("kolom")) {
    response =
      "Kolom berfungsi sebagai elemen struktur tekan yang menyalurkan beban dari balok ke pondasi.";
  } 
  else if (text.includes("render")) {
    response =
      "Rendering digunakan untuk menampilkan visual bangunan secara realistis menggunakan software seperti SketchUp, Lumion, atau Enscape.";
  } 
  else if (text.includes("drafting")) {
    response =
      "Drafting adalah proses penggambaran teknis bangunan secara detail, baik 2D maupun 3D.";
  }

  res.status(200).json({
    reply: response
  });
};
