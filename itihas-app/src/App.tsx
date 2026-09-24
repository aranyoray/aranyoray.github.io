import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { loadContent, loadCountries, loadCountry } from "./data";
import {
  currentNode,
  createSession,
  choose,
  reveal,
  advanceRipple,
  skipRipples,
  chooseFlash,
  finishBeat,
  percent,
  distance,
  replay,
} from "./engine";
import { useGame, download, csv, importSave } from "./store";
import {
  type CountryInfo,
  type Country,
  type Content,
  type GameEvent,
  type Session,
  type Options,
  type Meter,
  keys,
} from "./types";
const WorldMap = lazy(() => import("./WorldMap"));
const defaultOptions: Options = {
  difficulty: "student",
  teacher: false,
  council: false,
  readable: false,
  auto: true,
};
const meterNames: Record<Meter, string> = {
  TENSION: "World tension",
  STABILITY: "Stability",
  ECON: "Economy",
  INFLUENCE: "Influence",
};
const meterIcons: Record<Meter, string> = {
  TENSION: "↗",
  STABILITY: "≋",
  ECON: "▤",
  INFLUENCE: "◎",
};
function Mark() {
  return (
    <svg viewBox="0 0 40 32" aria-hidden="true">
      <path
        d="M20 15C6-5-5 0 7 18c-9 11 7 17 13-1C26 35 42 29 33 18 45 0 34-5 20 15Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M20 9v17m0-16-4-5m4 5 4-5" stroke="currentColor" fill="none" />
    </svg>
  );
}
function Meters({
  meters,
  previous,
}: {
  meters: Session["meters"];
  previous?: Session["meters"];
}) {
  return (
    <div className="meters">
      {keys.map((k) => (
        <div
          className={
            "meter " +
            k.toLowerCase() +
            (k === "TENSION" && meters[k] >= 80 ? " danger" : "")
          }
          key={k}
        >
          <div>
            <span>
              {meterIcons[k]} {meterNames[k]}
            </span>
            <strong>
              {meters[k]}
              <small>/100</small>
            </strong>
          </div>
          <div
            className="meter-track"
            role="meter"
            aria-label={meterNames[k]}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={meters[k]}
          >
            <span
              style={{
                width: meters[k] + "%",
                background:
                  k === "TENSION"
                    ? meters[k] >= 80
                      ? "#963d2e"
                      : meters[k] >= 50
                        ? "#967035"
                        : "#536b78"
                    : undefined,
              }}
            />
          </div>
          {previous && meters[k] !== previous[k] && (
            <span className="meter-change">
              {meters[k] - previous[k] > 0 ? "+" : ""}
              {meters[k] - previous[k]} this decision
            </span>
          )}
          {k === "TENSION" && meters[k] >= 95 && (
            <span className="defcon">DEFCON 1</span>
          )}
        </div>
      ))}
    </div>
  );
}
function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    const prior = document.activeElement as HTMLElement;
    return () => {
      d.close();
      prior?.focus?.();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={"modal " + (wide ? "wide" : "")}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button onClick={onClose} aria-label="Close dialog">
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
function TermText({
  text,
  content,
  onTerm,
}: {
  text: string;
  content: Content;
  onTerm: (term: string) => void;
}) {
  const terms = content.vocabulary
    .map((v) => v.term)
    .sort((a, b) => b.length - a.length);
  const re = new RegExp(
    "(" +
      terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") +
      ")",
    "gi",
  );
  return (
    <>
      {text.split(re).map((part, i) =>
        terms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
          <button className="term" key={i} onClick={() => onTerm(part)}>
            {part}
          </button>
        ) : (
          part
        ),
      )}
    </>
  );
}
function formatText(text: string, c: CountryInfo) {
  return text
    .replaceAll("{country}", c.name)
    .replaceAll("{capital}", c.capital);
}
function say(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.92;
  window.speechSynthesis.speak(u);
}
const countryNotes: Record<string, string> = {
  USA: "Power, prosperity, and the price of both.",
  USSR: "Security at home. An empire at its edges.",
  CHN: "A revolution looking for its place in the world.",
  UK: "An empire ends. A different role begins.",
  FRG: "A divided country at the center of everything.",
  CUB: "A small island in the shadow of superpowers.",
  IND: "Independence is only the beginning.",
};
export default function App() {
  const { session: s, archive, warning, setSession, dismiss } = useGame();
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [content, setContent] = useState<Content | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [selected, setSelected] = useState("USA");
  const [screen, setScreen] = useState<"home" | "play">("home");
  const [options, setOptions] = useState<Options>(s?.options || defaultOptions);
  const [modal, setModal] = useState<
    "settings" | "album" | "timeline" | "sources" | "help" | null
  >(null);
  const [inspect, setInspect] = useState<GameEvent | null>(null);
  const [term, setTerm] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [insight, setInsight] = useState(false);
  const [advisor, setAdvisor] = useState("general");
  const [votes, setVotes] = useState([0, 0, 0]);
  const [region, setRegion] = useState("All regions");
  const [filter, setFilter] = useState("All cards");
  const [debrief, setDebrief] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let active = true;
    Promise.all([loadCountries(), loadContent()])
      .then(([cs, data]) => {
        if (active) {
          setCountries(cs);
          setContent(data);
        }
      })
      .catch((e) => setError(e.message));
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const id = screen === "play" && s ? s.countryId : selected;
    let active = true;
    setBusy(true);
    loadCountry(id)
      .then((c) => {
        if (active) {
          setCountry(c);
          setBusy(false);
        }
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          setBusy(false);
        }
      });
    return () => {
      active = false;
    };
  }, [selected, screen, s?.countryId]);
  useEffect(() => {
    document.documentElement.classList.toggle(
      "readable",
      screen === "play" && s ? s.options.readable : options.readable,
    );
  }, [options.readable, s?.options.readable, screen]);
  useEffect(() => {
    if (screen !== "play" || !s) return;
    if (
      ["ripple", "flash-ripple"].includes(s.phase) &&
      s.queue[s.queueIndex] &&
      !s.queue[s.queueIndex].resolved
    )
      setSession(reveal(s));
  }, [s, screen, setSession]);
  useEffect(() => {
    if (
      screen !== "play" ||
      !s ||
      !["ripple", "flash-ripple"].includes(s.phase) ||
      !s.options.auto ||
      s.options.difficulty !== "student" ||
      s.options.teacher ||
      s.options.council ||
      modal ||
      inspect ||
      term ||
      !s.queue[s.queueIndex]?.resolved
    )
      return;
    const timer = window.setTimeout(() => setSession(advanceRipple(s)), 6000);
    return () => clearTimeout(timer);
  }, [s, screen, modal, inspect, term, setSession]);
  useEffect(() => {
    setInsight(false);
    panel.current?.scrollTo({ top: 0 });
  }, [s?.phase, s?.turn, s?.queueIndex]);
  useEffect(() => {
    setVotes([0, 0, 0]);
    setAdvisor("general");
  }, [s?.turn]);
  useEffect(() => {
    if (screen !== "play") return;
    panel.current?.focus({ preventScroll: true });
    if (window.matchMedia("(max-width:760px)").matches) {
      const target =
        s?.phase === "ripple" || s?.phase === "flash-ripple"
          ? document.querySelector(".game-layout")
          : panel.current;
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion:reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    }
  }, [s?.phase, s?.turn, screen]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  const selectedCountry = countries.find((c) => c.id === selected) || null;
  const playing =
    screen === "play" && !!s && !!country && country.id === s.countryId;
  const node = playing ? currentNode(country!, s!) : null;
  const active =
    playing && ["ripple", "flash-ripple"].includes(s!.phase)
      ? s!.queue[s!.queueIndex] || null
      : null;
  const historical = node?.choices.find((c) => c.historical);
  const chosen = node?.choices.find(
    (c) => c.id === s?.history.find((h) => h.turn === s.turn)?.choiceId,
  );
  const ending = content?.endings.find((e) => e.id === s?.endingId);
  const firstDivergence = s?.history.find((h) => !h.historical)?.turn;
  function openEvent(event: GameEvent) {
    setInspect(event);
    if (s)
      setSession({
        ...s,
        events: s.events.map((e) =>
          e.id === event.id ? { ...e, viewed: true } : e,
        ),
      });
  }
  async function start() {
    if (!country || country.id !== selected || busy) return;
    setSession(createSession(country, options));
    setDebrief(false);
    setScreen("play");
  }
  async function resume() {
    if (!s) return;
    setBusy(true);
    try {
      await loadCountry(s.countryId);
      setDebrief(false);
      setScreen("play");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function progress(phase: Session["phase"]) {
    if (s) setSession({ ...s, phase });
  }
  function setting(k: keyof Options, value: Options[keyof Options]) {
    const next = { ...options, [k]: value };
    if (k === "council" && value) next.teacher = true;
    setOptions(next);
    if (playing && s)
      setSession({
        ...s,
        options: {
          ...s.options,
          [k]: value,
          ...(k === "council" && value ? { teacher: true } : {}),
        },
      });
  }
  async function importFile(f: File) {
    setBusy(true);
    try {
      const next = await importSave(f);
      const c = await loadCountry(next.countryId);
      const validChoices = new Set(
        c.nodes.flatMap((n) => n.choices.map((ch) => ch.id)),
      );
      if (
        next.history.some(
          (h, i) =>
            h.turn !== i + 1 ||
            !validChoices.has(h.choiceId) ||
            !h.choiceId.startsWith(c.id + "_T" + h.turn + "_"),
        ) ||
        next.queueIndex > next.queue.length ||
        next.history.length > next.turn
      )
        throw Error(
          "The save contains inconsistent progress. Your current game is unchanged.",
        );
      setSession(next);
      setCountry(c);
      setScreen("play");
      setModal(null);
      setDebrief(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const exportCsv = () => {
    if (!s || !country || !content) return;
    const labels = Object.fromEntries([
      ...s.history.flatMap((h) =>
        currentNode(country, {
          ...s,
          turn: h.turn,
          flags: h.before.flags,
        }).choices.map((c) => [c.id, c.label]),
      ),
      ...content.flashpoints.flatMap((f) =>
        f.options.map((o) => [o.id, o.label]),
      ),
    ]);
    download(
      "butterfly-" + s.countryId + "-class-summary.csv",
      csv(s, country.name, labels),
      "text/csv;charset=utf-8",
    );
  };
  if (!content || countries.length === 0)
    return (
      <main className="fatal">
        <Mark />
        <p className="eyebrow">BUTTERFLY · COLD WAR</p>
        <h1>{error ? "The archive is unavailable." : "Unfolding the map…"}</h1>
        <p>{error || "Seven countries. A world of consequences."}</p>
        {error && <button onClick={() => location.reload()}>Try again</button>}
      </main>
    );
  function eventCard(e: GameEvent) {
    return (
      <article className="album-card" key={e.id}>
        <div className="eyebrow">
          {e.country} / {e.year} /{" "}
          {e.historical ? "Historical branch" : "Counterfactual branch"}
        </div>
        <h3>{e.place}</h3>
        <p>{e.text}</p>
        <div className="insight">
          <span>THE CONNECTION</span>
          <p>{e.insight}</p>
        </div>
        <small>
          Turn {e.turn} · {e.choiceLabel}
        </small>
      </article>
    );
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to game
      </a>
      <header className="site-header">
        <a
          href="../"
          className="home-link"
          aria-label="Back to Aranyo’s website"
        >
          ar.
        </a>
        <button
          className="wordmark"
          onClick={() => {
            setScreen("home");
            window.speechSynthesis?.cancel();
          }}
        >
          <Mark />
          <span>
            BUTTERFLY<small>AN ITIHAS GAME</small>
          </span>
        </button>
        <nav aria-label="Game tools">
          <button onClick={() => setModal("album")}>
            Album <span className="count">{archive.cards.length}</span>
          </button>
          <button onClick={() => setModal("help")}>How to play</button>
          <button
            className="settings-button"
            onClick={() => setModal("settings")}
          >
            Settings <span aria-hidden="true">☷</span>
          </button>
        </nav>
      </header>
      {warning && (
        <div className="notice" role="status">
          {warning}
          <button onClick={dismiss} aria-label="Dismiss storage notice">
            ×
          </button>
        </div>
      )}
      {error && (
        <div className="notice error" role="alert">
          {error}
          <button onClick={() => setError("")} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}
      <main id="main" tabIndex={-1}>
        {screen === "home" ? (
          <>
            <section className="edition">
              <span>SCENARIO 01 / THE COLD WAR</span>
              <span>1947—1991</span>
              <span>15–25 MINUTES · AGES 13+</span>
            </section>
            <section className="landing-title">
              <h1>
                One decision.
                <br />
                <em>A different world.</em>
              </h1>
              <div className="landing-deck">
                <p>
                  History happened once.
                  <br />
                  It could have happened differently.
                </p>
                <p>
                  Take a country through the Cold War. Make the call.
                  <br className="desktop" /> Follow the consequences across the
                  map.
                </p>
                <div className="facts">
                  <span>
                    <strong>7</strong> countries
                  </span>
                  <span>
                    <strong>8</strong> decisions
                  </span>
                  <span>
                    <strong>20</strong> endings
                  </span>
                </div>
              </div>
            </section>
            <section className="selection-stage">
              <aside className="country-picker">
                <div className="section-label">
                  <span>01</span> CHOOSE YOUR PERSPECTIVE
                </div>
                {countries.map((c, i) => (
                  <button
                    key={c.id}
                    className={
                      "country-row " + (selected === c.id ? "chosen" : "")
                    }
                    onClick={() => setSelected(c.id)}
                    aria-pressed={selected === c.id}
                  >
                    <span className="country-number">0{i + 1}</span>
                    <span>
                      {c.name}
                      <small>{c.capital}</small>
                    </span>
                    <span className="row-arrow">↗</span>
                  </button>
                ))}
                <p className="selection-note">
                  The same world looks different
                  <br />
                  from every capital.
                </p>
              </aside>
              <div className="selection-map">
                <Suspense
                  fallback={
                    <div className="map-loading">Drawing the atlas…</div>
                  }
                >
                  <WorldMap
                    countries={countries}
                    selected={selectedCountry}
                    events={[]}
                    active={null}
                    onSelect={(c) => setSelected(c.id)}
                    onEvent={openEvent}
                    playing={false}
                  />
                </Suspense>
                {selectedCountry && (
                  <div className="dossier">
                    <div className="eyebrow">
                      YOUR DESK / {selectedCountry.capital.toUpperCase()}
                    </div>
                    <h2>{selectedCountry.name}</h2>
                    <p>{countryNotes[selectedCountry.id]}</p>
                    <div className="dossier-rule" />
                    <p className="intro-excerpt">{selectedCountry.intro}</p>
                    <button className="primary" onClick={start} disabled={busy}>
                      {busy
                        ? "Opening the dossier…"
                        : `Begin as ${selectedCountry.name}`}{" "}
                      <span>→</span>
                    </button>
                    <div className="dossier-meta">
                      <button onClick={() => setModal("settings")}>
                        {options.council
                          ? "Council"
                          : options.teacher
                            ? "Classroom"
                            : options.difficulty === "student"
                              ? "Student"
                              : "Historian"}{" "}
                        mode <span>⌄</span>
                      </button>
                      <span>Progress saves automatically</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
            {s && (
              <div className="resume-bar">
                <div>
                  <span className="eyebrow">A DISPATCH LEFT OPEN</span>
                  <p>
                    {countries.find((c) => c.id === s.countryId)?.name} · Turn{" "}
                    {s.turn} of 8{s.phase === "ending" ? " · Completed" : ""}
                  </p>
                </div>
                <button className="outline" onClick={resume} disabled={busy}>
                  {s.phase === "ending"
                    ? "Revisit debrief"
                    : "Resume your game"}{" "}
                  →
                </button>
              </div>
            )}
            <section className="how-strip">
              <div>
                <span>01 / DECIDE</span>
                <h3>A seat at the table.</h3>
                <p>
                  Read the headlines. Hear four fictional advisors. Choose where
                  your country stands.
                </p>
              </div>
              <div>
                <span>02 / FOLLOW</span>
                <h3>The world answers back.</h3>
                <p>
                  Trace each consequence to a place on the map. See why one
                  decision travels so far.
                </p>
              </div>
              <div>
                <span>03 / REFLECT</span>
                <h3>Then meet real history.</h3>
                <p>
                  Compare your path with the record. Find the first moment you
                  changed the story.
                </p>
              </div>
            </section>
            <footer>
              <span>Made for curious minds. Built for the classroom.</span>
              <button onClick={() => setModal("sources")}>
                Sources & historical notes ↗
              </button>
            </footer>
          </>
        ) : !playing ? (
          <div className="fatal">
            <h1>Opening your country’s archive…</h1>
          </div>
        ) : s!.phase === "ending" ? (
          <section className="ending-page">
            <div className="ending-kicker">
              <span>THE WORLD YOU LEFT BEHIND</span>
              <span>ENDING {ending?.id.slice(1, 3)} / 20</span>
            </div>
            <h1>{ending?.title || "Your story ends here."}</h1>
            <p className="ending-card">
              {formatText(ending?.card || "", country!)}
            </p>
            <div className="ending-stats">
              <span>
                <strong>{percent(s!)}%</strong> of decisions matched history
              </span>
              <span>
                <strong>{s!.events.length}</strong> consequences traced
              </span>
              <span>
                <strong>{s!.history.length}</strong> decisions made
              </span>
            </div>
            <Meters meters={s!.meters} />
            <div className="ending-actions">
              <button
                className="primary"
                onClick={() => {
                  setDebrief(true);
                  setTimeout(
                    () =>
                      document
                        .getElementById("debrief")
                        ?.scrollIntoView({ behavior: "smooth" }),
                    50,
                  );
                }}
              >
                Open your debrief ↓
              </button>
              {!s!.options.teacher && !s!.options.council && (
                <button className="outline" onClick={() => setScreen("home")}>
                  Try another perspective
                </button>
              )}
              <button className="text-button" onClick={exportCsv}>
                Export choices (CSV)
              </button>
            </div>
            {debrief && (
              <div id="debrief" className="debrief">
                <div className="section-label">
                  <span>DEBRIEF</span> YOUR PATH & THE HISTORICAL RECORD
                </div>
                <h2>Where the story changed.</h2>
                <p>
                  {firstDivergence
                    ? `Your first departure from history was Turn ${firstDivergence}. Each dotted mark below is a different choice.`
                    : "Your major decisions followed the historical branches. The final result also reflects flashpoints, accumulated costs and risk."}
                </p>
                <div
                  className="divergence"
                  aria-label="Decisions compared with history"
                >
                  <span>History</span>
                  {s!.history.map((h) => (
                    <i
                      key={h.turn}
                      className="real"
                      title={"Turn " + h.turn + " historical path"}
                    >
                      {h.turn}
                    </i>
                  ))}
                  <span>Your path</span>
                  {s!.history.map((h) => (
                    <i
                      key={h.turn}
                      className={h.historical ? "same" : "different"}
                      title={
                        "Turn " +
                        h.turn +
                        (h.historical ? " matched" : " diverged")
                      }
                    >
                      {h.historical ? "●" : "○"}
                    </i>
                  ))}
                </div>
                <div className="reality-box">
                  <div className="eyebrow">WHAT REALLY HAPPENED</div>
                  <h3>A simulation is a question, not a prediction.</h3>
                  <p>{ending?.reality}</p>
                </div>
                <h3>Eight decisions, two histories.</h3>
                <div className="history-table">
                  {s!.history.map((h) => {
                    const n = currentNode(country!, {
                      ...s!,
                      turn: h.turn,
                      flags: h.before.flags,
                    });
                    const actual = n.choices.find((c) => c.historical)!;
                    const yours = n.choices.find((c) => c.id === h.choiceId)!;
                    return (
                      <article key={h.turn}>
                        <div className="history-date">
                          <strong>{n.year}</strong>
                          <small>TURN {h.turn}</small>
                        </div>
                        <div>
                          <h4>{n.title}</h4>
                          <p>
                            <span>Your decision</span> {yours.label}
                          </p>
                          <p>
                            <span>The historical choice</span> {actual.summary}
                          </p>
                          <small
                            className={h.historical ? "match" : "departure"}
                          >
                            {h.historical
                              ? "Matched the historical choice"
                              : "A counterfactual branch: plausible inference, not a fact"}
                          </small>
                        </div>
                        {!s!.options.teacher && !s!.options.council && (
                          <button
                            className="text-button"
                            onClick={() => {
                              setSession(replay(s!, h.turn));
                              setDebrief(false);
                            }}
                          >
                            Replay here ↗
                          </button>
                        )}
                      </article>
                    );
                  })}
                </div>
                <h3>Three consequences far from your desk.</h3>
                <div className="album-grid">
                  {[...s!.events]
                    .filter((e) => !e.choiceId.startsWith("FP"))
                    .sort(
                      (a, b) => distance(country!, b) - distance(country!, a),
                    )
                    .slice(0, 3)
                    .map(eventCard)}
                </div>
                <h3>Bring these questions to the table.</h3>
                {ending?.discuss.map((q, i) => (
                  <details
                    key={q}
                    className="question"
                    onToggle={(e) => {
                      if (e.currentTarget.open && !s!.discussion.includes(i))
                        setSession({
                          ...s!,
                          discussion: [...s!.discussion, i],
                        });
                    }}
                  >
                    <summary>
                      <span>0{i + 1}</span> Discussion question
                    </summary>
                    <p>{q}</p>
                    <label>
                      Your notes
                      <textarea
                        placeholder="What do you think?"
                        maxLength={10000}
                        value={s!.notes[String(i)] || ""}
                        onChange={(e) =>
                          setSession({
                            ...s!,
                            notes: { ...s!.notes, [String(i)]: e.target.value },
                          })
                        }
                        aria-label={"Notes for discussion question " + (i + 1)}
                      />
                    </label>
                  </details>
                ))}
                <div className="print-tools">
                  <button
                    className="outline"
                    onClick={() => {
                      document
                        .querySelectorAll<HTMLDetailsElement>(".question")
                        .forEach((d) => {
                          d.open = true;
                        });
                      setTimeout(() => window.print(), 100);
                    }}
                  >
                    Print debrief & worksheet
                  </button>
                  <button
                    className="text-button"
                    onClick={() => setModal("sources")}
                  >
                    Explore the sources ↗
                  </button>
                </div>
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="game-top">
              <div className="game-identity">
                <span className="eyebrow">AT THE DESK OF</span>
                <h1>{country!.name}</h1>
                <span>
                  {s!.options.council
                    ? "COUNCIL"
                    : s!.options.teacher
                      ? "CLASSROOM"
                      : s!.options.difficulty.toUpperCase()}{" "}
                  / TURN {s!.turn} OF 8
                </span>
              </div>
              <Meters
                meters={s!.meters}
                previous={
                  s!.history.find((h) => h.turn === s!.turn)?.before.meters
                }
              />
            </section>
            <div className="game-layout">
              <Suspense
                fallback={<div className="map-loading">Drawing the atlas…</div>}
              >
                <WorldMap
                  countries={countries}
                  selected={country}
                  events={s!.events}
                  active={inspect || active}
                  onSelect={() => {}}
                  onEvent={openEvent}
                  playing
                />
              </Suspense>
              <button
                className="timeline-button"
                onClick={() => setModal("timeline")}
              >
                ↳ Butterfly timeline <span>{s!.events.length}</span>
              </button>
              <div className="history-match">
                <strong>{s!.history.length ? percent(s!) + "%" : "—"}</strong>
                <span>MATCH WITH HISTORY</span>
              </div>
              <section
                className="dispatch-panel"
                ref={panel}
                tabIndex={-1}
                aria-label="Current decision"
              >
                <div className="dispatch-meta">
                  <span>DISPATCH 0{s!.turn}</span>
                  <strong>{node!.year}</strong>
                  <button
                    onClick={() => say(node!.situation)}
                    aria-label="Read the situation aloud"
                  >
                    ◖))
                  </button>
                </div>
                <div className="beat-track" aria-label="Turn progress">
                  {["headline", "cabinet", "decision", "ripple"].map((b, i) => (
                    <span
                      key={b}
                      className={
                        s!.phase === b ||
                        (b === "ripple" && s!.phase.startsWith("flash"))
                          ? "current"
                          : ""
                      }
                    >
                      0{i + 1} {b === "ripple" ? "Consequences" : b}
                    </span>
                  ))}
                </div>
                {s!.phase === "headline" ? (
                  <div className="headline-beat">
                    <p className="eyebrow">THREE CAPITALS. ONE MOMENT.</p>
                    <h2>{node!.title}</h2>
                    <p className="small-note">
                      Reconstructed headlines, written for this simulation.
                    </p>
                    <div className="newspapers">
                      {node!.headlines.map((h, i) => (
                        <article key={h.city} className={"paper paper-" + i}>
                          <div>
                            {h.name}{" "}
                            <small>
                              {h.city} / {node!.year}
                            </small>
                          </div>
                          <h3>{h.headline}</h3>
                          <p>{h.deck}</p>
                        </article>
                      ))}
                    </div>
                    <button
                      className="primary"
                      onClick={() => progress("cabinet")}
                    >
                      Read the briefing <span>→</span>
                    </button>
                  </div>
                ) : s!.phase === "cabinet" ? (
                  <>
                    <p className="eyebrow">YOUR CABINET IS WAITING</p>
                    <h2>{node!.title}</h2>
                    <p className="situation">
                      <TermText
                        text={
                          node!.variants.find((v) =>
                            v.requires.every((f) => s!.flags.includes(f)),
                          )?.situation || node!.situation
                        }
                        content={content}
                        onTerm={setTerm}
                      />
                    </p>
                    <div
                      className="advisor-tabs"
                      role="group"
                      aria-label="Listen to an advisor"
                    >
                      {node!.advisors.map((a, i) => (
                        <button
                          key={a.id}
                          className={advisor === a.id ? "selected" : ""}
                          aria-pressed={advisor === a.id}
                          onClick={() => setAdvisor(a.id)}
                        >
                          <span>{["♜", "♧", "▤", "◈"][i]}</span>
                          {a.name.replace("The ", "")}
                        </button>
                      ))}
                    </div>
                    <div className="advisor-card">
                      <p className="eyebrow">
                        {node!.advisors.find((a) => a.id === advisor)!.name}{" "}
                        RECOMMENDS
                      </p>
                      <h3>
                        {
                          node!.choices.find(
                            (c) =>
                              c.id ===
                              node!.advisors.find((a) => a.id === advisor)!
                                .recommends,
                          )!.label
                        }
                      </h3>
                      <blockquote>
                        “
                        {
                          node!.advisors.find((a) => a.id === advisor)!.lines[
                            node!.advisors.find((a) => a.id === advisor)!
                              .recommends
                          ]
                        }
                        ”
                      </blockquote>
                      <p className="small-note">
                        Fictional composite advisor. This is not a historical
                        quotation.
                      </p>
                    </div>
                    <label className="prediction">
                      Who do you think history listened to?
                      <select
                        value={s!.prediction || ""}
                        onChange={(e) =>
                          setSession({
                            ...s!,
                            prediction: e.target.value || null,
                          })
                        }
                      >
                        <option value="">Optional prediction</option>
                        {node!.advisors.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    {s!.options.council && (
                      <p className="council-note">
                        Assign one advisor to each student. Read the arguments
                        aloud, then collect the class vote on the next screen.
                      </p>
                    )}
                    <button
                      className="primary"
                      onClick={() => progress("decision")}
                    >
                      Make the call <span>→</span>
                    </button>
                  </>
                ) : s!.phase === "decision" ? (
                  <>
                    <p className="eyebrow">THE DECISION IS YOURS</p>
                    <h2>{node!.title}</h2>
                    <p className="situation">
                      <TermText
                        text={
                          node!.variants.find((v) =>
                            v.requires.every((f) => s!.flags.includes(f)),
                          )?.situation || node!.situation
                        }
                        content={content}
                        onTerm={setTerm}
                      />
                    </p>
                    <div className="choices">
                      {node!.choices.map((ch, i) => (
                        <div key={ch.id} className="choice-wrap">
                          <button
                            className="choice"
                            disabled={ch.requires?.some(
                              (f) => !s!.flags.includes(f),
                            )}
                            onClick={() => setSession(choose(s!, ch, country!))}
                          >
                            <span className="choice-letter">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>
                              <strong>{ch.label}</strong>
                              {ch.summary !== ch.label && (
                                <span className="choice-summary">
                                  {ch.summary}
                                </span>
                              )}
                              <span className="choice-deltas">
                                {Object.entries(ch.meterDelta)
                                  .filter(([, v]) => v !== 0)
                                  .map(([k, v]) => (
                                    <span key={k}>
                                      {(v || 0) > 0 ? "+" : ""}
                                      {v}{" "}
                                      {meterNames[k as Meter].replace(
                                        "World ",
                                        "",
                                      )}
                                    </span>
                                  ))}
                              </span>
                            </span>
                            <span className="choice-arrow">↗</span>
                          </button>
                          {s!.options.difficulty === "historian" && (
                            <details className="choice-advisors">
                              <summary>Cabinet arguments</summary>
                              {node!.advisors.map((a) => (
                                <p key={a.id}>
                                  <strong>{a.name}:</strong> {a.lines[ch.id]}
                                </p>
                              ))}
                            </details>
                          )}
                          {s!.options.council && (
                            <label className="vote-count">
                              Class votes for {String.fromCharCode(65 + i)}
                              <input
                                type="number"
                                min="0"
                                max="999"
                                value={votes[i]}
                                onChange={(e) =>
                                  setVotes(
                                    votes.map((v, j) =>
                                      j === i
                                        ? Math.max(
                                            0,
                                            Math.min(
                                              999,
                                              Number(e.target.value),
                                            ),
                                          )
                                        : v,
                                    ),
                                  )
                                }
                              />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                    {s!.options.council && (
                      <p className="small-note">
                        {votes.reduce((a, b) => a + b, 0)} votes recorded. The
                        teacher selects the final decision above.
                      </p>
                    )}
                    <button
                      className="text-button"
                      onClick={() => progress("cabinet")}
                    >
                      ← Hear your cabinet again
                    </button>
                  </>
                ) : s!.phase === "ripple" || s!.phase === "flash-ripple" ? (
                  <>
                    {active ? (
                      <>
                        <p className="eyebrow">
                          {s!.phase === "flash-ripple"
                            ? "FLASHPOINT CONSEQUENCE"
                            : `THE RIPPLE / ${s!.queueIndex + 1} OF ${s!.queue.length}`}
                        </p>
                        <h2>{active.place}</h2>
                        <div className="coordinates">
                          {Math.abs(active.lat).toFixed(2)}°
                          {active.lat >= 0 ? "N" : "S"} &nbsp;{" "}
                          {Math.abs(active.lng).toFixed(2)}°
                          {active.lng >= 0 ? "E" : "W"}
                        </div>
                        <p className="ripple-text" aria-live="polite">
                          {active.text}
                        </p>
                        {active.chance && (
                          <p className="risk-note">
                            Simulation draw:{" "}
                            {active.chanceHit
                              ? "outcome triggered"
                              : "outcome avoided"}{" "}
                            ·{" "}
                            {Math.round(
                              active.chance[s!.options.difficulty] * 100,
                            )}
                            % model probability. This is a design assumption,
                            not a measured historical probability.
                          </p>
                        )}
                        <button
                          className="insight-toggle"
                          onClick={() => setInsight(!insight)}
                          aria-expanded={insight}
                        >
                          {insight ? "−" : "+"} Why did this happen?
                        </button>
                        {insight && (
                          <div className="insight">
                            <p>
                              <TermText
                                text={active.insight}
                                content={content}
                                onTerm={setTerm}
                              />
                            </p>
                          </div>
                        )}
                        <div className="caused-by">
                          <span>SET IN MOTION BY</span>
                          <p>{active.choiceLabel}</p>
                        </div>
                        <div className="ripple-actions">
                          <button
                            className="primary"
                            onClick={() => setSession(advanceRipple(s!))}
                          >
                            {s!.queueIndex === s!.queue.length - 1
                              ? "Finish the dispatch"
                              : "Next consequence"}{" "}
                            <span>→</span>
                          </button>
                          {!s!.options.teacher &&
                            !s!.options.council &&
                            s!.options.difficulty === "student" && (
                              <button
                                className="text-button"
                                onClick={() =>
                                  setting("auto", !s!.options.auto)
                                }
                              >
                                {s!.options.auto
                                  ? "Pause auto-advance"
                                  : "Resume auto-advance"}
                              </button>
                            )}
                        </div>
                        <button
                          className="text-button skip-ripples"
                          onClick={() => setSession(skipRipples(s!))}
                        >
                          Skip animation, add all to timeline
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="eyebrow">DISPATCH COMPLETE</p>
                        <h2>The ripples keep moving.</h2>
                        <p>
                          You have traced this decision across the map. Every
                          consequence is in your timeline.
                        </p>
                        {s!.options.difficulty === "student" &&
                          chosen &&
                          s!.phase === "ripple" && (
                            <div className="historical-note">
                              <span>
                                {chosen.historical
                                  ? "YOU FOLLOWED HISTORY"
                                  : "YOU TOOK A DIFFERENT PATH"}
                              </span>
                              <p>
                                The historical decision was:{" "}
                                <strong>{historical!.label}.</strong>
                              </p>
                            </div>
                          )}
                        <button
                          className="primary"
                          onClick={() => setSession(finishBeat(s!, content))}
                        >
                          {s!.phase === "ripple"
                            ? "A newsflash arrives"
                            : s!.turn === 8
                              ? "See the world you made"
                              : "Open the next dispatch"}{" "}
                          <span>→</span>
                        </button>
                        <button
                          className="text-button"
                          onClick={() => setModal("timeline")}
                        >
                          Review your timeline
                        </button>
                      </>
                    )}
                  </>
                ) : s!.phase === "flashpoint" ? (
                  (() => {
                    const f = content.flashpoints[s!.turn - 1];
                    return (
                      <div className="flashpoint">
                        <p className="eyebrow">NEWSFLASH / {f.year}</p>
                        <h2>{f.title}</h2>
                        <p className="situation">
                          {formatText(f.prompt, country!)}
                        </p>
                        <p className="small-note">
                          {f.cutscene
                            ? "A historical interlude. This decision belongs to Petrov, not the player."
                            : `Historical interlude (${f.year}). Choose your government’s response; these briefings sit between the main eras.`}
                        </p>
                        {f.options.map((o, i) => (
                          <button
                            className="flash-choice"
                            key={o.id}
                            onClick={() =>
                              setSession(chooseFlash(s!, f, i, country!))
                            }
                          >
                            <span>
                              {f.cutscene ? "→" : String.fromCharCode(65 + i)}
                            </span>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    );
                  })()
                ) : null}
              </section>
            </div>
            <div className="era-strip" aria-label="Eight eras">
              {country!.nodes.map((n) => (
                <div
                  key={n.id}
                  className={
                    n.turn === s!.turn
                      ? "current"
                      : n.turn < s!.turn
                        ? "past"
                        : ""
                  }
                >
                  <span>{String(n.turn).padStart(2, "0")}</span>
                  <strong>{n.year}</strong>
                  <small>{n.title}</small>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      {modal === "settings" && (
        <Modal title="Your field settings" onClose={() => setModal(null)}>
          <div className="settings-content">
            <p>Choose how you want to read, play, and discuss.</p>
            <fieldset>
              <legend>Difficulty</legend>
              <label>
                <input
                  type="radio"
                  name="difficulty"
                  checked={
                    (playing ? s!.options : options).difficulty === "student"
                  }
                  onChange={() => setting("difficulty", "student")}
                />{" "}
                Student{" "}
                <small>
                  Historical comparisons after decisions; lower nuclear risk.
                </small>
              </label>
              <label>
                <input
                  type="radio"
                  name="difficulty"
                  checked={
                    (playing ? s!.options : options).difficulty === "historian"
                  }
                  onChange={() => setting("difficulty", "historian")}
                />{" "}
                Historian{" "}
                <small>
                  More cabinet arguments; manual reading; full model risk.
                </small>
              </label>
            </fieldset>
            {(
              [
                [
                  "auto",
                  "Automatically advance consequences",
                  "Six seconds per pin in Student mode. Pause at any time.",
                ],
                [
                  "readable",
                  "Use easier-to-read text",
                  "Larger Arial text, more spacing, and no italic headings.",
                ],
                [
                  "teacher",
                  "Teacher mode",
                  "Disable replay and automatic advance. Export a class summary.",
                ],
                [
                  "council",
                  "Council mode",
                  "Four students read the advisors; record votes before the teacher chooses.",
                ],
              ] as const
            ).map(([k, label, desc]) => (
              <label className="toggle" key={k}>
                <span>
                  <strong>{label}</strong>
                  <small>{desc}</small>
                </span>
                <input
                  type="checkbox"
                  checked={(playing ? s!.options : options)[k]}
                  onChange={(e) => setting(k, e.target.checked)}
                />
              </label>
            ))}
            <div className="save-tools">
              <button
                className="outline"
                disabled={!s}
                onClick={() =>
                  s &&
                  download("butterfly-save.json", JSON.stringify(s, null, 2))
                }
              >
                Export save
              </button>
              <button
                className="outline"
                onClick={() => input.current?.click()}
              >
                Import save
              </button>
              {s && (
                <button className="text-button" onClick={exportCsv}>
                  Export choices as CSV
                </button>
              )}
            </div>
            <p className="small-note">
              Saves stay in this browser. Export to keep a separate copy or move
              to another device.
            </p>
            <button className="primary" onClick={() => setModal(null)}>
              Back to the map →
            </button>
          </div>
        </Modal>
      )}
      {modal === "album" && (
        <Modal title="The Butterfly Album" onClose={() => setModal(null)} wide>
          <div className="album-intro">
            <div>
              <p className="eyebrow">COLLECTED ACROSS YOUR PLAYTHROUGHS</p>
              <p>
                {archive.cards.length} consequences · {archive.finished.length}{" "}
                countries completed
              </p>
            </div>
            <label>
              Collection
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {[
                  "All cards",
                  "Berlin",
                  "The Global South",
                  "Nuclear Near-Misses",
                ].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="badges">
            {content.badges.map((b) => (
              <div
                className={
                  "badge " + (archive.badges.includes(b.id) ? "earned" : "")
                }
                key={b.id}
                title={b.description}
              >
                <span>{archive.badges.includes(b.id) ? "✳" : "○"}</span>
                <strong>{b.name}</strong>
                <small>{b.description}</small>
              </div>
            ))}
          </div>
          <div className="album-grid">
            {archive.cards
              .filter(
                (e) =>
                  filter === "All cards" ||
                  (filter === "Berlin"
                    ? /berlin/i.test(e.place)
                    : filter === "The Global South"
                      ? ["Africa & Middle East", "Asia & Pacific"].includes(
                          e.region,
                        ) ||
                        (e.lat < 25 && e.lng < -30)
                      : /nuclear|missile|bomb|warhead/i.test(
                          e.text + " " + e.insight,
                        )),
              )
              .map(eventCard)}
          </div>
          {archive.cards.length === 0 && (
            <div className="empty">
              <Mark />
              <h3>Every consequence starts a collection.</h3>
              <p>
                Begin a game and follow the map pins. Your cards will be waiting
                here across playthroughs.
              </p>
            </div>
          )}
        </Modal>
      )}
      {modal === "timeline" && (
        <Modal title="Butterfly timeline" onClose={() => setModal(null)} wide>
          <div className="album-intro">
            <p>
              Every place your decisions reached. Select a card to return to it.
            </p>
            <label>
              Region
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {[
                  "All regions",
                  "Europe",
                  "Americas",
                  "Africa & Middle East",
                  "Asia & Pacific",
                  "World",
                ].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="timeline-list">
            {s?.events
              .filter((e) => region === "All regions" || e.region === region)
              .map((e) => (
                <button
                  key={e.id}
                  onClick={() => {
                    setModal(null);
                    openEvent(e);
                  }}
                >
                  <span className="timeline-turn">{e.turn}</span>
                  <div>
                    <small>
                      {e.year} · {e.choiceLabel}
                    </small>
                    <h3>{e.place}</h3>
                    <p>{e.text}</p>
                  </div>
                  <span>↗</span>
                </button>
              ))}
          </div>
          {!s?.events.length && (
            <p className="empty">
              Make your first decision to send ripples across the world.
            </p>
          )}
        </Modal>
      )}
      {modal === "sources" && (
        <Modal title="The historical record" onClose={() => setModal(null)}>
          <div className="sources">
            <p>
              This game adapts the supplied Cold War scripts. Historical
              branches describe the record; alternatives explore possibilities.
              Their exact outcomes and probabilities are simulation assumptions.
            </p>
            <p>
              The model carries resources and flags between eras. It revisits
              historical decision settings, rather than predicting every
              institution or event in an alternate world. The map shows
              coastlines, not period borders.
            </p>
            {content.sources.map((source) => (
              <a
                key={source.title}
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                <strong>{source.title} ↗</strong>
                <span>{source.note}</span>
              </a>
            ))}
            <p className="small-note">
              Historical claims and causal interpretations can be contested. Use
              the original records to compare perspectives, especially where the
              game simplifies a long debate.
            </p>
          </div>
        </Modal>
      )}
      {modal === "help" && (
        <Modal
          title="A decision, then a world of consequences"
          onClose={() => setModal(null)}
        >
          <div className="help-content">
            <p>
              Choose one of seven countries and follow eight turning points. At
              each one, read three reconstructed front pages, consult four
              fictional advisors, and make one of three decisions.
            </p>
            <ol>
              <li>
                <strong>Watch the meters.</strong> Tension is global. Stability,
                economy, and influence belong to your country. At 100 tension,
                the game ends in nuclear war.
              </li>
              <li>
                <strong>Follow the ripples.</strong> Each decision reaches five
                or six places. Open “Why did this happen?” to see the
                connection. The timeline includes every pin as a readable list.
              </li>
              <li>
                <strong>Read the interludes.</strong> Short flashpoints connect
                the eras. You can pause automatic advance in Student mode.
              </li>
              <li>
                <strong>Compare with history.</strong> The ending opens a
                debrief, discussion questions, sources, and replay from an
                earlier decision.
              </li>
            </ol>
            <p>
              Playing a state means examining its constraints and decisions. It
              is not an endorsement of its government or ideology.
            </p>
            <p>
              Use Tab to move between controls and Enter or Space to activate
              them. Map pins have the same information as the timeline.
              Easier-to-read text and classroom controls are in Settings.
            </p>
            <button className="primary" onClick={() => setModal(null)}>
              Back to the game →
            </button>
          </div>
        </Modal>
      )}
      {inspect && (
        <Modal title={inspect.place} onClose={() => setInspect(null)}>
          {eventCard(inspect)}
          <button
            className="outline"
            onClick={() => {
              say(inspect.text + ". " + inspect.insight);
            }}
          >
            Read aloud
          </button>
        </Modal>
      )}
      {term && (
        <Modal
          title={
            content.vocabulary.find(
              (v) => v.term.toLowerCase() === term.toLowerCase(),
            )?.term || term
          }
          onClose={() => setTerm(null)}
        >
          <p className="definition">
            {
              content.vocabulary.find(
                (v) => v.term.toLowerCase() === term.toLowerCase(),
              )?.definition
            }
          </p>
        </Modal>
      )}
      <input
        hidden
        type="file"
        accept=".json,application/json"
        ref={input}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void importFile(f);
          e.target.value = "";
        }}
      />
    </>
  );
}
