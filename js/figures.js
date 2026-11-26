// Figuren im Comic-Stil als SVG. Jede Figur: viewBox 0 0 120 150.
(function () {
  const O = "#15172b"; // Umrisslinie
  const SW = 3;

  const COLORS = [
    { id: "rot", name: "Rot", hex: "#e2462f" },
    { id: "gelb", name: "Gelb", hex: "#f3c33c" },
    { id: "gruen", name: "Grün", hex: "#3fae57" },
    { id: "blau", name: "Blau", hex: "#3a78d6" },
    { id: "lila", name: "Lila", hex: "#7a52d6" },
    { id: "weiss", name: "Weiß", hex: "#eef1f6" }
  ];

  const ACCESSORIES = [
    { id: "none", name: "Nichts" },
    { id: "kopfhoerer", name: "Kopfhörer" },
    { id: "brille", name: "Brille" },
    { id: "warnweste", name: "Warnweste" },
    { id: "sonnenbrille", name: "Sonnenbrille" },
    { id: "hut", name: "Hut", locked: "Finde das Zeichen. Es hat drei Farben." },
    { id: "aluhut", name: "Aluhut", locked: "Irgendwo versteckt sich ein Männchen mit Hut." }
  ];

  // ---------- Bausteine Mensch ----------
  function eyes(color, opts = {}) {
    if (opts.sleepy) {
      return `
        <path d="M42 61 Q49 65 56 61" fill="none" stroke="${O}" stroke-width="${SW}" stroke-linecap="round"/>
        <path d="M64 61 Q71 65 78 61" fill="none" stroke="${O}" stroke-width="${SW}" stroke-linecap="round"/>`;
    }
    return `
      <g class="eyes">
        <ellipse cx="49" cy="60" rx="7.5" ry="8.5" fill="#fff" stroke="${O}" stroke-width="2.4"/>
        <ellipse cx="71" cy="60" rx="7.5" ry="8.5" fill="#fff" stroke="${O}" stroke-width="2.4"/>
        <circle class="pupil" cx="50" cy="61" r="3.6" fill="${color}"/>
        <circle class="pupil" cx="70" cy="61" r="3.6" fill="${color}"/>
        <circle cx="51" cy="59.5" r="1.1" fill="#fff"/>
        <circle cx="71" cy="59.5" r="1.1" fill="#fff"/>
      </g>`;
  }

  function face(skin, eyeColor, opts = {}) {
    const mouth = opts.mouth || `<path class="mouth" d="M52 79 Q60 85 68 79" fill="none" stroke="${O}" stroke-width="${SW}" stroke-linecap="round"/>`;
    return `
      <ellipse cx="30.5" cy="65" rx="5" ry="7" fill="${skin}" stroke="${O}" stroke-width="${SW}"/>
      <ellipse cx="89.5" cy="65" rx="5" ry="7" fill="${skin}" stroke="${O}" stroke-width="${SW}"/>
      <ellipse cx="60" cy="62" rx="29" ry="31" fill="${skin}" stroke="${O}" stroke-width="${SW}"/>
      ${eyes(eyeColor, opts)}
      <path d="M42 49 L55 47" stroke="${O}" stroke-width="${SW}" stroke-linecap="round"/>
      <path d="M65 47 L78 49" stroke="${O}" stroke-width="${SW}" stroke-linecap="round"/>
      <ellipse cx="60" cy="71" rx="4" ry="3.6" fill="${shade(skin)}" stroke="${O}" stroke-width="2"/>
      ${mouth}`;
  }

  function body(shirt, wide) {
    const w = wide ? 44 : 38;
    return `
      <path d="M${60 - w} 150 Q${60 - w} 100 60 98 Q${60 + w} 100 ${60 + w} 150 Z" fill="${shirt}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M50 99 Q60 108 70 99" fill="none" stroke="${O}" stroke-width="2.2" opacity=".55"/>
      <g class="arm-l"><path d="M${62 - w} 116 Q${58 - w} 132 ${66 - w} 146" fill="none" stroke="${O}" stroke-width="2.2" opacity=".5"/></g>`;
  }

  // Rechter Arm mit Becher: wird bei richtiger Antwort gehoben
  function cupArm(shirt, skin, wide) {
    const x = wide ? 100 : 94;
    return `
      <g class="arm-r" style="transform-origin:${x - 6}px 110px">
        <path d="M${x - 8} 106 Q${x + 6} 116 ${x + 4} 140" fill="none" stroke="${O}" stroke-width="13" stroke-linecap="round"/>
        <path d="M${x - 8} 106 Q${x + 6} 116 ${x + 4} 140" fill="none" stroke="${shirt}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="${x + 4}" cy="141" r="6" fill="${skin}" stroke="${O}" stroke-width="2.4"/>
        <g class="cup">
          <path d="M${x - 2} 128 L${x + 10} 128 L${x + 9} 142 L${x - 1} 142 Z" fill="#d93b2b" stroke="${O}" stroke-width="2.2" stroke-linejoin="round"/>
          <path d="M${x + 10} 131 q5 1 4 5 q-1 3 -5 2" fill="none" stroke="${O}" stroke-width="2"/>
        </g>
      </g>`;
  }

  function shade(hex) {
    // etwas dunkler für Nase
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (n >> 16) - 22), g = Math.max(0, ((n >> 8) & 255) - 28), b = Math.max(0, (n & 255) - 28);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  const SKIN = "#f5c6a0";
  const SKIN2 = "#e2a77f";

  // ---------- Figuren ----------
  const FIGURES = [
    {
      id: "moderator", name: "Moderator", kind: "human",
      info: "blond, blaue Augen, Kopfhörer",
      head: { x: 60, y: 31, w: 58 }, chest: { x: 60, y: 104, w: 76 },
      draw(shirt) {
        return `
          ${body(shirt)}
          ${face(SKIN, "#2f74d0")}
          <path d="M31 58 Q28 30 46 27 Q50 18 60 22 Q70 16 76 25 Q93 27 89 58 Q86 44 78 40 Q74 46 66 41 Q60 47 53 41 Q45 47 40 40 Q33 46 31 58 Z" fill="#f1c95b" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <path d="M27 60 Q25 26 60 24 Q95 26 93 60" fill="none" stroke="${O}" stroke-width="5"/>
          <rect x="20" y="54" width="12" height="20" rx="5" fill="#2b2d42" stroke="${O}" stroke-width="2.4"/>
          <rect x="88" y="54" width="12" height="20" rx="5" fill="#2b2d42" stroke="${O}" stroke-width="2.4"/>
          <rect x="22" y="58" width="5" height="12" rx="2" fill="#f3c33c"/>
          <rect x="93" y="58" width="5" height="12" rx="2" fill="#f3c33c"/>
          ${cupArm(shirt, SKIN)}`;
      }
    },
    {
      id: "ampelwaechter", name: "Ampelwächter", kind: "human",
      info: "schwarze Haare, Bart, Notizbuch",
      head: { x: 60, y: 31, w: 58 }, chest: { x: 60, y: 104, w: 86 },
      draw(shirt) {
        return `
          ${body(shirt, true)}
          ${face(SKIN2, "#3b2a1a", { mouth: `<path class="mouth" d="M53 82 L67 81" stroke="${O}" stroke-width="${SW}" stroke-linecap="round"/>` })}
          <path d="M32 74 Q34 98 60 99 Q86 98 88 74 Q84 86 74 84 Q66 88 60 87 Q54 88 46 84 Q36 86 32 74 Z" fill="#1d1b1b" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <path d="M52 79 Q60 76 68 79" fill="none" stroke="#1d1b1b" stroke-width="5" stroke-linecap="round"/>
          <path d="M31 56 Q28 26 60 26 Q92 26 89 56 Q84 40 70 40 Q60 34 48 40 Q36 40 31 56 Z" fill="#1d1b1b" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <path d="M40 45 L55 42" stroke="#1d1b1b" stroke-width="6" stroke-linecap="round"/>
          <path d="M66 42 L81 45" stroke="#1d1b1b" stroke-width="6" stroke-linecap="round"/>
          <g class="notebook"><rect x="10" y="118" width="26" height="20" rx="2" fill="#f7e9b0" stroke="${O}" stroke-width="2.4" transform="rotate(-8 23 128)"/>
          <circle cx="18" cy="126" r="2.6" fill="#e2462f"/><circle cx="25" cy="125" r="2.6" fill="#e2462f"/><circle cx="31" cy="124" r="2.6" fill="#e2462f"/></g>
          ${cupArm(shirt, SKIN2, true)}`;
      }
    },
    {
      id: "drsommer", name: "Dr. Sommer", kind: "human",
      info: "blond, Brille, Tablet",
      head: { x: 60, y: 31, w: 58 }, chest: { x: 60, y: 104, w: 76 },
      draw(shirt) {
        return `
          <path d="M26 64 Q20 96 34 104 L44 92 Z" fill="#f2cf6d" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <path d="M94 64 Q100 96 86 104 L76 92 Z" fill="#f2cf6d" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          ${body(shirt)}
          <rect x="56" y="102" width="8" height="30" rx="2" fill="#2f6fd6" stroke="${O}" stroke-width="2"/>
          ${face(SKIN, "#3b6b4b", { mouth: `<path class="mouth" d="M54 80 Q60 83 66 80" fill="none" stroke="${O}" stroke-width="${SW}" stroke-linecap="round"/>` })}
          <path d="M29 70 Q22 26 60 25 Q98 26 91 70 Q88 48 76 40 Q62 50 40 44 Q32 52 29 70 Z" fill="#f2cf6d" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <circle cx="49" cy="60" r="10" fill="none" stroke="${O}" stroke-width="3"/>
          <circle cx="71" cy="60" r="10" fill="none" stroke="${O}" stroke-width="3"/>
          <path d="M59 59 L61 59" stroke="${O}" stroke-width="3"/>
          <g class="tablet"><rect x="8" y="120" width="30" height="21" rx="3" fill="#2b2d42" stroke="${O}" stroke-width="2.4" transform="rotate(8 23 130)"/>
          <rect x="13" y="128" width="5" height="8" fill="#3fae57" transform="rotate(8 23 130)"/><rect x="20" y="124" width="5" height="12" fill="#3fae57" transform="rotate(8 23 130)"/><rect x="27" y="130" width="5" height="6" fill="#e2462f" transform="rotate(8 23 130)"/></g>
          ${cupArm(shirt, SKIN)}`;
      }
    },
    {
      id: "ampelmann", name: "Ampelmännchen mit Hut", kind: "thing",
      info: "das „Zeichen“ des Grünen Kreises",
      head: { x: 60, y: 30, w: 34 }, chest: { x: 60, y: 82, w: 44 },
      draw(shirt) {
        const G = "#3fd35a";
        return `
          <circle cx="60" cy="86" r="56" fill="${shirt}" opacity=".35"/>
          <g class="walker">
            <path d="M48 104 L36 140 L46 142 L58 112 Z" fill="${G}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round" class="leg-a"/>
            <path d="M70 104 L86 138 L76 142 L62 112 Z" fill="${G}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round" class="leg-b"/>
            <path d="M44 66 Q60 58 76 66 L80 108 Q60 114 40 108 Z" fill="${G}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
            <path d="M44 70 L22 92 L28 98 L46 82" fill="${G}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
            <path d="M76 70 L98 90 L92 96 L74 82" fill="${G}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
            <circle cx="60" cy="48" r="15" fill="${G}" stroke="${O}" stroke-width="${SW}"/>
            <path d="M73 48 q8 2 4 7" fill="${G}" stroke="${O}" stroke-width="2.4"/>
            <circle cx="64" cy="45" r="2.6" fill="${O}"/>
            <path d="M40 36 L80 36" stroke="${O}" stroke-width="5" stroke-linecap="round"/>
            <path d="M40 36 L80 36" stroke="${G}" stroke-width="2" stroke-linecap="round"/>
            <path d="M47 35 Q47 20 60 20 Q73 20 73 35 Z" fill="${G}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          </g>`;
      }
    },
    {
      id: "planer", name: "Verkehrsplaner", kind: "human",
      info: "Klemmbrett, grüne Krawatte",
      head: { x: 60, y: 31, w: 58 }, chest: { x: 60, y: 104, w: 76 },
      draw(shirt) {
        return `
          ${body(shirt)}
          <path d="M54 100 L66 100 L63 108 L67 132 L60 140 L53 132 L57 108 Z" fill="#2f9a4a" stroke="${O}" stroke-width="2.2" stroke-linejoin="round"/>
          ${face(SKIN, "#5a3b22")}
          <path d="M31 56 Q30 26 62 26 Q92 28 89 54 Q80 38 62 40 L54 34 Q48 44 31 56 Z" fill="#7a4a26" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <g class="clipboard"><rect x="6" y="114" width="28" height="34" rx="3" fill="#c98b4e" stroke="${O}" stroke-width="2.4"/>
          <rect x="10" y="120" width="20" height="24" fill="#fff" stroke="${O}" stroke-width="1.6"/>
          <rect x="14" y="111" width="12" height="6" rx="2" fill="#9aa0ad" stroke="${O}" stroke-width="2"/>
          <path d="M13 126 h14 M13 131 h14 M13 136 h10" stroke="${O}" stroke-width="1.4"/></g>
          ${cupArm(shirt, SKIN)}`;
      }
    },
    {
      id: "schlaefer", name: "Schläfer", kind: "human",
      info: "fliegt aus dem Kanal, gähnt bei Fehlern",
      head: { x: 60, y: 31, w: 58 }, chest: { x: 60, y: 104, w: 76 },
      draw(shirt) {
        return `
          ${body(shirt)}
          ${face(SKIN, "#333", { sleepy: true, mouth: `<ellipse class="mouth yawn" cx="60" cy="82" rx="5" ry="3" fill="#7a2b2b" stroke="${O}" stroke-width="2.4"/>` })}
          <path d="M31 54 Q26 34 36 32 Q34 24 44 26 Q48 18 58 24 Q66 16 72 26 Q84 22 82 32 Q94 34 89 54 Q82 42 60 40 Q40 42 31 54 Z" fill="#8a5a3a" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <path d="M32 44 Q40 6 86 14 Q98 16 104 34 Q84 22 88 42 Q60 30 32 44 Z" fill="#4a63c9" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <circle cx="104" cy="38" r="7" fill="#fff" stroke="${O}" stroke-width="2.4"/>
          <text class="zzz" x="88" y="12" font-size="14" font-weight="700" fill="#fff" stroke="${O}" stroke-width=".8">z</text>
          ${cupArm(shirt, SKIN)}`;
      }
    },
    {
      id: "pylone", name: "Pylone", kind: "thing",
      info: "aus dem Studio-Regal, wackelt bei Zeitnot",
      head: { x: 60, y: 24, w: 30 }, chest: { x: 60, y: 96, w: 50 },
      draw(shirt) {
        return `
          <circle cx="60" cy="86" r="56" fill="${shirt}" opacity=".35"/>
          <g class="cone">
            <rect x="18" y="132" width="84" height="12" rx="3" fill="#f07a1a" stroke="${O}" stroke-width="${SW}"/>
            <path d="M52 24 L68 24 L92 134 L28 134 Z" fill="#f58a26" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
            <path d="M46 52 L74 52 L78 70 L42 70 Z" fill="#fff" stroke="${O}" stroke-width="2"/>
            <path d="M38 92 L82 92 L86 110 L34 110 Z" fill="#fff" stroke="${O}" stroke-width="2"/>
            <ellipse cx="53" cy="80" rx="5" ry="6" fill="#fff" stroke="${O}" stroke-width="2"/>
            <ellipse cx="67" cy="80" rx="5" ry="6" fill="#fff" stroke="${O}" stroke-width="2"/>
            <circle cx="54" cy="81" r="2.4" fill="${O}"/><circle cx="66" cy="81" r="2.4" fill="${O}"/>
            <path class="mouth" d="M55 120 Q60 124 65 120" fill="none" stroke="${O}" stroke-width="2.4" stroke-linecap="round"/>
          </g>`;
      }
    },
    {
      id: "becher", name: "Kaffeebecher", kind: "thing",
      info: "von der Tanke, dampft bei Grüner Welle",
      head: { x: 60, y: 36, w: 46 }, chest: { x: 60, y: 92, w: 56 },
      draw(shirt) {
        return `
          <circle cx="60" cy="86" r="56" fill="${shirt}" opacity=".35"/>
          <g class="steam">
            <path d="M48 30 q-6 -8 0 -14 q6 -6 0 -14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>
            <path d="M62 28 q-6 -8 0 -14 q6 -6 0 -14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>
            <path d="M76 30 q-6 -8 0 -14 q6 -6 0 -14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>
          </g>
          <path d="M32 50 L88 50 L80 144 L40 144 Z" fill="#fdf6e3" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <rect x="28" y="38" width="64" height="14" rx="5" fill="#5b3a29" stroke="${O}" stroke-width="${SW}"/>
          <path d="M35 80 L85 80 L82 112 L38 112 Z" fill="#c0392b" stroke="${O}" stroke-width="2.4"/>
          <ellipse cx="51" cy="68" rx="5" ry="6" fill="#fff" stroke="${O}" stroke-width="2"/>
          <ellipse cx="69" cy="68" rx="5" ry="6" fill="#fff" stroke="${O}" stroke-width="2"/>
          <circle cx="52" cy="69" r="2.4" fill="${O}"/><circle cx="68" cy="69" r="2.4" fill="${O}"/>
          <text x="60" y="102" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">TANKE</text>
          <path class="mouth" d="M55 124 Q60 128 65 124" fill="none" stroke="${O}" stroke-width="2.4" stroke-linecap="round"/>`;
      }
    }
  ];

  // ---------- Accessoires (relativ: Kopf 60 breit, Oberkante y=0, Augen bei y≈29) ----------
  function accessory(id, fig) {
    if (!id || id === "none") return "";
    if (id === "warnweste") {
      const c = fig.chest, s = c.w / 76;
      return `<g transform="translate(${c.x} ${c.y}) scale(${s})">
        <path d="M-34 4 L-12 -4 L-6 46 L-38 46 Z" fill="#d7f22a" stroke="${O}" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M34 4 L12 -4 L6 46 L38 46 Z" fill="#d7f22a" stroke="${O}" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M-36 24 L-8 24 M36 24 L8 24" stroke="#cfd6de" stroke-width="5"/>
      </g>`;
    }
    const h = fig.head, s = h.w / 60;
    let g = "";
    switch (id) {
      case "kopfhoerer":
        g = `<path d="M-33 30 Q-34 -6 0 -6 Q34 -6 33 30" fill="none" stroke="${O}" stroke-width="5"/>
             <rect x="-41" y="22" width="12" height="20" rx="5" fill="#e2462f" stroke="${O}" stroke-width="2.4"/>
             <rect x="29" y="22" width="12" height="20" rx="5" fill="#e2462f" stroke="${O}" stroke-width="2.4"/>`;
        break;
      case "brille":
        g = `<circle cx="-11" cy="29" r="9.5" fill="rgba(255,255,255,.15)" stroke="${O}" stroke-width="3"/>
             <circle cx="11" cy="29" r="9.5" fill="rgba(255,255,255,.15)" stroke="${O}" stroke-width="3"/>
             <path d="M-2 28 L2 28" stroke="${O}" stroke-width="3"/>`;
        break;
      case "sonnenbrille":
        g = `<rect x="-24" y="22" width="20" height="13" rx="5" fill="#15172b"/>
             <rect x="4" y="22" width="20" height="13" rx="5" fill="#15172b"/>
             <path d="M-4 27 L4 27" stroke="${O}" stroke-width="3"/>
             <path d="M-20 25 L-14 25" stroke="#7d8bb0" stroke-width="2"/>`;
        break;
      case "hut":
        g = `<ellipse cx="0" cy="4" rx="40" ry="8" fill="#2e7d46" stroke="${O}" stroke-width="3"/>
             <path d="M-22 4 L-20 -24 Q0 -32 20 -24 L22 4 Z" fill="#2e7d46" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
             <rect x="-21" y="-6" width="42" height="7" fill="#15172b"/>`;
        break;
      case "aluhut":
        g = `<path d="M-32 6 L0 -44 L32 6 Z" fill="#cfd6de" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
             <path d="M-14 -16 L-4 -6 L6 -20 L14 -8 M-22 -2 L-10 0 L0 -10 L12 2 L22 -4" fill="none" stroke="#8d97a5" stroke-width="2"/>
             <path d="M-36 6 Q0 14 36 6" fill="none" stroke="${O}" stroke-width="3"/>`;
        break;
    }
    return `<g class="acc" transform="translate(${h.x} ${h.y}) scale(${s})">${g}</g>`;
  }

  function svg(figId, colorId, accId, extraClass = "") {
    const fig = FIGURES.find((f) => f.id === figId) || FIGURES[0];
    const col = (COLORS.find((c) => c.id === colorId) || COLORS[3]).hex;
    const accBody = accId === "warnweste" ? accessory(accId, fig) : "";
    const accHead = accId !== "warnweste" ? accessory(accId, fig) : "";
    return `<svg class="figure fig-${fig.id} ${extraClass}" viewBox="0 -14 120 164" aria-label="${fig.name}" role="img" xmlns="http://www.w3.org/2000/svg">${fig.draw(col)}${accBody}${accHead}</svg>`;
  }

  window.FK_FIG = { FIGURES, COLORS, ACCESSORIES, svg };
})();
