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
};
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
        const [mod, res] = await Promise.all([
          import("maplibre-gl"),
          fetch(import.meta.env.BASE_URL + "maps/land.json"),
        ]);
        if (!res.ok) throw Error("Map unavailable");
        const land = await res.json();
        if (disposed) return;
        const ml = mod.default;
        api.current = ml;
        let m: any;
        try {
          m = new ml.Map({
            container: el.current!,
            center: [15, 25],
            zoom: 1.25,
            minZoom: 0.6,
            maxZoom: 6,
            attributionControl: false,
            renderWorldCopies: false,
            style: {
              version: 8,
              sources: {
                land: { type: "geojson", data: land },
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
          setMode("fallback");
          api.current = L;
          m = L.map(el.current!, {
            center: [25, 15],
            zoom: 2,
            minZoom: 1,
            maxZoom: 6,
            zoomControl: false,
            attributionControl: false,
          });
          L.geoJSON(land, {
            style: {
              color: "#a0a596",
              weight: 1,
              fillColor: "#f3f0e5",
              fillOpacity: 1,
            },
          }).addTo(m);
          L.geoJSON(grid, { style: { color: "#bec7bc", weight: 0.6 } }).addTo(
            m,
          );
          map.current = m;
          setReady((x) => x + 1);
        }
        const ro = new ResizeObserver(() => {
          m.invalidateSize?.();
          m.resize?.();
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
    function pin(lng: number, lat: number, element: HTMLElement) {
      if (mode === "fallback") {
        const m = ml
          .marker([lat, lng], {
            icon: ml.divIcon({
              html: element,
              className: "leaf-pin",
              iconSize: [18, 18],
            }),
          })
          .addTo(mapObj);
        markers.current.push(m);
      } else {
        markers.current.push(
          new ml.Marker({ element }).setLngLat([lng, lat]).addTo(mapObj),
        );
      }
    }
    if (!props.playing) {
      for (const c of props.countries) {
        const b = document.createElement("button");
        b.className =
          "capital-pin" + (props.selected?.id === c.id ? " selected" : "");
        b.dataset.country = c.id;
        b.setAttribute("aria-label", "Play as " + c.name);
        const dot = document.createElement("i");
        b.append(dot);
        const text = document.createElement("span");
        text.textContent = c.capital.replace(", DC", "");
        b.append(text);
        b.onclick = () => propsRef.current.onSelect(c);
        pin(c.lng, c.lat, b);
      }
    } else {
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
    props.events,
    props.active,
    props.playing,
  ]);
  useEffect(() => {
    if (!ready || !map.current) return;
    const target = props.active || (props.playing ? props.selected : null);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const center: [number, number] = target
      ? [target.lng, target.lat]
      : [15, 25];
    if (mode === "fallback") {
      map.current.setView([center[1], center[0]], target ? 3 : 2, {
        animate: !reduced,
      });
    } else {
      map.current.flyTo({
        center,
        zoom: target ? 2.8 : 1.25,
        duration: reduced ? 0 : 650,
        essential: false,
      });
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
  function zoom(d: number) {
    if (!map.current) return;
    mode === "fallback"
      ? map.current.setZoom(map.current.getZoom() + d)
      : map.current.zoomTo(map.current.getZoom() + d, { duration: 300 });
  }
  function reset() {
    if (!map.current) return;
    mode === "fallback"
      ? map.current.setView([25, 15], 2)
      : map.current.flyTo({ center: [15, 25], zoom: 1.25, duration: 600 });
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
        <button aria-label="Zoom in" onClick={() => zoom(1)}>
          +
        </button>
        <button aria-label="Zoom out" onClick={() => zoom(-1)}>
          −
        </button>
        <button aria-label="Show whole world" onClick={reset}>
          ↗
        </button>
      </div>
      <div className="map-credit">
        Natural Earth · coastlines, not historical borders
      </div>
      <div className="compass" aria-hidden="true">
        N<span>↑</span>
      </div>
    </div>
  );
}
