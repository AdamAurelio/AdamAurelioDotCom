/* eslint-disable react/prop-types */
// The small logo mark beside the site name: an arched stained-glass window.
// Sky above the horizon (navy -> teal -> gold dawn), a low sun, and fields
// below; panes are cut to the arch by a clip path, with dark "lead" between.
//
// The panes come from a seeded PRNG, so the artwork is identical on every
// load. They are computed once, at module load — about 40 rects.

const W = 300;
const H = 380;
const R = 150;
const CELL = 50;
const GAP = 10;
const HZ = 262; // horizon
const SUN = [212, 248];
const ARCH = `M0 ${H}V${R}A${R} ${R} 0 0 1 ${W} ${R}V${H}Z`;
const SKY = [
  [0, "#1D2B40"],
  [0.3, "#2B3D57"],
  [0.52, "#1f5f66"],
  [0.7, "#0f766e"],
  [0.86, "#C9A24E"],
  [1, "#F6EAD0"],
];
const FIELDS = ["#115e59", "#0f766e", "#3f7a5a", "#A56F1F", "#C58B2A", "#85581D", "#D5A345", "#2B3D57"];

// mulberry32
const prng = (seed) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const css = (c) => `rgb(${c.map((v) => Math.max(0, Math.min(255, Math.round(v)))).join(",")})`;
const ramp = (t) => {
  const x = Math.max(0, Math.min(1, t));
  for (let i = 1; i < SKY.length; i++) {
    if (x <= SKY[i][0]) {
      const [p0, c0] = SKY[i - 1];
      const [p1, c1] = SKY[i];
      return mix(rgb(c0), rgb(c1), (x - p0) / (p1 - p0));
    }
  }
  return rgb(SKY[SKY.length - 1][1]);
};

const buildPanes = (seed) => {
  const rnd = prng(seed);
  const cols = Math.ceil(W / CELL);
  const rows = Math.ceil(H / CELL);
  const hzRow = Math.floor(HZ / CELL);

  // Fields: bands of random widths that get deeper toward the viewer.
  const field = {};
  let last = -1;
  for (let r = hzRow, depth = 1; r < rows; r += depth, depth = Math.min(depth + 1, 3)) {
    for (let c = 0; c < cols; ) {
      const w = 2 + Math.floor(rnd() * 4);
      let k;
      do k = Math.floor(rnd() * FIELDS.length);
      while (k === last);
      last = k;
      for (let rr = r; rr < r + depth; rr++)
        for (let cc = c; cc < c + w; cc++) field[`${rr},${cc}`] = FIELDS[k];
      c += w;
    }
  }

  const inside = (x, y) => (y >= R ? x >= 0 && x <= W : Math.hypot(x - R, y - R) <= R);
  const panes = [];
  const sz = CELL - GAP;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * CELL + GAP / 2;
      const py = y * CELL + GAP / 2;
      if (!inside(px, py + sz) && !inside(px + sz, py + sz) && !inside(px, py) && !inside(px + sz, py))
        continue;
      const cx = px + sz / 2;
      const cy = py + sz / 2;
      const d = Math.hypot(cx - SUN[0], cy - SUN[1]);
      let col;
      if (y < hzRow) {
        col = ramp(cy / HZ + (rnd() - 0.5) * 0.08);
        if (d < 28) col = mix(col, rgb("#FBF6EC"), 0.92);
        else if (d < 82) col = mix(col, rgb("#E2BC6F"), (1 - (d - 28) / 54) * 0.75);
      } else {
        col = rgb(field[`${y},${x}`] || "#2B3D57");
        if (d < 95) col = mix(col, rgb("#E2BC6F"), (1 - d / 95) * 0.35);
      }
      const j = 0.9 + rnd() * 0.2;
      panes.push({
        x: px.toFixed(1),
        y: py.toFixed(1),
        fill: css(col.map((v) => v * j)),
        delay: Math.round(d * 4.2),
      });
    }
  }
  return panes;
};

const PANES = buildPanes(7);
const CLIP_ID = "brand-mark-clip";

const BrandMark = ({ className = "" }) => (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    className={`brand-mark overflow-visible ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <clipPath id={CLIP_ID}>
        <path d={ARCH} />
      </clipPath>
    </defs>
    <path className="lead" d={ARCH} />
    <g clipPath={`url(#${CLIP_ID})`}>
      {PANES.map((p) => (
        <rect
          key={`${p.x},${p.y}`}
          className="pane"
          x={p.x}
          y={p.y}
          width={CELL - GAP}
          height={CELL - GAP}
          rx="4"
          fill={p.fill}
          style={{ animationDelay: `${p.delay}ms` }}
        />
      ))}
    </g>
    <path className="w-frame" pathLength="1" strokeWidth="18" d={ARCH} />
  </svg>
);

export default BrandMark;
