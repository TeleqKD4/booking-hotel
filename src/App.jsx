import { useState, useEffect } from 'react'
import { K0, H0, sumW, okW, calc, validate } from './saw.js'
import { Icon, Art, rupiah } from './ui.jsx'
import { Hasil, Detail, Panduan } from './Result.jsx'

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d } catch { return d } }
const clone = (x) => JSON.parse(JSON.stringify(x))
const NAV = [['home', 'Beranda'], ['hotels', 'Daftar Hotel'], ['hasil', 'Rekomendasi'], ['detail', 'Perhitungan'], ['panduan', 'Panduan']]

export default function App() {
  const [K, setK] = useState(() => load('hb_k', K0))
  const [H, setH] = useState(() => load('hb_h', H0))
  const [page, setPage] = useState('home')
  const [toast, setToast] = useState('')
  const [edit, setEdit] = useState(null)
  useEffect(() => { localStorage.setItem('hb_k', JSON.stringify(K)) }, [K])
  useEffect(() => { localStorage.setItem('hb_h', JSON.stringify(H)) }, [H])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 3400); return () => clearTimeout(t) }, [toast])

  const go = (p) => {
    if (p === 'hasil' || p === 'detail') { const e = validate(H, K); if (e) { setToast(e); p = 'hotels' } }
    setPage(p); window.scrollTo(0, 0)
  }
  const reset = () => { if (confirm('Kembalikan semua data ke contoh awal?')) { setK(clone(K0)); setH(clone(H0)) } }
  const P = { K, setK, H, setH, go, setToast, edit, setEdit, reset }

  return (<>
    <header className="top"><div className="wrap bar">
      <div className="logo" onClick={() => go('home')}><span className="emb"><Icon n="bld" s={20} /></span><div><b>HotelPilih</b><small>SISTEM REKOMENDASI</small></div></div>
      <nav>{NAV.map(([k, l]) => <a key={k} className={page === k ? 'on' : ''} onClick={() => go(k)}>{l}</a>)}</nav>
      <button className="cta" onClick={() => go('hasil')}>PILIH HOTEL</button>
    </div></header>
    {page === 'home' && <Home {...P} />}{page === 'hotels' && <Hotels {...P} />}{page === 'hasil' && <Hasil {...P} />}
    {page === 'detail' && <Detail {...P} />}{page === 'panduan' && <Panduan {...P} />}
    <footer><div className="wrap">HotelPilih · Sistem Pendukung Keputusan Pemilihan Hotel dengan Simple Additive Weighting (SAW) <a onClick={reset}>Reset data</a></div></footer>
    {edit && <Modal {...P} />}
    <div id="toast" className={toast ? 's' : ''}>{toast}</div>
  </>)
}

export function Amen({ h, K }) {
  const it = [['star', h.v[2], 'Rating'], ['pin', h.v[1] + ' km', 'Jarak ke pusat kota'], ['bld', h.v[3], 'Fasilitas'], ['spark', h.v[4], 'Kebersihan']]
  return <div className="amen">{it.map(([ic, v, t]) => <span key={t} title={t + ': ' + v}><Icon n={ic} s={15} />{v}</span>)}</div>
}

function Home({ K, H, go }) {
  const ok = !validate(H, K), c = ok ? calc(H, K) : null
  const feat = [['sliders', 'Tentukan Bobot', 'Atur kepentingan harga, jarak, rating, fasilitas, dan kebersihan.'], ['bld', 'Isi Data Hotel', 'Tambah, ubah, atau hapus hotel yang ingin dibandingkan.'],
    ['calc', 'Hitung dengan SAW', 'Normalisasi dan pembobotan dilakukan otomatis dan transparan.'], ['trophy', 'Dapatkan Rekomendasi', 'Lihat peringkat hotel dari yang paling sesuai.']]
  return (<>
    <section className="hero"><div className="wrap"><span className="eyebrow">METODE SIMPLE ADDITIVE WEIGHTING</span><h1>Temukan Hotel Terbaik<br />Sesuai Kebutuhan Anda</h1>
      <p>Bandingkan beberapa hotel berdasarkan harga, jarak, rating, fasilitas, dan kebersihan. Biarkan sistem menghitung rekomendasi yang paling objektif.</p>
      <div className="hbtn"><button className="cta big" onClick={() => go('hotels')}>MULAI MEMILIH</button><button className="ghost" onClick={() => go('panduan')}>Pelajari metode</button></div></div></section>
    <section className="wrap sect"><h2 className="st">Bagaimana cara kerjanya?</h2><p className="ss">Empat langkah mudah dari data hingga rekomendasi.</p>
      <div className="feats">{feat.map(([ic, t, d], i) => <div className="feat" key={t}><span className="circ"><Icon n={ic} s={22} /></span><small>0{i + 1}</small><h3>{t}</h3><p>{d}</p></div>)}</div></section>
    {ok && <section className="wrap sect"><h2 className="st">Rekomendasi saat ini</h2><p className="ss">Tiga hotel teratas berdasarkan bobot yang berlaku.</p>
      <div className="rooms three">{c.rk.slice(0, 3).map((i, p) => <RoomCard key={H[i].id} h={H[i]} idx={i} K={K} banner={`PERINGKAT #${p + 1} · SKOR ${c.V[i].toFixed(4)}`} score={c.V[i]} />)}</div>
      <div style={{ textAlign: 'center', marginTop: 24 }}><button className="cta big dark" onClick={() => go('hasil')}>LIHAT HASIL LENGKAP</button></div></section>}
  </>)
}

export function RoomCard({ h, idx, K, banner, score, children }) {
  return (<article className="room"><div className="ph"><Art i={idx} img={h.img} name={h.n} /><div className="banner">{banner}</div></div>
    <h3>{h.n}</h3><p>{h.d}</p>{score !== undefined && <div className="sbar"><i style={{ width: score * 100 + '%' }} /></div>}<Amen h={h} K={K} />{children}</article>)
}

function Hotels({ K, setK, H, setH, setEdit, go, setToast }) {
  const s = sumW(K), ok = okW(K)
  const setW = (j, d) => setK(K.map((k, i) => (i === j ? { ...k, w: Math.min(1, Math.max(0, Math.round((k.w + d) * 100) / 100)) } : k)))
  const toggle = (j) => setK(K.map((k, i) => (i === j ? { ...k, t: k.t === 'cost' ? 'benefit' : 'cost' } : k)))
  const norm = () => { if (!s) return setToast('Isi bobot dulu.'); const n = K.map((k) => ({ ...k, w: Math.round((k.w / s) * 100) / 100 })); n[0].w = Math.round((n[0].w + 1 - sumW(n)) * 100) / 100; setK(n) }
  const del = (h) => (H.length <= 2 ? setToast('Minimal harus ada 2 hotel.') : confirm('Hapus ' + h.n + '?') && (setH(H.filter((x) => x.id !== h.id)), setToast(h.n + ' dihapus.')))
  const csv = () => {
    const q = (x) => (/[",]/.test(x) ? '"' + x + '"' : x)
    const c = [['Hotel', ...K.map((k) => k.n)], ...H.map((h) => [h.n, ...h.v])].map((r) => r.map(q).join(',')).join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + c], { type: 'text/csv' })); a.download = 'dataset_hotel.csv'; a.click()
  }
  return (<main className="wrap sect"><div className="phead"><div><h1 className="pt">{H.length} hotel tersedia</h1><p className="ss" style={{ margin: 0 }}>Kelola data hotel dan atur preferensi Anda di panel kanan.</p></div>
    <div className="pa"><button className="ghost dk" onClick={csv}>Unduh Dataset CSV</button><button className="cta dark" onClick={() => setEdit({ id: 0 })}>+ TAMBAH HOTEL</button></div></div>
    <div className="layout"><div className="rooms">{H.map((h, i) => (<RoomCard key={h.id} h={h} idx={i} K={K} banner={'Harga ' + rupiah(h.v[0]) + ' / malam'}>
      <div className="acts"><button onClick={() => setEdit(h)}><Icon n="edit" s={14} /> Ubah</button><button className="d" onClick={() => del(h)}><Icon n="trash" s={14} /> Hapus</button></div></RoomCard>))}</div>
    <aside className="pref"><h2>Preferensi Pemilihan</h2><p className="mu">Atur bobot kepentingan tiap kriteria. Total harus 1,00.</p>
      {K.map((k, j) => (<div className="prow" key={j}><div className="pl"><span><Icon n={['cal', 'pin', 'star', 'bld', 'spark'][j % 5]} s={15} /> {k.n}</span>
        <button className={'pill ' + k.t} onClick={() => toggle(j)} title="Klik untuk mengganti tipe">{k.t}</button></div>
        <div className="stepper"><button onClick={() => setW(j, -0.05)}>−</button><b>{k.w.toFixed(2)}</b><button onClick={() => setW(j, 0.05)}>+</button></div></div>))}
      <div className={'tot ' + (ok ? 'ok' : 'bad')}><span>Total bobot</span><b>{s.toFixed(2)} / 1,00</b></div>
      <button className="cta full light" onClick={norm}>NORMALKAN BOBOT</button><button className="cta full dark" onClick={() => go('hasil')}>HITUNG REKOMENDASI</button>
      <p className="note"><b>Cost</b>: makin kecil makin baik. <b>Benefit</b>: makin besar makin baik.</p></aside></div></main>)
}

function Modal({ K, H, setH, edit, setEdit, setToast }) {
  const isNew = !edit.id
  const [f, setF] = useState(() => ({ n: edit.n || '', d: edit.d || '', img: edit.img || '', v: (edit.v || K.map(() => '')).map(String) }))
  const save = () => {
    const v = f.v.map((x) => (x.trim() === '' ? NaN : +x))
    if (!f.n.trim() || v.some((x) => !Number.isFinite(x))) return setToast('Nama dan semua nilai kriteria wajib diisi (angka).')
    const o = { id: isNew ? Date.now() : edit.id, n: f.n.trim(), d: f.d.trim() || 'Belum ada deskripsi.', img: f.img.trim(), v }
    setH(isNew ? [...H, o] : H.map((h) => (h.id === o.id ? o : h))); setEdit(null); setToast(isNew ? 'Hotel berhasil ditambahkan.' : 'Perubahan hotel disimpan.')
  }
  return (<div className="ov" onClick={() => setEdit(null)}><div className="modal" onClick={(e) => e.stopPropagation()}>
    <h2>{isNew ? 'Tambah Hotel' : 'Ubah Hotel'}</h2>
    <label>Nama hotel<input value={f.n} onChange={(e) => setF({ ...f, n: e.target.value })} placeholder="Contoh: Hotel Mawar Indah" /></label>
    <label>Deskripsi singkat<textarea value={f.d} onChange={(e) => setF({ ...f, d: e.target.value })} /></label>
    <label>URL foto (opsional)<input value={f.img} onChange={(e) => setF({ ...f, img: e.target.value })} placeholder="https://... (kosongkan untuk ilustrasi otomatis)" /></label>
    <div className="g2">{K.map((k, j) => <label key={j}>C{j + 1} · {k.n}<input type="number" step="any" value={f.v[j]} onChange={(e) => setF({ ...f, v: f.v.map((x, q) => (q === j ? e.target.value : x)) })} /></label>)}</div>
    <div className="macts"><button className="ghost dk" onClick={() => setEdit(null)}>Batal</button><button className="cta dark" onClick={save}>SIMPAN</button></div></div></div>)
}
