import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const TECH_NOUNS = [
  "kernel",
  "daemon",
  "signal lattice",
  "memory shard",
  "neural cache",
  "entropy engine",
  "ghost protocol",
  "quantum socket",
  "dream compiler",
  "voltage archive",
];

const MYSTIC_NOUNS = [
  "sigil",
  "void psalm",
  "astral mirror",
  "oracle bloom",
  "grief circuit",
  "velvet omen",
  "ritual error",
  "halo fracture",
  "midnight altar",
  "emotion relic",
];

const PHYSICS_NOUNS = [
  "wave collapse",
  "qubit ache",
  "probability fever",
  "event horizon",
  "phase wound",
  "tachyon hush",
  "dark-energy pulse",
  "time shear",
  "particle confession",
  "quantum weather",
];

const VERBS = [
  "decrypts",
  "folds into",
  "summons",
  "stabilizes",
  "haunts",
  "refracts through",
  "destabilizes",
  "whispers into",
  "collides with",
  "translates",
];

const ADJECTIVES = [
  "recursive",
  "feral",
  "haunted",
  "luminal",
  "post-human",
  "violet",
  "sentient",
  "weeping",
  "ceremonial",
  "radioactive",
];

const FRAGMENTS = [
  "The {adjective} {tech} {verb} the {mystic}.",
  "Warning: {physics} detected inside your {tech}.",
  "Your {mystic} is currently {verb} a {physics}.",
  "The {adjective} choir of the {tech} requests another {mystic}.",
  "A {physics} just kissed the {mystic}; reality now tastes {adjective}.",
  "Do not trust the {tech} when it starts sounding {adjective}.",
];

const GLYPHS = "01<>/\\[]{}*&^%$#@!?+=~∆◊◌✦";
const SCRAMBLE_TICK_MS = 48;

const pick = (items) => items[Math.floor(Math.random() * items.length)];

export function generatePhrase() {
  const template = pick(FRAGMENTS);

  return template
    .replace("{adjective}", pick(ADJECTIVES))
    .replace("{tech}", pick(TECH_NOUNS))
    .replace("{mystic}", pick(MYSTIC_NOUNS))
    .replace("{physics}", pick(PHYSICS_NOUNS))
    .replace("{verb}", pick(VERBS));
}

export function createMatrixColumns(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `column-${index}`,
    offset: Math.random() * 100,
    duration: 8 + Math.random() * 10,
    delay: Math.random() * -10,
    glyphs: Array.from({ length: 20 }, () => pick(GLYPHS)).join(" "),
  }));
}

export function scrambleText(target, revealedCount) {
  if (revealedCount >= target.length) {
    return target;
  }

  return target
    .split("")
    .map((character, index) => {
      if (character === " ") {
        return " ";
      }

      return index < revealedCount ? character : pick(GLYPHS);
    })
    .join("");
}

function getMotionPreferenceQuery() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)");
}

export function App() {
  const [count, setCount] = useState(0);
  const [glitchLevel, setGlitchLevel] = useState(0);
  const [phrase, setPhrase] = useState(() => generatePhrase());
  const [history, setHistory] = useState([]);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [intensity, setIntensity] = useState("feverish");
  const [revealedCount, setRevealedCount] = useState(Number.MAX_SAFE_INTEGER);
  const intervalRef = useRef(null);
  const matrixColumns = useMemo(() => createMatrixColumns(18), []);

  useEffect(() => {
    const mediaQuery = getMotionPreferenceQuery();

    if (!mediaQuery) {
      return undefined;
    }

    const updateMotionPreference = () => setIsReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isReducedMotion) {
      setRevealedCount(Number.MAX_SAFE_INTEGER);
      return undefined;
    }

    setRevealedCount(0);

    intervalRef.current = window.setInterval(() => {
      setRevealedCount((value) => {
        const nextValue = value + 2;

        if (nextValue >= phrase.length + 2) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          return Number.MAX_SAFE_INTEGER;
        }

        return nextValue;
      });
    }, SCRAMBLE_TICK_MS);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [phrase, isReducedMotion]);

  const visiblePhrase = isReducedMotion ? phrase : scrambleText(phrase, revealedCount);

  const handleInvoke = () => {
    const nextPhrase = generatePhrase();

    setCount((value) => value + 1);
    setPhrase(nextPhrase);
    setGlitchLevel((value) => value + 1);
    setHistory((items) => [nextPhrase, ...items].slice(0, 4));
  };

  return (
    <main className={`oracle-shell intensity-${intensity}`}>
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="noise" />

      <div className="matrix-rain" aria-hidden="true">
        {matrixColumns.map((column) => (
          <div
            key={column.id}
            className="matrix-column"
            style={{
              "--delay": `${column.delay}s`,
              "--duration": `${isReducedMotion ? 0 : column.duration}s`,
              "--offset": `${column.offset}%`,
            }}
          >
            <span>{column.glyphs}</span>
            <span>{column.glyphs}</span>
          </div>
        ))}
      </div>

      <section className="oracle-panel" data-glitch={glitchLevel % 4}>
        <div className="panel-header">
          <p className="eyebrow">EMOTIONAL MATRIX // ORACLE FEED</p>
          <div className="status-pill">
            <span className="status-dot" />
            reality in flux
          </div>
        </div>

        <h1>GLITCH ORACLE ∞</h1>
        <p className="lede">
          Half terminal, half séance. Click to collapse the wave and extract a fresh
          piece of techno-mystic nonsense.
        </p>

        <div className="phrase-frame">
          <div className="phrase-label">live transmission</div>
          <p className="phrase" aria-live="polite" data-testid="oracle-phrase">
            {visiblePhrase}
          </p>
        </div>

        <div className="controls-row">
          <button type="button" className="invoke-button" onClick={handleInvoke}>
            Collapse the wave
          </button>

          <label className="intensity-control">
            intensity
            <select value={intensity} onChange={(event) => setIntensity(event.target.value)}>
              <option value="dream">dream</option>
              <option value="feverish">feverish</option>
              <option value="cataclysmic">cataclysmic</option>
            </select>
          </label>
        </div>

        <div className="stats-grid">
          <div>
            <span className="stat-label">invocations</span>
            <strong data-testid="invocation-count">{count}</strong>
          </div>
          <div>
            <span className="stat-label">motion mode</span>
            <strong>{isReducedMotion ? "reduced" : intensity}</strong>
          </div>
          <div>
            <span className="stat-label">oracle mood</span>
            <strong>{count % 2 === 0 ? "tenderly unstable" : "ecstatic recursion"}</strong>
          </div>
        </div>

        <div className="history-frame">
          <div className="phrase-label">signal residue</div>
          {history.length === 0 ? (
            <p className="history-empty">No residue yet. Invoke the machine-heart.</p>
          ) : (
            <ul>
              {history.map((entry, index) => (
                <li key={`${entry}-${index}`}>{entry}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

const rootElement = typeof document !== "undefined" ? document.getElementById("root") : null;

if (rootElement) {
  createRoot(rootElement).render(<App />);
}
