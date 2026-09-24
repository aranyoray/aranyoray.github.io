import { z } from "zod";
import {
  CountrySchema,
  CountryInfoSchema,
  ContentSchema,
  type Country,
} from "./types";
const base = import.meta.env.BASE_URL;
async function get(file: string) {
  const r = await fetch(`${base}content/cold-war/${file}.json`);
  if (!r.ok)
    throw Error(`Could not load ${file} (${r.status}). Please try again.`);
  return r.json();
}
export const loadCountries = async () =>
  z
    .array(CountryInfoSchema)
    .length(7)
    .parse(await get("countries"));
const cache = new Map<string, Country>();
export async function loadCountry(id: string) {
  if (cache.has(id)) return cache.get(id)!;
  const c = CountrySchema.parse(await get(id));
  cache.set(id, c);
  return c;
}
export async function loadContent() {
  const names = ["endings", "flashpoints", "vocabulary", "badges", "sources"];
  return ContentSchema.parse(
    Object.fromEntries(
      await Promise.all(names.map(async (n) => [n, await get(n)])),
    ),
  );
}
