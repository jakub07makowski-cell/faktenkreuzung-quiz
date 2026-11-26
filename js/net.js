// Verbindung für den Live-Modus.
// "firebase": Firebase Realtime Database (Adresse in config.js).
// "local": Testmodus ohne Internet, alle Tabs im selben Browser teilen sich die Daten.
(function () {
  const ROOT = "faktenkreuzung";

  function splitPath(p) { return p.split("/").filter(Boolean); }
  function getIn(obj, parts) {
    let o = obj;
    for (const k of parts) { if (o == null || typeof o !== "object") return null; o = o[k]; }
    return o === undefined ? null : o;
  }
  function setIn(obj, parts, val) {
    if (!parts.length) return val;
    const [k, ...rest] = parts;
    const copy = obj && typeof obj === "object" ? { ...obj } : {};
    const v = setIn(copy[k], rest, val);
    if (v === null || v === undefined) delete copy[k]; else copy[k] = v;
    return copy;
  }

  // ---------- Lokaler Testmodus ----------
  function LocalNet() {
    // Jeder Schreibvorgang ist ein eigener Eintrag, damit sich Tabs nicht gegenseitig überschreiben.
    const PFX = "fk-log:";
    const listeners = new Set();
    let seq = 0;
    const read = () => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(PFX)) keys.push(k); }
      keys.sort();
      let t = {};
      for (const k of keys) { try { const w = JSON.parse(localStorage.getItem(k)); (w.m || [[w.p, w.v]]).forEach(([pp, vv]) => { t = setIn(t, pp, vv); }); } catch (e) {} }
      return t;
    };
    const fire = () => { const t = read(); listeners.forEach((l) => l(t)); };
    const logMany = (pairs) => {
      const k = PFX + String(Date.now()).padStart(15, "0") + ":" + String(seq++).padStart(6, "0") + ":" + Math.random().toString(36).slice(2, 6);
      localStorage.setItem(k, JSON.stringify({ m: pairs.map(([pp, vv]) => [pp, vv === undefined ? null : vv]) }));
    };
    const log = (parts, val) => logMany([[parts, val]]);
    window.addEventListener("storage", (e) => { if (e.key && e.key.startsWith(PFX)) fire(); });
    const resolveTS = (v) => {
      if (v && typeof v === "object") {
        if (v[".sv"] === "timestamp") return Date.now();
        const o = Array.isArray(v) ? [] : {};
        for (const k in v) o[k] = resolveTS(v[k]);
        return o;
      }
      return v;
    };
    return {
      kind: "local",
      ready: Promise.resolve(true),
      now: () => Date.now(),
      TS: { ".sv": "timestamp" },
      set(path, val) { log([ROOT, ...splitPath(path)], resolveTS(val)); fire(); return Promise.resolve(); },
      update(path, obj) {
        logMany(Object.keys(obj).map((k) => [[ROOT, ...splitPath(path), ...splitPath(k)], resolveTS(obj[k])]));
        fire(); return Promise.resolve();
      },
      get(path) { return Promise.resolve(getIn(read(), [ROOT, ...splitPath(path)])); },
      listen(path, cb) {
        const parts = [ROOT, ...splitPath(path)];
        let last;
        const l = (t) => { const v = getIn(t, parts); const s = JSON.stringify(v); if (s !== last) { last = s; cb(v); } };
        listeners.add(l); setTimeout(() => l(read()), 0);
        return () => listeners.delete(l);
      },
      onDisconnectRemove() {}
    };
  }

  // ---------- Firebase ----------
  function FirebaseNet(url) {
    const app = firebase.initializeApp({ databaseURL: url, apiKey: "unused", projectId: "faktenkreuzung" });
    const db = firebase.database(app);
    let offset = 0;
    db.ref(".info/serverTimeOffset").on("value", (s) => { offset = s.val() || 0; });
    const ref = (p) => db.ref(ROOT + "/" + splitPath(p).join("/"));
    const ready = new Promise((resolve) => {
      let done = false;
      const t = setTimeout(() => { if (!done) { done = true; resolve(false); } }, 8000);
      db.ref(".info/connected").on("value", (s) => {
        if (s.val() === true && !done) { done = true; clearTimeout(t); resolve(true); }
      });
    });
    return {
      kind: "firebase",
      ready,
      now: () => Date.now() + offset,
      TS: firebase.database.ServerValue.TIMESTAMP,
      set: (p, v) => ref(p).set(v),
      update: (p, o) => ref(p).update(o),
      get: (p) => ref(p).get().then((s) => s.val()),
      listen(p, cb) {
        const r = ref(p);
        const h = (s) => cb(s.val());
        r.on("value", h);
        return () => r.off("value", h);
      },
      onDisconnectRemove(p) { try { ref(p).onDisconnect().remove(); } catch (e) {} }
    };
  }

  function create() {
    const params = new URLSearchParams(location.search);
    if (params.get("net") === "local") return LocalNet();
    const url = (window.FK_CONFIG && window.FK_CONFIG.databaseURL || "").trim();
    if (!url || typeof firebase === "undefined") return null;
    try { return FirebaseNet(url); } catch (e) { console.warn("Firebase nicht verfügbar", e); return null; }
  }

  window.FK_NET = { create };
})();
