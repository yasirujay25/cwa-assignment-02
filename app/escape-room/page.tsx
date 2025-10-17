"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

/* -------------------- TYPES & DATA -------------------- */
type StageKey = "format" | "debug" | "numbers" | "transform";
type CodeStage = {
  key: StageKey;
  title: string;
  type: "code" | "click";
  prompt: string;
  initialCode?: string;
};

const STAGES: CodeStage[] = [
  {
    key: "format",
    title: "Stage 1 — Fix & Format",
    type: "code",
    prompt: "Fix & format this function so that add(2,3) returns 5.",
    initialCode: `function add ( a ,b) 
{console.log("sum")
return a+ b`,
  },
  {
    key: "debug",
    title: "Stage 2 — Find the Debug Tool",
    type: "click",
    prompt: "Somewhere in this room is a hidden debug hotspot. Click it.",
  },
  {
    key: "numbers",
    title: "Stage 3 — Print 0 → 1000",
    type: "code",
    prompt: "Print the numbers 0-1000 (inclusive) using console.log.",
    initialCode: `for (let i = 0; i <= 10; i++) {
  console.log(i);
}`,
  },
  {
    key: "transform",
    title: "Stage 4 — JSON → CSV",
    type: "code",
    prompt: "Implement transform(data) that converts JSON to CSV.",
    initialCode: `function transform(data) {
  return "";
}`,
  },
];

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80";

const STORAGE_KEYS = {
  stageIndex: "er_stage",
  codes: "er_codes",
  bgUrl: "er_bg",
  userId: "er_user",
};

type Snapshot = {
  userId: string;
  stageIndex: number;
  bgUrl: string;
  minutesInput: number;
  timeLeft: number;
  codes: Record<StageKey, string>;
  solved: Record<StageKey, boolean>;
};

/* -------------------- PAGE -------------------- */
export default function EscapeRoom() {
  const [mounted, setMounted] = useState(false);
  const [bgUrl, setBgUrl] = useState(DEFAULT_BG);

  const [stageIndex, setStageIndex] = useState(0);
  const [codes, setCodes] = useState<Record<StageKey, string>>(() => ({
    format: STAGES[0].initialCode!,
    numbers: STAGES[2].initialCode!,
    transform: STAGES[3].initialCode!,
    debug: "",
  }));
  const [solved, setSolved] = useState<Record<StageKey, boolean>>({
    format: false,
    debug: false,
    numbers: false,
    transform: false,
  });

  // TIMER
  const [minutesInput, setMinutesInput] = useState(15);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startedRef = useRef(false);
  const totalSecRef = useRef(0);

  // USER
  const [userId, setUserId] = useState<string>("");
  const [toast, setToast] = useState<string>("");

  const current = STAGES[stageIndex];
  const allSolved = useMemo(
    () => Object.values(solved).every(Boolean),
    [solved]
  );
  const gameLocked = timeLeft === 0 && startedRef.current;

  // LOAD/SAVE (local)
  useEffect(() => {
    try {
      // userId
      let uid = localStorage.getItem(STORAGE_KEYS.userId) || "";
      if (!uid) {
        uid =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `user_${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(STORAGE_KEYS.userId, uid);
      }
      setUserId(uid);

      // state
      const s = localStorage.getItem(STORAGE_KEYS.stageIndex);
      if (s) setStageIndex(parseInt(s, 10));
      const c = localStorage.getItem(STORAGE_KEYS.codes);
      if (c) setCodes((p) => ({ ...p, ...JSON.parse(c) }));
      const b = localStorage.getItem(STORAGE_KEYS.bgUrl);
      if (b) setBgUrl(b);
    } catch {}
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEYS.stageIndex, String(stageIndex));
    localStorage.setItem(STORAGE_KEYS.codes, JSON.stringify(codes));
    localStorage.setItem(STORAGE_KEYS.bgUrl, bgUrl);
  }, [mounted, stageIndex, codes, bgUrl]);

  // TICK
  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, timeLeft]);

  // HELPERS
  const timeFmt = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const startTimer = () => {
    const total = Math.max(1, Math.floor(minutesInput * 60));
    if (timeLeft === 0) {
      setTimeLeft(total);
      totalSecRef.current = total;
    }
    setRunning(true);
    startedRef.current = true;
  };
  const pauseTimer = () => setRunning(false);
  const resetTimer = () => {
    setRunning(false);
    setTimeLeft(0);
    totalSecRef.current = 0;
    startedRef.current = false;
  };

  // EVAL
  function runUserCode(
    code: string,
    opts: {
      expectAdd?: boolean;
      expectNumbers?: boolean;
      expectTransform?: boolean;
    } = {}
  ): { ok: boolean; message: string } {
    const logs: any[] = [];
    const fakeConsole = { log: (...a: any[]) => logs.push(...a) };
    const sampleData = [
      { firstName: "Ada", lastName: "Lovelace", age: 36 },
      { firstName: "Alan", lastName: "Turing", age: 41 },
    ];
    try {
      const fn = new Function(
        "console",
        "sampleData",
        `"use strict";${code};return {add:typeof add!=="undefined"?add:undefined,transform:typeof transform!=="undefined"?transform:undefined};`
      );
      const exports = fn(fakeConsole, sampleData);

      if (opts.expectAdd) {
        if (typeof exports.add !== "function")
          return { ok: false, message: "add not found" };
        if (exports.add(2, 3) !== 5)
          return { ok: false, message: "add(2,3) !== 5" };
      }
      if (opts.expectNumbers) {
        const nums = logs.filter((x) => typeof x === "number");
        if (nums.length !== 1001 || nums[0] !== 0 || nums[1000] !== 1000)
          return { ok: false, message: "must print 0-1000" };
      }
      if (opts.expectTransform) {
        if (typeof exports.transform !== "function")
          return { ok: false, message: "transform not found" };
        const out = String(exports.transform(sampleData))
          .replace(/\r/g, "")
          .trim();
        const expected = `firstName,lastName,age\nAda,Lovelace,36\nAlan,Turing,41`;
        if (out !== expected) return { ok: false, message: "CSV mismatch" };
      }
      return { ok: true, message: "All tests passed ✅" };
    } catch (e: any) {
      return { ok: false, message: e.message };
    }
  }

  const trySolve = () => {
    if (gameLocked) return { ok: false, message: "Locked" };
    let res = { ok: false, message: "Nothing to run" };
    if (current.key === "format")
      res = runUserCode(codes.format || "", { expectAdd: true });
    if (current.key === "numbers")
      res = runUserCode(codes.numbers || "", { expectNumbers: true });
    if (current.key === "transform")
      res = runUserCode(codes.transform || "", { expectTransform: true });
    if (res.ok) setSolved((s) => ({ ...s, [current.key]: true }));
    return res;
  };

  const setCodeFor = (k: StageKey, v: string) =>
    setCodes((p) => ({ ...p, [k]: v }));
  const nextStage = () =>
    setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
  const prevStage = () => setStageIndex((i) => Math.max(i - 1, 0));
  const giveHint = () =>
    alert(
      {
        format: "Define: function add(a,b){ return a+b }",
        debug: "Look for the glowing green bug near the bottom-right.",
        numbers: "Loop from 0 to 1000 inclusive.",
        transform: "Map each object to a CSV row, then join with \\n.",
      }[current.key]
    );
  const resetGame = () => {
    setSolved({
      format: false,
      debug: false,
      numbers: false,
      transform: false,
    });
    setStageIndex(0);
    setCodes({
      format: STAGES[0].initialCode!,
      numbers: STAGES[2].initialCode!,
      transform: STAGES[3].initialCode!,
      debug: "",
    });
    resetTimer();
  };

  // -------- Server sync (API) --------
  const snapshot = (): Snapshot => ({
    userId,
    stageIndex,
    bgUrl,
    minutesInput,
    timeLeft,
    codes,
    solved,
  });

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  };

  const saveToServer = async () => {
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot()),
      });
      if (!res.ok) throw new Error(await res.text());
      showToast("✅ Progress saved");
    } catch (e) {
      showToast("❌ Save failed");
    }
  };

  const loadFromServer = async () => {
    try {
      const res = await fetch(
        `/api/progress?userId=${encodeURIComponent(userId)}`
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (!data) {
        showToast("ℹ️ No saved progress");
        return;
      }
      // Apply snapshot
      setStageIndex(data.stageIndex ?? 0);
      setBgUrl(data.bgUrl ?? DEFAULT_BG);
      setMinutesInput(data.minutesInput ?? 15);
      if (!running) setTimeLeft(data.timeLeft ?? 0);
      setCodes(data.codes as Snapshot["codes"]);
      setSolved(data.solved as Snapshot["solved"]);
      showToast("⬇️ Loaded saved progress");
    } catch {
      showToast("❌ Load failed");
    }
  };

  const clearOnServer = async () => {
    try {
      const res = await fetch("/api/progress", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error(await res.text());
      showToast("🗑️ Deleted server save");
    } catch {
      showToast("❌ Delete failed");
    }
  };

  if (!mounted) return null;

  const pct =
    totalSecRef.current > 0 ? Math.max(0, timeLeft / totalSecRef.current) : 0;

  return (
    <div className="text-white">
      {/* background behind content, not fixed */}
      <div
        className="relative -z-10"
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "none",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      <div className="absolute inset-0 -z-10 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiLz48L3N2Zz4=')]" />

      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-3 relative">
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold"
        >
          🗝 ESCAPE ROOM
        </motion.h1>
        <div className="flex items-center gap-3">
          <input
            className="hidden sm:block rounded-md px-3 py-1 bg-white/10 border border-white/20 w-64 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Background URL"
            value={bgUrl}
            onChange={(e) => setBgUrl(e.target.value)}
          />
          <MotionBtn onClick={() => setBgUrl(DEFAULT_BG)}>Reset BG</MotionBtn>
        </div>
      </header>

      {/* MAIN – natural page flow, but inner panels cap themselves to viewport */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 pb-6 relative">
        {/* Left nav */}
        <aside className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4 backdrop-blur-sm">
          <div>
            <h2 className="font-semibold mb-2">Stages</h2>
            <div className="flex flex-col gap-2">
              {STAGES.map((s, i) => {
                const done = solved[s.key];
                const active = i === stageIndex;
                return (
                  <motion.button
                    key={s.key}
                    onClick={() => setStageIndex(i)}
                    disabled={gameLocked}
                    whileTap={{ scale: 0.97 }}
                    className={`rounded-lg px-3 py-2 border text-left transition ${
                      active
                        ? "bg-white/20 border-white/40"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{s.title}</span>
                      <span
                        className={`text-xs ${
                          done ? "text-emerald-300" : "opacity-60"
                        }`}
                      >
                        {done ? "Solved" : "Pending"}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <MotionBtn onClick={giveHint}>Hint</MotionBtn>
            <MotionBtn onClick={resetGame}>Reset</MotionBtn>
          </div>

          {/* Server sync controls */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <h2 className="font-semibold mb-2">Cloud Save</h2>
            <div className="flex flex-wrap gap-2">
              <MotionBtn variant="emerald" onClick={saveToServer}>
                💾 Save
              </MotionBtn>
              <MotionBtn variant="amber" onClick={loadFromServer}>
                ⬇️ Load
              </MotionBtn>
              <MotionBtn variant="rose" onClick={clearOnServer}>
                🗑️ Clear
              </MotionBtn>
            </div>
            <p className="mt-2 text-xs opacity-70 break-all">ID: {userId}</p>
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-2 text-xs px-2 py-1 rounded bg-white/10 border border-white/20"
                >
                  {toast}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Center workspace */}
        <section className="lg:col-span-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{current.title}</h3>
              <p className="text-sm opacity-80">{current.prompt}</p>
            </div>
            <div className="flex items-center gap-2">
              <MotionBtn onClick={prevStage} disabled={stageIndex === 0}>
                Prev
              </MotionBtn>
              <MotionBtn
                onClick={nextStage}
                disabled={stageIndex === STAGES.length - 1}
              >
                Next
              </MotionBtn>
            </div>
          </div>

          <div className="p-4">
            {current.type === "code" ? (
              <CodePanel
                value={codes[current.key]}
                onChange={(v) => setCodeFor(current.key, v)}
                locked={gameLocked}
                solved={solved[current.key]}
                onRun={trySolve}
              />
            ) : (
              <DebugRoom
                onSolved={() => setSolved((s) => ({ ...s, debug: true }))}
                disabled={gameLocked}
              />
            )}
          </div>
        </section>

        {/* Right status */}
        <aside className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4 backdrop-blur-sm">
          <div>
            <h2 className="font-semibold mb-2">Goal</h2>
            <p className="text-sm opacity-90">
              Solve all four stages before the timer hits zero to unlock the
              door.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Progress</h3>
            <div className="flex flex-col gap-1">
              {STAGES.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="truncate">{s.title}</span>
                  <span
                    className={`${
                      solved[s.key] ? "text-emerald-300" : "opacity-60"
                    }`}
                  >
                    {solved[s.key] ? "✅" : "⏳"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <AnimatePresence>
            {allSolved && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-2 p-3 rounded-lg bg-emerald-500/20 border border-emerald-400/40"
              >
                <p className="font-semibold text-emerald-200">
                  🔓 Door Unlocked!
                </p>
                <p className="text-sm opacity-90">
                  You solved the room. Nicely done.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </main>

      {/* FOOTER CONTROLS */}
      <footer className="border-t border-white/10 bg-black/30 backdrop-blur-sm px-4 py-3 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            className="rounded-md px-2 py-1 bg-white/10 border border-white/20 w-20 outline-none"
            value={minutesInput}
            onChange={(e) => setMinutesInput(Number(e.target.value))}
            disabled={running || timeLeft > 0}
          />
          <span className="text-sm opacity-80">minutes</span>
        </div>
        <div className="flex items-center gap-3">
          <CountdownRing value={pct} label={timeFmt(timeLeft)} />
          <MotionBtn onClick={startTimer} disabled={running}>
            Start
          </MotionBtn>
          <MotionBtn onClick={pauseTimer} disabled={!running}>
            Pause
          </MotionBtn>
          <MotionBtn onClick={resetTimer}>Reset</MotionBtn>
        </div>
      </footer>
    </div>
  );
}

/* -------------------- UI PARTS -------------------- */

type MotionBtnProps = HTMLMotionProps<"button"> & {
  variant?: "default" | "emerald" | "amber" | "rose";
};
function MotionBtn({
  className = "",
  variant = "default",
  ...props
}: MotionBtnProps) {
  const palette =
    variant === "emerald"
      ? "bg-emerald-500 hover:bg-emerald-600 text-white border-transparent"
      : variant === "amber"
      ? "bg-amber-500 hover:bg-amber-600 text-white border-transparent"
      : variant === "rose"
      ? "bg-rose-500 hover:bg-rose-600 text-white border-transparent"
      : "bg-white/10 border-white/20 hover:bg-white/20";
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: props.disabled ? 1 : 1.03 }}
      {...props}
      className={`rounded-lg px-3 py-2 text-sm disabled:opacity-50 border transition ${palette} ${className}`}
    />
  );
}

function CountdownRing({ value, label }: { value: number; label: string }) {
  const deg = Math.round(value * 360);
  return (
    <div
      className="relative h-12 w-12 rounded-full grid place-items-center text-xs font-mono"
      style={{
        background: `conic-gradient(#10b981 ${deg}deg, rgba(255,255,255,0.15) 0)`,
        WebkitMask:
          "radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)",
        mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      {label}
    </div>
  );
}

/* -------- Fluid Code Panel -------- */
function CodePanel({
  value,
  onChange,
  locked,
  solved,
  onRun,
}: {
  value: string;
  onChange: (v: string) => void;
  locked?: boolean;
  solved?: boolean;
  onRun: () => { ok: boolean; message: string };
}) {
  const [msg, setMsg] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const syncScroll = () => {
    if (!taRef.current || !gutterRef.current) return;
    gutterRef.current.scrollTop = taRef.current.scrollTop;
  };

  const lines = useMemo(() => value.split("\n").length, [value]);

  const run = () => {
    const res = onRun();
    setMsg(res.message);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="rounded-lg border border-white/10 bg-black/40 overflow-hidden"
        style={{ maxHeight: "min(68svh, 720px)" }}
      >
        <div className="p-4">
          <div
            className="grid grid-cols-[56px_1fr] gap-3 rounded-md bg-black/30 overflow-hidden"
            style={{ height: "min(60svh, 640px)" }}
          >
            {/* gutter */}
            <div className="bg-black/50 border-r border-white/10">
              <div
                ref={gutterRef}
                className="h-full overflow-hidden pr-2 text-right text-white/40 select-none leading-5 py-4"
              >
                {Array.from({ length: lines }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
            </div>

            {/* textarea is the ONLY scroller */}
            <div>
              <textarea
                ref={taRef}
                onScroll={syncScroll}
                wrap="off"
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                data-gramm="false"
                data-enable-grammarly="false"
                data-lt-active="false"
                className="code-editor block w-full h-full resize-none overflow-auto leading-5 px-4 py-4 bg-transparent outline-none text-white"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={locked}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={run}
          disabled={locked || !!solved}
          className={`rounded-lg px-4 py-2 text-white text-sm border ${
            solved
              ? "bg-emerald-600 border-emerald-500"
              : "bg-indigo-600 border-indigo-500"
          }`}
        >
          {solved ? "✅ Passed" : "Run Tests"}
        </motion.button>

        <AnimatePresence>
          {msg && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`text-xs px-2 py-1 rounded ${
                msg.includes("✅") ? "bg-emerald-500/30" : "bg-rose-500/30"
              }`}
            >
              {msg}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .code-editor {
          scrollbar-gutter: stable both-edges;
          overscroll-behavior: contain;
        }
      `}</style>
    </div>
  );
}

function DebugRoom({
  onSolved,
  disabled,
}: {
  onSolved: () => void;
  disabled?: boolean;
}) {
  const [done, setDone] = useState(false);
  const click = (ok: boolean) => {
    if (disabled) return;
    if (ok) {
      setDone(true);
      onSolved();
    } else {
      alert("Nope – keep looking.");
    }
  };
  return (
    <div
      className="relative w-full rounded-lg overflow-hidden border border-white/10 bg-black/40"
      style={{ height: "min(60svh, 640px)" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
      <div className="p-3 text-sm opacity-80">Find the debug hotspot.</div>
      <button
        onClick={() => click(false)}
        className="absolute left-[20%] top-[30%] w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20"
        title="Lamp"
      />
      <button
        onClick={() => click(false)}
        className="absolute left-[60%] top-[20%] w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20"
        title="Books"
      />
      <button
        onClick={() => click(true)}
        className="absolute left-[75%] top-[60%] w-10 h-10 rounded-full bg-emerald-500/30 border border-emerald-400 animate-pulse"
        title="Debugger"
      />
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-4 bottom-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-400/40"
          >
            🪲 Debugger found – stage complete!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
