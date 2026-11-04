const P = {
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z',
  pin: 'M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z',
  bld: 'M3 21h18M5 21V8l7-4 7 4v13M9 12h2M13 12h2M9 16h2M13 16h2',
  spark: 'M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  calc: 'M5 3h14a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1zM8 7h8M8 12h2M14 12h2M8 16h2M14 16h2',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0zM7 6H4a3 3 0 003 4M17 6h3a3 3 0 01-3 4',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4', trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  check: 'M12 3a9 9 0 100 18 9 9 0 000-18zM8 12l3 3 5-6', book: 'M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-6M20 4v14h-6',
  chart: 'M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3', mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
}
export const Icon = ({ n, s = 16 }) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={P[n]} /></svg>)

const PAL = [['#f6dfbd', '#c98b52', '#6b4423'], ['#d3e6ee', '#6aa0b5', '#2f5d73'], ['#ead9f2', '#a77ac2', '#5a3a78'], ['#dcebd4', '#7fb069', '#386641'], ['#f9dccf', '#e07a5f', '#8d3b2a'], ['#e0e7f6', '#7d93c9', '#33457a']]
// Ilustrasi hotel otomatis (dipakai jika tidak ada foto)
export function Art({ i = 0, img, name }) {
  const [a, b, c] = PAL[i % PAL.length], g = 'g' + i
  if (img) return <img className="photo" src={img} alt={name} onError={(e) => { e.currentTarget.style.display = 'none' }} />
  return (<svg className="photo" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label={name}>
    <defs><linearGradient id={g} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor="#fff" /></linearGradient></defs>
    <rect width="400" height="240" fill={`url(#${g})`} /><circle cx={320 - (i % 3) * 40} cy="58" r="26" fill="#fff" opacity=".75" />
    <path d="M0 190 Q90 140 190 178 T400 160 V240 H0z" fill={b} opacity=".35" />
    <rect x="120" y="70" width="170" height="130" rx="4" fill={c} /><rect x="95" y="110" width="50" height="90" rx="3" fill={c} opacity=".8" /><rect x="268" y="100" width="45" height="100" rx="3" fill={c} opacity=".8" />
    {[0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3, 4].map((q) => <rect key={r + '-' + q} x={134 + q * 30} y={84 + r * 26} width="16" height="14" rx="2" fill="#fff" opacity={(r + q + i) % 3 ? 0.85 : 0.35} />))}
    <rect x="185" y="168" width="38" height="32" rx="3" fill={a} /><rect x="0" y="200" width="400" height="40" fill={b} opacity=".55" />
  </svg>)
}
export const rupiah = (rb) => 'Rp ' + Math.round(rb * 1000).toLocaleString('id-ID')
