import { z } from "zod";
export const ids = ["USA", "USSR", "CHN", "UK", "FRG", "CUB", "IND"] as const;
export const keys = ["TENSION", "STABILITY", "ECON", "INFLUENCE"] as const;
export const MeterSchema = z.enum(keys);
export type Meter = z.infer<typeof MeterSchema>;
export type Meters = Record<Meter, number>;
export const DeltaSchema = z.object({
  TENSION: z.number().optional(),
  STABILITY: z.number().optional(),
  ECON: z.number().optional(),
  INFLUENCE: z.number().optional(),
});
export const MetersSchema = z.object({
  TENSION: z.number().min(0).max(100),
  STABILITY: z.number().min(0).max(100),
  ECON: z.number().min(0).max(100),
  INFLUENCE: z.number().min(0).max(100),
});
export const EffectSchema = z.object({
  id: z.string(),
  place: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  text: z.string(),
  insight: z.string(),
  region: z.string(),
  delay: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
  flag: z.string().optional(),
  meterDelta: DeltaSchema.optional(),
  chance: z
    .object({
      flag: z.string(),
      historian: z.number().min(0).max(1),
      student: z.number().min(0).max(1),
      successText: z.string().optional(),
      failureText: z.string().optional(),
    })
    .optional(),
});
export type Effect = z.infer<typeof EffectSchema>;
export const ChoiceSchema = z.object({
  id: z.string(),
  label: z.string(),
  summary: z.string(),
  historical: z.boolean(),
  requires: z.array(z.string()).optional(),
  meterDelta: DeltaSchema,
  flags: z.array(z.string()).default([]),
  effects: z.array(EffectSchema).min(5).max(6),
  conditional: z
    .array(
      z.object({
        requires: z.array(z.string()),
        label: z.string(),
        summary: z.string(),
        flags: z.array(z.string()),
        effects: z.array(EffectSchema).min(5).max(6),
      }),
    )
    .optional(),
});
export type Choice = z.infer<typeof ChoiceSchema>;
export const AdvisorSchema = z.object({
  id: z.string(),
  name: z.string(),
  recommends: z.string(),
  lines: z.record(z.string()),
});
export type Advisor = z.infer<typeof AdvisorSchema>;
export const NodeSchema = z
  .object({
    id: z.string(),
    turn: z.number().int().min(1).max(8),
    year: z.string(),
    title: z.string(),
    situation: z.string(),
    choices: z.array(ChoiceSchema).length(3),
    variants: z
      .array(z.object({ requires: z.array(z.string()), situation: z.string() }))
      .default([]),
    headlines: z
      .array(
        z.object({
          city: z.string(),
          name: z.string(),
          headline: z.string(),
          deck: z.string(),
        }),
      )
      .length(3),
    advisors: z.array(AdvisorSchema).length(4),
  })
  .refine(
    (n) => n.choices.filter((c) => c.historical).length === 1,
    "Exactly one historical choice required",
  );
export type Node = z.infer<typeof NodeSchema>;
export const CountryInfoSchema = z.object({
  id: z.enum(ids),
  name: z.string(),
  capital: z.string(),
  lat: z.number(),
  lng: z.number(),
  intro: z.string(),
  startMeters: MetersSchema,
});
export const CountrySchema = CountryInfoSchema.extend({
  nodes: z.array(NodeSchema).length(8),
});
export type Country = z.infer<typeof CountrySchema>;
export type CountryInfo = z.infer<typeof CountryInfoSchema>;
export type Condition =
  | { flag: string; set: boolean }
  | { meter: Meter; op: ">=" | "<="; value: number }
  | { choice: string }
  | { country: string }
  | { notCountry: string }
  | { historicalPct: ">=" | "<="; value: number }
  | { any: Condition[] }
  | { all: Condition[] };
export const ConditionSchema: z.ZodType<Condition> = z.lazy(() =>
  z.union([
    z.object({ flag: z.string(), set: z.boolean() }),
    z.object({
      meter: MeterSchema,
      op: z.enum([">=", "<="]),
      value: z.number(),
    }),
    z.object({ choice: z.string() }),
    z.object({ country: z.string() }),
    z.object({ notCountry: z.string() }),
    z.object({ historicalPct: z.enum([">=", "<="]), value: z.number() }),
    z.object({ any: z.array(ConditionSchema) }),
    z.object({ all: z.array(ConditionSchema) }),
  ]),
);
export const EndingSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string(),
  priority: z.number(),
  conditions: z.array(ConditionSchema),
  card: z.string(),
  reality: z.string(),
  discuss: z.array(z.string()).length(3),
});
export type Ending = z.infer<typeof EndingSchema>;
export const FlashpointSchema = z.object({
  id: z.string(),
  afterTurn: z.number(),
  year: z.string(),
  title: z.string(),
  prompt: z.string(),
  cutscene: z.boolean(),
  options: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        meterDelta: DeltaSchema,
        effect: EffectSchema,
      }),
    )
    .min(1)
    .max(2),
});
export type Flashpoint = z.infer<typeof FlashpointSchema>;
export const LessonSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});
export type Badge = z.infer<typeof LessonSchema>;
export const ContentSchema = z.object({
  endings: z.array(EndingSchema).length(20),
  flashpoints: z.array(FlashpointSchema).length(8),
  vocabulary: z.array(z.object({ term: z.string(), definition: z.string() })),
  badges: z.array(LessonSchema).length(12),
  sources: z.array(
    z.object({ title: z.string(), url: z.string().url(), note: z.string() }),
  ),
});
export type Content = z.infer<typeof ContentSchema>;
export const OptionsSchema = z.object({
  difficulty: z.enum(["student", "historian"]),
  teacher: z.boolean(),
  council: z.boolean(),
  readable: z.boolean(),
  auto: z.boolean(),
});
export type Options = z.infer<typeof OptionsSchema>;
export const EventSchema = EffectSchema.extend({
  turn: z.number().int().min(1).max(8),
  year: z.string(),
  choiceId: z.string(),
  choiceLabel: z.string(),
  country: z.enum(ids),
  historical: z.boolean(),
  viewed: z.boolean(),
  resolved: z.boolean().optional(),
  chanceHit: z.boolean().optional(),
  dueTurn: z.number().optional(),
});
export type GameEvent = z.infer<typeof EventSchema>;
export const SnapshotSchema = z.object({
  meters: MetersSchema,
  flags: z.array(z.string()),
  rng: z.number(),
  eventCount: z.number(),
  pending: z.array(EventSchema),
});
export type Snapshot = z.infer<typeof SnapshotSchema>;
export const RecordSchema = z.object({
  turn: z.number().int().min(1).max(8),
  choiceId: z.string(),
  historical: z.boolean(),
  before: SnapshotSchema,
  prediction: z.string().nullable(),
  predictionCorrect: z.boolean(),
  deescalated: z.boolean().default(false),
});
export const SessionSchema = z.object({
  version: z.literal(1),
  countryId: z.enum(ids),
  options: OptionsSchema,
  turn: z.number().int().min(1).max(8),
  phase: z.enum([
    "headline",
    "cabinet",
    "decision",
    "ripple",
    "flashpoint",
    "flash-ripple",
    "ending",
  ]),
  meters: MetersSchema,
  flags: z.array(z.string()),
  rng: z.number().int().nonnegative(),
  history: z.array(RecordSchema).max(8),
  events: z.array(EventSchema).max(120),
  pending: z.array(EventSchema).max(50),
  queue: z.array(EventSchema).max(12),
  queueIndex: z.number().int().min(0).max(12),
  prediction: z.string().nullable(),
  flashChoices: z.record(z.string()),
  endingId: z.string().nullable(),
  discussion: z.array(z.number()).max(3),
  notes: z.record(z.string().max(10000)).default({}),
});
export type Session = z.infer<typeof SessionSchema>;
