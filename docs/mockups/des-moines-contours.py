"""Contour lines of Des Moines, Iowa, for the mockup's topography background.

Source: AWS Terrain Tiles (terrarium encoding). In the US that dataset is
USGS 3DEP/NED elevation, which is public domain. Fetch the 45 zoom-12 tiles
around downtown into a fresh directory first:

    mkdir tiles && cd tiles
    for y in $(seq 1523 1531); do for x in 980 981 982 983 984; do
      curl -sfo "12_${x}_${y}.png" \
        "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/12/${x}/${y}.png"
    done; done

Then:  python3 -I des-moines-contours.py tiles out 10 4.5
(10 m interval, 4.5 px Gaussian smoothing; the mockup uses these values.)
Writes out/topo.json (SVG path data for regular and index contours, in a
1000x2000 window with downtown at 500,700) and out/preview.png. Needs numpy + Pillow.
"""
import sys, math, json
from collections import defaultdict
import numpy as np
from PIL import Image, ImageDraw

tiles_dir, out_dir = sys.argv[1], sys.argv[2]
INTERVAL = float(sys.argv[3]) if len(sys.argv) > 3 else 5.0
SIGMA = float(sys.argv[4]) if len(sys.argv) > 4 else 2.0
Z, X0, X1, Y0, Y1 = 12, 980, 984, 1523, 1531
W, H = (X1 - X0 + 1) * 256, (Y1 - Y0 + 1) * 256

elev = np.zeros((H, W), np.float64)
for ty in range(Y0, Y1 + 1):
    for tx in range(X0, X1 + 1):
        a = np.asarray(Image.open(f"{tiles_dir}/{Z}_{tx}_{ty}.png").convert("RGB"), dtype=np.float64)
        elev[(ty - Y0) * 256:(ty - Y0 + 1) * 256, (tx - X0) * 256:(tx - X0 + 1) * 256] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768

def px(lon, lat):
    n = 2 ** Z
    x = (lon + 180) / 360 * n
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return (x - X0) * 256, (y - Y0) * 256

dx, dy = px(-93.6250, 41.5868)  # downtown
print(f"grid {W}x{H}  downtown px=({dx:.0f},{dy:.0f}) elev={elev[int(dy), int(dx)]:.1f} m")
print("elev min/p5/p50/p95/max:", [round(float(v), 1) for v in np.percentile(elev, [0, 5, 50, 95, 100])])

def blur(a, s):
    r = max(1, int(3 * s))
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / s) ** 2); k /= k.sum()
    p = np.pad(a, ((0, 0), (r, r)), mode="edge")
    a = sum(k[i] * p[:, i:i + a.shape[1]] for i in range(2 * r + 1))
    p = np.pad(a, ((r, r), (0, 0)), mode="edge")
    return sum(k[i] * p[i:i + a.shape[0], :] for i in range(2 * r + 1))

z = blur(elev, SIGMA)
# A 1000x2000 window for the full-page background, downtown at (500, 700):
# roughly behind "What I do" on a desktop-width page.
CX0, CY0 = round(dx) - 500, round(dy) - 700
CX1, CY1 = CX0 + 1000, CY0 + 2000
z = z[CY0:CY1, CX0:CX1]
W, H = CX1 - CX0, CY1 - CY0
dx, dy = dx - CX0, dy - CY0

def contours(z, L):
    tl, tr, br, bl = z[:-1, :-1], z[:-1, 1:], z[1:, 1:], z[1:, :-1]
    idx = ((tl > L) * 8 + (tr > L) * 4 + (br > L) * 2 + (bl > L) * 1).astype(np.uint8)
    ii, jj = np.nonzero((idx != 0) & (idx != 15))
    segs = []
    for i, j in zip(ii.tolist(), jj.tolist()):
        c = int(idx[i, j])
        T, B, Lf, R = ("h", i, j), ("h", i + 1, j), ("v", i, j), ("v", i, j + 1)
        if c in (1, 14): segs.append((Lf, B))
        elif c in (2, 13): segs.append((B, R))
        elif c in (3, 12): segs.append((Lf, R))
        elif c in (4, 11): segs.append((T, R))
        elif c in (6, 9): segs.append((T, B))
        elif c in (7, 8): segs.append((Lf, T))
        else:  # saddles: decide by the cell-centre average
            up = (tl[i, j] + tr[i, j] + br[i, j] + bl[i, j]) / 4 > L
            if (c == 5) == up: segs += [(Lf, T), (R, B)]
            else: segs += [(T, R), (Lf, B)]
    adj = defaultdict(list)
    for k, (a, b) in enumerate(segs): adj[a].append(k); adj[b].append(k)
    used = [False] * len(segs)
    def walk(e):
        chain = [e]
        while True:
            nxt = [k for k in adj[e] if not used[k]]
            if not nxt: return chain
            k = nxt[0]; used[k] = True
            a, b = segs[k]; e = b if a == e else a
            chain.append(e)
    chains = [walk(e) for e, ks in list(adj.items()) if len(ks) == 1 and not used[ks[0]]]
    chains += [walk(segs[k][0]) for k in range(len(segs)) if not used[k]]
    def pt(e):
        kind, i, j = e
        if kind == "h": return (j + (L - z[i, j]) / (z[i, j + 1] - z[i, j]), i)
        return (j, i + (L - z[i, j]) / (z[i + 1, j] - z[i, j]))
    return [[pt(e) for e in ch] for ch in chains if len(ch) > 1]

def chaikin(p, closed, n=2):
    for _ in range(n):
        q = [] if closed else [p[0]]
        rng = range(len(p)) if closed else range(len(p) - 1)
        for k in rng:
            a, b = p[k], p[(k + 1) % len(p)]
            q += [(a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25), (a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75)]
        if not closed: q.append(p[-1])
        p = q
    return p

def rdp(p, eps):
    if len(p) < 3: return p
    keep = [False] * len(p); keep[0] = keep[-1] = True
    stack = [(0, len(p) - 1)]
    while stack:
        s, e = stack.pop()
        ax, ay = p[s]; bx, by = p[e]; dxx, dyy = bx - ax, by - ay
        norm = math.hypot(dxx, dyy) or 1e-9
        best, bi = -1, -1
        for k in range(s + 1, e):
            d = abs(dyy * (p[k][0] - ax) - dxx * (p[k][1] - ay)) / norm
            if d > best: best, bi = d, k
        if best > eps:
            keep[bi] = True; stack += [(s, bi), (bi, e)]
    return [q for q, k in zip(p, keep) if k]

def length(p): return sum(math.hypot(p[k + 1][0] - p[k][0], p[k + 1][1] - p[k][1]) for k in range(len(p) - 1))

def to_path(p, closed):
    out = [f"M{p[0][0]:.1f} {p[0][1]:.1f}"]
    for a, b in zip(p, p[1:]):
        out.append(f"l{b[0] - a[0]:.1f} {b[1] - a[1]:.1f}".replace(".0 ", " ").replace("-0.0", "0"))
    if closed: out.append("z")
    return "".join(out)

lo = math.ceil(np.percentile(z, 0.5) / INTERVAL) * INTERVAL
hi = math.floor(np.percentile(z, 99.5) / INTERVAL) * INTERVAL
reg, idx_paths, preview = [], [], []
lv = lo
while lv <= hi:
    is_index = abs((lv / INTERVAL) % 5) < 1e-6
    for ch in contours(z, lv):
        closed = math.hypot(ch[0][0] - ch[-1][0], ch[0][1] - ch[-1][1]) < 1e-6
        if length(ch) < 80: continue
        if closed: ch = ch[:-1]
        sm = rdp(chaikin(ch, closed), 0.9)
        (idx_paths if is_index else reg).append(to_path(sm, closed))
        preview.append((sm + ([sm[0]] if closed else []), is_index))
    lv += INTERVAL

im = Image.new("RGB", (W, H), "white"); d = ImageDraw.Draw(im)
for p, is_index in preview: d.line(p, fill=(60, 80, 110) if is_index else (150, 165, 185), width=1)
d.ellipse((dx - 5, dy - 5, dx + 5, dy + 5), outline=(200, 40, 40), width=2)
im.save(f"{out_dir}/preview.png")
json.dump({"w": W, "h": H, "downtown": [round(dx), round(dy)], "interval": INTERVAL, "levels": [lo, hi],
           "regular": "".join(reg), "index": "".join(idx_paths)}, open(f"{out_dir}/topo.json", "w"))
print(f"levels {lo}..{hi} every {INTERVAL} m; paths: {len(reg)} regular, {len(idx_paths)} index; "
      f"bytes: {len(''.join(reg)) + len(''.join(idx_paths))}")
