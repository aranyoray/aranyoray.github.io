import { useEffect, useRef, useState } from "react";
import type { CountryInfo, GameEvent } from "./types";
import "maplibre-gl/dist/maplibre-gl.css";
import "leaflet/dist/leaflet.css";
type Props = {
  countries: CountryInfo[];
  selected: CountryInfo | null;
  events: GameEvent[];
  active: GameEvent | null;
  onSelect: (c: CountryInfo) => void;
  onEvent: (e: GameEvent) => void;
  playing: boolean;
  metrics?: CountryInfo["startMeters"];
};
const BLOC_COLORS = {
  western: "#6f9fbe",
  soviet: "#bd7770",
  nonaligned: "#c8ad6f",
  other: "#c8cec1",
} as const;
const BLOC_NAMES: Record<string, string> = {
  western: "U.S.-aligned",
  soviet: "Soviet-aligned",
  nonaligned: "Non-aligned",
  other: "Other / shifting",
};
const COUNTRY_BLOCS: Record<string, keyof typeof BLOC_COLORS> = {
  USA: "western", UK: "western", FRG: "western",
  USSR: "soviet", CHN: "other", CUB: "other", IND: "nonaligned",
};
const HEALTH_METRICS = [
  { key: "STABILITY" as const, label: "STB", name: "Stability", color: "#668b69" },
  { key: "ECON" as const, label: "ECO", name: "Economy", color: "#b18941" },
  { key: "INFLUENCE" as const, label: "INF", name: "Influence", color: "#647ca8" },
];
const labels = [
  ["NORTH AMERICA", -106, 48],
  ["SOUTH AMERICA", -58, -15],
  ["EUROPE", 19, 53],
  ["AFRICA", 20, 7],
  ["ASIA", 91, 47],
  ["AUSTRALIA", 134, -25],
  ["ATLANTIC", -35, 7],
  ["PACIFIC", -142, 0],
  ["INDIAN OCEAN", 76, -25],
];
const grid = {
  type: "FeatureCollection" as const,
  features: [
    ...Array.from({ length: 13 }, (_, i) => ({
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: Array.from({ length: 33 }, (_, j) => [
          -180 + i * 30,
          -80 + j * 5,
        ]),
      },
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: Array.from({ length: 73 }, (_, j) => [
          -180 + j * 5,
          -60 + i * 30,
        ]),
      },
    })),
  ],
};
function fitWholeWorld(map: any, fallback = false) {
  if (!map?.fitBounds) return;
  const width = map.getContainer?.()?.clientWidth || 800;
  const pad = Math.max(8, Math.min(34, Math.round(width * 0.035)));
  if (fallback) {
    map.fitBounds([[-82, -180], [82, 180]], { padding: [24, pad], animate: false, maxZoom: 1.05 });
  } else {
    map.fitBounds([[-180, -82], [180, 82]], {
      padding: { top: 24, right: pad, bottom: 34, left: pad },
      maxZoom: 1.05,
      duration: 0,
    });
  }
}
export default function WorldMap(props: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const api = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const propsRef = useRef(props);
  propsRef.current = props;
  const [ready, setReady] = useState(0);
  const [mode, setMode] = useState<"vector" | "fallback" | "failed">("vector");
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    async function init() {
      try {
        const [mod, landRes, blocsRes] = await Promise.all([
          import("maplibre-gl"),
          fetch(import.meta.env.BASE_URL + "maps/land.json"),
          fetch(import.meta.env.BASE_URL + "maps/world-blocs.geojson"),
        ]);
        if (!landRes.ok || !blocsRes.ok) throw Error("Map unavailable");
        const land = await landRes.json();
        const blocs = await blocsRes.json();
        if (disposed) return;
        const ml = mod.default;
        api.current = ml;
        let m: any;
        let fallbackMap = false;
        try {
          m = new ml.Map({
            container: el.current!,
            center: [15, 25],
            zoom: 0.8,
            minZoom: 0.25,
            maxZoom: 1.05,
            maxBounds: [[-180, -85], [180, 85]],
            dragPan: false,
            dragRotate: false,
            scrollZoom: false,
            boxZoom: false,
            doubleClickZoom: false,
            keyboard: false,
            touchZoomRotate: false,
            touchPitch: false,
            attributionControl: false,
            renderWorldCopies: false,
            style: {
              version: 8,
              sources: {
                land: { type: "geojson", data: land },
                blocs: { type: "geojson", data: blocs },
                grid: { type: "geojson", data: grid },
                routes: {
                  type: "geojson",
                  data: { type: "FeatureCollection", features: [] },
                },
              },
              layers: [
                {
                  id: "paper",
                  type: "background",
                  paint: { "background-color": "#e6e9e1" },
                },
                {
                  id: "graticule",
                  type: "line",
                  source: "grid",
                  paint: {
                    "line-color": "#bec7bc",
                    "line-width": 0.6,
                    "line-opacity": 0.65,
                  },
                },
                {
                  id: "land",
                  type: "fill",
                  source: "land",
                  paint: { "fill-color": "#f3f0e5" },
                },
                {
                  id: "bloc-fill",
                  type: "fill",
                  source: "blocs",
                  paint: {
                    "fill-color": ["match", ["get", "bloc"],
                      "western", BLOC_COLORS.western,
                      "soviet", BLOC_COLORS.soviet,
                      "nonaligned", BLOC_COLORS.nonaligned,
                      BLOC_COLORS.other,
                    ],
                    "fill-opacity": 0.88,
                  },
                },
                {
                  id: "bloc-borders",
                  type: "line",
                  source: "blocs",
                  paint: { "line-color": "#738071", "line-width": 0.55, "line-opacity": 0.9 },
                },
                {
                  id: "coast",
                  type: "line",
                  source: "land",
                  paint: { "line-color": "#a0a596", "line-width": 0.8 },
                },
                {
                  id: "route",
                  type: "line",
                  source: "routes",
                  paint: {
                    "line-color": "#914533",
                    "line-width": 1.4,
                    "line-dasharray": [3, 3],
                    "line-opacity": 0.65,
                  },
                },
              ],
            },
          });
          map.current = m;
          m.on("load", () => {
            if (disposed) return;
            fitWholeWorld(m);
            for (const [text, lng, lat] of labels) {
              const d = document.createElement("span");
              d.className =
                "atlas-label" +
                (String(text).includes("OCEAN") ||
                text === "ATLANTIC" ||
                text === "PACIFIC"
                  ? " ocean"
                  : "");
              d.textContent = String(text);
              new ml.Marker({ element: d })
                .setLngLat([Number(lng), Number(lat)])
                .addTo(m);
            }
            setReady((x) => x + 1);
          });
        } catch {
          const L = await import("leaflet");
          if (disposed) return;
          fallbackMap = true;
          setMode("fallback");
          api.current = L;
          m = L.map(el.current!, {
            center: [25, 15],
            zoom: 0.8,
            minZoom: 0,
            maxZoom: 1.05,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            touchZoom: false,
          });
          L.geoJSON(land, {
            style: {
              color: "#a0a596",
              weight: 1,
              fillColor: "#f3f0e5",
              fillOpacity: 1,
            },
          }).addTo(m);
          L.geoJSON(blocs, {
            style: (feature: any) => ({
              color: "#738071",
              weight: 0.55,
              fillColor: BLOC_COLORS[feature?.properties?.bloc as keyof typeof BLOC_COLORS] || BLOC_COLORS.other,
              fillOpacity: 0.88,
            }),
          }).addTo(m);
          L.geoJSON(grid, { style: { color: "#bec7bc", weight: 0.6 } }).addTo(
            m,
          );
          map.current = m;
          fitWholeWorld(m, true);
          setReady((x) => x + 1);
        }
        const ro = new ResizeObserver(() => {
          m.invalidateSize?.();
          m.resize?.();
          fitWholeWorld(m, fallbackMap);
        });
        ro.observe(el.current!);
        cleanup = () => {
          ro.disconnect();
          m.remove();
        };
      } catch {
        if (!disposed) setMode("failed");
      }
    }
    void init();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);
  useEffect(() => {
    if (!ready || !map.current) return;
    for (const m of markers.current) m.remove();
    markers.current = [];
    const ml = api.current;
    const mapObj = map.current;
    const pinOffsets: Record<string, [number, number]> = {
      USA: [14, 12], USSR: [8, 8], CHN: [14, 10], UK: [-48, 8],
      FRG: [50, -15], CUB: [14, 10], IND: [12, 16],
    };
    function pin(lng: number, lat: number, element: HTMLElement, countryId?: string) {
      const offset = countryId ? pinOffsets[countryId] || [0, 0] : [0, 0];
      if (mode === "fallback") {
        const m = ml
          .marker([lat, lng], {
            icon: ml.divIcon({
              html: element,
              className: "leaf-pin",
              iconSize: [150, 66],
              iconAnchor: [4 - offset[0], 9 - offset[1]],
            }),
          })
          .addTo(mapObj);
        markers.current.push(m);
      } else {
        markers.current.push(
          new ml.Marker({ element, offset }).setLngLat([lng, lat]).addTo(mapObj),
        );
      }
    }
    for (const c of props.countries) {
      const bloc = COUNTRY_BLOCS[c.id] || "other";
      const values = props.selected?.id === c.id && props.metrics
        ? props.metrics
        : c.startMeters;
      const marker = document.createElement(props.playing ? "div" : "button");
      marker.className = `capital-pin bloc-${bloc}${props.selected?.id === c.id ? " selected" : ""}`;
      marker.dataset.country = c.id;
      marker.style.setProperty("--bloc-color", BLOC_COLORS[bloc]);
      const details = HEALTH_METRICS.map(({ key, label, name, color }) => {
        const value = Math.round(values[key]);
        return `${name} ${value}/100`;
      }).join(", ");
      marker.setAttribute("aria-label", `${c.name}; ${BLOC_NAMES[bloc]}; ${details}`);
      marker.title = `${c.name} · ${BLOC_NAMES[bloc]} · ${details}`;
      const dot = document.createElement("i");
      dot.className = "country-dot";
      marker.append(dot);
      const copy = document.createElement("span");
      copy.className = "country-marker-copy";
      const name = document.createElement("strong");
      name.textContent = c.id;
      copy.append(name);
      const capital = document.createElement("small");
      capital.textContent = c.capital.replace(", DC", "");
      copy.append(capital);
      const bars = document.createElement("span");
      bars.className = "country-health-bars";
      bars.setAttribute("aria-hidden", "true");
      for (const { key, label, name: metricName, color } of HEALTH_METRICS) {
        const value = Math.round(values[key]);
        const row = document.createElement("span");
        row.className = "country-health-bar";
        row.title = `${metricName}: ${value}/100`;
        const tag = document.createElement("small");
        tag.textContent = label;
        const track = document.createElement("i");
        const fill = document.createElement("b");
        fill.style.width = `${value}%`;
        fill.style.backgroundColor = color;
        track.append(fill);
        row.append(tag, track);
        bars.append(row);
      }
      copy.append(bars);
      marker.append(copy);
      if (!props.playing) marker.onclick = () => propsRef.current.onSelect(c);
      pin(c.lng, c.lat, marker, c.id);
    }
    if (props.playing) {
      const seen = new Map<string, GameEvent>();
      for (const e of props.events) seen.set(e.place, e);
      if (props.active) seen.set(props.active.place, props.active);
      for (const e of seen.values()) {
        const b = document.createElement("button");
        b.className =
          "effect-pin" + (e.id === props.active?.id ? " active" : "");
        b.setAttribute("aria-label", e.place + ": " + e.text);
        b.textContent = String(e.turn);
        b.onclick = () => propsRef.current.onEvent(e);
        pin(e.lng, e.lat, b);
      }
      if (props.selected) {
        const b = document.createElement("span");
        b.className = "home-pin";
        b.textContent = "◎";
        b.setAttribute("aria-label", props.selected.capital);
        pin(props.selected.lng, props.selected.lat, b);
      }
    }
  }, [
    ready,
    mode,
    props.countries,
    props.selected,
    props.metrics,
    props.events,
    props.active,
    props.playing,
  ]);
  useEffect(() => {
    if (!ready || !map.current) return;
    if (mode !== "fallback") {
      const routes = map.current.getSource("routes");
      if (routes)
        routes.setData({
          type: "FeatureCollection",
          features:
            props.active && props.selected
              ? [
                  {
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "LineString",
                      coordinates: [
                        [props.selected.lng, props.selected.lat],
                        [props.active.lng, props.active.lat],
                      ],
                    },
                  },
                ]
              : [],
        });
    }
  }, [props.active?.id, props.playing, props.selected?.id, ready, mode]);
  function reset() {
    if (!map.current) return;
    fitWholeWorld(map.current, mode === "fallback");
  }
  return (
    <div className="atlas">
      <div
        className="map-canvas"
        ref={el}
        role="region"
        aria-label="World map of decisions and consequences"
      />
      {mode === "failed" && (
        <div className="map-failed">
          The map could not load. Every consequence is available in the
          timeline.
        </div>
      )}
      <div className="map-caption">
        <span className="crosshair">⊕</span> WORLD ATLAS <span>1947—1991</span>
      </div>
      <div className="map-controls">
        <button aria-label="Fit the whole world" onClick={reset}>
          ⤢
        </button>
      </div>
      <div className="map-bloc-legend" aria-label="Illustrative Cold War blocs">
        {Object.entries(BLOC_NAMES).map(([bloc, name]) => (
          <span key={bloc}><i style={{ backgroundColor: BLOC_COLORS[bloc as keyof typeof BLOC_COLORS] }} />{name}</span>
        ))}
      </div>
      <div className="map-credit">
        Natural Earth · illustrative alignments; borders and blocs shifted over time
      </div>
      <div className="compass" aria-hidden="true">
        N<span>↑</span>
      </div>
    </div>
  );
}
