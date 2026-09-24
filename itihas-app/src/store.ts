import { create } from "zustand";
import { z } from "zod";
import {
  SessionSchema,
  EventSchema,
  ids,
  type Session,
  type GameEvent,
} from "./types";
import { earnedBadges } from "./engine";
const ArchiveSchema = z.object({
  cards: z.array(EventSchema).max(2000),
  badges: z.array(z.string()).max(30),
  finished: z.array(z.enum(ids)).max(7),
});
export type Archive = z.infer<typeof ArchiveSchema>;
const empty: Archive = { cards: [], badges: [], finished: [] };
let storageWarning = "";
function read<S extends z.ZodTypeAny>(
  key: string,
  schema: S,
  fallback: z.output<S>,
): z.output<S> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const result = schema.safeParse(JSON.parse(raw));
    if (!result.success) {
      storageWarning =
        "An older or damaged save could not be read. Your browser’s stored copy has been kept.";
      return fallback;
    }
    return result.data;
  } catch {
    storageWarning =
      "Browser storage is unavailable. You can still play and export a save.";
    return fallback;
  }
}
const storedSession = read(
  "butterfly-session-v1",
  SessionSchema.nullable(),
  null,
);
const storedArchive = read("butterfly-album-v1", ArchiveSchema, empty);
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return "";
  } catch {
    return "Your browser could not save progress. Export a save before closing this page.";
  }
}
interface Store {
  session: Session | null;
  archive: Archive;
  warning: string;
  setSession: (s: Session | null) => void;
  inspect: (e: GameEvent) => void;
  dismiss: () => void;
}
export const useGame = create<Store>((set, get) => ({
  session: storedSession,
  archive: storedArchive,
  warning: storageWarning,
  setSession: (s) => {
    let a = structuredClone(get().archive);
    if (s) {
      const existing = new Map(a.cards.map((e) => [e.id, e]));
      for (const e of s.events.filter((e) => e.viewed)) existing.set(e.id, e);
      a.cards = [...existing.values()];
      a.badges = [...new Set([...a.badges, ...earnedBadges(s)])];
      if (s.phase === "ending")
        a.finished = [...new Set([...a.finished, s.countryId])];
      if (a.finished.length >= 3)
        a.badges = [...new Set([...a.badges, "passport"])];
      if (
        Array.from({ length: 8 }, (_, i) => i + 1).some(
          (t) =>
            a.cards.some((e) => e.country === "USA" && e.turn === t) &&
            a.cards.some((e) => e.country === "USSR" && e.turn === t),
        )
      )
        a.badges = [...new Set([...a.badges, "perspective"])];
    }
    const sessionError = write("butterfly-session-v1", s);
    const albumError = write("butterfly-album-v1", a);
    const warning = sessionError || albumError;
    set({ session: s, archive: a, warning: warning || get().warning });
  },
  inspect: (e) => {
    const a = structuredClone(get().archive);
    if (!a.cards.some((x) => x.id === e.id))
      a.cards.push({ ...e, viewed: true });
    set({
      archive: a,
      warning: write("butterfly-album-v1", a) || get().warning,
    });
  },
  dismiss: () => set({ warning: "" }),
}));
export function download(
  name: string,
  data: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function csv(
  s: Session,
  countryName: string,
  labels: Record<string, string>,
): string {
  const safe = (v: unknown) => {
    let text = String(v ?? "");
    if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  };
  return [
    [
      "country",
      "difficulty",
      "turn",
      "choice",
      "historical",
      "flashpoint",
      "ending",
      "tension",
      "stability",
      "economy",
      "influence",
    ],
    ...s.history.map((h) => [
      countryName,
      s.options.difficulty,
      h.turn,
      labels[h.choiceId] || h.choiceId,
      h.historical,
      labels[s.flashChoices["FP" + h.turn]] ||
        s.flashChoices["FP" + h.turn] ||
        "",
      s.endingId || "",
      s.meters.TENSION,
      s.meters.STABILITY,
      s.meters.ECON,
      s.meters.INFLUENCE,
    ]),
  ]
    .map((row) => row.map(safe).join(","))
    .join("\r\n");
}
export async function importSave(file: File) {
  if (file.size > 1_000_000)
    throw Error("This save is too large. Choose a Butterfly save under 1 MB.");
  const result = SessionSchema.safeParse(JSON.parse(await file.text()));
  if (!result.success)
    throw Error(
      "This is not a valid Butterfly save. Your current game is unchanged.",
    );
  return result.data;
}
