// Metode SAW: benefit r = x/max ; cost r = min/x ; V = Σ (w × r)
export const K0 = [
  { n: 'Harga (Rb/malam)', t: 'cost', w: 0.3 },
  { n: 'Jarak ke pusat kota (km)', t: 'cost', w: 0.2 },
  { n: 'Rating (1–5)', t: 'benefit', w: 0.25 },
  { n: 'Fasilitas (1–100)', t: 'benefit', w: 0.15 },
  { n: 'Kebersihan (1–100)', t: 'benefit', w: 0.1 },
]
export const H0 = [
  ['Hotel Melati Indah', 'Hotel ekonomis yang nyaman untuk perjalanan singkat, dekat kuliner lokal.', [350, 1.5, 3.8, 60, 80]],
  ['Hotel Cempaka', 'Kamar luas dengan sarapan dan area parkir yang lega untuk keluarga.', [520, 2, 4.2, 80, 80]],
  ['Hotel Anggrek Premier', 'Hotel bintang lima di pusat kota dengan kolam renang dan layanan 24 jam.', [850, 0.8, 4.6, 100, 95]],
  ['Hotel Bumi Asri', 'Suasana asri dan tenang, cocok untuk beristirahat jauh dari keramaian.', [450, 3.5, 4, 65, 60]],
  ['Hotel Sentosa', 'Hotel bisnis dengan ruang rapat, lokasi strategis, dan kebersihan terjaga.', [600, 1, 4.4, 85, 95]],
  ['Hotel Kenanga', 'Pilihan hemat dengan fasilitas dasar untuk pelancong berbujet terbatas.', [300, 5, 3.5, 40, 55]],
].map((h, i) => ({ id: i + 1, n: h[0], d: h[1], img: '', v: h[2] }))

export const sumW = (K) => K.reduce((s, k) => s + k.w, 0)
export const okW = (K) => Math.abs(sumW(K) - 1) < 1e-6
export function calc(H, K, w = K.map((k) => k.w)) {
  const R = H.map((h) => h.v.map((x, j) => {
    const c = H.map((a) => a.v[j]), mx = Math.max(...c), mn = Math.min(...c)
    return K[j].t === 'benefit' ? (mx ? x / mx : 0) : (x ? mn / x : 0)
  }))
  const V = R.map((r) => r.reduce((s, x, j) => s + x * w[j], 0))
  return { R, V, rk: V.map((_, i) => i).sort((a, b) => V[b] - V[a]) }
}
export function uji(H, K) {
  const n = K.length
  const sc = [['Bobot awal (pilihan Anda)', K.map((k) => k.w)], ['Fokus harga (C1 = 0,5)', K.map((_, j) => (j ? 0.5 / (n - 1) : 0.5))], ['Bobot sama rata', K.map(() => 1 / n)]]
  const r = sc.map(([a, w]) => ({ a, top: calc(H, K, w).rk.slice(0, 3).map((i) => H[i].n) }))
  return { r, st: new Set(r.map((x) => x.top[0])).size === 1 }
}
export function validate(H, K) {
  if (!okW(K)) return 'Total bobot harus tepat 1,00 (sekarang ' + sumW(K).toFixed(2) + '). Atur di panel Preferensi.'
  if (H.length < 2) return 'Minimal ada 2 hotel.'
  for (const h of H) {
    if (!h.n.trim()) return 'Ada nama hotel yang masih kosong.'
    if (h.v.some((x) => !Number.isFinite(x))) return 'Ada nilai kriteria yang kosong pada ' + h.n + '.'
  }
  return ''
}
