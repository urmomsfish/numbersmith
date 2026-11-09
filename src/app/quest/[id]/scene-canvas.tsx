"use client";

import { useEffect, useImperativeHandle, useRef, type RefObject } from "react";

/**
 * The game surface. Fills the viewport; everything else is drawn on top of it.
 *
 * This replaced a 210-pixel strip sitting between a sidebar and a form, which
 * read as a web page with a picture in it. A game is the thing you are looking
 * at, not a widget on a page — so the scene is the whole screen, and the HUD
 * and the question float over it.
 *
 * Monsters and terrain are drawn procedurally rather than loaded as art. The
 * reason is not cost, it is reach: the same creature has to work at 360px and
 * at 2560px, recolour per region, breathe, telegraph a swing, flinch, and die,
 * and a sprite sheet would need every one of those states authored by hand
 * fourteen times over. Here each one is a few numbers.
 *
 * The text of the question is *not* drawn here — the bank is authored in ASCII
 * maths that MathText must render, and it has to be selectable and reachable
 * by a screen reader. The DOM owns the words; the canvas owns the world.
 */

export type SceneHandle = {
  heroStrike: (amount: number) => void;
  enemyStrike: (amount: number, blocked: boolean) => void;
  enemyDown: () => void;
  heal: (amount: number) => void;
};

export type ScenePalette = {
  skyTop: string;
  skyBottom: string;
  ground: string;
  rock: string;
  accent: string;
};

export type Scene = {
  /** BATTLE draws the monster; SCENE is the same world with nobody in it. */
  mode: "BATTLE" | "SCENE";
  region: "EMBERWASTES" | "GLASS_REACH" | "SUNKEN_VAULT";
  palette: ScenePalette;

  startedAt: number;
  clockMs: number;
  elapsedAtServe: number;
  paused: boolean;

  art: string;
  tier: "COMMON" | "ELITE" | "BOSS";
  enemyHp: number;
  enemyMaxHp: number;
  heroHp: number;
  heroMaxHp: number;
  combo: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  kind: "spark" | "gore" | "dust" | "mote" | "snow" | "ember";
  hue: string;
};

type Float = { x: number; y: number; text: string; life: number; colour: string; size: number };
type Ring = { x: number; y: number; r: number; life: number; colour: string };

const MAX_PARTICLES = 420;

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const mix = (a: string, b: string, k: number) => {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return `rgb(${Math.round(r1 + (r2 - r1) * k)},${Math.round(g1 + (g2 - g1) * k)},${Math.round(b1 + (b2 - b1) * k)})`;
};
const shade = (hex: string, k: number) => {
  const [r, g, b] = hexToRgb(hex);
  const f = (v: number) => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k);
  return `rgb(${f(r)},${f(g)},${f(b)})`;
};

/** Where the combatants stand. Pushed well below centre so the creature has
 * sky above it and the question panel has room beneath. */
const groundY = (h: number) => h * 0.72;
const heroX = (w: number) => w * 0.26;
const foeX = (w: number) => w * 0.74;
/**
 * One unit of creature scale, so everything grows together on a big screen.
 *
 * Tuned against the viewport rather than fixed: the first full-screen pass
 * kept the sizes from the old 210px strip, which left a Slagbeast about the
 * size of a postage stamp in the middle of a 1600px desktop. The divisors
 * below put a common monster at roughly a seventh of the screen width.
 */
const unit = (w: number, h: number) => Math.max(0.9, Math.min(2.8, Math.min(w / 620, h / 450)));

export function SceneCanvas({
  scene,
  handle,
  className,
}: {
  scene: RefObject<Scene>;
  handle: RefObject<SceneHandle | null>;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const floats = useRef<Float[]>([]);
  const rings = useRef<Ring[]>([]);
  const shake = useRef(0);
  const flash = useRef(0);
  const flashHue = useRef("255,80,60");
  const heroLunge = useRef(0);
  const foeFlinch = useRef(0);
  const foeHurt = useRef(0);
  const foeAlive = useRef(1);
  const stars = useRef<{ x: number; y: number; z: number; tw: number }[]>([]);

  useImperativeHandle(
    handle,
    () => ({
      heroStrike(amount: number) {
        const c = canvasRef.current;
        if (!c) return;
        const { w, h } = size(c);
        const u = unit(w, h);
        const x = foeX(w);
        const y = groundY(h) - 60 * u;
        burst(particles.current, x, y, 40, "spark", "253,224,120");
        burst(particles.current, x, y, 22, "gore", "198,60,60");
        rings.current.push({ x, y, r: 10 * u, life: 1, colour: "253,224,120" });
        floats.current.push({ x, y: y - 16 * u, text: `−${amount}`, life: 1, colour: "#fbbf24", size: 40 * u });
        heroLunge.current = 1;
        foeFlinch.current = 1;
        foeHurt.current = 1;
        shake.current = Math.min(16, 5 + amount / 5);
      },
      enemyStrike(amount: number, blocked: boolean) {
        const c = canvasRef.current;
        if (!c) return;
        const { w, h } = size(c);
        const u = unit(w, h);
        const x = heroX(w);
        const y = groundY(h) - 46 * u;
        if (blocked) {
          burst(particles.current, x, y, 34, "spark", "186,230,253");
          rings.current.push({ x, y, r: 14 * u, life: 1, colour: "186,230,253" });
          floats.current.push({ x, y: y - 14 * u, text: "BLOCKED", life: 1, colour: "#7dd3fc", size: 26 * u });
          shake.current = 7;
          return;
        }
        burst(particles.current, x, y, 30, "gore", "208,48,48");
        burst(particles.current, x, y, 16, "dust", "130,120,115");
        floats.current.push({ x, y: y - 14 * u, text: `−${amount}`, life: 1, colour: "#f87171", size: 40 * u });
        shake.current = 22;
        flash.current = 1;
        flashHue.current = "220,40,40";
      },
      enemyDown() {
        const c = canvasRef.current;
        if (!c) return;
        const { w, h } = size(c);
        const u = unit(w, h);
        const x = foeX(w);
        const y = groundY(h) - 60 * u;
        burst(particles.current, x, y, 70, "ember", "251,191,36");
        burst(particles.current, x, y, 36, "dust", "150,140,132");
        rings.current.push({ x, y, r: 16 * u, life: 1, colour: "251,191,36" });
        rings.current.push({ x, y, r: 50 * u, life: 1, colour: "251,146,60" });
        shake.current = 18;
        foeAlive.current = 0;
      },
      heal(amount: number) {
        const c = canvasRef.current;
        if (!c) return;
        const { w, h } = size(c);
        const u = unit(w, h);
        const x = heroX(w);
        const y = groundY(h) - 46 * u;
        burst(particles.current, x, y, 30, "mote", "110,231,183");
        floats.current.push({ x, y: y - 14 * u, text: `+${amount}`, life: 1, colour: "#6ee7b7", size: 36 * u });
      },
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (stars.current.length === 0) {
      stars.current = Array.from({ length: 150 }, () => ({
        x: Math.random(),
        y: Math.random() * 0.68,
        z: 0.3 + Math.random() * 0.7,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    let raf = 0;
    let last = performance.now();

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    // One bad frame must not end the game. The reschedule is outside the try,
    // so a throw mid-draw costs a frame rather than freezing the world while
    // the wind-up keeps running and the player loses health to an invisible bug.
    let reported = false;
    const frame = (now: number) => {
      try {
        draw(now);
      } catch (err) {
        if (!reported) {
          reported = true;
          console.error("[scene] frame failed; the world keeps running", err);
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = scene.current;
      const { w, h } = size(canvas);
      const t = now / 1000;
      if (!s) return;
      const u = unit(w, h);

      ctx.save();
      if (shake.current > 0.2) {
        ctx.translate((Math.random() - 0.5) * shake.current, (Math.random() - 0.5) * shake.current);
        shake.current *= 0.87;
      } else shake.current = 0;

      drawWorld(ctx, w, h, s, t, stars.current, particles.current);

      const spent =
        s.paused || !s.startedAt ? s.elapsedAtServe : s.elapsedAtServe + (Date.now() - s.startedAt);
      const windup = s.mode === "BATTLE" ? Math.max(0, Math.min(1, spent / Math.max(1, s.clockMs))) : 0;

      heroLunge.current = Math.max(0, heroLunge.current - dt * 3);
      foeFlinch.current = Math.max(0, foeFlinch.current - dt * 2.4);
      foeHurt.current = Math.max(0, foeHurt.current - dt * 2.2);
      foeAlive.current = Math.min(1, foeAlive.current + dt * 1.2);

      drawHero(ctx, w, h, u, s, t, heroLunge.current);
      if (s.mode === "BATTLE" && (s.enemyHp > 0 || foeAlive.current < 1)) {
        drawFoe(ctx, w, h, u, s, t, windup, foeFlinch.current, foeHurt.current, foeAlive.current);
      }

      stepParticles(particles.current, dt, h);
      drawParticles(ctx, particles.current);
      stepRings(rings.current, dt, u);
      drawRings(ctx, rings.current);
      stepFloats(floats.current, dt);
      drawFloats(ctx, floats.current);

      if (flash.current > 0.01) {
        ctx.fillStyle = `rgba(${flashHue.current},${flash.current * 0.32})`;
        ctx.fillRect(0, 0, w, h);
        flash.current *= 0.85;
      }
      drawVignette(ctx, w, h);
      ctx.restore();
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [scene]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

function size(c: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  return { w: c.width / dpr, h: c.height / dpr };
}

// ---------------------------------------------------------------------------
// The world
// ---------------------------------------------------------------------------

function ridgeAt(t: number, o: number) {
  return (
    0.5 +
    0.3 * Math.sin(t * 4.1 + o) +
    0.17 * Math.sin(t * 9.3 + o * 2.3) +
    0.09 * Math.sin(t * 19.7 + o * 3.7) +
    0.04 * Math.sin(t * 37.3 + o * 5.1)
  );
}

function drawWorld(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  s: Scene,
  t: number,
  stars: { x: number; y: number; z: number; tw: number }[],
  particles: Particle[]
) {
  const p = s.palette;
  const gy = groundY(h);
  const cave = s.region === "SUNKEN_VAULT";

  const sky = ctx.createLinearGradient(0, 0, 0, gy);
  sky.addColorStop(0, p.skyTop);
  sky.addColorStop(1, p.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  if (!cave) {
    for (const st of stars) {
      const a = (0.12 + st.z * 0.42) * (0.55 + 0.45 * Math.sin(t * 1.3 + st.tw));
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fillRect(st.x * w, st.y * gy, st.z * 1.8, st.z * 1.8);
    }
    // A low sun, big and hazy, sitting on the horizon behind the ridges.
    const sx = w * 0.78;
    const sy = gy - h * 0.1;
    const sr = Math.min(w, h) * 0.12;
    const glow = ctx.createRadialGradient(sx, sy, sr * 0.2, sx, sy, sr * 3.4);
    glow.addColorStop(0, rgba(hexToRgb(p.accent), 0.5));
    glow.addColorStop(1, rgba(hexToRgb(p.accent), 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sx, sy, sr * 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = mix(p.accent, "#ffffff", 0.35);
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // A ceiling of stalactites instead of a sky.
    ctx.fillStyle = shade(p.rock, -0.4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    const teeth = Math.max(10, Math.round(w / 70));
    for (let i = teeth; i >= 0; i--) {
      const x = (i / teeth) * w;
      ctx.lineTo(x, h * (0.06 + 0.1 * Math.abs(Math.sin(i * 2.7))));
      ctx.lineTo(x - w / teeth / 2, h * 0.02);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Three parallax ridges, each hazed toward the sky by its distance. Without
  // the haze they read as one flat cut-out rather than as depth.
  const ridges: [number, number, number][] = [
    [0.7, 0.3, 0.68],
    [2.9, 0.2, 0.42],
    [5.3, 0.12, 0.16],
  ];
  for (const [offset, heightShare, haze] of ridges) {
    const height = h * heightShare;
    ctx.beginPath();
    ctx.moveTo(0, h);
    const step = Math.max(3, Math.round(w / 160));
    for (let x = 0; x <= w; x += step) ctx.lineTo(x, gy - ridgeAt(x / w, offset) * height);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = mix(p.rock, p.skyBottom, haze);
    ctx.fill();
  }

  // Fog banked against the base of the ridges, which is what actually sells
  // the distance between them.
  const fog = ctx.createLinearGradient(0, gy - h * 0.16, 0, gy);
  fog.addColorStop(0, rgba(hexToRgb(p.skyBottom), 0));
  fog.addColorStop(1, rgba(hexToRgb(p.skyBottom), 0.55));
  ctx.fillStyle = fog;
  ctx.fillRect(0, gy - h * 0.16, w, h * 0.16);

  const ground = ctx.createLinearGradient(0, gy, 0, h);
  ground.addColorStop(0, s.palette.ground);
  ground.addColorStop(1, shade(s.palette.ground, -0.6));
  ctx.fillStyle = ground;
  ctx.fillRect(0, gy, w, h - gy);

  // A lit strip where the ground meets the sky, so the horizon is an edge.
  ctx.fillStyle = rgba(hexToRgb(p.accent), 0.25);
  ctx.fillRect(0, gy - 1.5, w, 2.5);

  // Scattered foreground rocks for texture, deterministic so they do not crawl.
  for (let i = 0; i < 26; i++) {
    const rx = ((i * 97) % 100) / 100;
    const ry = ((i * 53) % 100) / 100;
    const x = rx * w;
    const y = gy + 8 + ry * (h - gy - 10);
    const r = (2 + ((i * 7) % 5)) * (0.6 + ry);
    ctx.fillStyle = shade(s.palette.ground, 0.1 - ry * 0.25);
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.7, r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Region weather, spawned into the shared particle list so it settles and
  // fades with everything else.
  const weather: Particle["kind"] = cave ? "mote" : s.region === "GLASS_REACH" ? "snow" : "ember";
  if (particles.length < MAX_PARTICLES - 40 && Math.random() < 0.6) {
    const fromTop = weather === "snow";
    particles.push({
      x: Math.random() * w,
      y: fromTop ? -10 : gy + Math.random() * (h - gy),
      vx: (Math.random() - 0.5) * 26,
      vy: fromTop ? 22 + Math.random() * 34 : -14 - Math.random() * 30,
      life: 1,
      maxLife: 3 + Math.random() * 3,
      size: 1 + Math.random() * 2,
      kind: weather,
      hue: weather === "snow" ? "226,240,255" : weather === "mote" ? "196,181,253" : "251,146,60",
    });
  }
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createRadialGradient(w / 2, h * 0.45, Math.min(w, h) * 0.3, w / 2, h * 0.45, Math.max(w, h) * 0.78);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.62)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

// ---------------------------------------------------------------------------
// Drawing primitives with volume
// ---------------------------------------------------------------------------

/** A filled shape with a dark outline and a rim light on the forge side.
 * The outline is what stops creatures reading as flat silhouettes. */
function body(
  ctx: CanvasRenderingContext2D,
  path: () => void,
  fill: string,
  rim: string,
  outlineWidth = 3
) {
  ctx.save();
  path();
  const g = ctx.createLinearGradient(-60, -60, 50, 60);
  g.addColorStop(0, shade(fill, 0.18));
  g.addColorStop(1, shade(fill, -0.3));
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.lineWidth = outlineWidth;
  ctx.stroke();
  // A rim light where the forge is. Clipped so it only brightens the inside
  // edge — and kept thin, because at 1.6x the outline it swallowed small
  // shapes whole and turned heads into pale emblems.
  ctx.clip();
  ctx.strokeStyle = rim;
  ctx.lineWidth = outlineWidth * 0.8;
  ctx.stroke();
  ctx.restore();
}

function ellipsePath(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number) {
  return () => {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  };
}

/** A limb with a visible joint, which is the difference between a creature
 * and a stick figure. */
function limb(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bend: number,
  width: number,
  colour: string
) {
  const mx = (x1 + x2) / 2 + bend;
  const my = (y1 + y2) / 2;
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = width + 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(mx, my, x2, y2);
  ctx.stroke();
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(mx, my, x2, y2);
  ctx.stroke();
}

/**
 * A lit eye with a pupil.
 *
 * The bloom is deliberately tight. At three times the iris it was wider than
 * the head it sat on, and two of them turned a Slagbeast's skull into a pale
 * blob — the glow has to say "this is lit", not "this is the brightest thing
 * in the scene".
 */
function eye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, colour: string, angry: number) {
  const g = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 1.9);
  g.addColorStop(0, `rgba(${colour},0.4)`);
  g.addColorStop(1, `rgba(${colour},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `rgb(${colour})`;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = Math.max(1, r * 0.22);
  ctx.stroke();

  // A vertical slit pupil, narrowing as it winds up to strike.
  ctx.fillStyle = "rgba(0,0,0,0.88)";
  ctx.beginPath();
  ctx.ellipse(x, y, r * (0.34 - angry * 0.12), r * (0.82 - angry * 0.18), 0, 0, Math.PI * 2);
  ctx.fill();
}

function horn(ctx: CanvasRenderingContext2D, x: number, y: number, lean: number, len: number, colour: string) {
  ctx.fillStyle = colour;
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - len * 0.22, y + len * 0.3);
  ctx.quadraticCurveTo(x + lean * len * 0.6, y - len * 0.3, x + lean * len, y - len);
  ctx.quadraticCurveTo(x + lean * len * 0.2, y - len * 0.1, x + len * 0.22, y + len * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// The hero
// ---------------------------------------------------------------------------

function drawHero(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  u: number,
  s: Scene,
  t: number,
  lunge: number
) {
  const gy = groundY(h);
  const x = heroX(w) + lunge * 26 * u;
  const bob = Math.sin(t * 2.1) * 1.6 * u;

  // The forge: a brazier whose fire climbs with the combo.
  const fx = x - 62 * u;
  const fire = (14 + s.combo * 10) * u;
  const fg = ctx.createRadialGradient(fx, gy - 16 * u, 2, fx, gy - 16 * u, fire * 2.6);
  fg.addColorStop(0, "rgba(255,214,140,0.95)");
  fg.addColorStop(0.45, "rgba(249,146,40,0.5)");
  fg.addColorStop(1, "rgba(234,88,12,0)");
  ctx.fillStyle = fg;
  ctx.beginPath();
  ctx.arc(fx, gy - 16 * u, fire * 2.6 * (0.92 + 0.08 * Math.sin(t * 8)), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a1420";
  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fx - 20 * u, gy);
  ctx.lineTo(fx - 13 * u, gy - 16 * u);
  ctx.lineTo(fx + 13 * u, gy - 16 * u);
  ctx.lineTo(fx + 20 * u, gy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const lift = (16 + s.combo * 9) * u * (0.7 + 0.3 * Math.sin(t * 6 + i * 2));
    const fl = ctx.createLinearGradient(fx, gy - 18 * u, fx, gy - 18 * u - lift);
    fl.addColorStop(0, "rgba(255,196,96,0.9)");
    fl.addColorStop(1, "rgba(234,88,12,0)");
    ctx.fillStyle = fl;
    ctx.beginPath();
    ctx.moveTo(fx + (i - 1) * 8 * u - 5 * u, gy - 17 * u);
    ctx.quadraticCurveTo(fx + (i - 1) * 8 * u, gy - 18 * u - lift, fx + (i - 1) * 8 * u + 5 * u, gy - 17 * u);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "rgba(0,0,0,0.38)";
  ctx.beginPath();
  ctx.ellipse(x, gy + 4 * u, 30 * u, 7 * u, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(x, gy - bob);
  ctx.scale(u, u);

  const cloth = "#2b3446";
  const rim = "rgba(255,180,90,0.75)";

  limb(ctx, -7, -22, -12, 0, -4, 7, shade(cloth, -0.3));
  limb(ctx, 7, -22, 13, 0, 4, 7, shade(cloth, -0.3));
  body(ctx, ellipsePath(ctx, 0, -38, 15, 19), cloth, rim);
  // An apron, so the smith is a smith and not a generic figure.
  ctx.fillStyle = "#4a2f1d";
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10, -34);
  ctx.lineTo(10, -34);
  ctx.lineTo(8, -16);
  ctx.lineTo(-8, -16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  body(ctx, ellipsePath(ctx, 0, -62, 10, 11), "#caa37a", rim, 2.5);

  // The hammer arm, swung through on a lunge.
  const swing = -1.1 + lunge * 2.6;
  ctx.save();
  ctx.translate(12, -48);
  ctx.rotate(swing);
  limb(ctx, 0, 0, 22, 0, 0, 6, "#caa37a");
  ctx.strokeStyle = "#6b3f1d";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.lineTo(42, 0);
  ctx.stroke();
  ctx.fillStyle = "#9aa6b4";
  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(38, -10, 16, 20, 3);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Monsters
// ---------------------------------------------------------------------------

function drawFoe(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  u: number,
  s: Scene,
  t: number,
  windup: number,
  flinch: number,
  hurt: number,
  alive: number
) {
  const gy = groundY(h);
  const tierScale = s.tier === "BOSS" ? 1.75 : s.tier === "ELITE" ? 1.3 : 1;
  const k = u * tierScale;
  const x = foeX(w) + flinch * 20 * u;
  const bob = Math.sin(t * 1.6) * 3 * u;
  // Rear back as the wind-up fills, so the swing is telegraphed in the body
  // and not only in a bar.
  const coil = windup * windup;

  ctx.save();
  ctx.globalAlpha = alive;

  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(x, gy + 5 * u, 44 * k, 9 * u, 0, 0, Math.PI * 2);
  ctx.fill();

  // A menace glow that swells as it prepares to strike.
  if (coil > 0.1) {
    const g = ctx.createRadialGradient(x, gy - 50 * k, 4, x, gy - 50 * k, 120 * k * coil);
    g.addColorStop(0, `rgba(239,68,68,${0.3 * coil})`);
    g.addColorStop(1, "rgba(239,68,68,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, gy - 50 * k, 120 * k * coil, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.translate(x, gy - bob);
  ctx.scale(k, k);
  ctx.rotate(-coil * 0.14 + flinch * 0.12);
  // Hurt reads as a wash of red over the whole creature.
  const base = hurt > 0.3 ? mix(s.palette.accent, "#ff6b6b", 0.65) : shade(s.palette.accent, -0.5);
  const dark = shade(base, -0.4);
  // Faint. A rim light that traces a whole small shape stops being a
  // highlight and becomes an outline — it was making heads read as coins
  // sitting beside the body rather than as part of the animal.
  const rim = "rgba(255,170,90,0.22)";
  const eyeHue = s.region === "GLASS_REACH" ? "186,230,253" : s.region === "SUNKEN_VAULT" ? "216,180,254" : "253,224,71";
  const sway = Math.sin(t * 2.4) * 3;

  switch (s.art) {
    case "IMP":
      limb(ctx, -14, -26, -26 + sway, -4, -6, 5, dark);
      limb(ctx, 14, -26, 26 - sway, -4, 6, 5, dark);
      body(ctx, ellipsePath(ctx, 0, -34, 20, 22), base, rim);
      horn(ctx, -11, -50, -0.8, 15, dark);
      horn(ctx, 11, -50, 0.8, 15, dark);
      eye(ctx, -7, -36, 4, eyeHue, coil);
      eye(ctx, 7, -36, 4, eyeHue, coil);
      break;

    case "BEAST":
      limb(ctx, -20, -18, -26, 0, -5, 8, dark);
      limb(ctx, 20, -18, 26, 0, 5, 8, dark);
      body(ctx, ellipsePath(ctx, 0, -30, 34, 22), base, rim);
      body(ctx, ellipsePath(ctx, -30, -40, 17, 15), base, rim);
      for (let i = -2; i <= 2; i++) horn(ctx, i * 11, -50, i * 0.2, 13, dark);
      eye(ctx, -34, -43, 3.6, eyeHue, coil);
      eye(ctx, -26, -44, 3.6, eyeHue, coil);
      break;

    case "WRAITH": {
      const g = ctx.createLinearGradient(0, -78, 0, 0);
      g.addColorStop(0, shade(base, 0.2));
      g.addColorStop(0.6, base);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-22 + sway, 0);
      ctx.quadraticCurveTo(-26, -58, 0, -78);
      ctx.quadraticCurveTo(26, -58, 22 - sway, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // A hood, so the shape has a readable head.
      body(ctx, ellipsePath(ctx, 0, -62, 16, 14), dark, rim, 2.5);
      eye(ctx, -6, -62, 3.6, eyeHue, coil);
      eye(ctx, 6, -62, 3.6, eyeHue, coil);
      break;
    }

    case "GOLEM":
      limb(ctx, -26, -34, -40, -6, -8, 13, dark);
      limb(ctx, 26, -34, 40, -6, 8, 13, dark);
      body(ctx, ellipsePath(ctx, 0, -40, 30, 32), base, rim, 4);
      ctx.strokeStyle = "rgba(255,170,90,0.5)";
      ctx.lineWidth = 3;
      for (const dy of [-18, -2, 14]) {
        ctx.beginPath();
        ctx.moveTo(-26, -40 + dy);
        ctx.lineTo(26, -40 + dy);
        ctx.stroke();
      }
      eye(ctx, -10, -48, 5, eyeHue, coil);
      eye(ctx, 10, -48, 5, eyeHue, coil);
      break;

    case "TYRANT":
      limb(ctx, -30, -38, -48 + sway, -4, -10, 14, dark);
      limb(ctx, 30, -38, 48 - sway, -4, 10, 14, dark);
      body(ctx, ellipsePath(ctx, 0, -48, 36, 38), base, rim, 4);
      horn(ctx, -22, -82, -1, 26, dark);
      horn(ctx, 22, -82, 1, 26, dark);
      // A crown of embers.
      for (let i = -2; i <= 2; i++) {
        ctx.fillStyle = `rgba(253,224,71,${0.6 + 0.4 * Math.sin(t * 4 + i)})`;
        ctx.beginPath();
        ctx.arc(i * 12, -86, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      eye(ctx, -13, -52, 6, eyeHue, coil);
      eye(ctx, 13, -52, 6, eyeHue, coil);
      break;

    case "MITE":
      limb(ctx, -13, -14, -22 + sway, 0, -4, 4, dark);
      limb(ctx, 13, -14, 22 - sway, 0, 4, 4, dark);
      body(ctx, ellipsePath(ctx, 0, -20, 17, 16), base, rim, 2.5);
      for (let i = -1; i <= 1; i++) horn(ctx, i * 9, -34, i * 0.3, 10, "#dbeafe");
      eye(ctx, -5, -21, 3.4, eyeHue, coil);
      eye(ctx, 5, -21, 3.4, eyeHue, coil);
      break;

    case "STALKER":
      limb(ctx, -12, -62, -34 + sway, -16, -10, 4, dark);
      limb(ctx, 12, -62, 34 - sway, -16, 10, 4, dark);
      limb(ctx, -8, -16, -18, 0, -4, 5, dark);
      limb(ctx, 8, -16, 18, 0, 4, 5, dark);
      ctx.globalAlpha = alive * 0.82;
      body(ctx, ellipsePath(ctx, 0, -46, 16, 36), base, rim, 2.5);
      ctx.globalAlpha = alive;
      eye(ctx, -5, -66, 3.4, eyeHue, coil);
      eye(ctx, 5, -66, 3.4, eyeHue, coil);
      break;

    case "HOUND":
      limb(ctx, -16, -16, -22, 0, -4, 6, dark);
      limb(ctx, 16, -16, 22, 0, 4, 6, dark);
      body(ctx, ellipsePath(ctx, 0, -26, 30, 17, ), base, rim);
      body(ctx, ellipsePath(ctx, -28, -36, 16, 13), base, rim, 2.5);
      horn(ctx, -34, -48, -0.6, 12, "#dbeafe");
      horn(ctx, -22, -50, 0.3, 10, "#dbeafe");
      eye(ctx, -33, -38, 3.4, eyeHue, coil);
      eye(ctx, -25, -39, 3.4, eyeHue, coil);
      break;

    case "SHARDMAW": {
      body(ctx, ellipsePath(ctx, 0, -38, 32, 32), base, rim, 4);
      ctx.fillStyle = "#0b1220";
      ctx.beginPath();
      ctx.arc(0, -38, 21, 0, Math.PI * 2);
      ctx.fill();
      const gape = 1 + coil * 0.5;
      ctx.fillStyle = "#e0f2fe";
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + Math.sin(t * 2) * 0.08;
        const r1 = 21 * gape;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, -38 + Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a + 0.2) * r1, -38 + Math.sin(a + 0.2) * r1);
        ctx.lineTo(Math.cos(a + 0.1) * 8, -38 + Math.sin(a + 0.1) * 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case "ARCHIVIST":
      limb(ctx, -24, -58, -44 + sway, -24, -10, 6, dark);
      limb(ctx, 24, -58, 44 - sway, -24, 10, 6, dark);
      body(ctx, ellipsePath(ctx, 0, -50, 26, 40), base, rim, 3.5);
      body(ctx, ellipsePath(ctx, 0, -84, 15, 14), dark, rim, 2.5);
      // Pages orbiting its head.
      for (let i = 0; i < 5; i++) {
        const a = t * 0.8 + (i / 5) * Math.PI * 2;
        ctx.fillStyle = "rgba(224,242,254,0.8)";
        ctx.save();
        ctx.translate(Math.cos(a) * 36, -84 + Math.sin(a) * 12);
        ctx.rotate(a);
        ctx.fillRect(-4, -5, 8, 10);
        ctx.restore();
      }
      eye(ctx, -6, -85, 3.8, eyeHue, coil);
      eye(ctx, 6, -85, 3.8, eyeHue, coil);
      break;

    case "CRAWLER":
      for (let i = -3; i <= 3; i++) {
        if (i === 0) continue;
        limb(ctx, i * 10, -18, i * 17 + Math.sin(t * 3 + i) * 3, 0, i * 2, 4, dark);
      }
      body(ctx, ellipsePath(ctx, 0, -26, 36, 18), base, rim);
      for (let i = -2; i <= 2; i++) horn(ctx, i * 13, -42, i * 0.2, 12, dark);
      eye(ctx, -8, -28, 4, eyeHue, coil);
      eye(ctx, 8, -28, 4, eyeHue, coil);
      break;

    case "SHADE": {
      const g = ctx.createRadialGradient(0, -44, 6, 0, -44, 52);
      g.addColorStop(0, shade(base, 0.25));
      g.addColorStop(0.5, rgba(hexToRgb(s.palette.accent), 0.35));
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, -44, 52, 0, Math.PI * 2);
      ctx.fill();
      // Tendrils, so it has a direction and a reach.
      for (let i = -2; i <= 2; i++) {
        limb(ctx, i * 10, -40, i * 22, -4 + Math.sin(t * 2 + i) * 6, i * 4, 3, rgba(hexToRgb(s.palette.accent), 0.5));
      }
      eye(ctx, -9, -46, 5, eyeHue, coil);
      eye(ctx, 9, -46, 5, eyeHue, coil);
      break;
    }

    case "GEARWYRM": {
      for (let i = 6; i >= 1; i--) {
        const sx = -i * 17;
        const sy = -26 + Math.sin(t * 1.8 + i * 0.6) * 9;
        body(ctx, ellipsePath(ctx, sx, sy, 15 - i * 1.1, 13 - i * 0.9), shade(base, -0.08 * i), rim, 2.5);
      }
      body(ctx, ellipsePath(ctx, 0, -30, 20, 18), base, rim, 3);
      ctx.save();
      ctx.translate(10, -30);
      ctx.rotate(t * 1.1);
      ctx.fillStyle = shade(base, 0.22);
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.roundRect(-4, -24, 8, 10, 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      eye(ctx, 6, -30, 4.5, eyeHue, coil);
      break;
    }

    case "AXIOM":
    default: {
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(0, -52);
        ctx.rotate(t * (0.25 + i * 0.2) * (i % 2 ? -1 : 1));
        ctx.strokeStyle = rgba(hexToRgb(s.palette.accent), 0.85 - i * 0.16);
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(0, 0, 46 - i * 9, 18 - i * 3.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      const core = ctx.createRadialGradient(0, -52, 2, 0, -52, 26);
      core.addColorStop(0, "#ffffff");
      core.addColorStop(0.4, mix(s.palette.accent, "#ffffff", 0.4));
      core.addColorStop(1, rgba(hexToRgb(s.palette.accent), 0));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, -52, 26 * (1 + coil * 0.25), 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Effects
// ---------------------------------------------------------------------------

function burst(list: Particle[], x: number, y: number, n: number, kind: Particle["kind"], hue: string) {
  for (let i = 0; i < n && list.length < MAX_PARTICLES; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = kind === "dust" ? 26 + Math.random() * 60 : 90 + Math.random() * 240;
    list.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - (kind === "ember" ? 60 : 0),
      life: 1,
      maxLife: kind === "dust" ? 1.2 : 0.5 + Math.random() * 0.6,
      size: kind === "dust" ? 5 + Math.random() * 7 : 1.8 + Math.random() * 3,
      kind,
      hue,
    });
  }
}

function stepParticles(list: Particle[], dt: number, h: number) {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.life -= dt / p.maxLife;
    if (p.life <= 0 || p.y > h + 60 || p.y < -60) {
      list.splice(i, 1);
      continue;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    const gravity =
      p.kind === "ember" || p.kind === "mote" ? -26 : p.kind === "snow" ? 16 : p.kind === "dust" ? -12 : 420;
    p.vy += gravity * dt;
    if (p.kind === "ember" || p.kind === "mote" || p.kind === "snow") {
      p.vx += Math.sin(p.life * 7 + p.x * 0.05) * 16 * dt;
      p.vx *= 0.995;
    } else {
      p.vx *= 0.97;
      p.vy *= 0.97;
    }
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, list: Particle[]) {
  for (const p of list) {
    const a = p.kind === "dust" ? p.life * 0.3 : p.kind === "snow" || p.kind === "mote" ? p.life * 0.65 : p.life;
    ctx.fillStyle = `rgba(${p.hue},${a})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (0.5 + p.life * 0.5), 0, Math.PI * 2);
    ctx.fill();
  }
}

function stepRings(list: Ring[], dt: number, u: number) {
  for (let i = list.length - 1; i >= 0; i--) {
    const r = list[i];
    r.life -= dt * 1.8;
    r.r += dt * 460 * u;
    if (r.life <= 0) list.splice(i, 1);
  }
}

function drawRings(ctx: CanvasRenderingContext2D, list: Ring[]) {
  for (const r of list) {
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${r.colour},${r.life * 0.65})`;
    ctx.lineWidth = 4 * r.life;
    ctx.stroke();
  }
}

function stepFloats(list: Float[], dt: number) {
  for (let i = list.length - 1; i >= 0; i--) {
    const f = list[i];
    f.life -= dt * 0.75;
    f.y -= dt * 58;
    if (f.life <= 0) list.splice(i, 1);
  }
}

function drawFloats(ctx: CanvasRenderingContext2D, list: Float[]) {
  ctx.textAlign = "center";
  for (const f of list) {
    ctx.font = `900 ${Math.round(f.size * (0.8 + f.life * 0.3))}px ui-sans-serif, system-ui, sans-serif`;
    ctx.lineWidth = 6;
    ctx.strokeStyle = `rgba(0,0,0,${f.life * 0.85})`;
    ctx.strokeText(f.text, f.x, f.y);
    ctx.globalAlpha = Math.min(1, f.life * 1.5);
    ctx.fillStyle = f.colour;
    ctx.fillText(f.text, f.x, f.y);
    ctx.globalAlpha = 1;
  }
}
