const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("./src/models/User");
const { Post } = require("./src/models/Post");
const { Comment } = require("./src/models/Comment");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blog_platform";

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected!");

    console.log("Clearing old data...");
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    console.log("Creating users...");
    const passwordHash = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      { name: "John Doe", username: "johndoe", email: "john@example.com", passwordHash },
      { name: "Jane Doe", username: "janedoe", email: "jane@example.com", passwordHash },
      { name: "Tech Guru", username: "techguru", email: "guru@tech.com", passwordHash },
      { name: "Creative Mind", username: "creativemind", email: "design@art.com", passwordHash },
      { name: "Traveler", username: "traveler", email: "travel@world.com", passwordHash },
    ]);

    console.log(`${users.length} users created.`);

    console.log("Creating posts...");
    const postsData = [
      {
        title: "Masa Depan Artificial Intelligence di 2026",
        category: "Tech",
        content: `Artificial Intelligence (AI) terus berkembang dengan kecepatan eksponensial. Di tahun 2026, kita melihat integrasi yang lebih dalam antara AI dan kehidupan sehari-hari.

## Tren Utama
1. **Generative AI di mana-mana**: Dari pembuatan kode hingga desain grafis, AI menjadi asisten utama.
2. **AI Etis**: Fokus pada transparansi dan pengurangan bias.
3. **Automasi Rumah**: Rumah pintar yang benar-benar "pintar" dan proaktif.

Bagaimana pendapatmu tentang perkembangan ini?`,
        author: users[2]._id,
      },
      {
        title: "Tips Fotografi Minimalis untuk Pemula",
        category: "Photography",
        content: `Fotografi minimalis adalah tentang "less is more". Ini bukan hanya tentang mengambil gambar objek kosong, tapi tentang komposisi.

### Kunci Fotografi Minimalis:
- **Negative Space**: Berikan ruang bernapas pada subjek.
- **Warna Kontras**: Gunakan warna yang berani atau monokromatik.
- **Pola Geometris**: Cari garis dan bentuk di sekitarmu.

Mulailah dengan memotret langit atau dinding polos dengan satu subjek menarik.`,
        author: users[3]._id,
      },
      {
        title: "Panduan Traveling Hemat ke Jepang",
        category: "Travel",
        content: `Jepang dikenal mahal, tapi sebenarnya bisa murah jika tahu caranya!

1. **Makan di Konbini**: Makanan di minimarket Jepang sangat enak dan murah.
2. **JR Pass**: Hitung dulu rutenya, terkadang tiket ketengan lebih murah.
3. **Capsule Hotel**: Pengalaman unik dan hemat biaya.

Jangan lupa kunjungi Kyoto saat musim gugur, pemandangannya luar biasa!`,
        author: users[4]._id,
      },
      {
        title: "Mengapa React Masih Populer?",
        category: "Tech",
        content: `Meskipun banyak framework baru bermunculan, React tetap menjadi raja library UI. Mengapa?

- **Ekosistem Raksasa**: Hampir semua masalah sudah ada solusinya di npm.
- **Komunitas**: Dukungan komunitas yang masif.
- **Evolusi**: React Server Components mengubah cara kita membangun aplikasi fullstack.

Apakah kalian sudah mencoba React 19?`,
        author: users[0]._id,
      },
      {
        title: "Resep Kopi V60 Sempurna di Rumah",
        category: "Lifestyle",
        content: `Menyeduh kopi manual brew itu seni. V60 adalah salah satu metode paling populer.

**Resep Dasar:**
- 15g Kopi (gilingan medium-fine)
- 250ml Air (suhu 92°C)
- Waktu seduh: 2:30 menit

**Langkah:**
1. Blooming 30g air, tunggu 45 detik.
2. Tuang perlahan hingga 150g.
3. Tuang sisanya hingga 250g.

Nikmati kopi pagimu!`,
        author: users[1]._id,
      },
      {
        title: "Belajar Coding dari Nol: Mulai Dari Mana?",
        category: "Tech",
        content: `Banyak yang bingung harus mulai dari mana saat belajar coding. 

**Saran Jalur:**
1. **HTML & CSS**: Dasar web.
2. **JavaScript**: Logika pemrograman.
3. **Pilih Jalur**: Frontend (React/Vue), Backend (Node/Python), atau Mobile.

Konsistensi adalah kunci!`,
        author: users[2]._id,
      },
      {
        title: "Review Gadget Terbaru: Smart Ring",
        category: "Gadgets",
        content: `Smart Ring mulai menggantikan Smartwatch untuk tracking kesehatan. Bentuknya kecil, baterai tahan lama, dan tidak mengganggu penampilan.

**Fitur Favorit:**
- Sleep Tracking akurat
- Stress Monitoring
- Desain stylish

Harganya memang masih premium, tapi worth it untuk kesehatan jangka panjang.`,
        author: users[0]._id,
      },
      {
        title: "Meditasi 10 Menit Sehari Mengubah Hidupku",
        category: "Wellness",
        content: `Di dunia yang serba cepat, ketenangan adalah barang mewah. Saya mencoba rutin meditasi 10 menit setiap pagi selama sebulan.

**Hasilnya:**
- Fokus meningkat
- Emosi lebih stabil
- Tidur lebih nyenyak

Cobalah aplikasi seperti Headspace atau Calm untuk memulai.`,
        author: users[3]._id,
      },
    ];

    const posts = await Post.insertMany(postsData);
    console.log(`${posts.length} posts created.`);

    console.log("Creating comments...");
    const commentsData = [
      { content: "Artikel yang sangat membuka wawasan!", author: users[1]._id, post: posts[0]._id },
      { content: "Saya setuju, AI memang menakutkan tapi juga membantu.", author: users[4]._id, post: posts[0]._id },
      { content: "Terima kasih tipsnya! Langsung praktek.", author: users[0]._id, post: posts[1]._id },
      { content: "Jepang memang destinasi impian.", author: users[1]._id, post: posts[2]._id },
      { content: "React for the win!", author: users[2]._id, post: posts[3]._id },
      { content: "Saya lebih suka French Press, tapi boleh dicoba.", author: users[3]._id, post: posts[4]._id },
    ];

    await Comment.insertMany(commentsData);
    console.log(`${commentsData.length} comments created.`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seedData();
