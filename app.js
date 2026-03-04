const STORAGE_KEYS = {
  custom: "quests_custom",
  edits: "quests_edits",
  deleted: "quests_deleted",
  history: "quest_history",
  saved: "quest_saved",
  settings: "settings",
};

const defaultSettings = {
  exclude_done_from_random: true,
  show_done_as_grey: true,
};

const durationBuckets = {
  any: null,
  "5-10": [5, 10],
  "10-20": [10, 20],
  "20-45": [20, 45],
  "45-90": [45, 90],
  "90+": [90, Infinity],
};

const state = {
  baseQuests: [],
  activeTab: "roulette",
  editingQuestId: null,
  rouletteSelectionId: null,
  rouletteSpinning: false,
  rouletteRotation: 0,
  filters: defaultFilters(true),
  allQuestsSearch: "",
  historyStatus: "all",
};

function defaultFilters(includeDoneDefault = true) {
  return {
    categories: [],
    duration_bucket: "any",
    setting: "any",
    group_mode: "any",
    adventure_level_min: 1,
    tags: [],
    include_done: includeDoneDefault,
  };
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function getStore() {
  return {
    custom: loadJSON(STORAGE_KEYS.custom, []),
    edits: loadJSON(STORAGE_KEYS.edits, {}),
    deleted: loadJSON(STORAGE_KEYS.deleted, []),
    history: loadJSON(STORAGE_KEYS.history, []),
    saved: loadJSON(STORAGE_KEYS.saved, []),
    settings: { ...defaultSettings, ...loadJSON(STORAGE_KEYS.settings, {}) },
  };
}

function setStorePatch(patch) {
  Object.entries(patch).forEach(([k, v]) => saveJSON(STORAGE_KEYS[k], v));
}

function questDoneIds(history) {
  return new Set(history.filter((h) => h.status === "done").map((h) => h.quest_id));
}

function mergeQuests(baseQuests, store) {
  const all = [...baseQuests, ...store.custom];
  const deleted = new Set(store.deleted);
  return all
    .filter((q) => !deleted.has(q.id))
    .map((q) => {
      const patch = store.edits[q.id] || {};
      return { ...q, ...patch };
    });
}

function overlapsBucket(q, bucket) {
  if (!durationBuckets[bucket]) return true;
  const [min, max] = durationBuckets[bucket];
  return q.duration_min <= max && q.duration_max >= min;
}

function applyFilters(quests, filters, doneSet) {
  return quests.filter((q) => {
    if (filters.categories.length && !filters.categories.includes(q.category)) return false;
    if (!overlapsBucket(q, filters.duration_bucket)) return false;
    if (filters.setting !== "any" && q.setting !== "both" && q.setting !== filters.setting) return false;
    if (filters.group_mode !== "any" && q.group_mode !== "both" && q.group_mode !== filters.group_mode) return false;
    if (q.adventure_level < filters.adventure_level_min) return false;
    if (filters.tags.length && !filters.tags.every((tag) => q.tags.includes(tag))) return false;
    if (!filters.include_done && doneSet.has(q.id)) return false;
    return true;
  });
}

function sortedSuggestions(filtered, doneSet) {
  return [...filtered].sort((a, b) => {
    const doneDiff = Number(doneSet.has(a.id)) - Number(doneSet.has(b.id));
    if (doneDiff !== 0) return doneDiff;
    return a.title.localeCompare(b.title, "de");
  });
}

function esc(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function uniqueTags(quests) {
  return [...new Set(quests.flatMap((q) => q.tags))].sort((a, b) => a.localeCompare(b, "de"));
}

function badge(text, type = "") {
  return `<span class="badge ${type}">${esc(text)}</span>`;
}

function layout(content) {
  const tabs = ["roulette", "all", "create", "history", "saved", "settings"];
  const labels = {
    roulette: "Picker",
    all: "Alle",
    create: "Neu",
    history: "Verlauf",
    saved: "Saved",
    settings: "Settings",
  };
  return `
    <header>
      <p class="eyebrow">Fresh mobile adventure app</p>
      <h1>Sidequest Picker</h1>
      <nav>
        ${tabs
          .map(
            (t) =>
              `<button data-tab="${t}" class="tab ${state.activeTab === t ? "active" : ""}">${labels[t]}</button>`
          )
          .join("")}
      </nav>
    </header>
    <main>${content}</main>
  `;
}

function filterPanel(allTags, mergedQuests, doneSet) {
  const filtered = applyFilters(mergedQuests, state.filters, doneSet);
  return `
    <section class="panel">
      <h3>Filter</h3>
      <div class="grid">
        <label>Kategorien
          <select multiple data-filter="categories">
            ${["outdoor", "creativity", "social", "mindset", "fitness", "food", "travel"]
              .map((c) => `<option ${state.filters.categories.includes(c) ? "selected" : ""} value="${c}">${c}</option>`)
              .join("")}
          </select>
        </label>
        <label>Dauer
          <select data-filter="duration_bucket">
            ${Object.keys(durationBuckets)
              .map((d) => `<option ${state.filters.duration_bucket === d ? "selected" : ""} value="${d}">${d}</option>`)
              .join("")}
          </select>
        </label>
        <label>Setting
          <select data-filter="setting">
            ${["any", "indoor", "outdoor"].map((s) => `<option ${state.filters.setting === s ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </label>
        <label>Group
          <select data-filter="group_mode">
            ${["any", "solo", "group"].map((s) => `<option ${state.filters.group_mode === s ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </label>
        <label>Adventure >=
          <input data-filter="adventure_level_min" type="number" min="1" max="5" value="${state.filters.adventure_level_min}" />
        </label>
        <label>Tags
          <select multiple data-filter="tags">
            ${allTags.map((tag) => `<option ${state.filters.tags.includes(tag) ? "selected" : ""}>${esc(tag)}</option>`).join("")}
          </select>
        </label>
        <label class="inline">Include done
          <input data-filter="include_done" type="checkbox" ${state.filters.include_done ? "checked" : ""} />
        </label>
      </div>
      <p><strong>Treffer:</strong> ${filtered.length}</p>
    </section>`;
}

function questCard(q, doneSet) {
  if (!q) return `<p>Spin das Roulette, um eine Sidequest zu picken.</p>`;
  return `
    <article class="quest-card ${doneSet.has(q.id) ? "done-row" : ""}">
      <h3>${esc(q.title)}</h3>
      <p>${esc(q.description || "")}</p>
      <p>${badge(q.category)} ${badge(`${q.duration_min}-${q.duration_max} min`)} ${badge(q.setting)} ${badge(q.group_mode)}</p>
      <p>Tags: ${q.tags.map((t) => badge(t)).join(" ")}</p>
      <ol>${q.instructions.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>
      <div class="actions">
        <button data-action="done" data-id="${q.id}">Done</button>
        <button data-action="skip" data-id="${q.id}">Skip</button>
        <button data-action="save" data-id="${q.id}">Save</button>
        <button data-action="spin">Nochmal drehen</button>
      </div>
    </article>
  `;
}

function wheelGradient(length) {
  if (!length) return "";
  const colors = ["#72f4b0", "#8ec5ff", "#bda6ff", "#7de8ff", "#6ff7d2", "#9ac1ff"];
  const slices = Array.from({ length }, (_, i) => {
    const start = (i * 360) / length;
    const end = ((i + 1) * 360) / length;
    return `${colors[i % colors.length]} ${start}deg ${end}deg`;
  });
  return `conic-gradient(from -90deg, ${slices.join(",")})`;
}

function wheelMarkup(pool) {
  if (!pool.length) return `<p class="empty">Pool leer. Filter lockern oder Done einschliessen.</p>`;
  const labelItems = pool
    .map(
      (q, i) => `<span class="wheel-label" style="--i:${i};--count:${pool.length};" title="${esc(q.title)}">${i + 1}</span>`
    )
    .join("");

  return `
    <div class="wheel-wrap">
      <div class="pointer"></div>
      <div class="wheel" style="background:${wheelGradient(pool.length)}; transform: rotate(${state.rouletteRotation}deg)">
        ${labelItems}
      </div>
    </div>
    <p class="muted">Segmente: ${pool.length} (je Segment = 1 Sidequest)</p>
  `;
}

function rouletteView(ctx) {
  const randomPool = ctx.filteredQuests.filter((q) => !ctx.store.settings.exclude_done_from_random || !ctx.doneSet.has(q.id));
  const selected = ctx.mergedQuests.find((q) => q.id === state.rouletteSelectionId);
  return layout(`
    ${filterPanel(ctx.tags, ctx.mergedQuests, ctx.doneSet)}
    <section class="panel">
      <h2>Sidequest Roulette Picker</h2>
      <button data-action="spin" ${state.rouletteSpinning ? "disabled" : ""}>${state.rouletteSpinning ? "Spinning..." : "Spin"}</button>
      ${wheelMarkup(randomPool)}
      ${questCard(selected, ctx.doneSet)}
    </section>
  `);
}

function questRow(q, doneSet) {
  return `<tr class="${doneSet.has(q.id) ? "done-row" : ""}">
    <td>${esc(q.title)}</td>
    <td>${esc(q.category)}</td>
    <td>${esc(q.tags.join(", "))}</td>
    <td>${q.duration_min}-${q.duration_max}</td>
    <td>${doneSet.has(q.id) ? "done" : "open"}</td>
    <td>${q.source}</td>
    <td>
      <button data-action="edit" data-id="${q.id}">Edit</button>
      <button data-action="delete" data-id="${q.id}">Delete</button>
    </td>
  </tr>`;
}

function allQuestsView(ctx) {
  const search = state.allQuestsSearch.toLowerCase();
  const results = sortedSuggestions(ctx.filteredQuests, ctx.doneSet).filter(
    (q) => !search || q.title.toLowerCase().includes(search) || q.tags.join(" ").toLowerCase().includes(search)
  );
  return layout(`
    ${filterPanel(ctx.tags, ctx.mergedQuests, ctx.doneSet)}
    <section class="panel">
      <h2>Alle Sidequests</h2>
      <input data-action="search-all" placeholder="Search title/tags" value="${esc(state.allQuestsSearch)}" />
      <table>
        <thead><tr><th>Title</th><th>Category</th><th>Tags</th><th>Dauer</th><th>Status</th><th>Source</th><th>Actions</th></tr></thead>
        <tbody>${results.map((q) => questRow(q, ctx.doneSet)).join("")}</tbody>
      </table>
    </section>
  `);
}

function questFormView(ctx, quest) {
  const isEdit = Boolean(quest);
  return layout(`
    <section class="panel">
      <h2>${isEdit ? "Edit Quest" : "Create Quest"}</h2>
      <form id="quest-form">
        <input type="hidden" name="id" value="${esc(quest?.id || "")}" />
        <label>Title <input required minlength="3" maxlength="80" name="title" value="${esc(quest?.title || "")}" /></label>
        <label>Description <textarea name="description">${esc(quest?.description || "")}</textarea></label>
        <label>Category
          <select name="category">${["outdoor", "creativity", "social", "mindset", "fitness", "food", "travel"].map((c) => `<option ${quest?.category === c ? "selected" : ""}>${c}</option>`).join("")}</select>
        </label>
        <label>Tags (comma) <input name="tags" value="${esc((quest?.tags || []).join(","))}" /></label>
        <label>Duration min <input type="number" name="duration_min" min="1" value="${quest?.duration_min || 10}" /></label>
        <label>Duration max <input type="number" name="duration_max" min="1" value="${quest?.duration_max || 20}" /></label>
        <label>Setting <select name="setting">${["indoor", "outdoor", "both"].map((c) => `<option ${quest?.setting === c ? "selected" : ""}>${c}</option>`).join("")}</select></label>
        <label>Group mode <select name="group_mode">${["solo", "group", "both"].map((c) => `<option ${quest?.group_mode === c ? "selected" : ""}>${c}</option>`).join("")}</select></label>
        <label>Adventure level <input type="number" min="1" max="5" name="adventure_level" value="${quest?.adventure_level || 1}" /></label>
        <label>Equipment (comma) <input name="equipment" value="${esc((quest?.equipment || []).join(","))}" /></label>
        <label>Budget max CHF <input type="number" step="1" min="0" name="budget_max_chf" value="${quest?.constraints?.budget_max_chf ?? ""}" /></label>
        <label>Quiet OK <input type="checkbox" name="quiet_ok" ${quest?.constraints?.quiet_ok ? "checked" : ""} /></label>
        <label>Weather required <select name="weather_required">${["none", "dry", "any"].map((c) => `<option ${quest?.constraints?.weather_required === c ? "selected" : ""}>${c}</option>`).join("")}</select></label>
        <label>Instructions (one per line)<textarea name="instructions">${esc((quest?.instructions || [""]).join("\n"))}</textarea></label>
        <button type="submit">Save Quest</button>
      </form>
    </section>
  `);
}

function historyView(ctx) {
  const rows = [...ctx.store.history]
    .filter((h) => state.historyStatus === "all" || h.status === state.historyStatus)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map((h) => {
      const q = ctx.mergedQuests.find((x) => x.id === h.quest_id);
      return `<tr><td>${esc(q?.title || h.quest_id)}</td><td>${h.status}</td><td>${new Date(h.timestamp).toLocaleString()}</td></tr>`;
    })
    .join("");
  return layout(`
    <section class="panel">
      <h2>History</h2>
      <select data-action="history-filter">
        ${["all", "done", "skip"].map((s) => `<option ${state.historyStatus === s ? "selected" : ""}>${s}</option>`).join("")}
      </select>
      <table><thead><tr><th>Quest</th><th>Status</th><th>Date</th></tr></thead><tbody>${rows}</tbody></table>
    </section>
  `);
}

function savedView(ctx) {
  const items = [...ctx.store.saved]
    .sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at))
    .map((s) => {
      const q = ctx.mergedQuests.find((x) => x.id === s.quest_id);
      return `<li>${esc(q?.title || s.quest_id)} (${new Date(s.saved_at).toLocaleDateString()})</li>`;
    })
    .join("");
  return layout(`<section class="panel"><h2>Saved</h2><ul>${items || "<li>Keine gespeicherten Quests.</li>"}</ul></section>`);
}

function settingsView(ctx) {
  return layout(`
    <section class="panel">
      <h2>Settings</h2>
      <label><input type="checkbox" data-action="toggle-setting" data-key="exclude_done_from_random" ${
        ctx.store.settings.exclude_done_from_random ? "checked" : ""
      } /> exclude_done_from_random</label>
      <label><input type="checkbox" data-action="toggle-setting" data-key="show_done_as_grey" ${
        ctx.store.settings.show_done_as_grey ? "checked" : ""
      } /> show_done_as_grey</label>
      <button data-action="reset-storage">Reset localStorage</button>
    </section>
  `);
}

function deriveContext() {
  const store = getStore();
  const mergedQuests = mergeQuests(state.baseQuests, store);
  const doneSet = questDoneIds(store.history);
  const filteredQuests = applyFilters(mergedQuests, state.filters, doneSet);
  const tags = uniqueTags(mergedQuests);
  return { store, mergedQuests, doneSet, filteredQuests, tags };
}

function render() {
  const app = document.querySelector("#app");
  const ctx = deriveContext();
  let view = "";
  if (state.activeTab === "roulette") view = rouletteView(ctx);
  if (state.activeTab === "all") view = allQuestsView(ctx);
  if (state.activeTab === "create") view = questFormView(ctx, state.editingQuestId ? ctx.mergedQuests.find((q) => q.id === state.editingQuestId) : null);
  if (state.activeTab === "history") view = historyView(ctx);
  if (state.activeTab === "saved") view = savedView(ctx);
  if (state.activeTab === "settings") view = settingsView(ctx);

  app.innerHTML = view;
  attachEvents(ctx);
}

function collectSelectValues(selectEl) {
  return [...selectEl.selectedOptions].map((o) => o.value);
}

function parseList(value) {
  return value
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function upsertEdit(id, payload) {
  const store = getStore();
  const edits = { ...store.edits, [id]: { ...(store.edits[id] || {}), ...payload, updated_at: nowIso() } };
  setStorePatch({ edits });
}

function pickWinnerFromRotation(pool, rotation) {
  const segmentAngle = 360 / pool.length;
  const normalized = ((360 - (rotation % 360)) + 360) % 360;
  const winnerIndex = Math.floor(normalized / segmentAngle) % pool.length;
  return pool[winnerIndex];
}

function attachEvents(ctx) {
  document.querySelectorAll("[data-tab]").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.activeTab = btn.dataset.tab;
      if (state.activeTab !== "create") state.editingQuestId = null;
      render();
    })
  );

  document.querySelectorAll("[data-filter]").forEach((el) =>
    el.addEventListener("change", () => {
      const key = el.dataset.filter;
      if (el.tagName === "SELECT" && el.multiple) state.filters[key] = collectSelectValues(el);
      else if (el.type === "checkbox") state.filters[key] = el.checked;
      else if (el.type === "number") state.filters[key] = Number(el.value);
      else state.filters[key] = el.value;
      render();
    })
  );

  document.querySelectorAll("[data-action='search-all']").forEach((el) =>
    el.addEventListener("input", () => {
      state.allQuestsSearch = el.value;
      render();
    })
  );

  document.querySelectorAll("[data-action='history-filter']").forEach((el) =>
    el.addEventListener("change", () => {
      state.historyStatus = el.value;
      render();
    })
  );

  document.querySelectorAll("[data-action='spin']").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const pool = ctx.filteredQuests.filter((q) => !ctx.store.settings.exclude_done_from_random || !ctx.doneSet.has(q.id));
      if (!pool.length || state.rouletteSpinning) return;

      state.rouletteSpinning = true;
      state.rouletteRotation += 2160 + Math.random() * 360;
      render();

      const finishSpin = () => {
        if (!state.rouletteSpinning) return;
        const winner = pickWinnerFromRotation(pool, state.rouletteRotation);
        state.rouletteSelectionId = winner?.id || null;
        state.rouletteSpinning = false;
        render();
      };

      const wheelEl = document.querySelector(".wheel");
      wheelEl?.addEventListener("transitionend", finishSpin, { once: true });
      setTimeout(finishSpin, 4300);
    })
  );

  document.querySelectorAll("[data-action='done'], [data-action='skip']").forEach((btn) =>
    btn.addEventListener("click", () => {
      const store = getStore();
      const history = [...store.history, { quest_id: btn.dataset.id, status: btn.dataset.action, timestamp: nowIso() }];
      setStorePatch({ history });
      render();
    })
  );

  document.querySelectorAll("[data-action='save']").forEach((btn) =>
    btn.addEventListener("click", () => {
      const store = getStore();
      const saved = [...store.saved, { quest_id: btn.dataset.id, saved_at: nowIso() }];
      setStorePatch({ saved });
      render();
    })
  );

  document.querySelectorAll("[data-action='edit']").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.editingQuestId = btn.dataset.id;
      state.activeTab = "create";
      render();
    })
  );

  document.querySelectorAll("[data-action='delete']").forEach((btn) =>
    btn.addEventListener("click", () => {
      const store = getStore();
      if (store.deleted.includes(btn.dataset.id)) return;
      setStorePatch({ deleted: [...store.deleted, btn.dataset.id] });
      if (state.rouletteSelectionId === btn.dataset.id) state.rouletteSelectionId = null;
      render();
    })
  );

  document.querySelectorAll("[data-action='toggle-setting']").forEach((checkbox) =>
    checkbox.addEventListener("change", () => {
      const store = getStore();
      setStorePatch({ settings: { ...store.settings, [checkbox.dataset.key]: checkbox.checked } });
      render();
    })
  );

  document.querySelectorAll("[data-action='reset-storage']").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (!window.confirm("Wirklich localStorage resetten?")) return;
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      state.filters = defaultFilters(true);
      state.rouletteSelectionId = null;
      state.rouletteRotation = 0;
      render();
    })
  );

  const form = document.querySelector("#quest-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const id = fd.get("id") || `custom-${crypto.randomUUID()}`;
      const payload = {
        id,
        title: String(fd.get("title") || "").trim(),
        description: String(fd.get("description") || "").trim(),
        category: fd.get("category"),
        tags: parseList(String(fd.get("tags") || "")),
        duration_min: Number(fd.get("duration_min")),
        duration_max: Number(fd.get("duration_max")),
        setting: fd.get("setting"),
        group_mode: fd.get("group_mode"),
        adventure_level: Number(fd.get("adventure_level")),
        equipment: parseList(String(fd.get("equipment") || "")),
        constraints: {
          budget_max_chf: fd.get("budget_max_chf") ? Number(fd.get("budget_max_chf")) : undefined,
          quiet_ok: fd.get("quiet_ok") === "on",
          weather_required: fd.get("weather_required") || "none",
        },
        instructions: String(fd.get("instructions") || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (payload.title.length < 3 || payload.title.length > 80) return alert("Title muss 3..80 Zeichen haben.");
      if (payload.duration_min > payload.duration_max) return alert("duration_min muss <= duration_max sein.");
      if (payload.instructions.length < 1) return alert("Mindestens eine Instruction erforderlich.");

      const store = getStore();
      const existsInBase = state.baseQuests.some((q) => q.id === id);
      const existsInCustom = store.custom.some((q) => q.id === id);

      if (!existsInBase && !existsInCustom) {
        const newQuest = {
          ...payload,
          created_at: nowIso(),
          source: "custom",
        };
        setStorePatch({ custom: [...store.custom, newQuest] });
      } else {
        upsertEdit(id, payload);
      }

      state.activeTab = "all";
      state.editingQuestId = null;
      render();
    });
  }
}

async function init() {
  try {
    const res = await fetch("./baseQuests.json");
    state.baseQuests = res.ok ? await res.json() : [];
  } catch {
    state.baseQuests = [];
  }
  render();
}

init();
