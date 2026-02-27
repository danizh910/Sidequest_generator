const STORAGE_KEYS = {
  custom: "quests_custom",
  edits: "quests_edits",
  deleted: "quests_deleted",
  history: "quest_history",
  saved: "quest_saved",
  settings: "settings",
};

const DEFAULT_SETTINGS = {
  exclude_done_from_random: true,
  show_done_as_grey: true,
};

const CATEGORY_OPTIONS = ["outdoor", "creativity", "money_business", "fitness"];
const DURATION_BUCKETS = {
  any: null,
  "5-10": [5, 10],
  "10-20": [10, 20],
  "20-45": [20, 45],
  "45-90": [45, 90],
  "90+": [90, Number.POSITIVE_INFINITY],
};

const state = {
  baseQuests: [],
  activeTab: "roulette",
  editingQuestId: null,
  rouletteSelectionId: null,
  rouletteTicker: "",
  rouletteSpinning: false,
  filters: defaultFilters(),
  allSearch: "",
  historyStatus: "all",
};

function defaultFilters() {
  return {
    categories: [],
    duration_bucket: "any",
    setting: "any",
    group_mode: "any",
    adventure_level_min: 1,
    tags: [],
    include_done: true,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStore() {
  return {
    custom: loadJson(STORAGE_KEYS.custom, []),
    edits: loadJson(STORAGE_KEYS.edits, {}),
    deleted: loadJson(STORAGE_KEYS.deleted, []),
    history: loadJson(STORAGE_KEYS.history, []),
    saved: loadJson(STORAGE_KEYS.saved, []),
    settings: { ...DEFAULT_SETTINGS, ...loadJson(STORAGE_KEYS.settings, {}) },
  };
}

function patchStore(patch) {
  Object.entries(patch).forEach(([slice, data]) => {
    const key = STORAGE_KEYS[slice];
    if (key) saveJson(key, data);
  });
}

function mergeQuests(baseQuests, store) {
  const deleted = new Set(store.deleted);
  const all = [...baseQuests, ...store.custom];
  return all
    .filter((q) => !deleted.has(q.id))
    .map((q) => {
      const edit = store.edits[q.id] || {};
      return Object.keys(edit).length ? { ...q, ...edit } : q;
    });
}

function doneQuestIds(history) {
  return new Set(history.filter((item) => item.status === "done").map((item) => item.quest_id));
}

function overlapsDuration(quest, bucketKey) {
  const range = DURATION_BUCKETS[bucketKey];
  if (!range) return true;
  const [min, max] = range;
  return quest.duration_min <= max && quest.duration_max >= min;
}

function questMatchesFilters(quest, filters, doneSet) {
  if (filters.categories.length && !filters.categories.includes(quest.category)) return false;
  if (!overlapsDuration(quest, filters.duration_bucket)) return false;
  if (filters.setting !== "any" && quest.setting !== "both" && quest.setting !== filters.setting) return false;
  if (filters.group_mode !== "any" && quest.group_mode !== "both" && quest.group_mode !== filters.group_mode) return false;
  if (quest.adventure_level < filters.adventure_level_min) return false;
  if (filters.tags.length && !filters.tags.every((tag) => quest.tags.includes(tag))) return false;
  if (!filters.include_done && doneSet.has(quest.id)) return false;
  return true;
}

function filterQuests(quests, filters, doneSet) {
  return quests.filter((q) => questMatchesFilters(q, filters, doneSet));
}

function sortByDoneThenTitle(quests, doneSet) {
  return [...quests].sort((a, b) => {
    const doneDiff = Number(doneSet.has(a.id)) - Number(doneSet.has(b.id));
    if (doneDiff !== 0) return doneDiff;
    return a.title.localeCompare(b.title, "de");
  });
}

function uniqTags(quests) {
  return [...new Set(quests.flatMap((q) => q.tags))].sort((a, b) => a.localeCompare(b, "de"));
}

function esc(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function parseCommaList(value) {
  return String(value)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function getCtx() {
  const store = getStore();
  const mergedQuests = mergeQuests(state.baseQuests, store);
  const doneSet = doneQuestIds(store.history);
  const filteredQuests = filterQuests(mergedQuests, state.filters, doneSet);
  const randomPool = filteredQuests.filter(
    (q) => !store.settings.exclude_done_from_random || !doneSet.has(q.id)
  );
  return {
    store,
    mergedQuests,
    doneSet,
    filteredQuests,
    randomPool,
    tags: uniqTags(mergedQuests),
  };
}

function badge(text, className = "") {
  return `<span class="badge ${className}">${esc(text)}</span>`;
}

function buildNav() {
  const tabs = [
    ["roulette", "🎯", "Roulette"],
    ["all", "📚", "All Quests"],
    ["create", "➕", "Create"],
    ["history", "🕒", "History"],
    ["saved", "⭐", "Saved"],
    ["settings", "⚙️", "Settings"],
  ];

  return `
    <header class="topbar">
      <div>
        <h1>Sidequest Roulette</h1>
        <p class="subtitle">Mobile-first • lokal gespeichert • ohne Backend</p>
      </div>
    </header>
    <nav class="tabbar">
      ${tabs
        .map(
          ([id, icon, label]) =>
            `<button class="tab ${state.activeTab === id ? "active" : ""}" data-tab="${id}"><span>${icon}</span><small>${label}</small></button>`
        )
        .join("")}
    </nav>
  `;
}

function filterPanel(ctx) {
  const suggestions = sortByDoneThenTitle(ctx.filteredQuests, ctx.doneSet).slice(0, 10);

  return `
    <section class="card">
      <div class="section-title-row">
        <h2>Filter</h2>
        <span class="counter">${ctx.filteredQuests.length} Matches</span>
      </div>
      <div class="filter-grid">
        <label>Kategorien
          <select multiple data-filter="categories">
            ${CATEGORY_OPTIONS.map((c) => `<option value="${c}" ${state.filters.categories.includes(c) ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </label>
        <label>Dauer
          <select data-filter="duration_bucket">
            ${Object.keys(DURATION_BUCKETS).map((b) => `<option value="${b}" ${state.filters.duration_bucket === b ? "selected" : ""}>${b}</option>`).join("")}
          </select>
        </label>
        <label>Setting
          <select data-filter="setting">
            ${["any", "indoor", "outdoor"].map((value) => `<option value="${value}" ${state.filters.setting === value ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </label>
        <label>Group
          <select data-filter="group_mode">
            ${["any", "solo", "group"].map((value) => `<option value="${value}" ${state.filters.group_mode === value ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </label>
        <label>Adventure min
          <input type="number" min="1" max="5" value="${state.filters.adventure_level_min}" data-filter="adventure_level_min" />
        </label>
        <label>Tags
          <select multiple data-filter="tags">
            ${ctx.tags.map((tag) => `<option value="${esc(tag)}" ${state.filters.tags.includes(tag) ? "selected" : ""}>${esc(tag)}</option>`).join("")}
          </select>
        </label>
      </div>
      <label class="inline-toggle">
        <input type="checkbox" data-filter="include_done" ${state.filters.include_done ? "checked" : ""} />
        Done in Listen anzeigen
      </label>
      <ul class="suggestion-list">
        ${
          suggestions.length
            ? suggestions.map((q) => `<li>${esc(q.title)} ${badge(q.category)} ${ctx.doneSet.has(q.id) ? badge("done", "done") : ""}</li>`).join("")
            : "<li>Keine Vorschlaege mit den aktuellen Filtern.</li>"
        }
      </ul>
    </section>
  `;
}

function questCard(quest, ctx, showActions = false) {
  const dimDone = ctx.store.settings.show_done_as_grey && ctx.doneSet.has(quest.id);

  return `
    <article class="card quest ${dimDone ? "is-done" : ""}">
      <div class="section-title-row">
        <h3>${esc(quest.title)}</h3>
        <div>${badge(quest.source)} ${ctx.doneSet.has(quest.id) ? badge("done", "done") : ""}</div>
      </div>
      <p class="muted">${esc(quest.description || "Keine Beschreibung")}</p>
      <p>${badge(quest.category)} ${badge(`${quest.duration_min}-${quest.duration_max} min`)} ${badge(quest.setting)} ${badge(quest.group_mode)}</p>
      <p><strong>Tags:</strong> ${quest.tags.map((t) => badge(t)).join(" ")}</p>
      <ol>${quest.instructions.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
      ${
        showActions
          ? `<div class="actions">
               <button data-action="done" data-id="${quest.id}">Done</button>
               <button data-action="skip" data-id="${quest.id}">Skip</button>
               <button data-action="save" data-id="${quest.id}">Save</button>
               <button data-action="spin">Next Spin</button>
             </div>`
          : `<div class="actions">
               <button data-action="edit" data-id="${quest.id}">Edit</button>
               <button data-action="delete" data-id="${quest.id}">Delete</button>
             </div>`
      }
    </article>
  `;
}

function rouletteView(ctx) {
  const selected = ctx.mergedQuests.find((q) => q.id === state.rouletteSelectionId);
  return `
    ${filterPanel(ctx)}
    <section class="card hero">
      <h2>Roulette</h2>
      <p class="muted">Pool: <strong>${ctx.randomPool.length}</strong> passende Quests</p>
      <button class="primary" data-action="spin" ${state.rouletteSpinning ? "disabled" : ""}>Spin</button>
      <p class="ticker">${esc(state.rouletteTicker)}</p>
      ${
        ctx.randomPool.length === 0
          ? `<p class="empty">Keine Quest verfuegbar. Filter lockern oder Done im Random einschliessen.</p>`
          : selected
            ? questCard(selected, ctx, true)
            : `<p>Tippe auf <strong>Spin</strong>, um deine naechste Sidequest zu bekommen.</p>`
      }
    </section>
  `;
}

function allQuestsView(ctx) {
  const search = state.allSearch.trim().toLowerCase();
  const list = sortByDoneThenTitle(ctx.filteredQuests, ctx.doneSet).filter(
    (q) => !search || q.title.toLowerCase().includes(search) || q.tags.join(" ").toLowerCase().includes(search)
  );

  return `
    ${filterPanel(ctx)}
    <section class="card">
      <div class="section-title-row">
        <h2>All Quests</h2>
        <span class="counter">${list.length} Ergebnisse</span>
      </div>
      <input data-action="search" placeholder="Suche in Titel / Tags" value="${esc(state.allSearch)}" />
      <div class="stack">${list.map((q) => questCard(q, ctx, false)).join("") || '<p class="muted">Keine Quests gefunden.</p>'}</div>
    </section>
  `;
}

function questFormView(ctx, quest) {
  const title = quest ? "Quest bearbeiten" : "Neue Quest erstellen";
  return `
    <section class="card">
      <h2>${title}</h2>
      <form id="quest-form" class="form-grid">
        <input type="hidden" name="id" value="${esc(quest?.id || "")}" />
        <label>Title
          <input name="title" required minlength="3" maxlength="80" value="${esc(quest?.title || "")}" />
        </label>
        <label>Beschreibung
          <textarea name="description">${esc(quest?.description || "")}</textarea>
        </label>
        <label>Category
          <select name="category">${CATEGORY_OPTIONS.map((c) => `<option value="${c}" ${quest?.category === c ? "selected" : ""}>${c}</option>`).join("")}</select>
        </label>
        <label>Tags (comma)
          <input name="tags" value="${esc((quest?.tags || []).join(", "))}" />
        </label>
        <div class="split">
          <label>Duration min <input type="number" min="1" name="duration_min" value="${quest?.duration_min || 10}" /></label>
          <label>Duration max <input type="number" min="1" name="duration_max" value="${quest?.duration_max || 20}" /></label>
        </div>
        <div class="split">
          <label>Setting
            <select name="setting">${["indoor", "outdoor", "both"].map((x) => `<option value="${x}" ${quest?.setting === x ? "selected" : ""}>${x}</option>`).join("")}</select>
          </label>
          <label>Group
            <select name="group_mode">${["solo", "group", "both"].map((x) => `<option value="${x}" ${quest?.group_mode === x ? "selected" : ""}>${x}</option>`).join("")}</select>
          </label>
        </div>
        <label>Adventure Level
          <input type="number" min="1" max="5" name="adventure_level" value="${quest?.adventure_level || 2}" />
        </label>
        <label>Equipment (comma)
          <input name="equipment" value="${esc((quest?.equipment || []).join(", "))}" />
        </label>
        <div class="split">
          <label>Budget max CHF
            <input type="number" min="0" name="budget_max_chf" value="${quest?.constraints?.budget_max_chf ?? ""}" />
          </label>
          <label>Weather
            <select name="weather_required">${["none", "dry", "any"].map((x) => `<option value="${x}" ${quest?.constraints?.weather_required === x ? "selected" : ""}>${x}</option>`).join("")}</select>
          </label>
        </div>
        <label class="inline-toggle"><input type="checkbox" name="quiet_ok" ${quest?.constraints?.quiet_ok ? "checked" : ""} /> Quiet ok</label>
        <label>Instructions (eine Zeile = ein Schritt)
          <textarea name="instructions">${esc((quest?.instructions || [""]).join("\n"))}</textarea>
        </label>
        <button class="primary" type="submit">Speichern</button>
      </form>
    </section>
  `;
}

function historyView(ctx) {
  const rows = [...ctx.store.history]
    .filter((entry) => state.historyStatus === "all" || entry.status === state.historyStatus)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map((entry) => {
      const quest = ctx.mergedQuests.find((q) => q.id === entry.quest_id);
      return `<li><strong>${esc(quest?.title || entry.quest_id)}</strong> · ${entry.status} · ${new Date(entry.timestamp).toLocaleString()}</li>`;
    });

  return `
    <section class="card">
      <h2>History</h2>
      <select data-action="history-filter">
        ${["all", "done", "skipped"].map((s) => `<option value="${s}" ${state.historyStatus === s ? "selected" : ""}>${s}</option>`).join("")}
      </select>
      <ul class="simple-list">${rows.join("") || "<li>Noch keine Eintraege.</li>"}</ul>
    </section>
  `;
}

function savedView(ctx) {
  const rows = [...ctx.store.saved]
    .sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at))
    .map((entry) => {
      const quest = ctx.mergedQuests.find((q) => q.id === entry.quest_id);
      return `<li><strong>${esc(quest?.title || entry.quest_id)}</strong> · gespeichert am ${new Date(entry.saved_at).toLocaleDateString()}</li>`;
    });

  return `<section class="card"><h2>Saved</h2><ul class="simple-list">${rows.join("") || "<li>Keine gespeicherten Quests.</li>"}</ul></section>`;
}

function settingsView(ctx) {
  return `
    <section class="card">
      <h2>Settings</h2>
      <label class="inline-toggle"><input type="checkbox" data-action="toggle-setting" data-key="exclude_done_from_random" ${ctx.store.settings.exclude_done_from_random ? "checked" : ""}/> Done im Random ausschliessen</label>
      <label class="inline-toggle"><input type="checkbox" data-action="toggle-setting" data-key="show_done_as_grey" ${ctx.store.settings.show_done_as_grey ? "checked" : ""}/> Done als grau markieren</label>
      <button data-action="reset-storage">LocalStorage resetten</button>
    </section>
  `;
}

function render() {
  const root = document.querySelector("#app");
  const ctx = getCtx();
  const editQuest = state.editingQuestId ? ctx.mergedQuests.find((q) => q.id === state.editingQuestId) : null;

  let page = "";
  if (state.activeTab === "roulette") page = rouletteView(ctx);
  if (state.activeTab === "all") page = allQuestsView(ctx);
  if (state.activeTab === "create") page = questFormView(ctx, editQuest);
  if (state.activeTab === "history") page = historyView(ctx);
  if (state.activeTab === "saved") page = savedView(ctx);
  if (state.activeTab === "settings") page = settingsView(ctx);

  root.innerHTML = `${buildNav()}<main class="page">${page}</main>`;
  bindEvents(ctx);
}

function collectSelected(select) {
  return [...select.selectedOptions].map((o) => o.value);
}

function bindEvents(ctx) {
  document.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeTab = btn.dataset.tab;
      if (state.activeTab !== "create") state.editingQuestId = null;
      render();
    });
  });

  document.querySelectorAll("[data-filter]").forEach((control) => {
    control.addEventListener("change", () => {
      const key = control.dataset.filter;
      if (control.multiple) state.filters[key] = collectSelected(control);
      else if (control.type === "checkbox") state.filters[key] = control.checked;
      else if (control.type === "number") state.filters[key] = Number(control.value || 1);
      else state.filters[key] = control.value;
      render();
    });
  });

  const searchInput = document.querySelector("[data-action='search']");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.allSearch = searchInput.value;
      render();
    });
  }

  const historyFilter = document.querySelector("[data-action='history-filter']");
  if (historyFilter) {
    historyFilter.addEventListener("change", () => {
      state.historyStatus = historyFilter.value;
      render();
    });
  }

  document.querySelectorAll("[data-action='spin']").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!ctx.randomPool.length || state.rouletteSpinning) return;
      state.rouletteSpinning = true;

      await new Promise((resolve) => {
        let tick = 0;
        const timer = setInterval(() => {
          state.rouletteTicker = pickRandom(ctx.randomPool).title;
          render();
          tick += 1;
          if (tick > 18) {
            clearInterval(timer);
            resolve();
          }
        }, 80);
      });

      const chosen = pickRandom(ctx.randomPool);
      state.rouletteSelectionId = chosen.id;
      state.rouletteTicker = "";
      state.rouletteSpinning = false;
      render();
    });
  });

  document.querySelectorAll("[data-action='done'], [data-action='skip']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const status = btn.dataset.action === "skip" ? "skipped" : "done";
      const store = getStore();
      patchStore({
        history: [...store.history, { quest_id: btn.dataset.id, status, timestamp: nowIso() }],
      });
      render();
    });
  });

  document.querySelectorAll("[data-action='save']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const store = getStore();
      const already = store.saved.some((entry) => entry.quest_id === btn.dataset.id);
      if (already) return;
      patchStore({
        saved: [...store.saved, { quest_id: btn.dataset.id, saved_at: nowIso() }],
      });
      render();
    });
  });

  document.querySelectorAll("[data-action='edit']").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.editingQuestId = btn.dataset.id;
      state.activeTab = "create";
      render();
    });
  });

  document.querySelectorAll("[data-action='delete']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const store = getStore();
      if (store.deleted.includes(btn.dataset.id)) return;
      patchStore({ deleted: [...store.deleted, btn.dataset.id] });
      if (state.rouletteSelectionId === btn.dataset.id) state.rouletteSelectionId = null;
      render();
    });
  });

  document.querySelectorAll("[data-action='toggle-setting']").forEach((input) => {
    input.addEventListener("change", () => {
      const store = getStore();
      patchStore({ settings: { ...store.settings, [input.dataset.key]: input.checked } });
      render();
    });
  });

  const resetBtn = document.querySelector("[data-action='reset-storage']");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!window.confirm("Wirklich alles lokal zuruecksetzen?")) return;
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      state.filters = defaultFilters();
      state.editingQuestId = null;
      state.rouletteSelectionId = null;
      render();
    });
  }

  const form = document.querySelector("#quest-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fd = new FormData(form);
      const id = String(fd.get("id") || `custom-${crypto.randomUUID()}`);
      const payload = {
        id,
        title: String(fd.get("title") || "").trim(),
        description: String(fd.get("description") || "").trim(),
        category: String(fd.get("category") || "outdoor"),
        tags: parseCommaList(fd.get("tags")),
        duration_min: Number(fd.get("duration_min")),
        duration_max: Number(fd.get("duration_max")),
        setting: String(fd.get("setting") || "both"),
        group_mode: String(fd.get("group_mode") || "both"),
        adventure_level: Number(fd.get("adventure_level")),
        equipment: parseCommaList(fd.get("equipment")),
        constraints: {
          budget_max_chf: fd.get("budget_max_chf") ? Number(fd.get("budget_max_chf")) : undefined,
          quiet_ok: fd.get("quiet_ok") === "on",
          weather_required: String(fd.get("weather_required") || "none"),
        },
        instructions: String(fd.get("instructions") || "")
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean),
      };

      if (payload.title.length < 3 || payload.title.length > 80) return window.alert("Title muss 3 bis 80 Zeichen haben.");
      if (payload.duration_min > payload.duration_max) return window.alert("duration_min muss <= duration_max sein.");
      if (payload.instructions.length < 1) return window.alert("Bitte mindestens 1 Instruction angeben.");

      const store = getStore();
      const baseExists = state.baseQuests.some((q) => q.id === id);
      const customExists = store.custom.some((q) => q.id === id);

      if (!baseExists && !customExists) {
        patchStore({
          custom: [...store.custom, { ...payload, source: "custom", created_at: nowIso() }],
        });
      } else {
        patchStore({
          edits: {
            ...store.edits,
            [id]: {
              ...(store.edits[id] || {}),
              ...payload,
              updated_at: nowIso(),
            },
          },
        });
      }

      state.activeTab = "all";
      state.editingQuestId = null;
      render();
    });
  }
}

async function init() {
  try {
    const response = await fetch("./baseQuests.json");
    state.baseQuests = response.ok ? await response.json() : [];
  } catch {
    state.baseQuests = [];
  }
  render();
}

init();
