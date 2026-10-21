/* A House Divided — board data.
   A stylized tile-grid map of the United States (vague borders, no flags),
   plus foreign "powers" as edge chips. States recolor by loyalty:
   0 = Confederate (gray), 100 = Union (blue). Baseline from the 1850 spec. */
(function () {
  // grid: [row, col] on an 11-col board. Vague geography, pixel aesthetic.
  const S = (name, row, col, loyalty, slavery, tier) =>
    ({ name, row, col, loyalty, slavery: slavery || 'FREE', tier: tier || 'state' });

  window.AH_REGIONS = {
    // --- Free states (loyalty 90) ---
    ME: S('Maine', 0, 10, 90, 'FREE'), NH: S('New Hampshire', 1, 10, 90, 'FREE'),
    VT: S('Vermont', 1, 9, 90, 'FREE'), MA: S('Massachusetts', 2, 9, 90, 'FREE'),
    RI: S('Rhode Island', 3, 10, 90, 'FREE'), CT: S('Connecticut', 3, 9, 90, 'FREE'),
    NY: S('New York', 2, 8, 90, 'FREE'), NJ: S('New Jersey', 3, 8, 90, 'FREE'),
    PA: S('Pennsylvania', 3, 7, 90, 'FREE'), OH: S('Ohio', 3, 6, 90, 'FREE'),
    IN: S('Indiana', 3, 5, 90, 'FREE'), IL: S('Illinois', 2, 5, 90, 'FREE'),
    MI: S('Michigan', 2, 7, 90, 'FREE'), WI: S('Wisconsin', 2, 6, 90, 'FREE'),
    IA: S('Iowa', 3, 4, 90, 'FREE'), MN: S('Minnesota', 2, 4, 88, 'FREE'),
    CA: S('California', 4, 0, 75, 'FREE'), OR: S('Oregon', 3, 0, 80, 'FREE'),
    // --- Upper South (loyalty 55, SLAVE) — the volatile border ---
    DE: S('Delaware', 4, 9, 55, 'SLAVE'), MD: S('Maryland', 4, 8, 55, 'SLAVE'),
    VA: S('Virginia', 4, 7, 55, 'SLAVE'), KY: S('Kentucky', 4, 5, 55, 'SLAVE'),
    MO: S('Missouri', 4, 4, 55, 'SLAVE'), TN: S('Tennessee', 5, 5, 55, 'SLAVE'),
    NC: S('North Carolina', 5, 6, 55, 'SLAVE'), AR: S('Arkansas', 5, 4, 55, 'SLAVE'),
    // --- Deep South (loyalty 35, SLAVE) ---
    SC: S('South Carolina', 5, 7, 35, 'SLAVE'), GA: S('Georgia', 6, 7, 35, 'SLAVE'),
    FL: S('Florida', 7, 7, 35, 'SLAVE'), AL: S('Alabama', 6, 6, 35, 'SLAVE'),
    MS: S('Mississippi', 6, 5, 35, 'SLAVE'), LA: S('Louisiana', 6, 4, 35, 'SLAVE'),
    TX: S('Texas', 7, 3, 35, 'SLAVE'),
    // --- Territories / not-yet-states (contested or ghosted) ---
    KS: S('Kansas Terr.', 5, 3, 50, 'FREE', 'terr'), NE: S('Nebraska Terr.', 4, 3, 50, 'FREE', 'terr'),
    NM: S('New Mexico Terr.', 5, 2, 50, 'SLAVE', 'terr'), UT: S('Utah Terr.', 4, 1, 50, 'FREE', 'terr'),
    CO: S('Colorado Terr.', 4, 2, 50, 'FREE', 'terr'), WV: S('West Virginia', 4, 6, 60, 'SLAVE', 'ghost'),
    DC: S('Washington DC', 5, 8, 65, 'SLAVE'),
    // Indian Territory as a nation tile
    OK: S('Indian Territory', 6, 3, 50, 'SLAVE', 'nation'),
    // --- Ghost tiles (exist on the board for context, not in play in 1850) ---
    WA: S('Washington Terr.', 2, 0, 50, 'FREE', 'ghost'), ID: S('Idaho Terr.', 2, 1, 50, 'FREE', 'ghost'),
    MT: S('Montana Terr.', 2, 2, 50, 'FREE', 'ghost'), ND: S('Dakota Terr.', 2, 3, 50, 'FREE', 'ghost'),
    SD: S('Dakota', 3, 3, 50, 'FREE', 'ghost'), WY: S('Wyoming Terr.', 3, 2, 50, 'FREE', 'ghost'),
    NV: S('Nevada', 3, 1, 50, 'FREE', 'ghost'), AZ: S('Arizona Terr.', 5, 1, 50, 'SLAVE', 'ghost')
  };

  // Foreign powers — edge chips (never interpolate; own tints).
  window.AH_FOREIGN = {
    CANADA: { name: 'Canada', side: 'edge-top', tint: '#5b7fa6' },
    GBR: { name: 'Britain', side: 'edge-right', tint: '#8b1e3f' },
    FRA: { name: 'France', side: 'edge-right', tint: '#5e3a8c' },
    MEX: { name: 'Mexico', side: 'edge-bottom', tint: '#2a7f62' },
    CUB: { name: 'Cuba', side: 'edge-bottom', tint: '#b87333' }
  };

  // loyalty -> fixed bloc fill: Confederate red, contested gold, Union blue.
  // Keeping each bloc categorical makes the state map read like a political map.
  window.AH_loyaltyColor = function (v) {
    v = Math.max(0, Math.min(100, v));
    if (v < 40) return 'rgb(183, 99, 75)';
    if (v < 65) return 'rgb(202, 158, 88)';
    return 'rgb(75, 122, 173)';
  };
})();
