import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const PLACEHOLDER_IMAGE = 'https://placehold.co/800x1200'

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const existingAdmin = await prisma.admin.findFirst({
    where: { role: 'Superadmin' }
  })

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        name: 'Adnan Pundong',
        username: 'mugetsu',
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: 'Superadmin'
      }
    })
  }

  const userPassword = await bcrypt.hash('user123', 10)

  await prisma.users.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'User Demo',
      email: 'user@example.com',
      password: userPassword,
      provider: 'Email'
    }
  })

  const categoriesData = [
    { name: 'Novel',                 slug: 'novel',                 image_url: 'https://placehold.co/800x400?text=Novel' },
    { name: 'Komik & Manga',         slug: 'komik-manga',           image_url: 'https://placehold.co/800x400?text=Komik' },
    { name: 'Pendidikan',            slug: 'pendidikan',            image_url: 'https://placehold.co/800x400?text=Pendidikan' },
    { name: 'Teknologi & Komputer',  slug: 'teknologi-komputer',    image_url: 'https://placehold.co/800x400?text=Teknologi' },
    { name: 'Anak & Remaja',         slug: 'anak-remaja',           image_url: 'https://placehold.co/800x400?text=Anak' },
    { name: 'Bisnis & Ekonomi',      slug: 'bisnis-ekonomi',        image_url: 'https://placehold.co/800x400?text=Bisnis' },
    { name: 'Self Improvement',      slug: 'self-improvement',      image_url: 'https://placehold.co/800x400?text=SelfImprovement' },
    { name: 'Agama & Spiritualitas', slug: 'agama-spiritualitas',   image_url: 'https://placehold.co/800x400?text=Agama' },
  ]

  const categories = []

  for (const cat of categoriesData) {
    const category = await prisma.categories.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        image_url: cat.image_url
      }
    })
    categories.push(category)
  }

  const booksData = [
    // ── NOVEL ─────────────────────────────────
    {
      name: 'Laskar Pelangi',
      slug: 'laskar-pelangi',
      categorySlug: 'novel',
      desc: 'Kisah persahabatan sepuluh anak Melayu Belitung yang berjuang menempuh pendidikan di sekolah miskin namun penuh semangat. Novel fenomenal karya Andrea Hirata yang menginspirasi jutaan pembaca Indonesia.',
      author: 'Andrea Hirata',
      publisher: 'Bentang Pustaka',
      language: 'Indonesia',
      page: 529, length: 20.5, width: 13.5, weight: 0.45,
      price: 89000, discount_price: 75000, qty: 50,
      published_at: new Date('2005-09-26'),
    },
    {
      name: 'Bumi',
      slug: 'bumi-tere-liye',
      categorySlug: 'novel',
      desc: 'Raib, seorang gadis 15 tahun yang bisa menghilang, terseret ke petualangan luar biasa di dunia paralel. Seri Bumi dari Tere Liye yang memukau pembaca semua usia.',
      author: 'Tere Liye',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 440, length: 20.0, width: 13.5, weight: 0.38,
      price: 89000, discount_price: null, qty: 45,
      published_at: new Date('2014-08-15'),
    },
    {
      name: 'Dilan: Dia adalah Dilanku Tahun 1990',
      slug: 'dilan-1990',
      categorySlug: 'novel',
      desc: 'Kisah cinta remaja yang manis antara Milea dan Dilan di Bandung tahun 1990. Novel yang berhasil memikat hati jutaan pembaca Indonesia dengan dialog-dialog romantisnya.',
      author: 'Pidi Baiq',
      publisher: 'Pastel Books',
      language: 'Indonesia',
      page: 358, length: 20.0, width: 13.5, weight: 0.32,
      price: 79000, discount_price: 65000, qty: 60,
      published_at: new Date('2014-01-01'),
    },
    {
      name: 'Perahu Kertas',
      slug: 'perahu-kertas',
      categorySlug: 'novel',
      desc: 'Kugy dan Keenan, dua anak muda yang dipertemukan oleh takdir. Kisah cinta dan mimpi yang mengalir seperti perahu kertas di arus sungai.',
      author: 'Dewi Lestari',
      publisher: 'Bentang Pustaka',
      language: 'Indonesia',
      page: 444, length: 20.5, width: 13.5, weight: 0.40,
      price: 85000, discount_price: null, qty: 40,
      published_at: new Date('2009-08-29'),
    },
    {
      name: 'Negeri 5 Menara',
      slug: 'negeri-5-menara',
      categorySlug: 'novel',
      desc: 'Kisah Alif dan lima sahabatnya di pesantren Madani, yang belajar meraih impian dengan kekuatan Man Jadda Wajada. Novel inspiratif tentang semangat dan persahabatan.',
      author: 'Ahmad Fuadi',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 423, length: 20.5, width: 13.5, weight: 0.37,
      price: 88000, discount_price: 72000, qty: 35,
      published_at: new Date('2009-07-01'),
    },
    {
      name: 'Ayah',
      slug: 'ayah-andrea-hirata',
      categorySlug: 'novel',
      desc: 'Novel terbaru Andrea Hirata tentang kisah seorang ayah yang berjuang demi putrinya. Penuh haru, cinta, dan kejutan yang khas dari sang maestro sastra Indonesia.',
      author: 'Andrea Hirata',
      publisher: 'Bentang Pustaka',
      language: 'Indonesia',
      page: 412, length: 20.5, width: 13.5, weight: 0.38,
      price: 95000, discount_price: null, qty: 30,
      published_at: new Date('2015-05-01'),
    },
    {
      name: 'Hujan',
      slug: 'hujan-tere-liye',
      categorySlug: 'novel',
      desc: 'Kisah di masa depan tentang Lail dan Esok, dua anak yang selamat dari bencana dahsyat. Novel sains fiksi romansa karya Tere Liye yang menyentuh hati.',
      author: 'Tere Liye',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 320, length: 20.0, width: 13.5, weight: 0.29,
      price: 85000, discount_price: 70000, qty: 55,
      published_at: new Date('2016-01-27'),
    },
    {
      name: 'Cantik Itu Luka',
      slug: 'cantik-itu-luka',
      categorySlug: 'novel',
      desc: 'Tentang Dewi Ayu, seorang pelacur cantik yang mewariskan kutukan kecantikan pada keturunannya. Karya Eka Kurniawan yang diakui sebagai karya besar sastra Indonesia modern.',
      author: 'Eka Kurniawan',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 505, length: 20.5, width: 13.5, weight: 0.44,
      price: 98000, discount_price: null, qty: 25,
      published_at: new Date('2002-09-01'),
    },
    {
      name: 'Laut Bercerita',
      slug: 'laut-bercerita',
      categorySlug: 'novel',
      desc: 'Kisah tentang aktivis mahasiswa yang hilang di era Orde Baru. Novel sejarah karya Leila S. Chudori yang menggetarkan tentang mereka yang tak pernah kembali.',
      author: 'Leila S. Chudori',
      publisher: 'Kepustakaan Populer Gramedia',
      language: 'Indonesia',
      page: 379, length: 20.5, width: 13.5, weight: 0.34,
      price: 89000, discount_price: null, qty: 45,
      published_at: new Date('2017-10-01'),
    },
    {
      name: 'Sang Pemimpi',
      slug: 'sang-pemimpi',
      categorySlug: 'novel',
      desc: 'Sekuel Laskar Pelangi. Ikal dan Arai bermimpi besar menjelajahi Eropa dan belajar di Sorbonne. Kisah semangat yang membara dari Andrea Hirata.',
      author: 'Andrea Hirata',
      publisher: 'Bentang Pustaka',
      language: 'Indonesia',
      page: 292, length: 20.5, width: 13.5, weight: 0.28,
      price: 79000, discount_price: 65000, qty: 40,
      published_at: new Date('2006-07-27'),
    },
    {
      name: 'Bumi Manusia',
      slug: 'bumi-manusia',
      categorySlug: 'novel',
      desc: 'Minke menemukan cintanya kepada Annelies di era kolonial Belanda. Masterpiece Pramoedya Ananta Toer tentang kebangkitan kesadaran nasional Indonesia.',
      author: 'Pramoedya Ananta Toer',
      publisher: 'Lentera Dipantara',
      language: 'Indonesia',
      page: 535, length: 20.5, width: 13.5, weight: 0.47,
      price: 110000, discount_price: 90000, qty: 35,
      published_at: new Date('2005-01-01'),
    },

    // ── KOMIK & MANGA ─────────────────────────
    {
      name: 'Naruto Vol. 1',
      slug: 'naruto-vol-1',
      categorySlug: 'komik-manga',
      desc: 'Petualangan Naruto Uzumaki, seorang ninja muda yang bermimpi menjadi Hokage. Volume perdana dari manga legendaris karya Masashi Kishimoto.',
      author: 'Masashi Kishimoto',
      publisher: 'Elex Media Komputindo',
      language: 'Indonesia',
      page: 192, length: 18.0, width: 12.8, weight: 0.19,
      price: 25000, discount_price: 20000, qty: 100,
      published_at: new Date('2000-09-21'),
    },
    {
      name: 'One Piece Vol. 1',
      slug: 'one-piece-vol-1',
      categorySlug: 'komik-manga',
      desc: 'Monkey D. Luffy memulai perjalanannya menjadi Raja Bajak Laut. Volume perdana dari manga terlaris di dunia karya Eiichiro Oda.',
      author: 'Eiichiro Oda',
      publisher: 'Elex Media Komputindo',
      language: 'Indonesia',
      page: 216, length: 18.0, width: 12.8, weight: 0.20,
      price: 25000, discount_price: null, qty: 120,
      published_at: new Date('1997-07-22'),
    },
    {
      name: 'Attack on Titan Vol. 1',
      slug: 'attack-on-titan-vol-1',
      categorySlug: 'komik-manga',
      desc: 'Di dunia yang dikepung Titan, Eren Yeager bertekad membasmi makhluk raksasa pemangsa manusia. Volume pertama manga fenomenal karya Hajime Isayama.',
      author: 'Hajime Isayama',
      publisher: 'Elex Media Komputindo',
      language: 'Indonesia',
      page: 193, length: 18.0, width: 12.8, weight: 0.19,
      price: 30000, discount_price: 25000, qty: 80,
      published_at: new Date('2009-09-09'),
    },
    {
      name: 'Spy x Family Vol. 1',
      slug: 'spy-x-family-vol-1',
      categorySlug: 'komik-manga',
      desc: 'Agen Twilight harus membentuk keluarga palsu untuk misi rahasianya. Kisah komedi aksi keluarga yang menggemaskan karya Tatsuya Endo.',
      author: 'Tatsuya Endo',
      publisher: 'Elex Media Komputindo',
      language: 'Indonesia',
      page: 208, length: 18.0, width: 12.8, weight: 0.20,
      price: 30000, discount_price: null, qty: 90,
      published_at: new Date('2019-07-04'),
    },

    // ── PENDIDIKAN ────────────────────────────
    {
      name: 'Matematika untuk SMA Kelas X',
      slug: 'matematika-sma-kelas-x',
      categorySlug: 'pendidikan',
      desc: 'Buku pelajaran Matematika lengkap untuk siswa SMA Kelas X kurikulum Merdeka. Dilengkapi contoh soal, latihan, dan pembahasan yang komprehensif.',
      author: 'Tim Penulis Erlangga',
      publisher: 'Erlangga',
      language: 'Indonesia',
      page: 380, length: 27.0, width: 21.0, weight: 0.70,
      price: 115000, discount_price: 95000, qty: 200,
      published_at: new Date('2022-07-01'),
    },
    {
      name: 'Fisika untuk SMA Kelas XI',
      slug: 'fisika-sma-kelas-xi',
      categorySlug: 'pendidikan',
      desc: 'Buku Fisika SMA Kelas XI yang membahas mekanika, termodinamika, gelombang, dan listrik dengan pendekatan konseptual dan matematis yang sistematis.',
      author: 'Marthen Kanginan',
      publisher: 'Erlangga',
      language: 'Indonesia',
      page: 420, length: 27.0, width: 21.0, weight: 0.75,
      price: 125000, discount_price: null, qty: 150,
      published_at: new Date('2022-07-01'),
    },
    {
      name: 'Kimia Dasar Jilid 1',
      slug: 'kimia-dasar-jilid-1',
      categorySlug: 'pendidikan',
      desc: 'Buku teks Kimia Dasar komprehensif untuk mahasiswa semester pertama. Membahas struktur atom, ikatan kimia, stoikiometri, dan termodinamika dasar.',
      author: 'Raymond Chang',
      publisher: 'Erlangga',
      language: 'Indonesia',
      page: 536, length: 27.5, width: 21.5, weight: 1.10,
      price: 195000, discount_price: 165000, qty: 80,
      published_at: new Date('2021-01-01'),
    },
    {
      name: 'Bahasa Indonesia untuk Perguruan Tinggi',
      slug: 'bahasa-indonesia-perguruan-tinggi',
      categorySlug: 'pendidikan',
      desc: 'Panduan lengkap berbahasa Indonesia yang baik dan benar untuk mahasiswa. Mencakup tata bahasa, penulisan karya ilmiah, dan komunikasi akademik.',
      author: 'Siti Annijat Maimunah',
      publisher: 'UB Press',
      language: 'Indonesia',
      page: 292, length: 24.0, width: 17.0, weight: 0.55,
      price: 85000, discount_price: null, qty: 120,
      published_at: new Date('2020-01-01'),
    },
    {
      name: 'Matematika Diskrit',
      slug: 'matematika-diskrit',
      categorySlug: 'pendidikan',
      desc: 'Buku teks Matematika Diskrit untuk mahasiswa ilmu komputer. Membahas logika, teori himpunan, kombinatorika, teori graf, dan aljabar boolean.',
      author: 'Kenneth H. Rosen',
      publisher: 'Erlangga',
      language: 'Indonesia',
      page: 745, length: 27.5, width: 21.5, weight: 1.35,
      price: 245000, discount_price: 198000, qty: 60,
      published_at: new Date('2021-07-01'),
    },
    {
      name: 'Biologi untuk SMA Kelas XII',
      slug: 'biologi-sma-kelas-xii',
      categorySlug: 'pendidikan',
      desc: 'Buku Biologi SMA Kelas XII Kurikulum Merdeka yang membahas bioteknologi, genetika molekuler, evolusi, dan ekosistem secara komprehensif.',
      author: 'Istamar Syamsuri',
      publisher: 'Erlangga',
      language: 'Indonesia',
      page: 398, length: 27.0, width: 21.0, weight: 0.72,
      price: 120000, discount_price: 99000, qty: 160,
      published_at: new Date('2022-07-01'),
    },

    // ── TEKNOLOGI & KOMPUTER ──────────────────
    {
      name: 'Pemrograman Python untuk Pemula',
      slug: 'pemrograman-python-pemula',
      categorySlug: 'teknologi-komputer',
      desc: 'Belajar Python dari nol hingga mahir. Membahas dasar-dasar pemrograman, struktur data, fungsi, OOP, dan proyek nyata.',
      author: 'Andi Offset',
      publisher: 'Andi',
      language: 'Indonesia',
      page: 350, length: 23.5, width: 17.5, weight: 0.60,
      price: 125000, discount_price: 99000, qty: 75,
      published_at: new Date('2023-03-01'),
    },
    {
      name: 'JavaScript: The Good Parts',
      slug: 'javascript-the-good-parts',
      categorySlug: 'teknologi-komputer',
      desc: 'Panduan ringkas namun mendalam tentang bagian terbaik dari JavaScript. Buku wajib bagi setiap developer JavaScript yang ingin menulis kode berkualitas.',
      author: 'Douglas Crockford',
      publisher: 'Elex Media Komputindo',
      language: 'Indonesia',
      page: 172, length: 23.5, width: 17.0, weight: 0.32,
      price: 85000, discount_price: null, qty: 60,
      published_at: new Date('2020-05-01'),
    },
    {
      name: 'Belajar Machine Learning dengan Python',
      slug: 'belajar-machine-learning-python',
      categorySlug: 'teknologi-komputer',
      desc: 'Pengantar Machine Learning praktis menggunakan Python dan scikit-learn. Dari regresi linier hingga neural network, lengkap dengan studi kasus nyata.',
      author: 'Aurélien Géron',
      publisher: 'Elex Media Komputindo',
      language: 'Indonesia',
      page: 526, length: 23.5, width: 17.5, weight: 0.95,
      price: 195000, discount_price: 165000, qty: 50,
      published_at: new Date('2022-01-01'),
    },
    {
      name: 'Docker dan Kubernetes untuk Developer',
      slug: 'docker-kubernetes-developer',
      categorySlug: 'teknologi-komputer',
      desc: 'Panduan praktis containerisasi aplikasi dengan Docker dan orkestrasi dengan Kubernetes. Dari instalasi hingga deployment production-ready.',
      author: 'Fajar Sentosa',
      publisher: 'Andi',
      language: 'Indonesia',
      page: 310, length: 23.5, width: 17.5, weight: 0.58,
      price: 135000, discount_price: null, qty: 45,
      published_at: new Date('2023-06-01'),
    },
    {
      name: 'Clean Code',
      slug: 'clean-code',
      categorySlug: 'teknologi-komputer',
      desc: 'Panduan menulis kode yang bersih, mudah dibaca, dan mudah di-maintain. Buku klasik karya Robert C. Martin yang wajib dibaca setiap programmer.',
      author: 'Robert C. Martin',
      publisher: 'Elex Media Komputindo',
      language: 'Indonesia',
      page: 431, length: 23.5, width: 17.5, weight: 0.75,
      price: 185000, discount_price: 155000, qty: 40,
      published_at: new Date('2021-01-01'),
    },
    {
      name: 'Design Patterns: Elements of Reusable OO Software',
      slug: 'design-patterns-gang-of-four',
      categorySlug: 'teknologi-komputer',
      desc: 'Buku klasik dari Gang of Four yang memperkenalkan 23 pola desain perangkat lunak. Referensi wajib untuk setiap software engineer profesional.',
      author: 'Gang of Four',
      publisher: 'Elex Media Komputindo',
      language: 'Indonesia',
      page: 395, length: 23.5, width: 17.5, weight: 0.70,
      price: 195000, discount_price: null, qty: 30,
      published_at: new Date('2020-01-01'),
    },
    {
      name: 'Node.js dan Express.js untuk Backend Developer',
      slug: 'nodejs-expressjs-backend',
      categorySlug: 'teknologi-komputer',
      desc: 'Panduan lengkap membangun REST API dengan Node.js dan Express.js. Dari setup project, routing, middleware, hingga deployment ke cloud.',
      author: 'Dhimas Prayoga',
      publisher: 'Andi',
      language: 'Indonesia',
      page: 388, length: 23.5, width: 17.5, weight: 0.68,
      price: 148000, discount_price: 122000, qty: 55,
      published_at: new Date('2023-09-01'),
    },
    {
      name: 'Database Design dengan PostgreSQL',
      slug: 'database-design-postgresql',
      categorySlug: 'teknologi-komputer',
      desc: 'Panduan desain database relasional menggunakan PostgreSQL. Meliputi normalisasi, indexing, query optimization, dan best practices untuk aplikasi skala besar.',
      author: 'Budi Raharjo',
      publisher: 'Informatika',
      language: 'Indonesia',
      page: 340, length: 23.5, width: 17.5, weight: 0.60,
      price: 130000, discount_price: null, qty: 40,
      published_at: new Date('2022-11-01'),
    },

    // ── ANAK & REMAJA ─────────────────────────
    {
      name: 'Ensiklopedia Anak: Tubuh Manusia',
      slug: 'ensiklopedia-anak-tubuh-manusia',
      categorySlug: 'anak-remaja',
      desc: 'Buku ensiklopedia bergambar yang memperkenalkan anatomi tubuh manusia kepada anak-anak dengan cara yang menyenangkan dan mudah dipahami.',
      author: 'Tim DK Publishing',
      publisher: 'Gramedia Widiasarana Indonesia',
      language: 'Indonesia',
      page: 208, length: 28.0, width: 22.0, weight: 0.85,
      price: 135000, discount_price: 110000, qty: 65,
      published_at: new Date('2021-06-01'),
    },
    {
      name: 'Serial Si Kancil: Kancil dan Buaya',
      slug: 'si-kancil-dan-buaya',
      categorySlug: 'anak-remaja',
      desc: 'Cerita rakyat Indonesia tentang kancil yang cerdik berhasil menipu buaya-buaya jahat untuk menyeberangi sungai. Buku bergambar penuh warna untuk anak usia 4-8 tahun.',
      author: 'Tim Gramedia',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 32, length: 24.0, width: 20.0, weight: 0.18,
      price: 45000, discount_price: null, qty: 150,
      published_at: new Date('2020-01-01'),
    },
    {
      name: 'Diary of a Wimpy Kid: Greg\'s Diary',
      slug: 'diary-wimpy-kid',
      categorySlug: 'anak-remaja',
      desc: 'Kisah lucu kehidupan Greg Heffley sebagai anak SMP yang dicatat dalam buku hariannya. Novel grafis populer untuk anak usia 8-12 tahun.',
      author: 'Jeff Kinney',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 224, length: 21.5, width: 14.0, weight: 0.28,
      price: 75000, discount_price: 62000, qty: 85,
      published_at: new Date('2019-03-01'),
    },
    {
      name: 'Harry Potter dan Batu Bertuah',
      slug: 'harry-potter-batu-bertuah',
      categorySlug: 'anak-remaja',
      desc: 'Harry Potter menemukan bahwa dirinya adalah seorang penyihir dan memulai petualangan ajaib di Hogwarts. Buku pertama dari serial legendaris karya J.K. Rowling.',
      author: 'J.K. Rowling',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 384, length: 20.5, width: 13.5, weight: 0.36,
      price: 98000, discount_price: null, qty: 70,
      published_at: new Date('2000-05-01'),
    },
    {
      name: 'Anak Sejuta Bintang',
      slug: 'anak-sejuta-bintang',
      categorySlug: 'anak-remaja',
      desc: 'Biografi inspiratif tentang seorang anak dari Tapanuli yang berhasil meraih mimpi setinggi bintang dengan kerja keras dan tekad yang pantang menyerah.',
      author: 'Arief Munandar',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 312, length: 21.0, width: 14.0, weight: 0.31,
      price: 88000, discount_price: null, qty: 50,
      published_at: new Date('2020-08-01'),
    },

    // ── BISNIS & EKONOMI ──────────────────────
    {
      name: 'Rich Dad Poor Dad',
      slug: 'rich-dad-poor-dad',
      categorySlug: 'bisnis-ekonomi',
      desc: 'Pelajaran tentang uang yang tidak diajarkan di sekolah. Robert Kiyosaki berbagi cara berpikir orang kaya vs orang miskin dalam memandang keuangan dan investasi.',
      author: 'Robert T. Kiyosaki',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 310, length: 21.0, width: 14.0, weight: 0.30,
      price: 99000, discount_price: 80000, qty: 90,
      published_at: new Date('2020-01-01'),
    },
    {
      name: 'Zero to One',
      slug: 'zero-to-one',
      categorySlug: 'bisnis-ekonomi',
      desc: 'Peter Thiel berbagi filosofi membangun startup yang menciptakan sesuatu baru, bukan sekadar menduplikasi. Buku wajib bagi setiap entrepreneur.',
      author: 'Peter Thiel',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 258, length: 21.0, width: 14.0, weight: 0.26,
      price: 95000, discount_price: null, qty: 55,
      published_at: new Date('2021-04-01'),
    },
    {
      name: 'The Lean Startup',
      slug: 'the-lean-startup',
      categorySlug: 'bisnis-ekonomi',
      desc: 'Eric Ries memperkenalkan metode Lean untuk membangun bisnis dengan efisien. Pendekatan build-measure-learn yang telah mengubah cara ribuan startup berkembang.',
      author: 'Eric Ries',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 320, length: 21.0, width: 14.0, weight: 0.31,
      price: 99000, discount_price: 82000, qty: 50,
      published_at: new Date('2020-06-01'),
    },
    {
      name: 'Ekonomi Indonesia di Era Digital',
      slug: 'ekonomi-indonesia-era-digital',
      categorySlug: 'bisnis-ekonomi',
      desc: 'Analisis komprehensif tentang transformasi ekonomi Indonesia di era digital. Membahas peluang, tantangan, dan strategi menghadapi disruption teknologi.',
      author: 'Rhenald Kasali',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 365, length: 21.0, width: 14.0, weight: 0.34,
      price: 115000, discount_price: null, qty: 45,
      published_at: new Date('2021-08-01'),
    },
    {
      name: 'Manajemen Keuangan untuk UKM',
      slug: 'manajemen-keuangan-ukm',
      categorySlug: 'bisnis-ekonomi',
      desc: 'Panduan praktis mengelola keuangan usaha kecil dan menengah. Dari pembukuan dasar, cashflow management, hingga strategi mendapatkan modal usaha.',
      author: 'Bramantyo Djohanputro',
      publisher: 'PPM Manajemen',
      language: 'Indonesia',
      page: 286, length: 23.0, width: 16.0, weight: 0.52,
      price: 105000, discount_price: 88000, qty: 70,
      published_at: new Date('2022-03-01'),
    },
    {
      name: 'The Psychology of Money',
      slug: 'psychology-of-money',
      categorySlug: 'bisnis-ekonomi',
      desc: 'Morgan Housel mengungkap cara aneh orang berpikir tentang uang. Buku yang menjelaskan mengapa keputusan keuangan lebih dipengaruhi psikologi daripada logika.',
      author: 'Morgan Housel',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 256, length: 21.0, width: 14.0, weight: 0.26,
      price: 99000, discount_price: 82000, qty: 75,
      published_at: new Date('2022-08-01'),
    },
    {
      name: 'Investasi Saham untuk Pemula',
      slug: 'investasi-saham-pemula',
      categorySlug: 'bisnis-ekonomi',
      desc: 'Panduan lengkap belajar investasi saham di Bursa Efek Indonesia. Dari membuka rekening efek, analisis fundamental, teknikal, hingga strategi jangka panjang.',
      author: 'Lukas Setia Atmaja',
      publisher: 'Andi',
      language: 'Indonesia',
      page: 275, length: 23.0, width: 16.0, weight: 0.50,
      price: 115000, discount_price: null, qty: 85,
      published_at: new Date('2023-01-01'),
    },

    // ── SELF IMPROVEMENT ──────────────────────
    {
      name: 'Atomic Habits',
      slug: 'atomic-habits',
      categorySlug: 'self-improvement',
      desc: 'James Clear mengungkap cara mudah membangun kebiasaan baik dan menghilangkan kebiasaan buruk. Perubahan kecil yang menghasilkan hasil luar biasa.',
      author: 'James Clear',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 320, length: 21.0, width: 14.0, weight: 0.31,
      price: 98000, discount_price: 82000, qty: 100,
      published_at: new Date('2022-01-01'),
    },
    {
      name: 'The 7 Habits of Highly Effective People',
      slug: '7-habits-highly-effective-people',
      categorySlug: 'self-improvement',
      desc: 'Stephen Covey mempersembahkan tujuh kebiasaan orang yang sangat efektif. Buku pengembangan diri legendaris yang telah mengubah jutaan kehidupan di seluruh dunia.',
      author: 'Stephen R. Covey',
      publisher: 'Binarupa Aksara',
      language: 'Indonesia',
      page: 358, length: 21.0, width: 14.0, weight: 0.34,
      price: 105000, discount_price: null, qty: 75,
      published_at: new Date('2020-01-01'),
    },
    {
      name: 'Ikigai: Rahasia Hidup Bahagia ala Jepang',
      slug: 'ikigai-rahasia-hidup-bahagia',
      categorySlug: 'self-improvement',
      desc: 'Konsep Jepang tentang menemukan alasan untuk hidup. Buku yang membantu pembaca menemukan passion, misi, profesi, dan vokasi dalam satu titik keseimbangan.',
      author: 'Héctor García & Francesc Miralles',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 208, length: 21.0, width: 14.0, weight: 0.23,
      price: 79000, discount_price: 65000, qty: 85,
      published_at: new Date('2021-03-01'),
    },
    {
      name: 'Start with Why',
      slug: 'start-with-why',
      categorySlug: 'self-improvement',
      desc: 'Simon Sinek mengajarkan bahwa pemimpin dan organisasi yang inspiratif selalu mulai dari pertanyaan Mengapa. Temukan purpose Anda dan raih kesuksesan sejati.',
      author: 'Simon Sinek',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 254, length: 21.0, width: 14.0, weight: 0.25,
      price: 89000, discount_price: null, qty: 65,
      published_at: new Date('2021-06-01'),
    },
    {
      name: 'Deep Work',
      slug: 'deep-work-cal-newport',
      categorySlug: 'self-improvement',
      desc: 'Cal Newport mengajarkan cara bekerja dengan fokus mendalam di era penuh distraksi. Kemampuan deep work adalah superpower di abad ke-21.',
      author: 'Cal Newport',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 296, length: 21.0, width: 14.0, weight: 0.28,
      price: 95000, discount_price: 78000, qty: 55,
      published_at: new Date('2022-04-01'),
    },
    {
      name: 'Mindset: The New Psychology of Success',
      slug: 'mindset-carol-dweck',
      categorySlug: 'self-improvement',
      desc: 'Carol Dweck membuktikan bahwa pola pikir (mindset) adalah kunci kesuksesan. Perbedaan fixed mindset vs growth mindset dan cara mengubahnya.',
      author: 'Carol S. Dweck',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 278, length: 21.0, width: 14.0, weight: 0.27,
      price: 85000, discount_price: null, qty: 60,
      published_at: new Date('2021-09-01'),
    },
    {
      name: 'Think and Grow Rich',
      slug: 'think-and-grow-rich',
      categorySlug: 'self-improvement',
      desc: 'Napoleon Hill mengungkap 13 prinsip sukses berdasarkan wawancara dengan 500 orang paling sukses di Amerika. Buku motivasi klasik yang tak lekang oleh waktu.',
      author: 'Napoleon Hill',
      publisher: 'Gramedia Pustaka Utama',
      language: 'Indonesia',
      page: 302, length: 21.0, width: 14.0, weight: 0.29,
      price: 89000, discount_price: 73000, qty: 70,
      published_at: new Date('2019-06-01'),
    },

    // ── AGAMA & SPIRITUALITAS ─────────────────
    {
      name: 'Quran Terjemah & Tafsir',
      slug: 'quran-terjemah-tafsir',
      categorySlug: 'agama-spiritualitas',
      desc: 'Al-Quran lengkap dengan terjemahan dan tafsir ringkas dalam bahasa Indonesia. Dilengkapi asbabun nuzul, indeks tema, dan khat yang mudah dibaca.',
      author: 'Tim Lajnah Pentashih',
      publisher: 'Cordoba',
      language: 'Indonesia',
      page: 792, length: 24.0, width: 17.0, weight: 1.20,
      price: 185000, discount_price: 155000, qty: 200,
      published_at: new Date('2020-01-01'),
    },
    {
      name: 'Sirah Nabawiyah',
      slug: 'sirah-nabawiyah',
      categorySlug: 'agama-spiritualitas',
      desc: 'Biografi lengkap Nabi Muhammad SAW dari kelahiran hingga wafat. Ditulis berdasarkan sumber-sumber hadits shahih dan kitab sirah klasik terpercaya.',
      author: 'Syaikh Shafiyurrahman Al-Mubarakfury',
      publisher: 'Ummul Qura',
      language: 'Indonesia',
      page: 598, length: 24.0, width: 16.5, weight: 0.98,
      price: 145000, discount_price: null, qty: 100,
      published_at: new Date('2019-10-01'),
    },
    {
      name: '365 Renungan Harian Kristen',
      slug: '365-renungan-harian-kristen',
      categorySlug: 'agama-spiritualitas',
      desc: 'Renungan Alkitabiah untuk setiap hari dalam setahun. Memuat ayat kunci, renungan singkat, dan doa harian untuk memperdalam iman Kristiani.',
      author: 'Tim Persekutuan Pembaca Alkitab',
      publisher: 'BPK Gunung Mulia',
      language: 'Indonesia',
      page: 396, length: 21.0, width: 14.5, weight: 0.48,
      price: 95000, discount_price: 80000, qty: 80,
      published_at: new Date('2022-01-01'),
    },
  ]

  for (const book of booksData) {
    const category = categories.find(
      (cat) => cat.slug === book.categorySlug
    )

    if (!category) {
      console.error(`Category not found for slug: ${book.categorySlug}`)
      continue
    }

    await prisma.books.upsert({
        where: { slug: book.slug },
        update: {},
        create: {
          name: book.name,
        slug: book.slug,
        desc: book.desc,
        author: book.author,
        publisher: book.publisher,
        language: book.language,
        price: book.price,
        discount_price: book.discount_price,
        qty: book.qty,
        categoryId: category.id, 
        published_at: book.published_at,
        page: book.page,
        length: book.length,
        width: book.width,
        weight: book.weight,
        image_url: PLACEHOLDER_IMAGE
      }
    })
  }

  const articlesData = [
    {
      title: 'Kenapa Membaca Buku Adalah Investasi Jangka Panjang?',
      slug: 'membaca-adalah-investasi-jangka-panjang',
      content: `
        <section>
          <h2>Membaca Sebagai Investasi Intelektual</h2>
          <p>Membaca buku bukan sekadar aktivitas pengisi waktu luang. Dalam perspektif pengembangan diri dan profesional, membaca adalah bentuk investasi jangka panjang yang berdampak langsung terhadap kualitas berpikir, kedalaman analisis, serta kematangan emosional seseorang.</p>

          <p>Berbeda dengan konsumsi konten singkat di media sosial, buku memberikan struktur pemikiran yang sistematis, mendalam, dan terkurasi. Penulis menyusun gagasan berdasarkan riset, pengalaman, atau refleksi panjang yang tidak bisa diringkas dalam beberapa detik video.</p>

          <h3>Manfaat Strategis Membaca</h3>
          <ul>
            <li>Meningkatkan kemampuan berpikir kritis</li>
            <li>Memperluas perspektif lintas disiplin</li>
            <li>Meningkatkan kapasitas komunikasi</li>
            <li>Mengurangi stres melalui fokus mendalam</li>
          </ul>

          <blockquote>
            "Orang yang berhenti membaca berhenti berkembang."
          </blockquote>

          <p>Dalam jangka panjang, kebiasaan membaca akan membentuk pola pikir yang lebih terstruktur, argumentatif, dan matang dalam mengambil keputusan.</p>
        </section>
      `
    },
    {
      title: 'Peran Buku dalam Meningkatkan Daya Analisis',
      slug: 'peran-buku-dalam-daya-analisis',
      content: `
        <section>
          <h2>Mengapa Buku Melatih Pola Pikir Kritis?</h2>
          <p>Buku memaksa pembaca untuk mengikuti alur pemikiran yang runtut. Ketika membaca buku nonfiksi, pembaca diajak memahami premis, argumentasi, data pendukung, hingga kesimpulan yang disusun secara sistematis.</p>

          <h3>Latihan Analisis Melalui Bacaan</h3>
          <ol>
            <li>Mengidentifikasi argumen utama</li>
            <li>Mengevaluasi validitas data</li>
            <li>Membandingkan dengan perspektif lain</li>
            <li>Menyusun kesimpulan pribadi</li>
          </ol>

          <p>Proses ini secara tidak langsung melatih kemampuan berpikir kritis yang sangat dibutuhkan dalam dunia akademik maupun profesional.</p>

          <table border="1" cellpadding="6">
            <tr>
              <th>Kebiasaan</th>
              <th>Dampak Jangka Panjang</th>
            </tr>
            <tr>
              <td>Membaca rutin</td>
              <td>Peningkatan analisis dan sintesis informasi</td>
            </tr>
            <tr>
              <td>Diskusi buku</td>
              <td>Pemahaman perspektif multipihak</td>
            </tr>
          </table>
        </section>
      `
    },
    {
      title: 'Literasi dan Kemajuan Bangsa',
      slug: 'literasi-dan-kemajuan-bangsa',
      content: `
        <section>
          <h2>Korelasi Literasi dan Pertumbuhan Ekonomi</h2>
          <p>Tingkat literasi suatu negara memiliki hubungan erat dengan kualitas sumber daya manusianya. Negara dengan budaya membaca yang kuat cenderung memiliki inovasi lebih tinggi serta daya saing global yang lebih baik.</p>

          <p>Literasi tidak hanya berarti mampu membaca, tetapi juga memahami, menganalisis, dan mengaplikasikan informasi secara efektif.</p>

          <h3>Faktor Pendukung Budaya Literasi</h3>
          <ul>
            <li>Akses buku yang merata</li>
            <li>Dukungan institusi pendidikan</li>
            <li>Lingkungan keluarga yang mendukung</li>
            <li>Komunitas diskusi dan perpustakaan aktif</li>
          </ul>

          <blockquote>
            "Bangsa yang besar adalah bangsa yang gemar membaca."
          </blockquote>

          <p>Investasi terhadap literasi berarti investasi terhadap masa depan bangsa itu sendiri.</p>
        </section>
      `
    },
    {
      title: 'Strategi Membaca Efektif untuk Profesional',
      slug: 'strategi-membaca-efektif-profesional',
      content: `
        <section>
          <h2>Membaca dengan Tujuan yang Jelas</h2>
          <p>Bagi profesional, membaca sebaiknya dilakukan secara strategis. Tentukan tujuan: apakah untuk memperdalam keahlian, memperluas wawasan industri, atau meningkatkan soft skills.</p>

          <h3>Metode Membaca Efektif</h3>
          <ul>
            <li>Preview isi buku sebelum membaca penuh</li>
            <li>Tandai poin penting</li>
            <li>Catat insight utama</li>
            <li>Diskusikan dengan rekan</li>
          </ul>

          <p>Dengan pendekatan ini, membaca menjadi aktivitas produktif yang langsung berdampak pada performa kerja.</p>
        </section>
      `
    },
    {
      title: 'Mengapa Buku Fisik Masih Relevan?',
      slug: 'buku-fisik-masih-relevan',
      content: `
        <section>
          <h2>Keunggulan Buku Fisik di Era Digital</h2>
          <p>Walaupun e-book semakin populer, buku fisik tetap memiliki tempat tersendiri. Penelitian menunjukkan bahwa membaca di media cetak meningkatkan retensi informasi dibanding layar digital.</p>

          <h3>Alasan Utama</h3>
          <ul>
            <li>Minim distraksi notifikasi</li>
            <li>Meningkatkan fokus mendalam</li>
            <li>Pengalaman membaca yang lebih personal</li>
          </ul>

          <p>Buku fisik juga memiliki nilai koleksi dan emosional yang tidak tergantikan.</p>
        </section>
      `
    },
    {
      title: 'Membangun Kebiasaan Membaca Konsisten',
      slug: 'membangun-kebiasaan-membaca',
      content: `
        <section>
          <h2>Konsistensi Lebih Penting dari Durasi</h2>
          <p>Membaca 20–30 menit setiap hari lebih efektif dibanding membaca berjam-jam namun tidak rutin.</p>

          <h3>Langkah Praktis</h3>
          <ol>
            <li>Tentukan waktu khusus</li>
            <li>Kurangi distraksi digital</li>
            <li>Buat daftar bacaan</li>
            <li>Evaluasi progres bulanan</li>
          </ol>

          <p>Kebiasaan kecil yang dilakukan konsisten akan menghasilkan dampak besar dalam jangka panjang.</p>
        </section>
      `
    },
    {
      title: 'Peran Buku Self Improvement dalam Karier',
      slug: 'peran-buku-self-improvement',
      content: `
        <section>
          <h2>Pengembangan Diri Berbasis Bacaan</h2>
          <p>Buku self improvement memberikan kerangka berpikir tentang produktivitas, manajemen waktu, komunikasi, dan kepemimpinan.</p>

          <p>Namun, membaca saja tidak cukup. Implementasi adalah kunci utama perubahan.</p>

          <blockquote>
            "Knowledge without action is meaningless."
          </blockquote>

          <p>Gunakan buku sebagai referensi, bukan sekadar motivasi sesaat.</p>
        </section>
      `
    },
    {
      title: 'Teknologi dan Transformasi Industri Buku',
      slug: 'teknologi-dan-transformasi-buku',
      content: `
        <section>
          <h2>Digitalisasi dan Distribusi Global</h2>
          <p>Teknologi telah mengubah cara buku diproduksi dan didistribusikan. Kini, pembaca dapat mengakses jutaan judul hanya melalui perangkat digital.</p>

          <p>Namun demikian, kualitas konten tetap menjadi faktor penentu utama.</p>

          <ul>
            <li>E-book</li>
            <li>Audiobook</li>
            <li>Platform distribusi digital</li>
          </ul>
        </section>
      `
    },
    {
      title: 'Membaca untuk Kesehatan Mental',
      slug: 'membaca-untuk-kesehatan-mental',
      content: `
        <section>
          <h2>Terapi Melalui Literatur</h2>
          <p>Membaca dapat menjadi bentuk relaksasi yang efektif. Aktivitas ini membantu menurunkan tingkat stres dan meningkatkan ketenangan pikiran.</p>

          <p>Fiksi membantu meningkatkan empati, sementara nonfiksi memperkaya wawasan dan rasa percaya diri.</p>
        </section>
      `
    },
    {
      title: 'Masa Depan Industri Perbukuan',
      slug: 'masa-depan-industri-perbukuan',
      content: `
        <section>
          <h2>Tantangan dan Peluang</h2>
          <p>Industri perbukuan menghadapi tantangan distribusi digital dan perubahan perilaku konsumen. Namun, peluang tetap terbuka luas melalui inovasi model bisnis.</p>

          <p>Penerbit yang adaptif terhadap teknologi dan memahami kebutuhan pembaca akan tetap relevan.</p>

          <ul>
            <li>Print on Demand</li>
            <li>Platform langganan buku</li>
            <li>Komunitas pembaca digital</li>
          </ul>

          <p>Dengan strategi yang tepat, industri buku akan terus berkembang di era modern.</p>
        </section>
      `
    }
  ]

  for (const article of articlesData) {
    await prisma.articles.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        title: article.title,
        slug: article.slug,
        content: 'Ini adalah konten artikel contoh.',
        image_url: PLACEHOLDER_IMAGE,
        published_at: new Date()
      }
    })
  }

  console.log('Seeding finished')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
