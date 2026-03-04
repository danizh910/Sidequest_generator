/* ════════════════════════════════════════════════
   SIDEQUEST PICKER  —  app.js
   Requires: jQuery + roulette.js (loaded in index.html)
════════════════════════════════════════════════ */

/* ─── BASE DATA ─── */
const BASE_QUESTS = [
  { id:"base-1",  title:"Take a train to a random city and figure it out when you get there", category:"travel",     tags:["spontaneous","city","explore"],       duration_min:240, duration_max:720,  setting:"outdoor", group_mode:"solo",  adventure_level:5, equipment:["phone","ticket"],            constraints:{budget_max_chf:180, weather_required:"any"},  instructions:["Pick the next available train to a city you do not know well.","When you arrive, choose one place to explore and one local meal.","Document three moments that surprised you."], source:"base" },
  { id:"base-2",  title:"Sleep under the stars somewhere you've never been",                   category:"outdoor",    tags:["night","nature","brave"],             duration_min:360, duration_max:720,  setting:"outdoor", group_mode:"both",  adventure_level:4, equipment:["sleeping bag"],             constraints:{budget_max_chf:80,  weather_required:"dry"},  instructions:["Find a legal and safe outdoor spot.","Pack only essentials for one night.","Watch the sky for 15 minutes without your phone."], source:"base" },
  { id:"base-3",  title:"Visit a town with a population under 500",                           category:"travel",     tags:["roadtrip","smalltown","curious"],     duration_min:180, duration_max:480,  setting:"outdoor", group_mode:"both",  adventure_level:3, equipment:["phone"],                    constraints:{budget_max_chf:50,  weather_required:"any"},  instructions:["Pick a tiny town nearby.","Talk to one local person.","Write down what felt different from your city."], source:"base" },
  { id:"base-4",  title:"Eat alone at a fancy restaurant and enjoy every second of it",       category:"food",       tags:["comfortzone","confidence","food"],    duration_min:90,  duration_max:180,  setting:"indoor",  group_mode:"solo",  adventure_level:3, equipment:["wallet"],                   constraints:{budget_max_chf:120, weather_required:"none"}, instructions:["Book a table for one.","Order slowly and stay present.","End the night by writing one thing you learned about yourself."], source:"base" },
  { id:"base-5",  title:"Get on a flight with only a carry-on and no hotel booked",           category:"travel",     tags:["risk","spontaneous","minimal"],       duration_min:720, duration_max:2880, setting:"both",    group_mode:"solo",  adventure_level:5, equipment:["passport","carry-on"],      constraints:{budget_max_chf:600, weather_required:"any"},  instructions:["Choose a destination with easy arrival options.","Plan only first-night safety basics.","Let day one be guided by local recommendations."], source:"base" },
  { id:"base-6",  title:"Find the highest point in your city and watch the sunset from there",category:"outdoor",    tags:["sunset","city","reflection"],         duration_min:60,  duration_max:150,  setting:"outdoor", group_mode:"both",  adventure_level:2, equipment:["comfortable shoes"],        constraints:{budget_max_chf:0,   weather_required:"dry"},  instructions:["Locate the highest accessible point.","Arrive 20 minutes before sunset.","Watch in silence until the last light fades."], source:"base" },
  { id:"base-7",  title:"Walk into a museum you've never noticed before",                     category:"creativity", tags:["culture","museum","curious"],         duration_min:60,  duration_max:180,  setting:"indoor",  group_mode:"both",  adventure_level:2, equipment:["ticket"],                   constraints:{budget_max_chf:25,  weather_required:"none"}, instructions:["Choose a museum you have ignored.","Spend at least 30 minutes on one floor.","Take one note about a piece that stayed with you."], source:"base" },
  { id:"base-8",  title:"Spend a full day in a neighborhood you always drive past",           category:"travel",     tags:["local","deepdive","urban"],           duration_min:300, duration_max:720,  setting:"both",    group_mode:"both",  adventure_level:3, equipment:["phone"],                    constraints:{budget_max_chf:40,  weather_required:"any"},  instructions:["Pick one neighborhood and stay there all day.","Try one café, one walk, and one random shop.","Leave with a mini-guide for a friend."], source:"base" },
  { id:"base-9",  title:"Strike up a real conversation with a stranger at a café",            category:"social",     tags:["social","listening","human"],         duration_min:15,  duration_max:45,   setting:"both",    group_mode:"solo",  adventure_level:3, equipment:["none"],                     constraints:{budget_max_chf:10,  weather_required:"none"}, instructions:["Start with a simple warm question.","Listen more than you speak.","Thank them for the conversation."], source:"base" },
  { id:"base-10", title:"Write a letter to someone who changed your life and send it",        category:"social",     tags:["gratitude","letter","connection"],    duration_min:20,  duration_max:60,   setting:"indoor",  group_mode:"solo",  adventure_level:2, equipment:["paper","envelope"],         constraints:{budget_max_chf:5,   weather_required:"none"}, instructions:["Write honestly and specifically.","Do not over-edit.","Send it the same day."], source:"base" },
  { id:"base-11", title:"Attend an event where you know absolutely no one",                   category:"social",     tags:["network","courage","event"],         duration_min:90,  duration_max:240,  setting:"both",    group_mode:"solo",  adventure_level:4, equipment:["phone"],                    constraints:{budget_max_chf:35,  weather_required:"any"},  instructions:["Find an open event in your city.","Introduce yourself to at least two people.","Stay for one full hour minimum."], source:"base" },
  { id:"base-12", title:"Compliment five strangers in one day and mean every word",           category:"social",     tags:["kindness","confidence","social"],     duration_min:30,  duration_max:180,  setting:"both",    group_mode:"solo",  adventure_level:3, equipment:["none"],                     constraints:{budget_max_chf:0,   weather_required:"none"}, instructions:["Give specific and respectful compliments.","Focus on sincerity, not speed.","Reflect on how people reacted."], source:"base" },
  { id:"base-13", title:"Call an old friend you haven't spoken to in years",                  category:"social",     tags:["friendship","reconnect","phone"],     duration_min:20,  duration_max:50,   setting:"indoor",  group_mode:"solo",  adventure_level:2, equipment:["phone"],                    constraints:{budget_max_chf:0,   weather_required:"none"}, instructions:["Pick one person and call, not text.","Ask about their life and listen deeply.","End with one honest memory you still value."], source:"base" },
  { id:"base-14", title:"Cook a full meal for someone who needs it right now",                category:"social",     tags:["care","food","service"],              duration_min:60,  duration_max:150,  setting:"indoor",  group_mode:"both",  adventure_level:3, equipment:["kitchen"],                  constraints:{budget_max_chf:30,  weather_required:"none"}, instructions:["Choose someone who would genuinely benefit.","Cook a balanced simple meal.","Deliver it with a short, kind note."], source:"base" },
  { id:"base-15", title:"Ask an elderly person about their biggest regret",                   category:"social",     tags:["wisdom","listening","presence"],      duration_min:30,  duration_max:90,   setting:"both",    group_mode:"solo",  adventure_level:3, equipment:["none"],                     constraints:{budget_max_chf:0,   weather_required:"none"}, instructions:["Ask with empathy and respect.","Keep your phone away completely.","Write down one lesson afterwards."], source:"base" },
  { id:"base-16", title:"Start a journal and write only in third person",                     category:"mindset",    tags:["journal","mindset","reflection"],     duration_min:15,  duration_max:30,   setting:"indoor",  group_mode:"solo",  adventure_level:2, equipment:["notebook"],                 constraints:{budget_max_chf:0,   weather_required:"none"}, instructions:["Describe your day as if you are observing yourself.","Keep it short but specific.","Repeat for three consecutive days."], source:"base" },
  { id:"base-17", title:"Take 30 photos in one hour with no filter and no retakes",           category:"creativity", tags:["photo","creative","challenge"],       duration_min:60,  duration_max:90,   setting:"both",    group_mode:"solo",  adventure_level:3, equipment:["phone"],                    constraints:{budget_max_chf:0,   weather_required:"any"},  instructions:["Set a one-hour timer.","Shoot 30 unique frames only once each.","Pick your top three and explain why."], source:"base" },
  { id:"base-18", title:"Write a short story about your life set 200 years ago",              category:"creativity", tags:["story","imagination","writing"],      duration_min:45,  duration_max:120,  setting:"indoor",  group_mode:"solo",  adventure_level:4, equipment:["notebook","laptop"],         constraints:{budget_max_chf:0,   weather_required:"none"}, instructions:["Pick one real event from your life.","Translate it into a different historical setting.","Finish with one fictional twist."], source:"base" },
  { id:"base-19", title:"Paint or draw something terrible and hang it on your wall anyway",   category:"creativity", tags:["art","imperfection","courage"],       duration_min:30,  duration_max:90,   setting:"indoor",  group_mode:"solo",  adventure_level:2, equipment:["paper","colors"],            constraints:{budget_max_chf:10,  weather_required:"none"}, instructions:["Create quickly without judging.","Sign and date it.","Hang it where you can see it for a week."], source:"base" },
  { id:"base-20", title:"Record yourself talking for 10 minutes and play it back",            category:"mindset",    tags:["selfawareness","voice","growth"],     duration_min:15,  duration_max:25,   setting:"indoor",  group_mode:"solo",  adventure_level:3, equipment:["phone"],                    constraints:{budget_max_chf:0,   weather_required:"none"}, instructions:["Set a 10-minute recording.","Speak freely without stopping.","Replay once and note one improvement."], source:"base" },
  { id:"base-21", title:"Rearrange your entire living space in one afternoon",                 category:"mindset",    tags:["home","reset","energy"],              duration_min:120, duration_max:240,  setting:"indoor",  group_mode:"both",  adventure_level:3, equipment:["none"],                     constraints:{budget_max_chf:0,   weather_required:"none"}, instructions:["Choose a start and end time.","Move major pieces first.","Finish by removing at least five unnecessary items."], source:"base" },
  { id:"base-22", title:"Make a playlist for a version of yourself that doesn't exist yet",   category:"creativity", tags:["music","future-self","vision"],       duration_min:25,  duration_max:60,   setting:"indoor",  group_mode:"solo",  adventure_level:2, equipment:["music app"],                constraints:{budget_max_chf:0,   weather_required:"none"}, instructions:["Define the future version in one sentence.","Select 12 songs that match that identity.","Listen once and write down the feeling."], source:"base" },
];

/* ─── STORAGE ─── */
const SK = { custom:"sq_custom", edits:"sq_edits", deleted:"sq_deleted", history:"sq_history", saved:"sq_saved", settings:"sq_settings" };
const DEF_SETTINGS = { exclude_done_from_random: true, show_done_as_grey: true };
const DURATIONS     = { any:null, "5-10":[5,10], "10-20":[10,20], "20-45":[20,45], "45-90":[45,90], "90+":[90,Infinity] };
const CATS          = ["outdoor","creativity","social","mindset","fitness","food","travel"];
const CAT_ICONS     = { outdoor:"🌲", creativity:"🎨", social:"🤝", mindset:"🧠", fitness:"⚡", food:"🍽", travel:"✈️" };

const lj  = (k, fb) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } };
const sj  = (k, v)  => localStorage.setItem(k, JSON.stringify(v));
const iso = ()      => new Date().toISOString();
const esc = (s='')  => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const parseList = v  => v.split(',').map(x => x.trim()).filter(Boolean);
const getStore  = () => ({
  custom:   lj(SK.custom,   []),
  edits:    lj(SK.edits,    {}),
  deleted:  lj(SK.deleted,  []),
  history:  lj(SK.history,  []),
  saved:    lj(SK.saved,    []),
  settings: { ...DEF_SETTINGS, ...lj(SK.settings, {}) },
});
const patchStore = p => Object.entries(p).forEach(([k,v]) => sj(SK[k], v));

/* ─── STATE ─── */
const S = {
  tab: 'roulette',
  editId: null,
  winId: null,
  spinning: false,
  filters: { cats:[], dur:'any', setting:'any', group:'any', lvl:1, done:true },
  search: '',
  histFilter: 'all',
  // roulette.js instance (jQuery plugin)
  _rouletteInited: false,
};

/* ─── QUEST LOGIC ─── */
function doneIds(hist) {
  return new Set(hist.filter(h => h.status === 'done').map(h => h.quest_id));
}

function mergeQuests(store) {
  const del = new Set(store.deleted);
  return [...BASE_QUESTS, ...store.custom]
    .filter(q => !del.has(q.id))
    .map(q => ({ ...q, ...(store.edits[q.id] || {}) }));
}

function inBucket(q, b) {
  if (!DURATIONS[b]) return true;
  const [mn, mx] = DURATIONS[b];
  return q.duration_min <= mx && q.duration_max >= mn;
}

function filterQuests(qs, f, doneSet) {
  return qs.filter(q => {
    if (f.cats.length && !f.cats.includes(q.category))                       return false;
    if (!inBucket(q, f.dur))                                                  return false;
    if (f.setting !== 'any' && q.setting !== 'both' && q.setting !== f.setting) return false;
    if (f.group   !== 'any' && q.group_mode !== 'both' && q.group_mode !== f.group) return false;
    if (q.adventure_level < f.lvl)                                            return false;
    if (!f.done && doneSet.has(q.id))                                         return false;
    return true;
  });
}

function buildCtx() {
  const store    = getStore();
  const all      = mergeQuests(store);
  const dset     = doneIds(store.history);
  const filtered = filterQuests(all, S.filters, dset);
  return { store, all, dset, filtered };
}

function upsertEdit(id, payload) {
  const s = getStore();
  patchStore({ edits: { ...s.edits, [id]: { ...(s.edits[id]||{}), ...payload, updated_at: iso() } } });
}

/* ─── HTML HELPERS ─── */
const levelStr = n => '■'.repeat(n) + '□'.repeat(5-n);
const mkBadge  = (t, cls='') => `<span class="badge ${cls}">${esc(t)}</span>`;

function renderQuestCard(q, dset) {
  if (!q) return `<div class="no-selection">// Spin the drum to pick a quest</div>`;
  const done = dset.has(q.id);
  return `
  <article class="quest-card ${done ? 'done-card' : ''}">
    <div class="qc-header">
      <h3 class="qc-title">${esc(q.title)}</h3>
      <span class="level-badge">${levelStr(q.adventure_level)}</span>
    </div>
    <div class="qc-meta">
      ${mkBadge(CAT_ICONS[q.category] + ' ' + q.category, 'b-cat')}
      ${mkBadge('⏱ ' + q.duration_min + '–' + q.duration_max + 'm')}
      ${mkBadge(q.setting   === 'both' ? '🌍 any' : q.setting   === 'outdoor' ? '🌤 outdoor' : '🏠 indoor')}
      ${mkBadge(q.group_mode=== 'both' ? '👥 any' : q.group_mode=== 'group'   ? '👥 group'   : '🙋 solo'  )}
      ${q.constraints?.budget_max_chf > 0 ? mkBadge('CHF ' + q.constraints.budget_max_chf) : ''}
      ${done ? mkBadge('✓ done','b-done') : ''}
    </div>
    <ol class="qc-steps">${q.instructions.map(i => `<li>${esc(i)}</li>`).join('')}</ol>
    ${q.tags.length ? `<div class="qc-meta" style="margin-top:.5rem">${q.tags.map(t => mkBadge(t,'b-tag')).join('')}</div>` : ''}
    <div class="qc-actions">
      <button class="btn btn-fire btn-sm" data-action="done" data-id="${q.id}">✓ Done</button>
      <button class="btn btn-ghost btn-sm" data-action="skip" data-id="${q.id}">↷ Skip</button>
      <button class="btn btn-ghost btn-sm" data-action="save" data-id="${q.id}">♡ Save</button>
      <button class="btn btn-ghost btn-sm" data-action="spin">↻ Nochmal</button>
    </div>
  </article>`;
}

function renderFilters(c) {
  const n = c.filtered.length;
  return `
  <div class="panel">
    <div class="panel-header">
      <span class="panel-title">Filter</span>
      <span class="panel-count">${n} result${n !== 1 ? 's' : ''}</span>
    </div>
    <div class="cat-row">
      ${CATS.map(cat => `<button class="cat-pill ${S.filters.cats.includes(cat) ? 'on' : ''}" data-cat="${cat}">${CAT_ICONS[cat]} ${cat}</button>`).join('')}
    </div>
    <div class="filter-grid">
      <label>Dauer
        <select data-filter="dur">
          ${Object.keys(DURATIONS).map(d => `<option value="${d}" ${S.filters.dur === d ? 'selected' : ''}>${d}</option>`).join('')}
        </select>
      </label>
      <label>Setting
        <select data-filter="setting">
          ${['any','indoor','outdoor'].map(v => `<option ${S.filters.setting === v ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
      </label>
      <label>Gruppe
        <select data-filter="group">
          ${['any','solo','group'].map(v => `<option ${S.filters.group === v ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
      </label>
      <label>Level ≥
        <input type="number" min="1" max="5" data-filter="lvl" value="${S.filters.lvl}"/>
      </label>
      <label class="label-inline">Erledigte einschliessen
        <label class="toggle"><input type="checkbox" data-filter="done" ${S.filters.done ? 'checked' : ''}><span class="tslider"></span></label>
      </label>
    </div>
  </div>`;
}

/* ════════════════════════════════
   SLOT MACHINE (roulette.js)
════════════════════════════════ */

/**
 * Builds the hidden <img> elements that roulette.js scrolls through.
 * Each "image" is actually a 360×80 SVG rendered as a data-URI so we
 * can show quest info without real image files.
 */
function questToSVG(q) {
  const cat   = esc((CAT_ICONS[q.category] || '') + ' ' + q.category).toUpperCase();
  const title = esc(q.title.length > 52 ? q.title.slice(0, 51) + '…' : q.title);
  const dur   = `${q.duration_min}–${q.duration_max} MIN`;

  // Encode newlines inside tspan for wrapping
  const words = title.split(' ');
  let line1 = '', line2 = '';
  for (const w of words) {
    if ((line1 + ' ' + w).trim().length <= 34) line1 = (line1 + ' ' + w).trim();
    else line2 = (line2 + ' ' + w).trim();
  }
  if (line2.length > 34) line2 = line2.slice(0, 33) + '…';

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='80'>
    <rect width='360' height='80' fill='%23141414'/>
    <rect width='3' height='80' fill='%23ff5500'/>
    <text x='14' y='20' font-family='monospace' font-size='9' fill='%23ff5500' letter-spacing='1'>${cat}</text>
    <text x='14' y='38' font-family='sans-serif' font-size='13' font-weight='bold' fill='%23f5f5f5'>${line1}</text>
    ${line2 ? `<text x='14' y='54' font-family='sans-serif' font-size='13' font-weight='bold' fill='%23f5f5f5'>${line2}</text>` : ''}
    <text x='14' y='72' font-family='monospace' font-size='9' fill='%23888'>${dur}</text>
  </svg>`;

  return 'data:image/svg+xml,' + svg.replace(/\n\s*/g, ' ');
}

/**
 * Tears down the old roulette DOM and rebuilds it with the new pool,
 * then re-initialises the jQuery plugin.
 */
function buildSlotDrum(pool) {
  const $container = $('#slot-drum-container');
  $container.empty();

  if (!pool.length) {
    $container.html('<p class="slot-empty">// POOL LEER — Filter lockern</p>');
    S._rouletteInited = false;
    return;
  }

  // Build the roulette div with one <img> per quest
  const $drum = $('<div class="slot-drum" id="roulette-drum" style="display:none;"></div>');
  pool.forEach(q => {
    $drum.append($('<img>').attr('src', questToSVG(q)).attr('data-id', q.id));
  });
  $container.append($drum);
  S._rouletteInited = false; // force re-init
}

/**
 * (Re-)initialise the roulette.js plugin on the drum element.
 * Returns the jQuery roulette object.
 */
function initRoulettePlugin(pool, winnerIndex, onDone) {
  const $drum = $('#roulette-drum');
  if (!$drum.length) return;

  // Initialise plugin (pass options as first arg = jQuery plugin convention)
  $drum.roulette({
    speed:           12,
    duration:        3,
    stopImageNumber: winnerIndex,
    startCallback:   function() {},
    slowDownCallback: function() {},
    stopCallback:    function($stopEl) {
      const id = $($stopEl).data('id') || (pool[winnerIndex] && pool[winnerIndex].id);
      onDone(id);
    },
  });

  S._rouletteInited = true;
  return $drum;
}

/* ════════════════════════════════
   VIEWS
════════════════════════════════ */
function layout(content) {
  const tabs = [
    { id:'roulette', l:'Picker'  },
    { id:'all',      l:'Alle'    },
    { id:'create',   l:'+ Neu'   },
    { id:'history',  l:'History' },
    { id:'saved',    l:'Saved'   },
    { id:'settings', l:'Settings'},
  ];
  return `
  <header>
    <div class="logo-row">
      <span class="logo">Sidequest</span>
      <span class="logo-tag">// adventure picker</span>
    </div>
    <nav>
      ${tabs.map(t => `<button class="tab ${S.tab === t.id ? 'active' : ''}" data-tab="${t.id}">${t.l}</button>`).join('')}
    </nav>
  </header>
  <main>${content}</main>`;
}

function viewPicker(c) {
  const pool    = c.filtered.filter(q => !c.store.settings.exclude_done_from_random || !c.dset.has(q.id));
  const winQuest = c.all.find(q => q.id === S.winId);

  return layout(`
    ${renderFilters(c)}
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Slot Machine</span>
        <span class="panel-count">${pool.length} im pool</span>
      </div>
      <div class="picker-zone">
        <button class="btn-mega-spin ${S.spinning ? 'spinning' : ''}" id="spin-btn" ${S.spinning ? 'disabled' : ''}>
          <span>${S.spinning ? 'Spinning…' : 'Spin'}</span>
        </button>

        <div class="slot-drum-wrap">
          <div class="slot-highlight"></div>
          <div id="slot-drum-container"></div>
        </div>

        <p class="slot-hint" id="slot-hint">${pool.length} quest${pool.length !== 1 ? 's' : ''} verfügbar</p>
      </div>
      ${renderQuestCard(winQuest, c.dset)}
    </div>
  `);
}

function viewAll(c) {
  const q = S.search.toLowerCase();
  const rows = [...c.filtered]
    .filter(x => !q || x.title.toLowerCase().includes(q) || x.tags.join(' ').toLowerCase().includes(q))
    .sort((a, b) => {
      const d = Number(c.dset.has(a.id)) - Number(c.dset.has(b.id));
      return d || a.title.localeCompare(b.title, 'de');
    });

  return layout(`
    ${renderFilters(c)}
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Alle Quests</span>
        <span class="panel-count">${rows.length} visible</span>
      </div>
      <div class="search-wrap">
        <input data-action="search-all" placeholder="Titel oder Tag…" value="${esc(S.search)}"/>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Titel</th><th>Kat.</th><th>Min</th><th>Status</th><th>—</th></tr></thead>
          <tbody>
            ${rows.map(q => `
            <tr class="${c.dset.has(q.id) ? 'tr-done' : ''}">
              <td class="td-title">${esc(q.title)}</td>
              <td>${mkBadge(CAT_ICONS[q.category]+' '+q.category,'b-cat')}</td>
              <td style="font-size:.62rem;color:var(--mute)">${q.duration_min}–${q.duration_max}</td>
              <td>${c.dset.has(q.id) ? mkBadge('done','b-done') : mkBadge('open')}</td>
              <td><div class="td-acts">
                <button class="btn btn-ghost btn-sm" data-action="edit"   data-id="${q.id}">Edit</button>
                <button class="btn btn-danger btn-sm" data-action="delete" data-id="${q.id}">Del</button>
              </div></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);
}

function viewCreate(c) {
  const q = S.editId ? c.all.find(x => x.id === S.editId) : null;
  return layout(`
  <div class="panel">
    <div class="panel-header">
      <span class="panel-title">${q ? 'Quest bearbeiten' : 'Neue Quest'}</span>
    </div>
    <form id="quest-form">
      <input type="hidden" name="id" value="${esc(q?.id||'')}"/>
      <div class="form-grid">
        <label class="col-full">Titel
          <input required minlength="3" maxlength="80" name="title" value="${esc(q?.title||'')}" placeholder="Quest Titel…"/>
        </label>
        <label class="col-full">Beschreibung
          <textarea name="description" placeholder="Optional…">${esc(q?.description||'')}</textarea>
        </label>
        <label>Kategorie
          <select name="category">${CATS.map(cat => `<option ${q?.category===cat?'selected':''}>${cat}</option>`).join('')}</select>
        </label>
        <label>Tags (Komma)
          <input name="tags" value="${esc((q?.tags||[]).join(','))}" placeholder="sport,natur,…"/>
        </label>
        <label>Dauer min
          <input type="number" name="duration_min" min="1" value="${q?.duration_min||10}"/>
        </label>
        <label>Dauer max
          <input type="number" name="duration_max" min="1" value="${q?.duration_max||20}"/>
        </label>
        <label>Setting
          <select name="setting">${['indoor','outdoor','both'].map(v=>`<option ${q?.setting===v?'selected':''}>${v}</option>`).join('')}</select>
        </label>
        <label>Gruppe
          <select name="group_mode">${['solo','group','both'].map(v=>`<option ${q?.group_mode===v?'selected':''}>${v}</option>`).join('')}</select>
        </label>
        <label>Adventure Level (1–5)
          <input type="number" min="1" max="5" name="adventure_level" value="${q?.adventure_level||1}"/>
        </label>
        <label>Budget CHF
          <input type="number" step="1" min="0" name="budget_max_chf" value="${q?.constraints?.budget_max_chf??''}" placeholder="0"/>
        </label>
        <label class="col-full">Ausrüstung (Komma)
          <input name="equipment" value="${esc((q?.equipment||[]).join(','))}"/>
        </label>
        <label class="col-full">Wetter
          <select name="weather_required">${['none','dry','any'].map(v=>`<option ${q?.constraints?.weather_required===v?'selected':''}>${v}</option>`).join('')}</select>
        </label>
        <label class="col-full">Schritte (eine pro Zeile)
          <textarea name="instructions" placeholder="Schritt 1&#10;Schritt 2&#10;…">${esc((q?.instructions||[]).join('\n'))}</textarea>
        </label>
      </div>
      <div style="display:flex;gap:.5rem;margin-top:1rem;flex-wrap:wrap">
        <button type="submit" class="btn btn-primary">Speichern</button>
        <button type="button" class="btn btn-ghost" data-action="cancel">Abbrechen</button>
      </div>
    </form>
  </div>`);
}

function viewHistory(c) {
  const rows = [...c.store.history]
    .filter(h => S.histFilter === 'all' || h.status === S.histFilter)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return layout(`
  <div class="panel">
    <div class="hist-toolbar">
      <span class="panel-title" style="font-family:'Syne';font-weight:800;font-size:1rem;text-transform:uppercase;letter-spacing:.08em">History</span>
      <select data-action="hist-filter" style="width:auto">
        ${['all','done','skip'].map(v=>`<option ${S.histFilter===v?'selected':''}>${v}</option>`).join('')}
      </select>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Quest</th><th>Status</th><th>Datum</th></tr></thead>
        <tbody>
          ${rows.length ? rows.map(h => {
            const q = c.all.find(x => x.id === h.quest_id);
            return `<tr>
              <td style="max-width:220px">${esc(q?.title || h.quest_id)}</td>
              <td>${h.status === 'done' ? mkBadge('done','b-done') : mkBadge('skip')}</td>
              <td style="font-size:.62rem;color:var(--mute)">${new Date(h.timestamp).toLocaleString('de-CH')}</td>
            </tr>`;
          }).join('') : `<tr><td colspan="3" class="empty-state">// keine Einträge</td></tr>`}
        </tbody>
      </table>
    </div>
  </div>`);
}

function viewSaved(c) {
  const items = [...c.store.saved].sort((a,b) => new Date(b.saved_at)-new Date(a.saved_at));
  return layout(`
  <div class="panel">
    <div class="panel-header">
      <span class="panel-title">Saved</span>
      <span class="panel-count">${items.length} total</span>
    </div>
    ${items.length
      ? `<ul class="saved-list">${items.map(s => {
          const q = c.all.find(x => x.id === s.quest_id);
          return `<li class="saved-item">
            <span>${esc(q?.title || s.quest_id)}</span>
            <span class="saved-date">${new Date(s.saved_at).toLocaleDateString('de-CH')}</span>
          </li>`;
        }).join('')}</ul>`
      : `<div class="empty-state"><span class="empty-ico">♡</span>// nichts gespeichert</div>`}
  </div>`);
}

function viewSettings(c) {
  const ss = c.store.settings;
  const rows = [
    { k:'exclude_done_from_random', l:'Erledigte vom Zufall ausschliessen', d:'Abgehakte Quests erscheinen nicht im Drum' },
    { k:'show_done_as_grey',        l:'Erledigte ausgegraut',               d:'Bereits erledigte werden ausgegraut' },
  ];
  return layout(`
  <div class="panel">
    <div class="panel-header"><span class="panel-title">Settings</span></div>
    ${rows.map(r => `
    <div class="setting-row">
      <div class="setting-info">
        <span class="setting-lbl">${r.l}</span>
        <span class="setting-desc">${r.d}</span>
      </div>
      <label class="toggle">
        <input type="checkbox" data-action="toggle-setting" data-key="${r.k}" ${ss[r.k]?'checked':''}>
        <span class="tslider"></span>
      </label>
    </div>`).join('')}
    <div style="margin-top:1.5rem">
      <button class="btn btn-danger" data-action="reset-storage">⚠ Reset localStorage</button>
    </div>
  </div>`);
}

/* ════════════════════════════════
   MAIN RENDER
════════════════════════════════ */
function render() {
  const app = document.getElementById('app');
  const c   = buildCtx();
  let html  = '';

  if      (S.tab === 'roulette') html = viewPicker(c);
  else if (S.tab === 'all')      html = viewAll(c);
  else if (S.tab === 'create')   html = viewCreate(c);
  else if (S.tab === 'history')  html = viewHistory(c);
  else if (S.tab === 'saved')    html = viewSaved(c);
  else if (S.tab === 'settings') html = viewSettings(c);

  app.innerHTML = html;
  attachEvents(c);

  // After render: if on picker tab, rebuild the slot drum
  if (S.tab === 'roulette') {
    const pool = c.filtered.filter(q => !c.store.settings.exclude_done_from_random || !c.dset.has(q.id));
    buildSlotDrum(pool);
  }
}

/* ════════════════════════════════
   EVENT BINDING
════════════════════════════════ */
function attachEvents(c) {

  /* ── Tabs ── */
  document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
    S.tab = b.dataset.tab;
    if (S.tab !== 'create') S.editId = null;
    render();
  }));

  /* ── Category pills ── */
  document.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => {
    const cat = b.dataset.cat;
    const i   = S.filters.cats.indexOf(cat);
    i === -1 ? S.filters.cats.push(cat) : S.filters.cats.splice(i, 1);
    render();
  }));

  /* ── Generic filters ── */
  document.querySelectorAll('[data-filter]').forEach(el => el.addEventListener('change', () => {
    const k = el.dataset.filter;
    if      (el.type === 'checkbox') S.filters[k] = el.checked;
    else if (el.type === 'number')   S.filters[k] = Number(el.value);
    else                              S.filters[k] = el.value;
    render();
  }));

  /* ── Search ── */
  document.querySelectorAll('[data-action="search-all"]').forEach(el => el.addEventListener('input', () => {
    S.search = el.value; render();
  }));

  /* ── History filter ── */
  document.querySelectorAll('[data-action="hist-filter"]').forEach(el => el.addEventListener('change', () => {
    S.histFilter = el.value; render();
  }));

  /* ── SPIN BUTTON ── */
  document.getElementById('spin-btn')?.addEventListener('click', () => {
    const pool = c.filtered.filter(q => !c.store.settings.exclude_done_from_random || !c.dset.has(q.id));
    if (!pool.length || S.spinning) return;

    // Pick winner
    const winnerIndex = Math.floor(Math.random() * pool.length);
    const winner      = pool[winnerIndex];

    S.spinning = true;
    render(); // re-render to show spinning state + rebuilt drum

    // Rebuild drum for fresh spin (roulette.js needs fresh DOM)
    const freshPool = (() => {
      const store = getStore();
      const all   = mergeQuests(store);
      const dset  = doneIds(store.history);
      return filterQuests(all, S.filters, dset)
        .filter(q => !store.settings.exclude_done_from_random || !dset.has(q.id));
    })();

    buildSlotDrum(freshPool);

    // Small tick to let DOM settle, then init plugin + start
    setTimeout(() => {
      const $drum = $('#roulette-drum');
      if (!$drum.length) { S.spinning = false; render(); return; }

      // Init plugin with winner target
      $drum.roulette({
        speed:            13,
        duration:         3,
        stopImageNumber:  winnerIndex,
        startCallback:    function() {},
        slowDownCallback: function() {},
        stopCallback:     function() {
          S.winId    = winner.id;
          S.spinning = false;
          render();
        },
      });

      // Start the spin!
      $drum.roulette('start');

    }, 80);
  });

  /* ── Done / Skip ── */
  document.querySelectorAll('[data-action="done"],[data-action="skip"]').forEach(b => b.addEventListener('click', () => {
    const s = getStore();
    patchStore({ history: [...s.history, { quest_id: b.dataset.id, status: b.dataset.action, timestamp: iso() }] });
    render();
  }));

  /* ── Save ── */
  document.querySelectorAll('[data-action="save"]').forEach(b => b.addEventListener('click', () => {
    const s = getStore();
    patchStore({ saved: [...s.saved, { quest_id: b.dataset.id, saved_at: iso() }] });
    render();
  }));

  /* ── Edit ── */
  document.querySelectorAll('[data-action="edit"]').forEach(b => b.addEventListener('click', () => {
    S.editId = b.dataset.id; S.tab = 'create'; render();
  }));

  /* ── Delete ── */
  document.querySelectorAll('[data-action="delete"]').forEach(b => b.addEventListener('click', () => {
    if (!confirm('Quest löschen?')) return;
    const s = getStore();
    if (!s.deleted.includes(b.dataset.id)) {
      patchStore({ deleted: [...s.deleted, b.dataset.id] });
      if (S.winId === b.dataset.id) S.winId = null;
      render();
    }
  }));

  /* ── Cancel form ── */
  document.querySelectorAll('[data-action="cancel"]').forEach(b => b.addEventListener('click', () => {
    S.tab = 'all'; S.editId = null; render();
  }));

  /* ── Settings toggles ── */
  document.querySelectorAll('[data-action="toggle-setting"]').forEach(cb => cb.addEventListener('change', () => {
    const s = getStore();
    patchStore({ settings: { ...s.settings, [cb.dataset.key]: cb.checked } });
    render();
  }));

  /* ── Reset storage ── */
  document.querySelectorAll('[data-action="reset-storage"]').forEach(b => b.addEventListener('click', () => {
    if (!confirm('Alles zurücksetzen?')) return;
    Object.values(SK).forEach(k => localStorage.removeItem(k));
    S.filters = { cats:[], dur:'any', setting:'any', group:'any', lvl:1, done:true };
    S.winId = null;
    render();
  }));

  /* ── Quest form submit ── */
  document.getElementById('quest-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const fd  = new FormData(e.target);
    const id  = String(fd.get('id') || '').trim() || `custom-${crypto.randomUUID()}`;
    const payload = {
      id,
      title:           String(fd.get('title')       || '').trim(),
      description:     String(fd.get('description') || '').trim(),
      category:        fd.get('category'),
      tags:            parseList(String(fd.get('tags')      || '')),
      duration_min:    Number(fd.get('duration_min')),
      duration_max:    Number(fd.get('duration_max')),
      setting:         fd.get('setting'),
      group_mode:      fd.get('group_mode'),
      adventure_level: Number(fd.get('adventure_level')),
      equipment:       parseList(String(fd.get('equipment') || '')),
      constraints: {
        budget_max_chf:   fd.get('budget_max_chf') ? Number(fd.get('budget_max_chf')) : undefined,
        weather_required: fd.get('weather_required') || 'none',
      },
      instructions: String(fd.get('instructions') || '').split('\n').map(s => s.trim()).filter(Boolean),
    };
    if (payload.title.length < 3)             return alert('Titel ≥ 3 Zeichen.');
    if (payload.duration_min > payload.duration_max) return alert('Min muss ≤ Max sein.');
    if (!payload.instructions.length)         return alert('Mindestens 1 Schritt.');

    const s        = getStore();
    const inBase   = BASE_QUESTS.some(q => q.id === id);
    const inCustom = s.custom.some(q => q.id === id);

    if (!inBase && !inCustom) {
      patchStore({ custom: [...s.custom, { ...payload, created_at: iso(), source: 'custom' }] });
    } else {
      upsertEdit(id, payload);
    }
    S.tab = 'all'; S.editId = null; render();
  });
}

/* ─── BOOT ─── */
render();
