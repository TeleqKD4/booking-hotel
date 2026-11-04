import { calc, uji, validate } from './saw.js'
import { Icon, Art, rupiah } from './ui.jsx'
import { RoomCard } from './App.jsx'

const f4 = (x) => x.toFixed(4)
const Guard = ({ msg, go }) => (<main className="wrap sect"><div className="panel" style={{ textAlign: 'center' }}><h2>Data belum lengkap</h2><p className="mu">{msg}</p><button className="cta dark" onClick={() => go('hotels')}>ATUR PREFERENSI</button></div></main>)

export function Hasil({ K, H, go }) {
  const err = validate(H, K); if (err) return <Guard msg={err} go={go} />
  const c = calc(H, K), t = c.rk, w = t[0], hw = H[w]
  const best = K.map((k, j) => (c.R[w][j] >= 0.9999 ? k.n.split(' (')[0] : null)).filter(Boolean)
  return (<main className="wrap sect">
    <div className="phead"><div><h1 className="pt">Hasil Rekomendasi</h1><p className="ss" style={{ margin: 0 }}>Berdasarkan {H.length} hotel dan {K.length} kriteria dengan bobot pilihan Anda.</p></div>
      <div className="pa"><button className="ghost dk" onClick={() => window.print()}>Cetak</button><button className="cta dark" onClick={() => go('detail')}>LIHAT PERHITUNGAN</button></div></div>
    <section className="featured"><div className="fp"><Art i={w} img={hw.img} name={hw.n} /><span className="ribbon"><Icon n="trophy" s={16} /> REKOMENDASI TERBAIK</span></div>
      <div className="fi"><small>PERINGKAT #1</small><h2>{hw.n}</h2><p>{hw.d}</p>
        {best.length > 0 && <div className="chips">Unggul pada: {best.map((b) => <span key={b}>{b}</span>)}</div>}
        <table className="kv"><tbody>{K.map((k, j) => <tr key={j}><td>{k.n}</td><td>{j === 0 ? rupiah(hw.v[0]) : hw.v[j]}</td></tr>)}</tbody></table>
        <div className="big"><span>Nilai preferensi (V)</span><b>{f4(c.V[w])}</b></div><p className="mu" style={{ fontSize: 13, margin: '6px 0 0' }}>Selisih {f4(c.V[w] - c.V[t[1]])} dari peringkat 2 ({H[t[1]].n}).</p></div></section>
    <h2 className="st" style={{ marginTop: 34 }}>Peringkat lengkap</h2>
    <div className="rooms three">{t.map((i, p) => <RoomCard key={H[i].id} h={H[i]} idx={i} K={K} banner={`PERINGKAT #${p + 1} · SKOR ${f4(c.V[i])}`} score={c.V[i]} />)}</div></main>)
}

export function Detail({ K, H, go }) {
  const err = validate(H, K); if (err) return <Guard msg={err} go={go} />
  const c = calc(H, K), u = uji(H, K)
  const Mat = ({ d, fm }) => (<div className="tw"><table><thead><tr><th>Kode</th><th>Hotel</th>{K.map((_, j) => <th key={j}>C{j + 1}</th>)}</tr></thead>
    <tbody>{d.map((r, i) => <tr key={i}><td>A{i + 1}</td><td>{H[i].n}</td>{r.map((x, j) => <td key={j}>{fm(x)}</td>)}</tr>)}</tbody></table></div>)
  return (<main className="wrap sect"><div className="phead"><div><h1 className="pt">Detail Perhitungan SAW</h1><p className="ss" style={{ margin: 0 }}>Seluruh tahapan dari data mentah hingga ranking, siap untuk laporan.</p></div>
    <div className="pa"><button className="ghost dk" onClick={() => go('hasil')}>Kembali</button><button className="cta dark" onClick={() => window.print()}>CETAK LAPORAN</button></div></div>
    <div className="panel"><h3><i>1</i>Matriks keputusan (X)</h3><p className="mu">Nilai mentah setiap hotel.</p><Mat d={H.map((h) => h.v)} fm={(x) => x} /></div>
    <div className="panel"><h3><i>2</i>Normalisasi (R)</h3><div className="fm">Benefit: r = x / max(x) &nbsp;|&nbsp; Cost: r = min(x) / x</div><Mat d={c.R} fm={f4} /></div>
    <div className="panel"><h3><i>3</i>Nilai preferensi (V)</h3><div className="fm">V = Σ ( w × r ) &nbsp;&nbsp; bobot: {K.map((k, j) => `w${j + 1}=${k.w}`).join(', ')}</div>
      <div className="tw"><table><thead><tr><th>Peringkat</th><th>Hotel</th>{K.map((_, j) => <th key={j}>w{j + 1}×r{j + 1}</th>)}<th>V</th></tr></thead>
        <tbody>{c.rk.map((i, p) => <tr key={i} className={p ? '' : 'w'}><td>{p + 1}</td><td>{H[i].n}</td>{c.R[i].map((r, j) => <td key={j}>{f4(r * K[j].w)}</td>)}<td>{f4(c.V[i])}</td></tr>)}</tbody></table></div></div>
    <div className="panel"><h3><i>4</i>Pengujian hasil</h3>
      <p>• Total bobot = 1: <span className="lg">Lulus</span><br />• Semua nilai V di rentang 0–1: {c.V.every((v) => v >= 0 && v <= 1.0000001) ? <span className="lg">Lulus</span> : <span className="wr">Gagal</span>}<br />
        • Sensitivitas bobot: {u.st ? <span className="lg">hotel peringkat 1 sama di semua skenario, hasil stabil.</span> : <span className="wr">peringkat 1 berubah saat bobot diubah, hasil sensitif terhadap bobot.</span>}</p>
      <div className="tw"><table><thead><tr><th>Skenario bobot</th><th>Peringkat 1</th><th>Peringkat 2</th><th>Peringkat 3</th></tr></thead>
        <tbody>{u.r.map((x) => <tr key={x.a}><td>{x.a}</td>{[0, 1, 2].map((p) => <td key={p}>{x.top[p] || '-'}</td>)}</tr>)}</tbody></table></div></div></main>)
}

export function Panduan({ go }) {
  const info = [['book', 'Metode SAW', 'Simple Additive Weighting menjumlahkan nilai ternormalisasi yang dikalikan bobot kriteria.'], ['sliders', 'Cost & Benefit', 'Cost: makin kecil makin baik (harga, jarak). Benefit: makin besar makin baik (rating, fasilitas, kebersihan).'],
    ['calc', 'Rumus', 'Benefit r = x / max · Cost r = min / x · Nilai akhir V = Σ (w × r).'], ['chart', 'Pengujian', 'Sistem mengecek total bobot, rentang nilai V, dan uji sensitivitas terhadap perubahan bobot.']]
  const st = ['Buka Daftar Hotel dan periksa atau ubah data hotel.', 'Atur bobot kriteria di panel Preferensi sampai total 1,00.', 'Klik Hitung Rekomendasi untuk melihat peringkat.', 'Buka Perhitungan untuk melihat langkah detail dan pengujian.']
  return (<main className="wrap sect"><h1 className="pt" style={{ textAlign: 'center' }}>Panduan & Metode</h1><p className="ss" style={{ textAlign: 'center' }}>Pelajari cara kerja sistem dan cara menggunakannya.</p>
    <div className="contact"><div className="cl">{info.map(([ic, t, d]) => <div className="ci" key={t}><span className="circ dk"><Icon n={ic} s={20} /></span><div><b>{t}</b><p>{d}</p></div></div>)}</div>
      <div className="cc"><h2>Cara Menggunakan</h2><ol>{st.map((s) => <li key={s}>{s}</li>)}</ol><button className="cta full dark" onClick={() => go('hotels')}>MULAI SEKARANG</button></div></div></main>)
}
