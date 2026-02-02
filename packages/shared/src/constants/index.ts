/**
 * SNSMON-AI Constants
 * Indonesian administrative regions and crisis keywords
 */

import type { RegionData, Platform } from '../types';

// ============================================
// Indonesia Provinces (38 Provinces)
// ============================================

export const INDONESIA_PROVINCES: RegionData[] = [
  // Sumatra
  { code: '11', level: 'province', name: 'Aceh', nameLocal: 'Aceh', coordinates: { lat: 4.6951, lng: 96.7494 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '12', level: 'province', name: 'North Sumatra', nameLocal: 'Sumatera Utara', coordinates: { lat: 2.1154, lng: 99.5451 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '13', level: 'province', name: 'West Sumatra', nameLocal: 'Sumatera Barat', coordinates: { lat: -0.7399, lng: 100.8000 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '14', level: 'province', name: 'Riau', nameLocal: 'Riau', coordinates: { lat: 0.2933, lng: 101.7068 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '15', level: 'province', name: 'Jambi', nameLocal: 'Jambi', coordinates: { lat: -1.4852, lng: 102.4380 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '16', level: 'province', name: 'South Sumatra', nameLocal: 'Sumatera Selatan', coordinates: { lat: -3.3194, lng: 103.9144 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '17', level: 'province', name: 'Bengkulu', nameLocal: 'Bengkulu', coordinates: { lat: -3.5778, lng: 102.3464 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '18', level: 'province', name: 'Lampung', nameLocal: 'Lampung', coordinates: { lat: -4.5586, lng: 105.4068 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '19', level: 'province', name: 'Bangka Belitung Islands', nameLocal: 'Kepulauan Bangka Belitung', coordinates: { lat: -2.7411, lng: 106.4406 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '21', level: 'province', name: 'Riau Islands', nameLocal: 'Kepulauan Riau', coordinates: { lat: 3.9457, lng: 108.1429 }, timezone: 'Asia/Jakarta', isActive: true },

  // Java
  { code: '31', level: 'province', name: 'DKI Jakarta', nameLocal: 'DKI Jakarta', coordinates: { lat: -6.2088, lng: 106.8456 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '32', level: 'province', name: 'West Java', nameLocal: 'Jawa Barat', coordinates: { lat: -6.9175, lng: 107.6191 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '33', level: 'province', name: 'Central Java', nameLocal: 'Jawa Tengah', coordinates: { lat: -7.1510, lng: 110.1403 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '34', level: 'province', name: 'DI Yogyakarta', nameLocal: 'DI Yogyakarta', coordinates: { lat: -7.7956, lng: 110.3695 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '35', level: 'province', name: 'East Java', nameLocal: 'Jawa Timur', coordinates: { lat: -7.5361, lng: 112.2384 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '36', level: 'province', name: 'Banten', nameLocal: 'Banten', coordinates: { lat: -6.4058, lng: 106.0640 }, timezone: 'Asia/Jakarta', isActive: true },

  // Kalimantan
  { code: '61', level: 'province', name: 'West Kalimantan', nameLocal: 'Kalimantan Barat', coordinates: { lat: -0.2788, lng: 111.4753 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '62', level: 'province', name: 'Central Kalimantan', nameLocal: 'Kalimantan Tengah', coordinates: { lat: -1.6815, lng: 113.3824 }, timezone: 'Asia/Jakarta', isActive: true },
  { code: '63', level: 'province', name: 'South Kalimantan', nameLocal: 'Kalimantan Selatan', coordinates: { lat: -3.0926, lng: 115.2838 }, timezone: 'Asia/Makassar', isActive: true },
  { code: '64', level: 'province', name: 'East Kalimantan', nameLocal: 'Kalimantan Timur', coordinates: { lat: 1.6407, lng: 116.4194 }, timezone: 'Asia/Makassar', isActive: true },
  { code: '65', level: 'province', name: 'North Kalimantan', nameLocal: 'Kalimantan Utara', coordinates: { lat: 3.0731, lng: 116.0414 }, timezone: 'Asia/Makassar', isActive: true },

  // Sulawesi
  { code: '71', level: 'province', name: 'North Sulawesi', nameLocal: 'Sulawesi Utara', coordinates: { lat: 0.6247, lng: 123.9750 }, timezone: 'Asia/Makassar', isActive: true },
  { code: '72', level: 'province', name: 'Central Sulawesi', nameLocal: 'Sulawesi Tengah', coordinates: { lat: -1.4300, lng: 121.4456 }, timezone: 'Asia/Makassar', isActive: true },
  { code: '73', level: 'province', name: 'South Sulawesi', nameLocal: 'Sulawesi Selatan', coordinates: { lat: -3.6688, lng: 119.9741 }, timezone: 'Asia/Makassar', isActive: true },
  { code: '74', level: 'province', name: 'Southeast Sulawesi', nameLocal: 'Sulawesi Tenggara', coordinates: { lat: -4.1449, lng: 122.1746 }, timezone: 'Asia/Makassar', isActive: true },
  { code: '75', level: 'province', name: 'Gorontalo', nameLocal: 'Gorontalo', coordinates: { lat: 0.6999, lng: 122.4467 }, timezone: 'Asia/Makassar', isActive: true },
  { code: '76', level: 'province', name: 'West Sulawesi', nameLocal: 'Sulawesi Barat', coordinates: { lat: -2.8442, lng: 119.2321 }, timezone: 'Asia/Makassar', isActive: true },

  // Bali & Nusa Tenggara
  { code: '51', level: 'province', name: 'Bali', nameLocal: 'Bali', coordinates: { lat: -8.3405, lng: 115.0920 }, timezone: 'Asia/Makassar', isActive: true },
  { code: '52', level: 'province', name: 'West Nusa Tenggara', nameLocal: 'Nusa Tenggara Barat', coordinates: { lat: -8.6529, lng: 117.3616 }, timezone: 'Asia/Makassar', isActive: true },
  { code: '53', level: 'province', name: 'East Nusa Tenggara', nameLocal: 'Nusa Tenggara Timur', coordinates: { lat: -8.6574, lng: 121.0794 }, timezone: 'Asia/Makassar', isActive: true },

  // Maluku
  { code: '81', level: 'province', name: 'Maluku', nameLocal: 'Maluku', coordinates: { lat: -3.2385, lng: 130.1453 }, timezone: 'Asia/Jayapura', isActive: true },
  { code: '82', level: 'province', name: 'North Maluku', nameLocal: 'Maluku Utara', coordinates: { lat: 1.5709, lng: 127.8088 }, timezone: 'Asia/Jayapura', isActive: true },

  // Papua
  { code: '91', level: 'province', name: 'Papua', nameLocal: 'Papua', coordinates: { lat: -4.2699, lng: 138.0804 }, timezone: 'Asia/Jayapura', isActive: true },
  { code: '92', level: 'province', name: 'West Papua', nameLocal: 'Papua Barat', coordinates: { lat: -1.3361, lng: 133.1747 }, timezone: 'Asia/Jayapura', isActive: true },
  { code: '93', level: 'province', name: 'South Papua', nameLocal: 'Papua Selatan', coordinates: { lat: -6.1000, lng: 140.3000 }, timezone: 'Asia/Jayapura', isActive: true },
  { code: '94', level: 'province', name: 'Central Papua', nameLocal: 'Papua Tengah', coordinates: { lat: -3.7000, lng: 136.5000 }, timezone: 'Asia/Jayapura', isActive: true },
  { code: '95', level: 'province', name: 'Highland Papua', nameLocal: 'Papua Pegunungan', coordinates: { lat: -4.0000, lng: 138.5000 }, timezone: 'Asia/Jayapura', isActive: true },
  { code: '96', level: 'province', name: 'Southwest Papua', nameLocal: 'Papua Barat Daya', coordinates: { lat: -1.5000, lng: 132.0000 }, timezone: 'Asia/Jayapura', isActive: true },
];

// ============================================
// Major Cities
// ============================================

export const INDONESIA_MAJOR_CITIES: RegionData[] = [
  // Java
  { code: '3171', level: 'regency', name: 'Jakarta Pusat', nameLocal: 'Jakarta Pusat', parentCode: '31', coordinates: { lat: -6.1862, lng: 106.8341 }, timezone: 'Asia/Jakarta', population: 1057000, isActive: true },
  { code: '3172', level: 'regency', name: 'Jakarta Utara', nameLocal: 'Jakarta Utara', parentCode: '31', coordinates: { lat: -6.1384, lng: 106.8638 }, timezone: 'Asia/Jakarta', population: 1730000, isActive: true },
  { code: '3173', level: 'regency', name: 'Jakarta Barat', nameLocal: 'Jakarta Barat', parentCode: '31', coordinates: { lat: -6.1681, lng: 106.7590 }, timezone: 'Asia/Jakarta', population: 2430000, isActive: true },
  { code: '3174', level: 'regency', name: 'Jakarta Selatan', nameLocal: 'Jakarta Selatan', parentCode: '31', coordinates: { lat: -6.2615, lng: 106.8106 }, timezone: 'Asia/Jakarta', population: 2165000, isActive: true },
  { code: '3175', level: 'regency', name: 'Jakarta Timur', nameLocal: 'Jakarta Timur', parentCode: '31', coordinates: { lat: -6.2250, lng: 106.9004 }, timezone: 'Asia/Jakarta', population: 2817000, isActive: true },
  { code: '3273', level: 'regency', name: 'Bandung', nameLocal: 'Bandung', parentCode: '32', coordinates: { lat: -6.9175, lng: 107.6191 }, timezone: 'Asia/Jakarta', population: 2500000, isActive: true },
  { code: '3374', level: 'regency', name: 'Semarang', nameLocal: 'Semarang', parentCode: '33', coordinates: { lat: -6.9666, lng: 110.4196 }, timezone: 'Asia/Jakarta', population: 1800000, isActive: true },
  { code: '3471', level: 'regency', name: 'Yogyakarta', nameLocal: 'Yogyakarta', parentCode: '34', coordinates: { lat: -7.7956, lng: 110.3695 }, timezone: 'Asia/Jakarta', population: 420000, isActive: true },
  { code: '3578', level: 'regency', name: 'Surabaya', nameLocal: 'Surabaya', parentCode: '35', coordinates: { lat: -7.2575, lng: 112.7521 }, timezone: 'Asia/Jakarta', population: 2900000, isActive: true },

  // Sumatra
  { code: '1271', level: 'regency', name: 'Medan', nameLocal: 'Medan', parentCode: '12', coordinates: { lat: 3.5952, lng: 98.6722 }, timezone: 'Asia/Jakarta', population: 2500000, isActive: true },
  { code: '1371', level: 'regency', name: 'Padang', nameLocal: 'Padang', parentCode: '13', coordinates: { lat: -0.9471, lng: 100.4172 }, timezone: 'Asia/Jakarta', population: 940000, isActive: true },
  { code: '1471', level: 'regency', name: 'Pekanbaru', nameLocal: 'Pekanbaru', parentCode: '14', coordinates: { lat: 0.5071, lng: 101.4478 }, timezone: 'Asia/Jakarta', population: 1100000, isActive: true },
  { code: '1671', level: 'regency', name: 'Palembang', nameLocal: 'Palembang', parentCode: '16', coordinates: { lat: -2.9761, lng: 104.7754 }, timezone: 'Asia/Jakarta', population: 1700000, isActive: true },

  // Kalimantan
  { code: '6371', level: 'regency', name: 'Banjarmasin', nameLocal: 'Banjarmasin', parentCode: '63', coordinates: { lat: -3.3186, lng: 114.5944 }, timezone: 'Asia/Makassar', population: 700000, isActive: true },
  { code: '6472', level: 'regency', name: 'Samarinda', nameLocal: 'Samarinda', parentCode: '64', coordinates: { lat: -0.4948, lng: 117.1436 }, timezone: 'Asia/Makassar', population: 850000, isActive: true },
  { code: '6471', level: 'regency', name: 'Balikpapan', nameLocal: 'Balikpapan', parentCode: '64', coordinates: { lat: -1.2654, lng: 116.8312 }, timezone: 'Asia/Makassar', population: 700000, isActive: true },

  // Sulawesi
  { code: '7371', level: 'regency', name: 'Makassar', nameLocal: 'Makassar', parentCode: '73', coordinates: { lat: -5.1477, lng: 119.4327 }, timezone: 'Asia/Makassar', population: 1500000, isActive: true },
  { code: '7171', level: 'regency', name: 'Manado', nameLocal: 'Manado', parentCode: '71', coordinates: { lat: 1.4748, lng: 124.8421 }, timezone: 'Asia/Makassar', population: 450000, isActive: true },

  // Bali
  { code: '5171', level: 'regency', name: 'Denpasar', nameLocal: 'Denpasar', parentCode: '51', coordinates: { lat: -8.6705, lng: 115.2126 }, timezone: 'Asia/Makassar', population: 950000, isActive: true },
];

// ============================================
// Crisis Keywords (Indonesian)
// ============================================

export const CRISIS_KEYWORDS = {
  // Civil Unrest / Riots
  civil_unrest: {
    id: [
      'kerusuhan', 'rusuh', 'demo', 'demonstrasi', 'protes',
      'aksi massa', 'unjuk rasa', 'bentrok', 'ricuh', 'anarkis',
      'anarkisme', 'perusakan', 'pembakaran', 'sweeping', 'blokade',
      'penjarahan', 'massa mengamuk', 'kericuhan', 'huru-hara'
    ],
    en: [
      'riot', 'riots', 'protest', 'demonstration', 'civil unrest',
      'mass action', 'clash', 'clashes', 'violence', 'looting'
    ]
  },

  // Violence / Bloodshed
  violence: {
    id: [
      'tewas', 'korban jiwa', 'meninggal', 'luka-luka', 'berdarah',
      'penembakan', 'pembunuhan', 'penusukan', 'kekerasan', 'penyerangan',
      'pembacokan', 'penganiayaan', 'perkosaan', 'penculikan', 'mutilasi',
      'mayat', 'jenazah', 'korban tewas', 'korban luka', 'terluka parah'
    ],
    en: [
      'killed', 'dead', 'death', 'wounded', 'injured', 'shooting',
      'murder', 'stabbing', 'violence', 'attack', 'assault'
    ]
  },

  // Natural Disasters
  natural_disaster: {
    id: [
      'gempa', 'gempa bumi', 'banjir', 'banjir bandang', 'tsunami',
      'longsor', 'tanah longsor', 'gunung meletus', 'erupsi', 'letusan',
      'kebakaran hutan', 'bencana alam', 'puting beliung', 'angin topan',
      'kekeringan', 'badai', 'gelombang tinggi', 'rob', 'likuifaksi'
    ],
    en: [
      'earthquake', 'flood', 'tsunami', 'landslide', 'volcanic eruption',
      'forest fire', 'natural disaster', 'tornado', 'drought', 'storm'
    ]
  },

  // Incidents / Accidents
  incidents: {
    id: [
      'kecelakaan', 'tabrakan', 'pesawat jatuh', 'kapal tenggelam',
      'kebakaran', 'ledakan', 'runtuh', 'ambruk', 'kecelakaan lalu lintas',
      'kecelakaan kerja', 'tenggelam', 'terbakar', 'terguling', 'terjatuh',
      'keracunan', 'kebocoran gas', 'listrik padam', 'blackout'
    ],
    en: [
      'accident', 'crash', 'plane crash', 'ship sinking', 'fire',
      'explosion', 'collapse', 'traffic accident', 'drowning'
    ]
  },

  // Government / Prosecution
  government: {
    id: [
      'korupsi', 'suap', 'penangkapan', 'OTT', 'KPK', 'kejaksaan',
      'jaksa', 'pengadilan', 'sidang', 'vonis', 'gratifikasi', 'pencucian uang',
      'penggelapan', 'penipuan', 'penyalahgunaan wewenang', 'kolusi', 'nepotisme',
      'tersangka', 'terdakwa', 'terpidana', 'hukuman', 'banding', 'kasasi'
    ],
    en: [
      'corruption', 'bribery', 'arrest', 'prosecution', 'court',
      'verdict', 'money laundering', 'embezzlement', 'fraud'
    ]
  },

  // Security / Terrorism
  security: {
    id: [
      'teror', 'teroris', 'bom', 'ancaman bom', 'pengeboman',
      'penyanderaan', 'penculikan', 'radikalisme', 'ekstremisme',
      'militan', 'ISIS', 'JAD', 'JI', 'Densus 88', 'terduga teroris',
      'serangan teror', 'aksi teror', 'deradikalisasi'
    ],
    en: [
      'terror', 'terrorist', 'bomb', 'bombing', 'hostage',
      'kidnapping', 'radicalism', 'extremism', 'militant'
    ]
  },

  // Economic Crisis
  economic: {
    id: [
      'PHK', 'pemutusan hubungan kerja', 'inflasi', 'resesi', 'krisis',
      'bangkrut', 'pailit', 'utang', 'default', 'devaluasi', 'pengangguran',
      'kemiskinan', 'kelangkaan', 'harga naik', 'kenaikan harga',
      'demo buruh', 'mogok kerja', 'upah minimum'
    ],
    en: [
      'layoff', 'unemployment', 'inflation', 'recession', 'crisis',
      'bankruptcy', 'debt', 'default', 'devaluation', 'poverty'
    ]
  },

  // Health Emergency
  health: {
    id: [
      'wabah', 'pandemi', 'epidemi', 'virus', 'penyakit menular',
      'korban jiwa', 'rumah sakit penuh', 'keracunan massal', 'DBD',
      'malaria', 'kolera', 'difteri', 'polio', 'karantina', 'lockdown',
      'PSBB', 'PPKM', 'vaksin', 'antivaksin'
    ],
    en: [
      'outbreak', 'pandemic', 'epidemic', 'virus', 'infectious disease',
      'hospital overcrowded', 'mass poisoning', 'quarantine', 'lockdown'
    ]
  }
};

// ============================================
// Platform Configuration
// ============================================

export const SUPPORTED_PLATFORMS: Platform[] = [
  'twitter',
  'instagram',
  'facebook',
  'tiktok',
  'whatsapp',
  'line',
  'telegram',
  'youtube'
];

export const PLATFORM_DISPLAY_NAMES: Record<Platform, string> = {
  twitter: 'X (Twitter)',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
  line: 'LINE',
  telegram: 'Telegram',
  youtube: 'YouTube'
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  facebook: '#1877F2',
  tiktok: '#000000',
  whatsapp: '#25D366',
  line: '#00C300',
  telegram: '#0088CC',
  youtube: '#FF0000'
};

// ============================================
// Sentiment Configuration
// ============================================

export const SENTIMENT_THRESHOLDS = {
  positive: { min: 0.3, color: '#22c55e' },
  neutral: { min: -0.3, max: 0.3, color: '#eab308' },
  negative: { max: -0.3, color: '#ef4444' }
};

export const EMOTION_LABELS = {
  joy: { id: 'Senang', en: 'Joy', color: '#22c55e' },
  sadness: { id: 'Sedih', en: 'Sadness', color: '#3b82f6' },
  anger: { id: 'Marah', en: 'Anger', color: '#ef4444' },
  fear: { id: 'Takut', en: 'Fear', color: '#8b5cf6' },
  surprise: { id: 'Terkejut', en: 'Surprise', color: '#f59e0b' },
  disgust: { id: 'Jijik', en: 'Disgust', color: '#84cc16' },
  trust: { id: 'Percaya', en: 'Trust', color: '#06b6d4' },
  anticipation: { id: 'Antisipasi', en: 'Anticipation', color: '#ec4899' }
};

// ============================================
// Alert Configuration
// ============================================

export const ALERT_SEVERITY_CONFIG = {
  critical: { label: 'Critical', color: '#dc2626', priority: 1 },
  high: { label: 'High', color: '#ea580c', priority: 2 },
  medium: { label: 'Medium', color: '#ca8a04', priority: 3 },
  low: { label: 'Low', color: '#16a34a', priority: 4 }
};

export const DEFAULT_ALERT_THRESHOLDS = {
  volumeSpike: {
    percentage: 200,      // 200% increase
    baselineWindow: '24h',
    minVolume: 100
  },
  sentimentDrop: {
    percentage: 30,       // 30% drop
    minScore: -0.5,
    window: '1h'
  },
  crisisScore: {
    warning: 50,
    high: 70,
    critical: 85
  }
};

// ============================================
// API Rate Limits
// ============================================

export const API_RATE_LIMITS: Record<Platform, { maxRequests: number; windowMs: number }> = {
  twitter: { maxRequests: 450, windowMs: 15 * 60 * 1000 },     // 450/15min
  instagram: { maxRequests: 200, windowMs: 60 * 60 * 1000 },   // 200/hour
  facebook: { maxRequests: 200, windowMs: 60 * 60 * 1000 },    // 200/hour
  tiktok: { maxRequests: 100, windowMs: 60 * 60 * 1000 },      // 100/hour (limited)
  whatsapp: { maxRequests: 1000, windowMs: 24 * 60 * 60 * 1000 }, // conversations/day
  line: { maxRequests: 500, windowMs: 60 * 60 * 1000 },        // 500/hour
  telegram: { maxRequests: 30, windowMs: 1000 },               // 30/second
  youtube: { maxRequests: 10000, windowMs: 24 * 60 * 60 * 1000 } // 10000/day
};

// ============================================
// Indonesian Slang Dictionary (for preprocessing)
// ============================================

export const INDONESIAN_SLANG_MAP: Record<string, string> = {
  // Common abbreviations
  'gak': 'tidak',
  'ga': 'tidak',
  'gk': 'tidak',
  'tdk': 'tidak',
  'yg': 'yang',
  'dgn': 'dengan',
  'utk': 'untuk',
  'bgt': 'banget',
  'bngt': 'banget',
  'sy': 'saya',
  'klo': 'kalau',
  'kl': 'kalau',
  'krn': 'karena',
  'bs': 'bisa',
  'jg': 'juga',
  'sdh': 'sudah',
  'udh': 'sudah',
  'blm': 'belum',
  'blom': 'belum',
  'org': 'orang',
  'dr': 'dari',
  'dri': 'dari',
  'tp': 'tapi',
  'tpi': 'tapi',
  'sm': 'sama',
  'aja': 'saja',
  'aj': 'saja',
  'lg': 'lagi',
  'lgi': 'lagi',
  'nih': 'ini',
  'ni': 'ini',
  'tuh': 'itu',
  'tu': 'itu',
  'msh': 'masih',
  'msih': 'masih',
  'skrg': 'sekarang',
  'skg': 'sekarang',
  'kmrn': 'kemarin',
  'bsk': 'besok',
  'wkt': 'waktu',
  'dl': 'dulu',
  'dlu': 'dulu',

  // Sentiment-related slang
  'mantap': 'bagus',
  'mantul': 'mantap betul',
  'keren': 'bagus',
  'asik': 'bagus',
  'sip': 'bagus',
  'oke': 'baik',
  'ok': 'baik',
  'btw': 'ngomong-ngomong',
  'otw': 'dalam perjalanan',
  'lol': 'tertawa',
  'wkwk': 'tertawa',
  'haha': 'tertawa',
  'anjir': 'sialan',
  'anjay': 'sialan',
  'goblok': 'bodoh',
  'tolol': 'bodoh',
  'bego': 'bodoh',

  // Question words
  'gmn': 'bagaimana',
  'gmna': 'bagaimana',
  'knp': 'kenapa',
  'knpa': 'kenapa',
  'dmn': 'dimana',
  'dmna': 'dimana',
  'kpn': 'kapan',
  'kpna': 'kapan',
  'spt': 'seperti',
  'sprti': 'seperti',

  // Pronouns
  'gw': 'saya',
  'gue': 'saya',
  'gua': 'saya',
  'lo': 'kamu',
  'lu': 'kamu',
  'loe': 'kamu',
  'dia': 'dia',
  'dy': 'dia',
  'mrk': 'mereka',
  'kita': 'kita',
  'kt': 'kita'
};
