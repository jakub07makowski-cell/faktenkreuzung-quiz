(function () {
  "use strict";
  const D = window.FK_DATA, F = window.FK_FIG;
  const T = D.questionTime * 1000;
  const QN = D.questions.length;
  const SCORED = D.questions.filter((q) => !q.bonus).length;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  // pro Tab (ein Tab = ein Spieler, übersteht aber Neuladen)
  const tabStore = {
    get(k, d) { try { const v = sessionStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  const params = new URLSearchParams(location.search);
  const IS_HOST = params.has("host");
  const net = window.FK_NET.create();
  const now = () => (net ? net.now() : Date.now());
  const BASE_URL = location.origin + location.pathname.replace(/index\.html$/, "");

  // ---------- Profil ----------
  const profile = Object.assign({ name: "", fig: "moderator", color: "blau", acc: "none" }, store.get("fk-profile", {}));
  let unlocked = store.get("fk-unlocked", []);
  const isUnlocked = (id) => unlocked.includes(id);
  function unlock(id, msg) {
    if (!isUnlocked(id)) { unlocked.push(id); store.set("fk-unlocked", unlocked); }
    toast(msg);
    sfx("egg");
    if ($("#s-lobby").classList.contains("active")) renderLobby();
  }
  const nm = (s) => esc(String(s == null ? "?" : s).slice(0, 16));
  const figSvg = (p, cls) => F.svg(p.fig, p.color, p.acc, cls || "");

  // ---------- Bildschirme ----------
  function show(id) {
    if (params.has("debug")) console.log("show", id, (new Error().stack || "").split("\n").slice(2, 4).join(" | "));
    document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
    window.scrollTo(0, 0);
  }
  function hostView(id) {
    document.querySelectorAll(".host-view").forEach((s) => s.classList.toggle("active", s.id === id));
  }
  let toastTimer;
  function toast(msg, ms = 3200) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }
  function setOnAir(on) { $("#onair").classList.toggle("live", !!on); }
  function flickerOnAir() { const o = $("#onair"); o.classList.remove("flicker"); void o.offsetWidth; o.classList.add("flicker"); }

  // Kleine Figuren für Sprechblasen
  function fillSayFigs(root = document) {
    root.querySelectorAll("[data-fig]").forEach((el) => {
      if (el.dataset.done) return;
      const map = { moderator: "lila", ampelwaechter: "rot", drsommer: "weiss" };
      el.innerHTML = F.svg(el.dataset.fig, map[el.dataset.fig] || "blau", "none");
      el.dataset.done = "1";
    });
  }

  // ---------- Ton ----------
  let soundOn = store.get("fk-sound", IS_HOST);
  let actx;
  function updSoundBtn() { $("#soundBtn").classList.toggle("off", !soundOn); }
  $("#soundBtn").addEventListener("click", () => { soundOn = !soundOn; store.set("fk-sound", soundOn); updSoundBtn(); if (soundOn) sfx("tick"); });
  updSoundBtn();
  function tone(freq, start, dur, type = "square", vol = 0.06) {
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, actx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + start + dur);
    o.connect(g).connect(actx.destination); o.start(actx.currentTime + start); o.stop(actx.currentTime + start + dur + 0.05);
  }
  function sfx(kind) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      if (kind === "tick") tone(880, 0, 0.06);
      else if (kind === "go") { tone(660, 0, 0.12); tone(990, 0.12, 0.2); }
      else if (kind === "right") { tone(523, 0, 0.1, "triangle", 0.12); tone(659, 0.1, 0.1, "triangle", 0.12); tone(784, 0.2, 0.25, "triangle", 0.12); }
      else if (kind === "wrong") { tone(200, 0, 0.25, "sawtooth", 0.05); tone(150, 0.2, 0.3, "sawtooth", 0.05); }
      else if (kind === "egg") { [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.08, 0.12, "triangle", 0.1)); }
      else if (kind === "jingle") { [392, 523, 659, 784, 659, 784].forEach((f, i) => tone(f, i * 0.13, 0.16, "triangle", 0.1)); }
    } catch (e) {}
  }

  // ---------- Uhr ----------
  function tickClock() {
    const d = new Date();
    const m = d.getMinutes(), h = d.getHours() % 12;
    const rot = (el, deg) => el.setAttribute("transform", `rotate(${deg} 20 20)`);
    rot($("#mHand"), m * 6 + d.getSeconds() * 0.1);
    rot($("#hHand"), h * 30 + m * 0.5);
    $("#clock").title = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    $("#clockNote").textContent = d.getHours() === 18 && m < 10 ? "Abgabe!" : "";
  }
  tickClock(); setInterval(tickClock, 1000);

  // ---------- Ladetexte ----------
  let loadIdx = Math.floor(Math.random() * D.loadingLines.length);
  function tickLoading() {
    loadIdx = (loadIdx + 1) % D.loadingLines.length;
    document.querySelectorAll(".loading-line").forEach((el) => { if (!el.dataset.fixed) el.textContent = D.loadingLines[loadIdx]; });
  }
  tickLoading(); setInterval(tickLoading, 2400);

  // ---------- Easter Egg: Die Drei (dreimal auf die Studio-Ampel) ----------
  let ampelTaps = [];
  $("#studioAmpel").addEventListener("click", () => {
    const t = Date.now();
    ampelTaps = ampelTaps.filter((x) => t - x < 1800); ampelTaps.push(t);
    const a = $("#studioAmpel"); a.classList.toggle("go");
    sfx("tick");
    if (ampelTaps.length >= 3) {
      ampelTaps = [];
      unlock("hut", "Du hast das Zeichen erkannt. Drei Farben, drei Sekunden Gelb … Skin „Hut“ freigeschaltet.");
    }
  });

  // ---------- Easter Egg: Pinnwand lange drücken ----------
  function bindPinboard(el) {
    if (!el) return;
    let timer;
    const start = (e) => { timer = setTimeout(() => {
      el.classList.toggle("strung");
      if (el.classList.contains("strung")) { toast("Alles hängt mit allem zusammen. Oder doch nicht?"); sfx("egg"); }
    }, 650); };
    const stop = () => clearTimeout(timer);
    el.addEventListener("pointerdown", start);
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => el.addEventListener(ev, stop));
    el.addEventListener("contextmenu", (e) => e.preventDefault());
  }
  bindPinboard($("#pinboard"));

  // ---------- Formen der Antwortfelder ----------
  const SHAPES = [
    { name: "Achteck", svg: '<svg class="shape" viewBox="0 0 40 40" aria-hidden="true"><path d="M13 3h14l10 10v14L27 37H13L3 27V13z" fill="#fff" stroke="#15172b" stroke-width="3"/></svg>' },
    { name: "Raute", svg: '<svg class="shape" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2L38 20 20 38 2 20z" fill="#fff" stroke="#15172b" stroke-width="3"/></svg>' },
    { name: "Kreis", svg: '<svg class="shape" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#fff" stroke="#15172b" stroke-width="3"/></svg>' },
    { name: "Dreieck", svg: '<svg class="shape" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3L38 36H2z" fill="#fff" stroke="#15172b" stroke-width="3" stroke-linejoin="round"/></svg>' }
  ];
  function answerHTML(q, perm, slot, extra = "") {
    const orig = perm[slot];
    return `<button class="answer s${slot}" data-orig="${orig}" aria-label="${SHAPES[slot].name}: ${esc(q.a[orig])}">${SHAPES[slot].svg}<span>${esc(q.a[orig])}</span>${extra}</button>`;
  }

  // ---------- Punkte ----------
  function scoreFor(q, correct, elapsed) {
    if (q.bonus || !correct) return 0;
    const f = Math.min(1, Math.max(0, elapsed / T));
    return Math.round(1000 * (1 - 0.5 * f));
  }
  function waveBonus(q, correct, streak) {
    return !q.bonus && correct && streak >= 2 ? Math.min(300, 100 * (streak - 1)) : 0;
  }
  function rankFor(correctCount) { return D.ranks.find((r) => correctCount >= r.min && correctCount <= r.max) || D.ranks[0]; }

  // ---------- Countdown (Ampel: Rot, 3 Sekunden Gelb, Grün) ----------
  const CD_BASE = 4600, CD_ABL = 1800;
  function runCountdown(startAt, abl) {
    return new Promise((resolve) => {
      const el = $("#countdown"), txt = $("#cdText"), shout = $("#cdShout");
      fillSayFigs(el);
      if (startAt - now() <= 150) { resolve(); return; }
      el.classList.remove("hidden");
      let lastKey = "", finished = false;
      // Sicherheitsnetz, falls der Browser Timer drosselt
      const hard = setTimeout(() => { if (!finished) { finished = true; el.classList.add("hidden"); resolve(); } }, Math.max(0, startAt - now()) + 120);
      const step = () => {
        if (finished) return;
        const left = startAt - now();
        let l = "", t = "", key;
        if (abl && left > CD_BASE) { // Ablenkungswelle: viermal Grün
          const k = Math.floor((left - CD_BASE) / 225);
          l = k % 2 === 0 ? "g" : ""; t = ""; key = "abl" + k;
          shout.classList.remove("hidden");
        } else {
          shout.classList.add("hidden");
          if (left > 3600) { l = "r"; t = "Achtung …"; key = "r"; }
          else if (left > 600) { l = "y"; const n = Math.ceil((left - 600) / 1000); t = String(n); key = "y" + n; }
          else if (left > 0) { l = "g"; t = "Los!"; key = "g"; }
        }
        if (key !== lastKey) {
          lastKey = key; el.dataset.l = l; txt.textContent = t;
          if (key && key.startsWith("y")) sfx("tick"); if (key === "g") sfx("go");
        }
        if (left <= 0) { finished = true; clearTimeout(hard); el.classList.add("hidden"); resolve(); return; }
        setTimeout(step, 40);
      };
      step();
    });
  }

  // ---------- Timer während der Frage ----------
  let timerRAF;
  let timerHard;
  function runTimer(endsAt, onEnd, els) {
    clearTimeout(timerRAF); clearTimeout(timerHard);
    let ended = false;
    const end = () => { if (ended) return; ended = true; clearTimeout(timerHard); onEnd && onEnd(); };
    timerHard = setTimeout(() => { clearTimeout(timerRAF); els.box.dataset.l = "r"; if (els.fill) els.fill.style.transform = "scaleX(0)"; if (els.sec) els.sec.textContent = "0"; end(); }, Math.max(0, endsAt - now()) + 150);
    const total = T;
    const loop = () => {
      const left = Math.max(0, endsAt - now());
      const l = left > 10000 ? "g" : left > 3000 ? "y" : "r";
      els.box.dataset.l = l;
      if (els.fill) els.fill.style.transform = `scaleX(${left / total})`;
      if (els.sec) els.sec.textContent = Math.ceil(left / 1000);
      if (els.onTick) els.onTick(left, l);
      if (left <= 0) { end(); return; }
      timerRAF = setTimeout(loop, 40);
    };
    loop();
  }

  // ===================================================================
  // SPIELER
  // ===================================================================
  let mode = null; // "solo" | "live"
  let liveRoom = null; // gefundene Live-Runde
  let startUnsub = null;
  let eggQ = -1; // Frage mit verstecktem Ampelmännchen

  function initStart() {
    show("s-start");
    $("#trio").innerHTML = F.svg("ampelwaechter", "rot", "none") + F.svg("moderator", "lila", "none") + F.svg("drsommer", "weiss", "none");
    const status = $("#liveStatus");
    const join = $("#btnJoin"), solo = $("#btnSolo");
    const setSolo = (msg) => {
      liveRoom = null;
      status.classList.remove("on");
      status.innerHTML = esc(msg);
      join.textContent = "Lobby betreten"; solo.classList.add("hidden");
    };
    if (!net) { setSolo("Gerade läuft keine Live-Runde. Du spielst für dich allein."); return; }
    status.innerHTML = '<span class="loading-line"></span>'; tickLoading();
    let decided = false;
    const forced = (new URLSearchParams(location.search).get("r") || "").replace(/\D/g, "");
    if (startUnsub) startUnsub();
    startUnsub = net.listen("current", async (cur) => {
      decided = true;
      const fresh = cur && cur.code && now() - (cur.alive || 0) < 40000 && cur.phase !== "podium";
      let code = null;
      if (forced) { // QR-Code der Spielleitung mit Raumnummer hat Vorrang, solange der Raum offen ist
        try {
          const st = await net.get(`rooms/${forced}/state`);
          if (st && st.phase !== "closed" && st.phase !== "podium") code = forced;
        } catch (e) {}
      }
      if (!code && fresh) code = String(cur.code);
      if (!$("#s-start").classList.contains("active")) return;
      if (code) {
        liveRoom = code;
        status.classList.add("on");
        status.textContent = `Live-Runde gefunden: Raum ${code}`;
        join.textContent = "Live-Lobby betreten"; solo.classList.remove("hidden");
      } else setSolo("Gerade läuft keine Live-Runde. Du spielst für dich allein.");
    });
    setTimeout(() => { if (!decided) setSolo("Keine Verbindung zur Live-Runde. Du spielst für dich allein."); }, 9000);
  }

  $("#btnJoin").addEventListener("click", () => { mode = liveRoom ? "live" : "solo"; openLobby(); });
  $("#btnSolo").addEventListener("click", () => { mode = "solo"; openLobby(); });

  // ---------- Lobby ----------
  function openLobby() {
    $("#lobbyKicker").textContent = mode === "live" ? `Live-Lobby · Raum ${liveRoom}` : "Lobby · Einzelrunde";
    if (!profile.name) profile.name = rnd(D.nameIdeas);
    $("#nameInput").value = profile.name;
    $("#nameMsg").textContent = "";
    renderLobby();
    show("s-lobby");
  }
  function renderLobby() {
    if (profile.acc !== "none" && F.ACCESSORIES.find((a) => a.id === profile.acc && a.locked) && !isUnlocked(profile.acc)) profile.acc = "none";
    $("#preview").innerHTML = figSvg(profile);
    $("#figGrid").innerHTML = F.FIGURES.map((f) =>
      `<button class="fig-opt" data-fig="${f.id}" aria-pressed="${f.id === profile.fig}" title="${esc(f.info)}">${F.svg(f.id, profile.color, "none")}<span>${esc(f.name)}</span></button>`).join("");
    $("#swatches").innerHTML = F.COLORS.map((c) =>
      `<button class="swatch" data-color="${c.id}" style="background:${c.hex}" aria-label="${c.name}" aria-pressed="${c.id === profile.color}"></button>`).join("");
    $("#accChips").innerHTML = F.ACCESSORIES.map((a) => {
      const locked = a.locked && !isUnlocked(a.id);
      return `<button class="chip ${locked ? "locked" : ""}" data-acc="${a.id}" aria-pressed="${a.id === profile.acc}" ${locked ? `data-hint="${esc(a.locked)}"` : ""}>${esc(a.name)}</button>`;
    }).join("");
  }
  $("#figGrid").addEventListener("click", (e) => { const b = e.target.closest(".fig-opt"); if (!b) return; profile.fig = b.dataset.fig; renderLobby(); });
  $("#swatches").addEventListener("click", (e) => { const b = e.target.closest(".swatch"); if (!b) return; profile.color = b.dataset.color; renderLobby(); });
  $("#accChips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    if (b.classList.contains("locked")) { toast("Gesperrt. Tipp: " + b.dataset.hint); return; }
    profile.acc = b.dataset.acc; renderLobby();
  });
  $("#btnDice").addEventListener("click", () => { const n = rnd(D.nameIdeas); $("#nameInput").value = n; profile.name = n; $("#nameMsg").textContent = ""; });
  $("#nameInput").addEventListener("input", (e) => { profile.name = e.target.value; $("#nameMsg").textContent = ""; });

  $("#btnSeat").addEventListener("click", async () => {
    const name = $("#nameInput").value.trim().replace(/\s+/g, " ").slice(0, 16);
    const msg = $("#nameMsg"); msg.classList.remove("ok");
    if (!name) { msg.textContent = "Bitte gib einen Spitznamen ein."; return; }
    if (name.toLowerCase().replace(/\s/g, "") === "ampelwächter_3" || name.toLowerCase() === "ampelwaechter_3") {
      msg.textContent = "Der Name ist schon vergeben. Zufall? Sicher nicht."; sfx("wrong"); return;
    }
    profile.name = name;
    store.set("fk-profile", profile);
    if (/^gr(ü|ue)ner\s?kreis$/i.test(name)) toast("Willkommen, Schläfer. Wir haben dich schon erwartet.", 4000);
    eggQ = Math.floor(Math.random() * SCORED);
    if (mode === "live") await joinLive(); else startSolo();
  });

  // ---------- Frage anzeigen (für Solo und Live gleich) ----------
  function renderQuestion(qi, perm, endsAt, onAnswer, onTimeout) {
    const q = D.questions[qi];
    $("#qNum").textContent = q.bonus ? "Bonusfrage" : `Frage ${qi + 1} von ${SCORED}`;
    $("#askerFig").innerHTML = F.svg("moderator", "lila", "none");
    $("#qText").textContent = q.q;
    const box = $("#answers");
    box.className = "answers";
    box.innerHTML = perm.map((_, slot) => answerHTML(q, perm, slot)).join("");
    let done = false;
    box.onclick = (e) => {
      const b = e.target.closest(".answer"); if (!b || done) return;
      done = true;
      b.classList.add("chosen"); box.classList.add("done");
      box.querySelectorAll(".answer").forEach((x) => (x.disabled = true));
      clearTimeout(timerRAF), clearTimeout(timerHard);
      onAnswer(Number(b.dataset.orig));
    };
    // verstecktes Ampelmännchen
    const egg = $("#eggMan");
    if (qi === eggQ && !isUnlocked("aluhut")) {
      egg.innerHTML = F.svg("ampelmann", "gruen", "none");
      egg.style.left = (8 + Math.random() * 80) + "vw";
      egg.style.top = (Math.random() < 0.5 ? 70 : 88) + "vh";
      egg.classList.remove("hidden");
      egg.onclick = () => { egg.classList.add("hidden"); unlock("aluhut", "Du hast das Männchen mit Hut gefunden. Er ist überall … Skin „Aluhut“ freigeschaltet."); };
    } else egg.classList.add("hidden");
    show("s-question");
    setOnAir(true);
    runTimer(endsAt, () => {
      if (!done) { done = true; box.querySelectorAll(".answer").forEach((x) => (x.disabled = true)); onTimeout && onTimeout(); }
    }, { box: $("#timer"), fill: $("#timerFill"), sec: $("#timerS") });
  }

  function renderFeedback(o) {
    // o: {qi, answered, correct, points, wave, streak, total, place, of}
    const q = D.questions[o.qi];
    setOnAir(false);
    $("#eggMan").classList.add("hidden");
    const card = $("#fbCard");
    card.classList.remove("right", "wrong", "late", "neutral");
    let banner, cls;
    if (!o.answered) { banner = "Zu spät!"; cls = "late"; }
    else if (o.correct) { banner = "Richtig!"; cls = "right"; }
    else { banner = "Leider falsch."; cls = "wrong"; }
    if (q.bonus && o.answered) { banner = o.correct ? "Richtig! Gut zugehört." : "Knapp daneben."; }
    card.classList.add(cls);
    $("#fbBanner").textContent = banner;
    const figCls = o.correct ? "cheer" + (o.streak >= 2 ? " wave" : "") : "oops";
    $("#fbFig").innerHTML = figSvg(profile, figCls);
    $("#fbPlus").textContent = q.bonus ? "Bonus: 0 Punkte" : `+${o.points + o.wave}`;
    $("#fbWave").textContent = o.wave ? `Grüne Welle ×${o.streak} (+${o.wave})` : "";
    $("#fbTotal").textContent = `Gesamt: ${o.total.toLocaleString("de-DE")}`;
    $("#fbPlace").textContent = o.place ? `Platz ${o.place} von ${o.of}` : "";
    const w = $("#fbWaechter");
    if (!o.correct) {
      w.classList.remove("hidden");
      $("#fbWaechterText").textContent = o.answered ? rnd(D.wrongLines) : rnd(D.slowLines);
    } else w.classList.add("hidden");
    $("#fbRight").textContent = "Richtig ist: " + q.a[0];
    $("#fbEx").textContent = q.ex;
    fillSayFigs($("#s-feedback"));
    if (o.correct) sfx("right"); else { sfx("wrong"); flickerOnAir(); }
    show("s-feedback");
  }

  function renderResult(o) {
    // o: {score, correct, bonusRight, place, of}
    setOnAir(false);
    const r = rankFor(o.correct);
    $("#resFig").innerHTML = figSvg(profile, o.correct >= 7 ? "cheer wave" : "");
    $("#resRank").textContent = r.title;
    $("#resScore").textContent = `${o.score.toLocaleString("de-DE")} Punkte · ${o.correct} von ${SCORED} richtig` + (o.place ? ` · Platz ${o.place} von ${o.of}` : "");
    $("#resText").textContent = r.text;
    $("#resBonus").classList.toggle("hidden", !o.bonusRight);
    $("#farewell").textContent = D.farewell;
    $("#btnAgain").textContent = mode === "live" ? "Zur Startseite" : "Nochmal spielen";
    lastResult = { ...o, rank: r.title };
    sfx("jingle");
    show("s-result");
  }
  let lastResult = null;
  $("#btnAgain").addEventListener("click", () => {
    if (mode === "live") { stopLive(); initStart(); } else { startSolo(); }
  });
  $("#btnShow").addEventListener("click", () => {
    const sc = $("#showcard");
    sc.innerHTML = `<div>${figSvg(profile, "cheer")}<h2>${esc(lastResult.rank)}</h2><p><b>${esc(profile.name)}</b></p><p>${lastResult.score.toLocaleString("de-DE")} Punkte · ${lastResult.correct} von ${SCORED} richtig</p><small>Antippen zum Schließen</small></div>`;
    sc.classList.remove("hidden");
  });
  $("#showcard").addEventListener("click", () => $("#showcard").classList.add("hidden"));

  // ---------- Einzelrunde ----------
  let solo;
  function startSolo() {
    mode = "solo";
    solo = { i: 0, score: 0, streak: 0, correct: 0, bonusRight: false };
    eggQ = Math.floor(Math.random() * SCORED);
    soloQuestion();
  }
  async function soloQuestion() {
    const qi = solo.i, q = D.questions[qi];
    const abl = Math.random() < 1 / 8;
    const startAt = Date.now() + CD_BASE + (abl ? CD_ABL : 0);
    showAnswered("Achtung, gleich geht es los.", ""); // ruhiger Hintergrund hinter dem Countdown
    await runCountdown(startAt, abl);
    const perm = shuffle([0, 1, 2, 3]);
    const t0 = Date.now();
    const finish = (orig) => {
      const answered = orig !== null;
      const correct = answered && orig === 0;
      const points = scoreFor(q, correct, Date.now() - t0);
      if (!q.bonus) solo.streak = correct ? solo.streak + 1 : 0;
      const wave = waveBonus(q, correct, solo.streak);
      solo.score += points + wave;
      if (correct && !q.bonus) solo.correct++;
      if (correct && q.bonus) solo.bonusRight = true;
      setTimeout(() => {
        renderFeedback({ qi, answered, correct, points, wave, streak: solo.streak, total: solo.score });
        $("#btnNext").classList.remove("hidden"); $("#fbWait").classList.add("hidden");
        $("#btnNext").textContent = qi === QN - 1 ? "Zum Ergebnis" : "Weiter";
      }, answered ? 450 : 0);
    };
    renderQuestion(qi, perm, t0 + T, (orig) => finish(orig), () => finish(null));
  }
  $("#btnNext").addEventListener("click", () => {
    if (mode !== "solo") return;
    solo.i++;
    if (solo.i >= QN) renderResult({ score: solo.score, correct: solo.correct, bonusRight: solo.bonusRight });
    else soloQuestion();
  });

  function showAnswered(title, sub, cls) {
    $("#answeredTitle").textContent = title;
    $("#answeredSub").textContent = sub || "";
    $("#answeredFig").innerHTML = figSvg(profile, cls || "");
    show("s-answered");
  }

  // ---------- Live (Spieler) ----------
  let live = null;
  function stopLive() {
    if (!live) return;
    live.unsubs.forEach((u) => u());
    clearTimeout(timerRAF), clearTimeout(timerHard);
    live = null;
  }
  async function joinLive() {
    const code = liveRoom;
    const pidKey = "fk-pid-" + code;
    let pid = tabStore.get(pidKey, null);
    if (!pid) { pid = "p" + Math.random().toString(36).slice(2, 10); tabStore.set(pidKey, pid); }
    try {
      await net.update(`rooms/${code}/players/${pid}`, { name: profile.name, fig: profile.fig, color: profile.color, acc: profile.acc, joined: net.TS });
    } catch (e) {
      toast("Beitreten hat nicht geklappt. Du spielst jetzt allein."); startSolo(); return;
    }
    stopLive();
    live = { code, pid, unsubs: [], state: null, scores: {}, players: {}, handledKey: "" };
    $("#waitRoom").textContent = `Raum ${code}`;
    $("#waitFig").innerHTML = figSvg(profile);
    $("#waitName").textContent = profile.name;
    show("s-wait");
    live.unsubs.push(net.listen(`rooms/${code}/players`, (p) => {
      live && (live.players = p || {});
      const n = Object.keys(p || {}).length;
      $("#waitCount").textContent = n === 1 ? "Du bist bisher allein am Tisch." : `${n} Leute sitzen am Tisch.`;
      if (live && p && !p[pid] && live.state) { // vom Tisch entfernt (z. B. neue Runde)
      }
    }));
    live.unsubs.push(net.listen(`rooms/${code}/scores/${pid}`, (s) => { if (live) { live.myScore = s; renderLiveState(); } }));
    live.unsubs.push(net.listen(`rooms/${code}/state`, (st) => { if (live) { live.state = st; live.stateLoaded = true; renderLiveState(); } }));
  }

  function placeOf(myScoreObj) {
    if (!live || !live.state || !live.state.ranking) return {};
    const r = live.state.ranking;
    const idx = r.indexOf(live.pid);
    return idx >= 0 ? { place: idx + 1, of: r.length } : {};
  }

  async function renderLiveState() {
    const st = live && live.state;
    if (!live || !live.stateLoaded) return;
    if (!st) { stopLive(); toast("Die Live-Runde wurde beendet."); initStart(); return; }
    if (st.phase === "closed") {
      stopLive();
      try { const u = new URLSearchParams(location.search); u.delete("r"); history.replaceState(null, "", location.pathname + (u.toString() ? "?" + u : "")); } catch (e) {}
      $("#countdown").classList.add("hidden"); setOnAir(false);
      initStart();
      toast("Es gibt einen neuen Raum. Tippe auf „Live-Lobby betreten“, um wieder mitzuspielen.", 5000);
      return;
    }
    const round = st.round || 0;
    const key = `${st.phase}:${st.q}:${round}`;
    if (st.phase === "lobby") {
      if (live.handledKey !== key) {
        const wasPlaying = live.handledKey && !live.handledKey.startsWith("lobby");
        live.handledKey = key;
        clearTimeout(timerRAF); clearTimeout(timerHard);
        $("#countdown").classList.add("hidden"); $("#eggMan").classList.add("hidden"); $("#showcard").classList.add("hidden");
        show("s-wait"); setOnAir(false);
        if (wasPlaying) toast("Das Spiel wurde zurückgesetzt. Gleich geht es von vorne los.");
      }
      return;
    }
    if (st.phase === "question") {
      if (live.handledKey === key) return;
      if (typeof st.startAt !== "number" || typeof st.endsAt !== "number" || !Array.isArray(st.perm)) return;
      live.handledKey = key;
      const qi = st.q, q = D.questions[qi];
      if (!q) return;
      const ansKey = `fk-ans-${live.code}-${round}-${qi}`;
      if (tabStore.get(ansKey, false)) { showAnswered("Antwort eingeloggt.", "Warte auf die anderen …"); return; }
      if (now() >= st.endsAt - 1500) { showAnswered("Du steigst bei der nächsten Frage ein.", "Diese Frage läuft gerade aus."); return; }
      showAnswered("Achtung, gleich geht es los.", "");
      await runCountdown(st.startAt, st.abl);
      if (!live || live.handledKey !== key) return;
      const room = live.code, me = live.pid;
      renderQuestion(qi, st.perm || [0, 1, 2, 3], st.endsAt, (orig) => {
        tabStore.set(ansKey, true);
        net.set(`rooms/${room}/answers/${qi}/${me}`, { a: orig, at: net.TS }).catch(() => toast("Antwort konnte nicht gesendet werden. Prüfe dein Internet."));
        setTimeout(() => { if (live && live.handledKey === key) { showAnswered("Antwort eingeloggt.", "Warte auf die anderen …"); setOnAir(false); } }, 350);
      }, () => { if (live && live.handledKey === key) { showAnswered("Zeit abgelaufen.", "Gleich kommt die Auflösung.", "oops"); setOnAir(false); } });
      // Pylone wackelt bei Zeitnot: über Timer-Klasse
      return;
    }
    if (st.phase === "reveal" || st.phase === "board") {
      const s = live.myScore || { score: 0, streak: 0 };
      if (st.phase === "reveal" && s.lastQ !== st.q && live.waitedFor !== `${round}:${st.q}`) {
        live.waitedFor = `${round}:${st.q}`;
        setTimeout(() => { if (live) renderLiveState(); }, 700);
        return;
      }
      const fbKey = `fb:${st.q}:${s.lastQ === st.q ? "s" : "n"}:${st.phase}:${round}`;
      if (live.handledKey === fbKey) {
        const p0 = placeOf(); $("#fbPlace").textContent = p0.place ? `Platz ${p0.place} von ${p0.of}` : ""; return;
      }
      if (s.lastQ !== st.q && st.phase === "reveal") { // Punkte noch nicht da
        live.handledKey = fbKey;
      } else live.handledKey = fbKey;
      clearTimeout(timerRAF), clearTimeout(timerHard);
      const got = s.lastQ === st.q;
      const pl = placeOf();
      if (st.phase === "board" && $("#s-feedback").classList.contains("active")) {
        $("#fbPlace").textContent = pl.place ? `Platz ${pl.place} von ${pl.of}` : ""; return;
      }
      renderFeedback({
        qi: st.q, answered: got ? !!s.lastAnswered : false, correct: got ? !!s.lastCorrect : false,
        points: got ? s.lastPoints || 0 : 0, wave: got ? s.lastWave || 0 : 0, streak: s.streak || 0,
        total: s.score || 0, place: pl.place, of: pl.of
      });
      $("#btnNext").classList.add("hidden"); $("#fbWait").classList.remove("hidden");
      $("#fbWait").textContent = st.q >= QN - 1 ? "Gleich kommt das Siegertreppchen." : "Gleich kommt die nächste Frage.";
      return;
    }
    if (st.phase === "podium") {
      if (live.handledKey === key) return;
      live.handledKey = key;
      const s = live.myScore || { score: 0, correct: 0 };
      const pl = placeOf();
      renderResult({ score: s.score || 0, correct: s.correct || 0, bonusRight: !!s.bonusRight, place: pl.place, of: pl.of });
    }
  }

  // ===================================================================
  // SPIELLEITUNG (BEAMER)
  // ===================================================================
  const host = { code: null, state: null, players: {}, scores: {}, answers: {}, unsubs: [], revealing: false, hb: null };

  async function initHost() {
    document.body.classList.add("host");
    show("s-host");
    fillSayFigs();
    if (!net) { hostView("h-setup"); return; }
    $("#hostSetupText").textContent = "Verbinde mit der Datenbank …";
    hostView("h-setup");
    const ok = await net.ready;
    if (!ok) { $("#hostSetupText").textContent = "Keine Verbindung zur Firebase-Datenbank. Prüfe das Internet am Laptop der Spielleitung und die Adresse in js/config.js."; return; }
    const saved = store.get("fk-host-room", null);
    if (saved && Date.now() - saved.at < 3 * 3600 * 1000) {
      const st = await net.get(`rooms/${saved.code}/state`);
      if (st && st.phase !== "podium" && st.phase !== "closed") { attachHost(saved.code); return; }
    }
    await newRoom();
  }

  async function newRoom() {
    const old = host.code;
    detachHost();
    clearTimeout(timerRAF); clearTimeout(timerHard); $("#countdown").classList.add("hidden");
    if (answersUnsub) { answersUnsub(); answersUnsub = null; }
    answersQ = -1; lastHostKey = "";
    if (old) { try { await net.update(`rooms/${old}/state`, { phase: "closed" }); } catch (e) {} }
    const code = String(1000 + Math.floor(Math.random() * 9000));
    await net.set(`rooms/${code}`, { state: { phase: "lobby", q: -1 }, created: net.TS });
    store.set("fk-host-room", { code, at: Date.now() });
    attachHost(code);
  }
  function detachHost() { host.unsubs.forEach((u) => u()); host.unsubs = []; clearInterval(host.hb); clearInterval(host.loop); }

  function attachHost(code) {
    $("#hostTools").classList.remove("hidden");
    host.code = code; host.players = {}; host.scores = {}; host.answers = {}; host.state = null;
    const joinUrl = BASE_URL + "?r=" + code;
    $("#roomCode").textContent = code;
    $("#joinUrl").textContent = BASE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");
    try {
      const qr = qrcode(0, "M"); qr.addData(joinUrl); qr.make();
      $("#qr").innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
    } catch (e) { $("#qr").textContent = joinUrl; }
    const beat = () => net.set("current", { code, alive: net.TS, phase: host.state ? host.state.phase : "lobby" });
    beat(); host.hb = setInterval(beat, 10000);
    host.unsubs.push(net.listen(`rooms/${code}/players`, (p) => { host.players = p || {}; renderHost(); }));
    host.unsubs.push(net.listen(`rooms/${code}/scores`, (s) => { host.scores = s || {}; }));
    host.unsubs.push(net.listen(`rooms/${code}/state`, (s) => { host.state = s; renderHost(true); }));
    host.loop = setInterval(hostTick, 250);
  }

  function hostTick() {
    const st = host.state;
    if (!st || st.phase !== "question") return;
    const n = Object.keys(host.players).length;
    const a = Object.keys(host.answers[st.q] || {}).length;
    if (now() >= st.endsAt + 400 || (n > 0 && a >= n && now() > st.startAt)) hostReveal();
  }

  let answersUnsub = null, answersQ = -1;
  function watchAnswers(q) {
    if (answersQ === q) return;
    if (answersUnsub) answersUnsub();
    answersQ = q;
    answersUnsub = net.listen(`rooms/${host.code}/answers/${q}`, (a) => {
      host.answers[q] = a || {};
      const n = Object.keys(host.players).length;
      $("#hqCount").textContent = `${Object.keys(a || {}).length} / ${n} Antworten`;
    });
  }

  function sortedPlayers() {
    return Object.keys(host.players).map((pid) => ({ pid, ...host.players[pid], ...(host.scores[pid] || {}) }))
      .sort((x, y) => (y.score || 0) - (x.score || 0) || (x.name || "").localeCompare(y.name || ""));
  }

  let lastHostKey = "";
  function renderHost(fromState) {
    const st = host.state;
    if (!st) return;
    const key = `${st.phase}:${st.q}`;
    if (st.phase === "lobby") {
      hostView("h-lobby"); setOnAir(false);
      const list = Object.values(host.players);
      $("#hCount").textContent = list.length ? (list.length === 1 ? "1 Person sitzt am Tisch." : `${list.length} Leute sitzen am Tisch.`) : "Noch niemand am Tisch. Scannt den QR-Code!";
      $("#seats").innerHTML = list.map((p) => `<div class="seat">${F.svg(p.fig, p.color, p.acc)}<span>${nm(p.name)}</span></div>`).join("");
      $("#btnStart").disabled = list.length === 0;
      lastHostKey = key; return;
    }
    if (!fromState && key === lastHostKey && st.phase !== "question") return;
    if (st.phase === "question") {
      if (key === lastHostKey) return;
      lastHostKey = key;
      hostShowQuestion(st);
      return;
    }
    lastHostKey = key;
    if (st.phase === "reveal") hostShowReveal(st);
    else if (st.phase === "board") hostShowBoard();
    else if (st.phase === "podium") hostShowPodium();
  }

  async function hostShowQuestion(st) {
    const q = D.questions[st.q];
    host.revealing = false;
    watchAnswers(st.q);
    hostView("h-question");
    $("#hqNum").textContent = q.bonus ? "Bonusfrage (ohne Punkte)" : `Frage ${st.q + 1} von ${SCORED}`;
    $("#hqAsker").innerHTML = F.svg("moderator", "lila", "none");
    $("#hqText").textContent = q.q;
    const box = $("#hqAnswers");
    box.className = "answers host";
    box.innerHTML = st.perm.map((_, slot) => answerHTML(q, st.perm, slot, '<span class="cnt"></span>')).join("");
    box.querySelectorAll(".answer").forEach((b) => (b.disabled = true));
    $("#hqSay").classList.add("hidden");
    $("#btnHostNext").textContent = "Auflösen";
    $("#btnSkipBoard").classList.add("hidden");
    $("#hqAmpel").dataset.l = "r"; $("#hqSec").textContent = "";
    $("#hqCount").textContent = `0 / ${Object.keys(host.players).length} Antworten`;
    await runCountdown(st.startAt, st.abl);
    if (!host.state || host.state.phase !== "question" || host.state.q !== st.q) return;
    setOnAir(true);
    runTimer(st.endsAt, null, { box: $("#hqAmpel"), sec: $("#hqSec") });
  }

  async function hostReveal() {
    const st = host.state;
    if (!st || st.phase !== "question" || host.revealing) return;
    host.revealing = true;
    try {
    const q = D.questions[st.q];
    const answers = (await net.get(`rooms/${host.code}/answers/${st.q}`)) || {};
    const counts = [0, 0, 0, 0];
    const upd = {};
    const players = Object.keys(host.players);
    const newScores = {};
    players.forEach((pid) => {
      const prev = host.scores[pid] || { score: 0, streak: 0, correct: 0 };
      const ans = answers[pid];
      const valid = !!(ans && [0, 1, 2, 3].includes(ans.a) && (!ans.at || ans.at <= st.endsAt + 1500));
      if (valid) counts[ans.a] = (counts[ans.a] || 0) + 1;
      const correct = !!(valid && ans.a === 0);
      const elapsed = valid && ans.at ? ans.at - st.startAt : T;
      const points = scoreFor(q, correct, elapsed);
      const streak = q.bonus ? (prev.streak || 0) : correct ? (prev.streak || 0) + 1 : 0;
      const wave = waveBonus(q, correct, streak);
      const s = {
        score: (prev.score || 0) + points + wave, streak,
        correct: (prev.correct || 0) + (correct && !q.bonus ? 1 : 0),
        bonusRight: !!(prev.bonusRight || (q.bonus && correct)),
        lastQ: st.q, lastAnswered: !!valid, lastCorrect: correct, lastPoints: points, lastWave: wave
      };
      newScores[pid] = s;
      upd[`scores/${pid}`] = s;
    });
    const ranking = players.slice().sort((a, b) => newScores[b].score - newScores[a].score);
    upd["state/counts"] = counts;
    upd["state/ranking"] = ranking;
    upd["state/phase"] = "reveal";
    await net.update(`rooms/${host.code}`, upd);
    } catch (e) {
      console.error("Auflösung fehlgeschlagen", e);
      setTimeout(() => { host.revealing = false; }, 1500); // hostTick versucht es erneut
    }
  }

  function hostShowReveal(st) {
    const q = D.questions[st.q];
    clearTimeout(timerRAF), clearTimeout(timerHard);
    setOnAir(false);
    hostView("h-question");
    $("#hqAmpel").dataset.l = "g"; $("#hqSec").textContent = "";
    const box = $("#hqAnswers");
    if (!box.children.length || box.dataset.q !== String(st.q)) {
      $("#hqNum").textContent = q.bonus ? "Bonusfrage (ohne Punkte)" : `Frage ${st.q + 1} von ${SCORED}`;
      $("#hqAsker").innerHTML = F.svg("moderator", "lila", "none");
      $("#hqText").textContent = q.q;
      box.innerHTML = st.perm.map((_, slot) => answerHTML(q, st.perm, slot, '<span class="cnt"></span>')).join("");
    }
    box.dataset.q = st.q;
    box.className = "answers host reveal";
    const counts = st.counts || [0, 0, 0, 0];
    box.querySelectorAll(".answer").forEach((b) => {
      const orig = Number(b.dataset.orig);
      b.classList.toggle("correct", orig === 0);
      b.querySelector(".cnt").textContent = counts[orig] || 0;
    });
    const total = counts.reduce((a, b) => a + b, 0);
    const right = counts[0] || 0;
    $("#hqCount").textContent = total ? `${right} von ${total} richtig` : "Niemand hat geantwortet";
    $("#hqEx").textContent = q.ex;
    $("#hqSay").classList.remove("hidden");
    fillSayFigs($("#h-question"));
    $("#btnHostNext").textContent = st.q >= QN - 1 ? "Zum Siegertreppchen" : "Rangliste";
    const skip = $("#btnSkipBoard");
    skip.classList.toggle("hidden", st.q >= QN - 1);
    skip.textContent = D.questions[st.q + 1] && D.questions[st.q + 1].bonus ? "Direkt zur Bonusfrage" : "Direkt zur nächsten Frage";
    sfx("right");
  }

  function hostShowBoard() {
    hostView("h-board");
    const top = sortedPlayers().slice(0, 5);
    $("#board").innerHTML = top.length ? top.map((p, i) =>
      `<li style="animation-delay:${i * 90}ms"><span class="pl">${i + 1}.</span>${F.svg(p.fig, p.color, p.acc, p.streak >= 2 ? "wave" : "")}<span class="nm">${nm(p.name)}</span>${p.streak >= 2 ? `<span class="wv">Grüne Welle ×${p.streak}</span>` : ""}<span class="sc">${(p.score || 0).toLocaleString("de-DE")}</span></li>`).join("")
      : '<li>Noch keine Punkte.</li>';
    const st = host.state;
    $("#btnBoardNext").textContent = D.questions[st.q + 1] && D.questions[st.q + 1].bonus ? "Bonusfrage" : "Nächste Frage";
  }

  function hostShowPodium() {
    hostView("h-podium");
    setOnAir(false);
    const top = sortedPlayers().slice(0, 3);
    const order = [1, 0, 2];
    $("#podium").innerHTML = order.map((i) => {
      const p = top[i]; if (!p) return "";
      return `<div class="step p${i + 1}">${F.svg(p.fig, p.color, p.acc, "cheer")}<div class="nm">${nm(p.name)}</div><div class="block">${i + 1}<span class="sc">${(p.score || 0).toLocaleString("de-DE")}</span></div></div>`;
    }).join("");
    fillSayFigs($("#h-podium"));
    sfx("jingle");
    net.set("current", { code: host.code, alive: net.TS, phase: "podium" });
  }

  async function hostGoQuestion(q) {
    const abl = Math.random() < 1 / 8;
    const startAt = now() + CD_BASE + (abl ? CD_ABL : 0) + 400;
    await net.update(`rooms/${host.code}/state`, { phase: "question", q, perm: shuffle([0, 1, 2, 3]), startAt, endsAt: startAt + T, abl, counts: null });
  }

  let lastNext = 0;
  function hostNext() {
    const st = host.state; if (!st) return;
    if (Date.now() - lastNext < 400) return; // Doppelklick überspringt sonst einen Schritt
    lastNext = Date.now();
    if (st.phase === "lobby") { if (Object.keys(host.players).length) hostGoQuestion(0); }
    else if (st.phase === "question") hostReveal();
    else if (st.phase === "reveal") net.update(`rooms/${host.code}/state`, { phase: st.q >= QN - 1 ? "podium" : "board" });
    else if (st.phase === "board") hostGoQuestion(st.q + 1);
  }
  $("#btnStart").addEventListener("click", hostNext);
  $("#btnHostNext").addEventListener("click", hostNext);
  $("#btnBoardNext").addEventListener("click", hostNext);
  // Rangliste überspringen: von der Auflösung direkt zur nächsten Frage
  $("#btnSkipBoard").addEventListener("click", () => {
    const st = host.state; if (!st || st.phase !== "reveal" || st.q >= QN - 1) return;
    if (Date.now() - lastNext < 400) return;
    lastNext = Date.now();
    hostGoQuestion(st.q + 1);
  });

  // Spiel zurücksetzen: gleicher Raum, gleicher QR-Code, alle bleiben am Tisch, Punkte und Antworten weg
  async function hostReset() {
    if (!host.code) return;
    host.revealing = true; // laufende Auflösung verhindern
    clearTimeout(timerRAF); clearTimeout(timerHard);
    $("#countdown").classList.add("hidden");
    if (answersUnsub) { answersUnsub(); answersUnsub = null; }
    answersQ = -1; host.answers = {}; host.scores = {}; lastHostKey = "";
    await net.update(`rooms/${host.code}`, { answers: null, scores: null, state: { phase: "lobby", q: -1, round: Date.now() } });
    host.revealing = false;
    toast("Spiel zurückgesetzt. Alle bleiben am Tisch, wer fehlt, kann jetzt noch scannen.");
  }
  let askAction = null;
  function ask(text, yes, action) {
    askAction = action;
    $("#resetText").textContent = text; $("#resetYes").textContent = yes;
    $("#toolBtns").classList.add("hidden"); $("#resetAsk").classList.remove("hidden");
  }
  function closeAsk() { $("#resetAsk").classList.add("hidden"); $("#toolBtns").classList.remove("hidden"); }
  $("#btnReset").addEventListener("click", () => ask("Wirklich von vorne? Punkte und Antworten werden gelöscht, alle bleiben am Tisch.", "Ja, neu starten", hostReset));
  $("#btnNewRoom2").addEventListener("click", () => ask("Neuen Raum erstellen? Es gibt eine neue Raumnummer und einen neuen QR-Code. Alle müssen neu beitreten.", "Ja, neuer Raum", async () => { await newRoom(); toast("Neuer Raum erstellt. Alle bitte neu beitreten."); }));
  $("#resetNo").addEventListener("click", closeAsk);
  $("#resetYes").addEventListener("click", async () => { const a = askAction; closeAsk(); if (a) await a(); });
  $("#btnRestart").addEventListener("click", () => newRoom());
  document.addEventListener("keydown", (e) => {
    if (!IS_HOST) return;
    if (e.target.tagName === "INPUT" || e.repeat) return;
    if (!$("#resetAsk").classList.contains("hidden")) return;
    if (host.state && host.state.phase === "podium") return;
    if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
      e.preventDefault();
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      hostNext();
    }
  });

  // Bildschirm wach halten (Beamer-Laptop und Handys im Warteraum)
  let wakeLock = null;
  async function keepAwake() {
    try { if ("wakeLock" in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release", () => { wakeLock = null; }); } } catch (e) {}
  }
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && (IS_HOST || live)) keepAwake(); });
  document.addEventListener("click", () => { if (IS_HOST || mode === "live") keepAwake(); });

  // ---------- Start ----------
  fillSayFigs();
  if (IS_HOST) initHost(); else initStart();

  // Für Tests
  window.FK_APP = { host, get live() { return live; }, get solo() { return solo; } };
})();
