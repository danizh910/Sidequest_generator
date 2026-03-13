/* ════════════════════════════════════════════════
   SIDEQUEST PICKER — app.js
   Requires: jQuery 3+ and roulette.js (in index.html)
════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   TRANSLATIONS (DE / EN)
────────────────────────────────────────────── */
const LANG = {
  de: {
    logoSub: 'Picker',
    langBtn: 'EN',
    tabs: { roulette:'Picker', all:'Alle', create:'+ Neu', history:'Verlauf', saved:'Gespeichert', settings:'Einstellungen' },
    filter: 'Filter',
    results: n => `${n} Ergebnis${n!==1?'se':''}`,
    duration: 'Dauer',
    setting: 'Ort',
    group: 'Gruppe',
    levelMin: 'Level ≥',
    includeDone: 'Erledigte einschliessen',
    spinBtn: 'Spin',
    spinning: 'Dreht…',
    poolCount: n => `${n} Quest${n!==1?'s':''} im Pool`,
    poolEmpty: 'Pool leer — Filter lockern',
    drumHint: n => `${n} Quest${n!==1?'s':''} verfügbar`,
    spinFirst: 'Dreh das Rad um eine Quest zu picken',
    catLabels: { outdoor:'Draussen', creativity:'Kreativ', social:'Sozial', mindset:'Mindset', fitness:'Fitness', food:'Essen', travel:'Reisen' },
    settingOpts: { any:'Egal', indoor:'Drinnen', outdoor:'Draussen' },
    groupOpts:   { any:'Egal', solo:'Solo', group:'Gruppe' },
    durOpts: { any:'Egal', '5-10':'5–10 Min', '10-20':'10–20 Min', '20-45':'20–45 Min', '45-90':'45–90 Min', '90+':'90+ Min' },
    doneBtn: '✓ Erledigt', skipBtn: '↷ Überspringen', saveBtn: '♡ Speichern', againBtn: '↻ Nochmal',
    editBtn: 'Bearbeiten', deleteBtn: 'Löschen',
    allTitle: 'Alle Quests', visible: n => `${n} sichtbar`,
    searchPlaceholder: 'Titel oder Tag suchen…',
    colTitle: 'Titel', colCat: 'Kategorie', colDur: 'Dauer', colStatus: 'Status', colAct: '—',
    statusDone: 'erledigt', statusOpen: 'offen', statusSkip: 'übersprungen',
    createTitle: 'Neue Quest', editTitle: 'Quest bearbeiten',
    fTitle: 'Titel', fDesc: 'Beschreibung', fDescPh: 'Optional…',
    fCat: 'Kategorie', fTags: 'Tags (Komma)', fTagsPh: 'sport, natur, …',
    fDurMin: 'Dauer min', fDurMax: 'Dauer max', fSetting: 'Ort',
    fGroup: 'Gruppe', fLevel: 'Adventure Level (1–5)', fBudget: 'Budget CHF',
    fEquip: 'Ausrüstung (Komma)', fWeather: 'Wetter', fSteps: 'Schritte (eine pro Zeile)',
    fStepsPh: 'Schritt 1\nSchritt 2\nSchritt 3',
    saveQuestBtn: 'Speichern', cancelBtn: 'Abbrechen',
    histTitle: 'Verlauf', histAll: 'Alle', histDone: 'Erledigt', histSkip: 'Übersprungen',
    colDate: 'Datum',
    histEmpty: 'Noch kein Verlauf',
    savedTitle: 'Gespeichert', savedEmpty: 'Noch nichts gespeichert',
    settingsTitle: 'Einstellungen',
    settingRows: [
      { k:'exclude_done_from_random', l:'Erledigte ausschliessen', d:'Bereits erledigte Quests erscheinen nicht im Drum' },
      { k:'show_done_as_grey',        l:'Erledigte ausgegraut',    d:'Erledigte Quests werden ausgegraut dargestellt' },
    ],
    resetBtn: '⚠ Alles zurücksetzen',
    resetProgressBtn: 'Fortschritt zurücksetzen',
    confirmDelete: 'Quest wirklich löschen?',
    confirmReset: 'Wirklich alles zurücksetzen?',
    confirmProgressReset: 'Alle erledigten/übersprungenen Sidequests zurücksetzen?',
    errTitle: 'Titel muss mindestens 3 Zeichen haben.',
    errDur: 'Min-Dauer muss ≤ Max-Dauer sein.',
    errSteps: 'Mindestens 1 Schritt erforderlich.',
    levelLabel: n => `Level ${n}`,
  },
  en: {
    logoSub: 'Picker',
    langBtn: 'DE',
    tabs: { roulette:'Picker', all:'All', create:'+ New', history:'History', saved:'Saved', settings:'Settings' },
    filter: 'Filter',
    results: n => `${n} result${n!==1?'s':''}`,
    duration: 'Duration',
    setting: 'Setting',
    group: 'Group',
    levelMin: 'Level ≥',
    includeDone: 'Include completed',
    spinBtn: 'Spin',
    spinning: 'Spinning…',
    poolCount: n => `${n} quest${n!==1?'s':''} in pool`,
    poolEmpty: 'Pool empty — loosen filters',
    drumHint: n => `${n} quest${n!==1?'s':''} available`,
    spinFirst: 'Spin the drum to pick a quest',
    catLabels: { outdoor:'Outdoor', creativity:'Creative', social:'Social', mindset:'Mindset', fitness:'Fitness', food:'Food', travel:'Travel' },
    settingOpts: { any:'Any', indoor:'Indoor', outdoor:'Outdoor' },
    groupOpts:   { any:'Any', solo:'Solo', group:'Group' },
    durOpts: { any:'Any', '5-10':'5–10 min', '10-20':'10–20 min', '20-45':'20–45 min', '45-90':'45–90 min', '90+':'90+ min' },
    doneBtn: '✓ Done', skipBtn: '↷ Skip', saveBtn: '♡ Save', againBtn: '↻ Again',
    editBtn: 'Edit', deleteBtn: 'Delete',
    allTitle: 'All Quests', visible: n => `${n} visible`,
    searchPlaceholder: 'Search title or tag…',
    colTitle: 'Title', colCat: 'Category', colDur: 'Duration', colStatus: 'Status', colAct: '—',
    statusDone: 'done', statusOpen: 'open', statusSkip: 'skipped',
    createTitle: 'New Quest', editTitle: 'Edit Quest',
    fTitle: 'Title', fDesc: 'Description', fDescPh: 'Optional…',
    fCat: 'Category', fTags: 'Tags (comma)', fTagsPh: 'sport, nature, …',
    fDurMin: 'Duration min', fDurMax: 'Duration max', fSetting: 'Setting',
    fGroup: 'Group mode', fLevel: 'Adventure Level (1–5)', fBudget: 'Budget CHF',
    fEquip: 'Equipment (comma)', fWeather: 'Weather required', fSteps: 'Steps (one per line)',
    fStepsPh: 'Step 1\nStep 2\nStep 3',
    saveQuestBtn: 'Save Quest', cancelBtn: 'Cancel',
    histTitle: 'History', histAll: 'All', histDone: 'Done', histSkip: 'Skipped',
    colDate: 'Date',
    histEmpty: 'No history yet',
    savedTitle: 'Saved', savedEmpty: 'Nothing saved yet',
    settingsTitle: 'Settings',
    settingRows: [
      { k:'exclude_done_from_random', l:'Exclude completed', d:'Already completed quests won\'t appear in the drum' },
      { k:'show_done_as_grey',        l:'Grey out completed', d:'Completed quests are shown greyed out' },
    ],
    resetBtn: '⚠ Reset all data',
    resetProgressBtn: 'Reset progress',
    confirmDelete: 'Really delete this quest?',
    confirmReset: 'Really reset all data?',
    confirmProgressReset: 'Reset all done/skipped sidequests?',
    errTitle: 'Title must be at least 3 characters.',
    errDur: 'Min duration must be ≤ max duration.',
    errSteps: 'At least 1 step is required.',
    levelLabel: n => `Level ${n}`,
  },
};

/* ──────────────────────────────────────────────
   BASE DATA
────────────────────────────────────────────── */
const BASE_QUESTS = [
  { id:'base-1',  title_de:'Mit dem Zug in eine zufällige Stadt und einfach schauen was passiert',       title_en:'Take a train to a random city and figure it out when you get there',          category:'travel',     tags:['spontan','stadt','erkunden'],        duration_min:240, duration_max:720,  setting:'outdoor', group_mode:'solo',  adventure_level:5, equipment:['Handy','Ticket'],          constraints:{budget_max_chf:180,weather_required:'any'},  instructions_de:['Nächsten Zug in eine unbekannte Stadt nehmen.','Ankunft: einen Ort erkunden + ein lokales Essen.','Drei überraschende Momente dokumentieren.'], instructions_en:['Pick the next available train to a city you do not know well.','When you arrive, choose one place to explore and one local meal.','Document three moments that surprised you.'], source:'base' },
  { id:'base-2',  title_de:'Unter den Sternen schlafen, an einem Ort den du noch nie warst',              title_en:'Sleep under the stars somewhere you\'ve never been',                          category:'outdoor',    tags:['nacht','natur','mutig'],             duration_min:360, duration_max:720,  setting:'outdoor', group_mode:'both',  adventure_level:4, equipment:['Schlafsack'],              constraints:{budget_max_chf:80,weather_required:'dry'},   instructions_de:['Legalen und sicheren Outdoor-Spot finden.','Nur das Nötigste einpacken.','15 Minuten den Himmel anschauen — ohne Handy.'], instructions_en:['Find a legal and safe outdoor spot.','Pack only essentials for one night.','Watch the sky for 15 minutes without your phone.'], source:'base' },
  { id:'base-3',  title_de:'Eine Stadt mit weniger als 500 Einwohnern besuchen',                          title_en:'Visit a town with a population under 500',                                    category:'travel',     tags:['roadtrip','kleinstadt','neugierig'], duration_min:180, duration_max:480,  setting:'outdoor', group_mode:'both',  adventure_level:3, equipment:['Handy'],                   constraints:{budget_max_chf:50,weather_required:'any'},   instructions_de:['Kleine Stadt in der Nähe auswählen.','Mit einer einheimischen Person reden.','Aufschreiben was anders war als in der eigenen Stadt.'], instructions_en:['Pick a tiny town nearby.','Talk to one local person.','Write down what felt different from your city.'], source:'base' },
  { id:'base-4',  title_de:'Alleine in einem schicken Restaurant essen und jeden Moment geniessen',       title_en:'Eat alone at a fancy restaurant and enjoy every second of it',                category:'food',       tags:['komfortzone','selbstvertrauen','essen'], duration_min:90, duration_max:180, setting:'indoor',  group_mode:'solo',  adventure_level:3, equipment:['Portemonnaie'],            constraints:{budget_max_chf:120,weather_required:'none'}, instructions_de:['Tisch für eine Person reservieren.','Langsam bestellen, im Moment bleiben.','Nachher eine Sache aufschreiben die man über sich gelernt hat.'], instructions_en:['Book a table for one.','Order slowly and stay present.','End the night by writing one thing you learned about yourself.'], source:'base' },
  { id:'base-5',  title_de:'In ein Flugzeug steigen — nur Handgepäck, kein Hotel gebucht',               title_en:'Get on a flight with only a carry-on and no hotel booked',                    category:'travel',     tags:['risiko','spontan','minimalistisch'],  duration_min:720, duration_max:2880, setting:'both',    group_mode:'solo',  adventure_level:5, equipment:['Pass','Handgepäck'],       constraints:{budget_max_chf:600,weather_required:'any'},  instructions_de:['Ziel mit einfacher Ankunft wählen.','Nur die erste Nacht grob planen.','Tag 1 von Einheimischen leiten lassen.'], instructions_en:['Choose a destination with easy arrival options.','Plan only first-night safety basics.','Let day one be guided by local recommendations.'], source:'base' },
  { id:'base-6',  title_de:'Den höchsten Punkt der Stadt finden und den Sonnenuntergang beobachten',      title_en:'Find the highest point in your city and watch the sunset from there',          category:'outdoor',    tags:['sonnenuntergang','stadt','reflexion'], duration_min:60, duration_max:150, setting:'outdoor', group_mode:'both',  adventure_level:2, equipment:['Bequeme Schuhe'],          constraints:{budget_max_chf:0,weather_required:'dry'},    instructions_de:['Höchsten zugänglichen Punkt lokalisieren.','20 Minuten vor Sonnenuntergang ankommen.','In Stille warten bis das letzte Licht verblasst.'], instructions_en:['Locate the highest accessible point.','Arrive 20 minutes before sunset.','Watch in silence until the last light fades.'], source:'base' },
  { id:'base-7',  title_de:'Ein Museum betreten das du noch nie beachtet hast',                           title_en:'Walk into a museum you\'ve never noticed before',                             category:'creativity', tags:['kultur','museum','neugierig'],        duration_min:60,  duration_max:180,  setting:'indoor',  group_mode:'both',  adventure_level:2, equipment:['Ticket'],                  constraints:{budget_max_chf:25,weather_required:'none'},  instructions_de:['Ein ignoriertes Museum auswählen.','Mindestens 30 Min auf einem Stockwerk verbringen.','Ein Werk notieren das bleibt.'], instructions_en:['Choose a museum you have ignored.','Spend at least 30 minutes on one floor.','Take one note about a piece that stayed with you.'], source:'base' },
  { id:'base-8',  title_de:'Einen ganzen Tag in einem Quartier verbringen das du immer übersiehst',       title_en:'Spend a full day in a neighborhood you always drive past',                     category:'travel',     tags:['lokal','tieftauchen','urban'],        duration_min:300, duration_max:720,  setting:'both',    group_mode:'both',  adventure_level:3, equipment:['Handy'],                   constraints:{budget_max_chf:40,weather_required:'any'},   instructions_de:['Ein Quartier wählen und den ganzen Tag dort bleiben.','Ein Café, einen Spaziergang, ein zufälliges Geschäft ausprobieren.','Mit einem Mini-Guide für Freunde nach Hause gehen.'], instructions_en:['Pick one neighborhood and stay there all day.','Try one café, one walk, and one random shop.','Leave with a mini-guide for a friend.'], source:'base' },
  { id:'base-9',  title_de:'Mit einem Fremden in einem Café ein echtes Gespräch führen und zuhören',     title_en:'Strike up a real conversation with a stranger at a café and actually listen',   category:'social',     tags:['sozial','zuhören','menschlich'],      duration_min:15,  duration_max:45,   setting:'both',    group_mode:'solo',  adventure_level:3, equipment:['nichts'],                  constraints:{budget_max_chf:10,weather_required:'none'},  instructions_de:['Mit einer einfachen Frage beginnen.','Mehr zuhören als reden.','Sich für das Gespräch bedanken.'], instructions_en:['Start with a simple warm question.','Listen more than you speak.','Thank them for the conversation.'], source:'base' },
  { id:'base-10', title_de:'Einem Menschen der dein Leben verändert hat einen Brief schreiben und ihn wirklich abschicken', title_en:'Write a letter to someone who changed your life and actually send it', category:'social', tags:['dankbarkeit','brief','verbindung'], duration_min:20, duration_max:60, setting:'indoor', group_mode:'solo', adventure_level:2, equipment:['Papier','Umschlag'], constraints:{budget_max_chf:5,weather_required:'none'}, instructions_de:['Ehrlich und konkret schreiben.','Nicht übermässig korrigieren.','Noch am gleichen Tag abschicken.'], instructions_en:['Write honestly and specifically.','Do not over-edit.','Send it the same day.'], source:'base' },
  { id:'base-11', title_de:'An einem Event teilnehmen wo du absolut niemanden kennst',                    title_en:'Attend an event where you know absolutely no one',                            category:'social',     tags:['netzwerk','mut','event'],             duration_min:90,  duration_max:240,  setting:'both',    group_mode:'solo',  adventure_level:4, equipment:['Handy'],                   constraints:{budget_max_chf:35,weather_required:'any'},   instructions_de:['Offenes Event in der Stadt finden.','Mindestens zwei Personen ansprechen.','Mindestens eine Stunde bleiben.'], instructions_en:['Find an open event in your city.','Introduce yourself to at least two people.','Stay for one full hour minimum.'], source:'base' },
  { id:'base-12', title_de:'Fünf Fremden an einem Tag ein Kompliment machen und es ernst meinen',         title_en:'Compliment five strangers in one day and mean every word',                    category:'social',     tags:['freundlichkeit','selbstvertrauen','sozial'], duration_min:30, duration_max:180, setting:'both', group_mode:'solo', adventure_level:3, equipment:['nichts'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Spezifische und respektvolle Komplimente geben.','Auf Aufrichtigkeit fokussieren, nicht auf Geschwindigkeit.','Reflektieren wie die Menschen reagiert haben.'], instructions_en:['Give specific and respectful compliments.','Focus on sincerity, not speed.','Reflect on how people reacted.'], source:'base' },
  { id:'base-13', title_de:'Einen alten Freund anrufen mit dem du seit Jahren nicht gesprochen hast',     title_en:'Call an old friend you haven\'t spoken to in years with no agenda',           category:'social',     tags:['freundschaft','wiederverbinden','anruf'], duration_min:20, duration_max:50, setting:'indoor', group_mode:'solo', adventure_level:2, equipment:['Handy'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Eine Person wählen und anrufen — nicht schreiben.','Nach ihrem Leben fragen und tief zuhören.','Mit einer ehrlichen Erinnerung abschliessen.'], instructions_en:['Pick one person and call, not text.','Ask about their life and listen deeply.','End with one honest memory you still value.'], source:'base' },
  { id:'base-14', title_de:'Für jemanden der es gerade braucht eine vollständige Mahlzeit kochen',        title_en:'Cook a full meal for someone who needs it right now',                          category:'social',     tags:['fürsorge','essen','dienst'],          duration_min:60,  duration_max:150,  setting:'indoor',  group_mode:'both',  adventure_level:3, equipment:['Küche'],                   constraints:{budget_max_chf:30,weather_required:'none'},  instructions_de:['Jemanden wählen dem es wirklich helfen würde.','Eine einfache ausgewogene Mahlzeit kochen.','Mit einem kurzen freundlichen Zettel liefern.'], instructions_en:['Choose someone who would genuinely benefit.','Cook a balanced simple meal.','Deliver it with a short, kind note.'], source:'base' },
  { id:'base-15', title_de:'Einem älteren Menschen nach seinem grössten Bedauern fragen — ohne Handy',    title_en:'Ask an elderly person about their biggest regret and listen without your phone', category:'social',  tags:['weisheit','zuhören','präsenz'],       duration_min:30,  duration_max:90,   setting:'both',    group_mode:'solo',  adventure_level:3, equipment:['nichts'],                  constraints:{budget_max_chf:0,weather_required:'none'},   instructions_de:['Mit Empathie und Respekt fragen.','Handy komplett weglegen.','Danach eine Lektion aufschreiben.'], instructions_en:['Ask with empathy and respect.','Keep your phone away completely.','Write down one lesson afterwards.'], source:'base' },
  { id:'base-16', title_de:'Ein Tagebuch beginnen und nur in der dritten Person schreiben',               title_en:'Start a journal and write only in third person',                              category:'mindset',    tags:['tagebuch','mindset','reflexion'],     duration_min:15,  duration_max:30,   setting:'indoor',  group_mode:'solo',  adventure_level:2, equipment:['Notizbuch'],               constraints:{budget_max_chf:0,weather_required:'none'},   instructions_de:['Den Tag beschreiben als würde man sich selbst beobachten.','Kurz aber konkret bleiben.','Drei aufeinanderfolgende Tage wiederholen.'], instructions_en:['Describe your day as if you are observing yourself.','Keep it short but specific.','Repeat for three consecutive days.'], source:'base' },
  { id:'base-17', title_de:'In einer Stunde 30 Fotos machen — kein Filter, keine Wiederholungen',         title_en:'Take 30 photos in one hour with no filter and no retakes',                    category:'creativity', tags:['foto','kreativ','herausforderung'],   duration_min:60,  duration_max:90,   setting:'both',    group_mode:'solo',  adventure_level:3, equipment:['Handy'],                   constraints:{budget_max_chf:0,weather_required:'any'},    instructions_de:['Einen Stunden-Timer stellen.','30 einzigartige Bilder — jedes nur einmal.','Die Top 3 auswählen und erklären warum.'], instructions_en:['Set a one-hour timer.','Shoot 30 unique frames only once each.','Pick your top three and explain why.'], source:'base' },
  { id:'base-18', title_de:'Eine Kurzgeschichte über dein Leben schreiben — aber 200 Jahre in der Vergangenheit', title_en:'Write a short story about your life but set it 200 years ago', category:'creativity', tags:['geschichte','fantasie','schreiben'], duration_min:45, duration_max:120, setting:'indoor', group_mode:'solo', adventure_level:4, equipment:['Notizbuch','Laptop'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Ein echtes Ereignis aus dem eigenen Leben auswählen.','In ein historisches Setting übersetzen.','Mit einer fiktiven Wendung abschliessen.'], instructions_en:['Pick one real event from your life.','Translate it into a different historical setting.','Finish with one fictional twist.'], source:'base' },
  { id:'base-19', title_de:'Etwas Schreckliches malen oder zeichnen und es trotzdem aufhängen',           title_en:'Paint or draw something terrible and hang it on your wall anyway',            category:'creativity', tags:['kunst','unvollkommenheit','mut'],     duration_min:30,  duration_max:90,   setting:'indoor',  group_mode:'solo',  adventure_level:2, equipment:['Papier','Farben'],          constraints:{budget_max_chf:10,weather_required:'none'},  instructions_de:['Schnell erschaffen ohne zu urteilen.','Unterschreiben und datieren.','Eine Woche lang aufgehängt lassen.'], instructions_en:['Create quickly without judging.','Sign and date it.','Hang it where you can see it for a week.'], source:'base' },
  { id:'base-20', title_de:'10 Minuten über irgendetwas reden und sich selbst zuhören',                   title_en:'Record yourself talking for 10 minutes about anything and play it back',     category:'mindset',    tags:['selbstwahrnehmung','stimme','wachstum'], duration_min:15, duration_max:25, setting:'indoor', group_mode:'solo', adventure_level:3, equipment:['Handy'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Eine 10-Minuten-Aufnahme starten.','Frei sprechen ohne anzuhalten.','Einmal abspielen und eine Verbesserung notieren.'], instructions_en:['Set a 10-minute recording.','Speak freely without stopping.','Replay once and note one improvement.'], source:'base' },
  { id:'base-21', title_de:'Den gesamten Wohnraum an einem Nachmittag umgestalten',                       title_en:'Rearrange your entire living space in one afternoon',                          category:'mindset',    tags:['zuhause','neustart','energie'],       duration_min:120, duration_max:240,  setting:'indoor',  group_mode:'both',  adventure_level:3, equipment:['nichts'],                  constraints:{budget_max_chf:0,weather_required:'none'},   instructions_de:['Start- und Endzeit festlegen.','Zuerst die grossen Möbel verschieben.','Mindestens fünf unnötige Dinge entfernen.'], instructions_en:['Choose a start and end time.','Move major pieces first.','Finish by removing at least five unnecessary items.'], source:'base' },
  { id:'base-22', title_de:'Eine Playlist für eine Version von dir erstellen die noch nicht existiert',    title_en:'Make a playlist for a version of yourself that doesn\'t exist yet',           category:'creativity', tags:['musik','zukünftiges-ich','vision'],   duration_min:25,  duration_max:60,   setting:'indoor',  group_mode:'solo',  adventure_level:2, equipment:['Musik-App'],               constraints:{budget_max_chf:0,weather_required:'none'},   instructions_de:['Die Zukunftsversion in einem Satz definieren.','12 Songs wählen die zu dieser Identität passen.','Einmal durchhören und das Gefühl aufschreiben.'], instructions_en:['Define the future version in one sentence.','Select 12 songs that match that identity.','Listen once and write down the feeling.'], source:'base' },

  { id:'base-23', title_de:'Bei Live-Musik mit einer fremden Person einen Song lang tanzen', title_en:'Dance with a stranger for one full song when you hear live music', category:'social', tags:['mut','gespräch','challenge'], duration_min:10, duration_max:30, setting:'outdoor', group_mode:'solo', adventure_level:3, equipment:['bequeme Schuhe'], constraints:{budget_max_chf:0,weather_required:'any'}, instructions_de:['Einen öffentlichen Ort mit Musik wählen.','Vorher kurz um Zustimmung fragen.','Einen Song lang tanzen und dich danach bedanken.'], instructions_en:['Choose a public place with music.','Ask for consent first.','Dance for one song and thank them afterwards.'], source:'base' },
  { id:'base-24', title_de:'Bei Laser Tag in einem Match unter die Top 3 kommen', title_en:'Play one laser tag match and finish in the top three', category:'fitness', tags:['challenge','city','adventure'], duration_min:45, duration_max:90, setting:'indoor', group_mode:'both', adventure_level:3, equipment:['Sportkleidung'], constraints:{budget_max_chf:35,weather_required:'none'}, instructions_de:['Eine Session mit offenen Plätzen buchen.','Fokussiert ein Match spielen.','Dein Ergebnis notieren und eine zweite Runde optional spielen.'], instructions_en:['Book a session with open spots.','Play one focused match.','Note your score and optionally play a second round.'], source:'base' },
  { id:'base-25', title_de:'In einem Trampolinpark eine freundliche Dodgeball-Runde spielen', title_en:'Join a friendly dodgeball round at a trampoline park', category:'fitness', tags:['group','challenge','city'], duration_min:45, duration_max:120, setting:'indoor', group_mode:'both', adventure_level:3, equipment:['Sportkleidung'], constraints:{budget_max_chf:35,weather_required:'none'}, instructions_de:['Einen sicheren Trampolinpark auswählen.','Eine Gruppe höflich fragen, ob du mitspielen darfst.','Drei faire Runden spielen und mit Handschlag beenden.'], instructions_en:['Choose a safe trampoline park.','Politely ask a group if you can join.','Play three fair rounds and end on a good note.'], source:'base' },
  { id:'base-26', title_de:'Alleine in einer Karaoke-Bar einen Song performen', title_en:'Go to a karaoke bar alone and perform one song', category:'social', tags:['solo','bold','challenge'], duration_min:45, duration_max:120, setting:'indoor', group_mode:'solo', adventure_level:4, equipment:['nichts'], constraints:{budget_max_chf:25,weather_required:'none'}, instructions_de:['Einen Song wählen, den du grob kennst.','Ohne Perfektionsdruck auftreten.','Nach dem Song einen Moment stolz wahrnehmen.'], instructions_en:['Pick a song you roughly know.','Perform without aiming for perfection.','Take a moment to acknowledge the win afterwards.'], source:'base' },
  { id:'base-27', title_de:'10 Fremde nach der besten Entscheidung ihres Lebens fragen', title_en:'Ask 10 strangers about the best decision they ever made', category:'social', tags:['conversation','city','reflective'], duration_min:45, duration_max:120, setting:'outdoor', group_mode:'solo', adventure_level:4, equipment:['Notizbuch'], constraints:{budget_max_chf:0,weather_required:'any'}, instructions_de:['Respektvoll um 30 Sekunden bitten.','Die Antwort in einem Satz notieren.','Am Ende drei Muster zusammenfassen.'], instructions_en:['Ask respectfully for 30 seconds of their time.','Write each answer in one sentence.','Summarize three patterns at the end.'], source:'base' },
  { id:'base-28', title_de:'10 Fremde nach der schlechtesten Entscheidung ihres Lebens fragen', title_en:'Ask 10 strangers about the worst decision they ever made', category:'social', tags:['conversation','city','lessons'], duration_min:45, duration_max:120, setting:'outdoor', group_mode:'solo', adventure_level:4, equipment:['Notizbuch'], constraints:{budget_max_chf:0,weather_required:'any'}, instructions_de:['Sensibel und ohne zu drängen fragen.','Nur teilen lassen, was freiwillig kommt.','Eine persönliche Lernnotiz daraus machen.'], instructions_en:['Ask sensitively and without pressure.','Only take what people volunteer freely.','Write one personal lesson from the answers.'], source:'base' },
  { id:'base-29', title_de:'Dich bewusst schick anziehen und Luxusläden nur zur Inspiration besuchen', title_en:'Dress up intentionally and browse luxury stores for inspiration only', category:'mindset', tags:['confidence','city','low_budget'], duration_min:60, duration_max:150, setting:'indoor', group_mode:'solo', adventure_level:2, equipment:['outfit'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Ein Outfit wählen, das dir Haltung gibt.','Zwei bis drei Läden ruhig besuchen.','Notieren, was dich an Stil oder Design inspiriert hat.'], instructions_en:['Pick an outfit that makes you feel composed.','Visit two or three stores calmly.','Note what inspired you in style or design.'], source:'base' },
  { id:'base-30', title_de:'Alleine ins Kino gehen und den Film ohne Ablenkung erleben', title_en:'Go to a movie theater alone and experience the film without distractions', category:'mindset', tags:['solo','mindful','city'], duration_min:90, duration_max:180, setting:'indoor', group_mode:'solo', adventure_level:2, equipment:['ticket'], constraints:{budget_max_chf:30,weather_required:'none'}, instructions_de:['Einen Film wählen, den du wirklich sehen willst.','Handy bis zum Abspann ausgeschaltet lassen.','Danach eine kurze 3-Satz-Review schreiben.'], instructions_en:['Pick a film you genuinely want to watch.','Keep your phone off until credits roll.','Write a short three-sentence review afterwards.'], source:'base' },
  { id:'base-31', title_de:'In einem Café Menschen beobachten und 10 wertfreie Notizen machen', title_en:'People-watch in a café and write 10 non-judgmental observations', category:'creativity', tags:['solo','reflective','city'], duration_min:30, duration_max:90, setting:'indoor', group_mode:'solo', adventure_level:2, equipment:['Notizbuch'], constraints:{budget_max_chf:15,weather_required:'none'}, instructions_de:['Ein neues Café auswählen.','10 konkrete Beobachtungen ohne Wertung notieren.','Aus drei Notizen eine Mini-Story bauen.'], instructions_en:['Choose a café you have not tried before.','Write 10 concrete observations without judgment.','Turn three notes into a mini story.'], source:'base' },
  { id:'base-32', title_de:'Im Gym eine Person fragen, ob ihr einen Satz zusammen trainiert', title_en:'At the gym, ask someone if you can do one set together', category:'fitness', tags:['social','challenge','conversation'], duration_min:30, duration_max:90, setting:'indoor', group_mode:'both', adventure_level:3, equipment:['Gym-Abo'], constraints:{budget_max_chf:20,weather_required:'none'}, instructions_de:['Eine Pause zwischen Sätzen abwarten.','Höflich und klar um einen gemeinsamen Satz bitten.','Dich bedanken und den Flow der Person respektieren.'], instructions_en:['Wait for a natural break between sets.','Ask clearly and politely to share one set.','Thank them and respect their training flow.'], source:'base' },
  { id:'base-33', title_de:'In einer Bar ein neues Gespräch starten und 10 Minuten halten', title_en:'Start a new conversation at a bar and keep it going for 10 minutes', category:'social', tags:['conversation','bold','city'], duration_min:20, duration_max:60, setting:'indoor', group_mode:'solo', adventure_level:4, equipment:['nichts'], constraints:{budget_max_chf:25,weather_required:'none'}, instructions_de:['Mit einer offenen Frage starten.','Aktiv zuhören statt nur erzählen.','Nach 10 Minuten freundlich verabschieden oder vertiefen.'], instructions_en:['Start with an open question.','Listen actively instead of performing.','After 10 minutes, close politely or continue naturally.'], source:'base' },
  { id:'base-34', title_de:'An einem warmen Tag durch einen Brunnenbereich laufen (wo erlaubt)', title_en:'Walk through a public fountain area on a warm day (where allowed)', category:'outdoor', tags:['city','playful','adventure'], duration_min:10, duration_max:30, setting:'outdoor', group_mode:'both', adventure_level:2, equipment:['Wechselkleidung'], constraints:{budget_max_chf:0,weather_required:'dry'}, instructions_de:['Vorher prüfen, ob es dort erlaubt ist.','Handy und Wertsachen trocken sichern.','Den Moment bewusst und kurz geniessen.'], instructions_en:['Check local rules before doing it.','Keep phone and valuables protected.','Enjoy the playful moment briefly and mindfully.'], source:'base' },
  { id:'base-35', title_de:'In einer Arcade bleiben, bis du mindestens ein Spiel gewinnst', title_en:'Go to an arcade and stay until you win at least one game', category:'creativity', tags:['challenge','city','solo'], duration_min:45, duration_max:120, setting:'indoor', group_mode:'both', adventure_level:3, equipment:['Kleingeld'], constraints:{budget_max_chf:30,weather_required:'none'}, instructions_de:['Mit einem Spiel starten, das dir Spass macht.','Nach jeder Runde eine Kleinigkeit anpassen.','Ersten Sieg feiern und dann bewusst Schluss machen.'], instructions_en:['Start with a game you enjoy.','Adjust one small thing after each round.','Celebrate your first win, then end intentionally.'], source:'base' },
  { id:'base-36', title_de:'Früh aufstehen und zum Sonnenaufgang zu einem Aussichtspunkt laufen', title_en:'Wake up early and run to a viewpoint for sunrise', category:'outdoor', tags:['sunrise','challenge','adventure'], duration_min:60, duration_max:150, setting:'outdoor', group_mode:'solo', adventure_level:4, equipment:['Laufschuhe'], constraints:{budget_max_chf:0,weather_required:'dry'}, instructions_de:['Route und Sicherheit am Vorabend planen.','Im ruhigen Tempo zum Spot laufen.','Dort 10 Minuten ohne Musik bleiben.'], instructions_en:['Plan route and safety the evening before.','Run to the spot at a sustainable pace.','Stay there for 10 minutes without music.'], source:'base' },
  { id:'base-37', title_de:'Zu einem Open Mic gehen, bis zum Ende bleiben und einer Person danken', title_en:'Attend an open mic until the end and thank one performer', category:'social', tags:['conversation','creative','city'], duration_min:90, duration_max:180, setting:'indoor', group_mode:'solo', adventure_level:3, equipment:['nichts'], constraints:{budget_max_chf:20,weather_required:'none'}, instructions_de:['Ein lokales Event auswählen.','Bis zum letzten Auftritt bleiben.','Einer auftretenden Person ein ehrliches Kompliment geben.'], instructions_en:['Choose a local event.','Stay through the final performance.','Give one performer a sincere compliment.'], source:'base' },
  { id:'base-38', title_de:'Einer neuen Person ein ehrliches Kompliment machen und weitergehen', title_en:'Give a sincere compliment to someone new and move on respectfully', category:'social', tags:['conversation','bold','respect'], duration_min:5, duration_max:20, setting:'both', group_mode:'solo', adventure_level:3, equipment:['nichts'], constraints:{budget_max_chf:0,weather_required:'any'}, instructions_de:['Kompliment konkret und respektvoll halten.','Keine Gegenleistung erwarten.','Freundlich verabschieden und weitergehen.'], instructions_en:['Keep the compliment specific and respectful.','Expect nothing in return.','Wish them well and move on.'], source:'base' },
  { id:'base-39', title_de:'Einen Tag lang das Handy ausschalten und ohne Plan durch die Stadt laufen', title_en:'Turn your phone off for a day and wander the city without a plan', category:'travel', tags:['solo','city','adventure'], duration_min:180, duration_max:600, setting:'outdoor', group_mode:'solo', adventure_level:4, equipment:['Stadtkarte'], constraints:{budget_max_chf:30,weather_required:'any'}, instructions_de:['Vorher nur Sicherheitskontakt informieren.','Einen Startpunkt setzen und spontan entscheiden.','Drei Orte notieren, die du ohne Karte nie entdeckt hättest.'], instructions_en:['Share your rough plan with a safety contact first.','Pick a start point and decide spontaneously.','Note three places you would not have found with routine navigation.'], source:'base' },
  { id:'base-40', title_de:'Drei Minuten Blickkontakt mit dir selbst im Spiegel halten', title_en:'Hold eye contact with yourself in the mirror for three minutes', category:'mindset', tags:['reflective','solo','challenge'], duration_min:5, duration_max:15, setting:'indoor', group_mode:'solo', adventure_level:2, equipment:['Spiegel'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Einen Timer auf drei Minuten stellen.','Ruhig atmen und Blickkontakt halten.','Danach drei Gefühle aufschreiben.'], instructions_en:['Set a three-minute timer.','Breathe calmly and keep eye contact.','Write down three feelings afterwards.'], source:'base' },
  { id:'base-41', title_de:'Ein ehrliches Selbstgespräch aufschreiben: Was vermeide ich gerade?', title_en:'Write an honest self-conversation: what am I avoiding right now?', category:'mindset', tags:['reflective','journal','solo'], duration_min:20, duration_max:45, setting:'indoor', group_mode:'solo', adventure_level:3, equipment:['Notizbuch'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Zwei Spalten anlegen: Frage und Antwort.','Mindestens fünf harte Fragen stellen.','Mit einer kleinen konkreten Aktion abschliessen.'], instructions_en:['Use two columns: question and answer.','Ask at least five hard questions.','Finish with one concrete next action.'], source:'base' },
  { id:'base-42', title_de:'Mit einer offenen Entscheidung 30 Minuten still sitzen', title_en:'Sit with an avoided decision for 30 minutes in silence', category:'mindset', tags:['reflective','challenge','solo'], duration_min:30, duration_max:45, setting:'indoor', group_mode:'solo', adventure_level:3, equipment:['Timer'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Eine konkrete Entscheidung benennen.','30 Minuten ohne Ablenkung sitzen.','Am Ende den nächsten kleinsten Schritt wählen.'], instructions_en:['Name one specific decision you are avoiding.','Sit for 30 minutes without distractions.','Choose the smallest next step at the end.'], source:'base' },
  { id:'base-43', title_de:'10 Minuten beten, meditieren oder reflektieren ohne etwas zu erzwingen', title_en:'Pray, meditate, or reflect for 10 minutes without forcing answers', category:'mindset', tags:['reflective','calm','solo'], duration_min:10, duration_max:20, setting:'indoor', group_mode:'solo', adventure_level:1, equipment:['nichts'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Einen ruhigen Ort wählen.','Gedanken kommen und gehen lassen.','Einen Satz notieren, der geblieben ist.'], instructions_en:['Choose a quiet place.','Let thoughts come and pass naturally.','Write down one sentence that stayed with you.'], source:'base' },
  { id:'base-44', title_de:'Ein bewusst geplantes Solo-Date mit dir selbst machen', title_en:'Take yourself on an intentionally planned solo date', category:'mindset', tags:['solo','reflective','city'], duration_min:90, duration_max:240, setting:'both', group_mode:'solo', adventure_level:2, equipment:['nichts'], constraints:{budget_max_chf:50,weather_required:'any'}, instructions_de:['Eine kleine Route mit zwei Stopps planen.','Dich behandeln wie einen geschätzten Gast.','Danach einen Highlight-Moment notieren.'], instructions_en:['Plan a simple route with two stops.','Treat yourself like a valued guest.','Note one highlight moment afterwards.'], source:'base' },
  { id:'base-45', title_de:'20 Minuten Musik hören, die exakt zu deiner aktuellen Stimmung passt', title_en:'Listen to music that matches your current mood for 20 minutes', category:'mindset', tags:['solo','reflective','music'], duration_min:20, duration_max:35, setting:'indoor', group_mode:'solo', adventure_level:1, equipment:['Kopfhörer'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Die Stimmung zuerst in drei Wörtern benennen.','Passende Songs ohne Skip auswählen.','Nachher prüfen, was sich verändert hat.'], instructions_en:['Name your mood in three words first.','Pick matching tracks and avoid skipping.','Check what changed afterwards.'], source:'base' },
  { id:'base-46', title_de:'Einen Brief an dein jüngeres Ich schreiben', title_en:'Write a letter to your younger self', category:'mindset', tags:['reflective','journal','healing'], duration_min:20, duration_max:60, setting:'indoor', group_mode:'solo', adventure_level:2, equipment:['Papier'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Ein konkretes Alter als Empfänger wählen.','Drei Dinge nennen: Trost, Rat, Dankbarkeit.','Den Brief datieren und aufbewahren.'], instructions_en:['Pick one specific age as the recipient.','Include comfort, advice, and gratitude.','Date the letter and keep it.'], source:'base' },
  { id:'base-47', title_de:'Heute einmal bewusst Nein sagen, wo du sonst Ja sagen würdest', title_en:'Say no once today where you would usually say yes', category:'mindset', tags:['boundaries','challenge','solo'], duration_min:5, duration_max:20, setting:'both', group_mode:'solo', adventure_level:3, equipment:['nichts'], constraints:{budget_max_chf:0,weather_required:'any'}, instructions_de:['Vorher deinen persönlichen Grund klären.','Kurz, freundlich und ohne Rechtfertigung ablehnen.','Später notieren, wie es sich angefühlt hat.'], instructions_en:['Clarify your reason beforehand.','Decline briefly, kindly, and without overexplaining.','Note how it felt afterwards.'], source:'base' },
  { id:'base-48', title_de:'Eine Stunde nichts tun und es nicht erklären', title_en:'Do nothing for one hour and do not justify it', category:'mindset', tags:['reflective','calm','challenge'], duration_min:60, duration_max:75, setting:'indoor', group_mode:'solo', adventure_level:2, equipment:['Timer'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Timer stellen und alle Benachrichtigungen aus.','Kein Konsum, keine To-do-Liste, kein Scrollen.','Danach einen Satz über deinen inneren Zustand schreiben.'], instructions_en:['Set a timer and mute notifications.','No consumption, no to-do list, no scrolling.','Write one sentence about your inner state afterwards.'], source:'base' },
  { id:'base-49', title_de:'Schreibe auf, wer du bist, wenn niemand zuschaut', title_en:'Write down who you are when no one is watching', category:'mindset', tags:['reflective','identity','journal'], duration_min:15, duration_max:40, setting:'indoor', group_mode:'solo', adventure_level:2, equipment:['Notizbuch'], constraints:{budget_max_chf:0,weather_required:'none'}, instructions_de:['Fünf ungefilterte Eigenschaften notieren.','Eine davon auswählen und morgen bewusst leben.','Abends kurz reflektieren, ob es gelungen ist.'], instructions_en:['Write five unfiltered traits.','Pick one and live it intentionally tomorrow.','Reflect briefly in the evening.'], source:'base' },
  { id:'base-50', title_de:'Abends 30 Minuten achtsam durch einen Park gehen', title_en:'Take a mindful 30-minute evening walk through a park', category:'outdoor', tags:['solo','night','reflective'], duration_min:30, duration_max:45, setting:'outdoor', group_mode:'solo', adventure_level:1, equipment:['bequeme Schuhe'], constraints:{budget_max_chf:0,weather_required:'dry'}, instructions_de:['Eine beleuchtete und sichere Route wählen.','Ohne Kopfhörer auf Geräusche und Gerüche achten.','Zum Schluss eine Beobachtung notieren.'], instructions_en:['Choose a lit and safe route.','Walk without headphones and notice sounds and smells.','Write down one observation at the end.'], source:'base' },

];

/* ──────────────────────────────────────────────
   STORAGE / CONSTANTS
────────────────────────────────────────────── */
const SK  = { custom:'sq_custom', edits:'sq_edits', deleted:'sq_deleted', history:'sq_history', saved:'sq_saved', settings:'sq_settings', lang:'sq_lang' };
const DEF = { exclude_done_from_random:true, show_done_as_grey:true };
const CATS = ['outdoor','creativity','social','mindset','fitness','food','travel'];
const CAT_ICONS = { outdoor:'🌲', creativity:'🎨', social:'🤝', mindset:'🧠', fitness:'⚡', food:'🍽', travel:'✈️' };
const DURATIONS  = { any:null, '5-10':[5,10], '10-20':[10,20], '20-45':[20,45], '45-90':[45,90], '90+':[90,Infinity] };

const lj = (k,fb) => { try { const r=localStorage.getItem(k); return r?JSON.parse(r):fb; } catch { return fb; } };
const sj = (k,v)  => localStorage.setItem(k,JSON.stringify(v));
const iso= ()     => new Date().toISOString();
const esc= (s='') => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const parseList = v => v.split(',').map(x=>x.trim()).filter(Boolean);

const getStore = () => ({
  custom:   lj(SK.custom,  []),
  edits:    lj(SK.edits,   {}),
  deleted:  lj(SK.deleted, []),
  history:  lj(SK.history, []),
  saved:    lj(SK.saved,   []),
  settings: {...DEF, ...lj(SK.settings,{})},
});
const patchStore = p => Object.entries(p).forEach(([k,v])=>sj(SK[k],v));

/* ──────────────────────────────────────────────
   STATE
────────────────────────────────────────────── */
const S = {
  lang:      lj(SK.lang,'de'),
  tab:       'roulette',
  editId:    null,
  winId:     null,
  spinning:  false,
  filters:   { cats:[], dur:'any', setting:'any', group:'any', lvl:1, done:true },
  search:    '',
  histFilter:'all',
};

/* ──────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────── */
const t = () => LANG[S.lang];  // current translations

function qTitle(q)        { return q['title_'+S.lang] || q.title_de; }
function qInstructions(q) { return q['instructions_'+S.lang] || q.instructions_de; }

function doneIds(hist)  { return new Set(hist.filter(h=>h.status==='done').map(h=>h.quest_id)); }
function mergeQuests(store) {
  const del = new Set(store.deleted);
  return [...BASE_QUESTS,...store.custom]
    .filter(q=>!del.has(q.id))
    .map(q=>({...q,...(store.edits[q.id]||{})}));
}
function inBucket(q,b) {
  if(!DURATIONS[b])return true;
  const[mn,mx]=DURATIONS[b];
  return q.duration_min<=mx && q.duration_max>=mn;
}
function filterQuests(qs,f,dset) {
  return qs.filter(q=>{
    if(f.cats.length && !f.cats.includes(q.category))                           return false;
    if(!inBucket(q,f.dur))                                                       return false;
    if(f.setting!=='any' && q.setting!=='both' && q.setting!==f.setting)         return false;
    if(f.group!=='any'   && q.group_mode!=='both' && q.group_mode!==f.group)     return false;
    if(q.adventure_level<f.lvl)                                                  return false;
    if(!f.done && dset.has(q.id))                                                return false;
    return true;
  });
}
function buildCtx() {
  const store=getStore();
  const all=mergeQuests(store);
  const dset=doneIds(store.history);
  const filtered=filterQuests(all,S.filters,dset);
  return{store,all,dset,filtered};
}
function upsertEdit(id,payload) {
  const s=getStore();
  patchStore({edits:{...s.edits,[id]:{...(s.edits[id]||{}),...payload,updated_at:iso()}}});
}

/* ──────────────────────────────────────────────
   SLOT MACHINE — custom CSS/JS scroller
────────────────────────────────────────────── */

const ITEM_H = 96; // px — must match .drum-item height in CSS

/** One drum row as HTML */
function drumItemHTML(q) {
  const icon = CAT_ICONS[q.category] || '';
  const cat  = t().catLabels[q.category] || q.category;
  const dur  = `${q.duration_min}–${q.duration_max} Min`;
  return `<div class="drum-item" data-id="${q.id}">
    <div class="drum-item-cat">${esc(icon + ' ' + cat.toUpperCase())}</div>
    <div class="drum-item-title">${esc(qTitle(q))}</div>
    <div class="drum-item-dur">${esc(dur)}</div>
  </div>`;
}

/** (Re)build the drum strip with given pool */
function buildDrum(pool) {
  const clip = document.querySelector('.drum-clip');
  if (!clip) return false;

  const old = clip.querySelector('.drum-strip');
  if (old) old.remove();
  clip.querySelector('.drum-empty') && clip.querySelector('.drum-empty').remove();

  if (!pool.length) {
    clip.insertAdjacentHTML('beforeend', `<p class="drum-empty">${t().poolEmpty}</p>`);
    return false;
  }

  // Repeat pool enough times for a convincing long scroll (min 60 items total)
  const strip = document.createElement('div');
  strip.className = 'drum-strip';
  const reps = Math.max(5, Math.ceil(60 / pool.length));
  for (let r = 0; r < reps; r++) {
    pool.forEach(q => strip.insertAdjacentHTML('beforeend', drumItemHTML(q)));
  }
  clip.appendChild(strip);
  return true;
}

/**
 * Animate the drum, stopping so winnerIndex (in original pool)
 * is centered in the middle slot.
 *
 * The strip = pool × reps items.
 * We scroll from the top to near the END of the strip, landing
 * so that the winner of the LAST repetition sits in the center slot.
 */
function spinDrum(pool, winnerIndex) {
  return new Promise(resolve => {
    const clip  = document.querySelector('.drum-clip');
    const strip = clip && clip.querySelector('.drum-strip');
    if (!strip) { resolve(); return; }

    const reps    = Math.round(strip.children.length / pool.length);
    const oneLoop = pool.length * ITEM_H;

    // The center slot is ITEM_H px from the top of the clip
    // (first visible row is at 0, second/center at ITEM_H)
    const middleOffset = ITEM_H;

    // Target: winner in the second-to-last rep (leaves a bit of buffer)
    const targetRep = reps - 2;
    const targetY   = targetRep * oneLoop + winnerIndex * ITEM_H - middleOffset;

    const DURATION = 3400; // ms
    const startTime = performance.now();

    function easeOutQuart(x) { return 1 - Math.pow(1 - x, 4); }

    strip.style.transition = 'none';
    strip.style.transform  = 'translateY(0)';

    function frame(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased    = easeOutQuart(progress);
      const y        = targetY * eased;
      strip.style.transform = `translateY(-${y}px)`;
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        strip.style.transform = `translateY(-${targetY}px)`;
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}
/** Instantly position drum so winnerIndex is centered — no animation */
function snapDrum(pool, winnerIndex) {
  const clip  = document.querySelector('.drum-clip');
  const strip = clip && clip.querySelector('.drum-strip');
  if (!strip) return;
  const reps    = Math.round(strip.children.length / pool.length);
  const oneLoop = pool.length * ITEM_H;
  const targetRep = Math.floor(reps / 2); // middle rep
  const targetY   = targetRep * oneLoop + winnerIndex * ITEM_H - ITEM_H;
  strip.style.transition = 'none';
  strip.style.transform  = `translateY(-${targetY}px)`;
}

/* ──────────────────────────────────────────────
   RENDER HELPERS
────────────────────────────────────────────── */
const levelStr = n => '■'.repeat(n)+'□'.repeat(5-n);
const mkBadge  = (txt,cls='') => `<span class="badge ${cls}">${esc(txt)}</span>`;

function renderFilters(c){
  const tr=t();
  const n=c.filtered.length;
  return `
  <div class="panel">
    <div class="panel-hd">
      <span class="panel-title">${tr.filter}</span>
      <span class="panel-count">${tr.results(n)}</span>
    </div>
    <div class="cat-row">
      ${CATS.map(cat=>`<button class="cat-pill${S.filters.cats.includes(cat)?' on':''}" data-cat="${cat}">${CAT_ICONS[cat]} ${tr.catLabels[cat]||cat}</button>`).join('')}
    </div>
    <div class="filter-grid">
      <label>${tr.duration}
        <select data-filter="dur">
          ${Object.keys(DURATIONS).map(d=>`<option value="${d}"${S.filters.dur===d?' selected':''}>${tr.durOpts[d]||d}</option>`).join('')}
        </select>
      </label>
      <label>${tr.setting}
        <select data-filter="setting">
          ${['any','indoor','outdoor'].map(v=>`<option value="${v}"${S.filters.setting===v?' selected':''}>${tr.settingOpts[v]}</option>`).join('')}
        </select>
      </label>
      <label>${tr.group}
        <select data-filter="group">
          ${['any','solo','group'].map(v=>`<option value="${v}"${S.filters.group===v?' selected':''}>${tr.groupOpts[v]}</option>`).join('')}
        </select>
      </label>
      <label>${tr.levelMin}
        <input type="number" min="1" max="5" data-filter="lvl" value="${S.filters.lvl}"/>
      </label>
      <label class="lbl-inline">${tr.includeDone}
        <label class="toggle"><input type="checkbox" data-filter="done"${S.filters.done?' checked':''}><span class="tslider"></span></label>
      </label>
    </div>
  </div>`;
}

function renderQuestCard(q,dset){
  if(!q) return `<div class="no-pick">${t().spinFirst}</div>`;
  const done=dset.has(q.id);
  const tr=t();
  return `
  <article class="quest-card${done?' is-done':''}">
    <div class="qc-header">
      <h3 class="qc-title">${esc(qTitle(q))}</h3>
      <span class="qc-level">${levelStr(q.adventure_level)}</span>
    </div>
    <div class="qc-meta">
      ${mkBadge(CAT_ICONS[q.category]+' '+(tr.catLabels[q.category]||q.category),'b-cat')}
      ${mkBadge('⏱ '+q.duration_min+'–'+q.duration_max+'m')}
      ${mkBadge(q.setting==='both'?'🌍 '+tr.settingOpts.any:q.setting==='outdoor'?'🌤 '+tr.settingOpts.outdoor:'🏠 '+tr.settingOpts.indoor)}
      ${mkBadge(q.group_mode==='both'?'👥 '+tr.groupOpts.any:q.group_mode==='group'?'👥 '+tr.groupOpts.group:'🙋 '+tr.groupOpts.solo)}
      ${q.constraints?.budget_max_chf>0?mkBadge('CHF '+q.constraints.budget_max_chf):''}
      ${done?mkBadge('✓ '+tr.statusDone,'b-done'):''}
    </div>
    <ol class="qc-steps">${qInstructions(q).map(i=>`<li>${esc(i)}</li>`).join('')}</ol>
    ${q.tags?.length?`<div class="qc-meta" style="margin-top:.5rem">${q.tags.map(tag=>mkBadge(tag,'b-tag')).join('')}</div>`:''}
    <div class="qc-actions">
      <button class="btn btn-accent btn-sm" data-action="done" data-id="${q.id}">${tr.doneBtn}</button>
      <button class="btn btn-ghost btn-sm" data-action="skip" data-id="${q.id}">${tr.skipBtn}</button>
      <button class="btn btn-ghost btn-sm" data-action="save" data-id="${q.id}">${tr.saveBtn}</button>
      <button class="btn btn-ghost btn-sm" data-action="spin">${tr.againBtn}</button>
    </div>
  </article>`;
}

/* ──────────────────────────────────────────────
   LAYOUT WRAPPER
────────────────────────────────────────────── */
function layout(content){
  const tr=t();
  return `
  <header>
    <div class="logo-row">
      <span class="logo-main">Sidequest</span>
      <span class="logo-sub">${tr.logoSub}</span>
      <button class="lang-btn" data-action="lang">${tr.langBtn}</button>
    </div>
    <nav>
      ${Object.entries(tr.tabs).map(([id,lbl])=>`<button class="tab${S.tab===id?' active':''}" data-tab="${id}">${lbl}</button>`).join('')}
    </nav>
  </header>
  <main>${content}</main>`;
}

/* ──────────────────────────────────────────────
   VIEWS
────────────────────────────────────────────── */
function viewPicker(c){
  const tr=t();
  const pool=c.filtered.filter(q=>!c.store.settings.exclude_done_from_random||!c.dset.has(q.id));
  const win=c.all.find(q=>q.id===S.winId);
  // Show the drum only while spinning or after the first spin
  const showDrum = S.spinning || !!S.winId;
  return layout(`
    ${renderFilters(c)}
    <div class="panel">
      <div class="panel-hd">
        <span class="panel-title">Slot Machine</span>
        <span class="panel-count">${tr.poolCount(pool.length)}</span>
      </div>
      <div class="picker-zone">
        <button class="btn-spin-big${S.spinning?' is-spinning':''}" id="spin-btn"${S.spinning?' disabled':''}>
          <span>${S.spinning?tr.spinning:tr.spinBtn}</span>
        </button>
        ${showDrum ? `
        <div class="drum-outer">
          <div class="drum-clip">
            <div class="drum-highlight"></div>
          </div>
        </div>
        <p class="drum-hint">${tr.drumHint(pool.length)}</p>
        ` : `
        <div class="drum-cta">
          <span class="drum-cta-arrow">↑</span>
          <span class="drum-cta-text">${tr.spinFirst}</span>
        </div>
        `}
      </div>
      ${renderQuestCard(win,c.dset)}
      <div class="picker-reset-wrap">
        <button class="btn btn-ghost btn-sm" data-action="reset-progress">${tr.resetProgressBtn}</button>
      </div>
    </div>
  `);
}

function viewAll(c){
  const tr=t();
  const q=S.search.toLowerCase();
  const rows=[...c.filtered]
    .filter(x=>!q||qTitle(x).toLowerCase().includes(q)||x.tags?.join(' ').toLowerCase().includes(q))
    .sort((a,b)=>{
      const d=Number(c.dset.has(a.id))-Number(c.dset.has(b.id));
      return d||qTitle(a).localeCompare(qTitle(b));
    });
  return layout(`
    ${renderFilters(c)}
    <div class="panel">
      <div class="panel-hd">
        <span class="panel-title">${tr.allTitle}</span>
        <span class="panel-count">${tr.visible(rows.length)}</span>
      </div>
      <div class="search-input-wrap">
        <input data-action="search-all" placeholder="${tr.searchPlaceholder}" value="${esc(S.search)}"/>
      </div>
      <div class="table-scroll">
        <table>
          <thead><tr>
            <th>${tr.colTitle}</th><th>${tr.colCat}</th>
            <th>${tr.colDur}</th><th>${tr.colStatus}</th><th>${tr.colAct}</th>
          </tr></thead>
          <tbody>${rows.map(q=>`
          <tr class="${c.dset.has(q.id)?'tr-done':''}">
            <td class="td-title">${esc(qTitle(q))}</td>
            <td>${mkBadge(CAT_ICONS[q.category]+' '+(tr.catLabels[q.category]||q.category),'b-cat')}</td>
            <td style="font-family:'DM Mono',monospace;font-size:.65rem;color:var(--muted)">${q.duration_min}–${q.duration_max}</td>
            <td>${c.dset.has(q.id)?mkBadge(tr.statusDone,'b-done'):mkBadge(tr.statusOpen)}</td>
            <td><div class="td-acts">
              <button class="btn btn-ghost btn-sm" data-action="edit"   data-id="${q.id}">${tr.editBtn}</button>
              <button class="btn btn-danger btn-sm" data-action="delete" data-id="${q.id}">${tr.deleteBtn}</button>
            </div></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`);
}

function viewCreate(c){
  const tr=t();
  const q=S.editId?c.all.find(x=>x.id===S.editId):null;
  return layout(`
  <div class="panel">
    <div class="panel-hd"><span class="panel-title">${q?tr.editTitle:tr.createTitle}</span></div>
    <form id="quest-form">
      <input type="hidden" name="id" value="${esc(q?.id||'')}"/>
      <div class="form-grid">
        <label class="col-full">${tr.fTitle}
          <input required minlength="3" maxlength="80" name="title_de" value="${esc(q?.title_de||q?.title||'')}" placeholder="${tr.fTitle}…"/>
        </label>
        <label class="col-full">${tr.fTitle} (EN)
          <input name="title_en" value="${esc(q?.title_en||'')}" placeholder="English title (optional)"/>
        </label>
        <label class="col-full">${tr.fDesc}
          <textarea name="description" placeholder="${tr.fDescPh}">${esc(q?.description||'')}</textarea>
        </label>
        <label>${tr.fCat}
          <select name="category">${CATS.map(cat=>`<option value="${cat}"${q?.category===cat?' selected':''}>${tr.catLabels[cat]||cat}</option>`).join('')}</select>
        </label>
        <label>${tr.fTags}
          <input name="tags" value="${esc((q?.tags||[]).join(','))}" placeholder="${tr.fTagsPh}"/>
        </label>
        <label>${tr.fDurMin}
          <input type="number" name="duration_min" min="1" value="${q?.duration_min||10}"/>
        </label>
        <label>${tr.fDurMax}
          <input type="number" name="duration_max" min="1" value="${q?.duration_max||20}"/>
        </label>
        <label>${tr.fSetting}
          <select name="setting">${['indoor','outdoor','both'].map(v=>`<option${q?.setting===v?' selected':''}>${v}</option>`).join('')}</select>
        </label>
        <label>${tr.fGroup}
          <select name="group_mode">${['solo','group','both'].map(v=>`<option${q?.group_mode===v?' selected':''}>${v}</option>`).join('')}</select>
        </label>
        <label>${tr.fLevel}
          <input type="number" min="1" max="5" name="adventure_level" value="${q?.adventure_level||1}"/>
        </label>
        <label>${tr.fBudget}
          <input type="number" step="1" min="0" name="budget_max_chf" value="${q?.constraints?.budget_max_chf??''}" placeholder="0"/>
        </label>
        <label class="col-full">${tr.fEquip}
          <input name="equipment" value="${esc((q?.equipment||[]).join(','))}"/>
        </label>
        <label class="col-full">${tr.fWeather}
          <select name="weather_required">${['none','dry','any'].map(v=>`<option${q?.constraints?.weather_required===v?' selected':''}>${v}</option>`).join('')}</select>
        </label>
        <label class="col-full">${tr.fSteps} (DE)
          <textarea name="instructions_de" placeholder="${tr.fStepsPh}">${esc((q?.instructions_de||[]).join('\n'))}</textarea>
        </label>
        <label class="col-full">${tr.fSteps} (EN)
          <textarea name="instructions_en" placeholder="Step 1\nStep 2">${esc((q?.instructions_en||[]).join('\n'))}</textarea>
        </label>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">${tr.saveQuestBtn}</button>
        <button type="button" class="btn btn-ghost"  data-action="cancel">${tr.cancelBtn}</button>
      </div>
    </form>
  </div>`);
}

function viewHistory(c){
  const tr=t();
  const rows=[...c.store.history]
    .filter(h=>S.histFilter==='all'||h.status===S.histFilter)
    .sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));
  return layout(`
  <div class="panel">
    <div class="hist-bar">
      <span class="panel-title">${tr.histTitle}</span>
      <select data-action="hist-filter" style="width:auto">
        <option value="all"${S.histFilter==='all'?' selected':''}>${tr.histAll}</option>
        <option value="done"${S.histFilter==='done'?' selected':''}>${tr.histDone}</option>
        <option value="skip"${S.histFilter==='skip'?' selected':''}>${tr.histSkip}</option>
      </select>
    </div>
    <div class="table-scroll">
      <table>
        <thead><tr><th>${tr.colTitle}</th><th>${tr.colStatus}</th><th>${tr.colDate}</th></tr></thead>
        <tbody>${rows.length?rows.map(h=>{
          const q=c.all.find(x=>x.id===h.quest_id);
          return`<tr>
            <td style="max-width:220px">${esc(qTitle(q)||h.quest_id)}</td>
            <td>${h.status==='done'?mkBadge(tr.statusDone,'b-done'):mkBadge(tr.statusSkip)}</td>
            <td style="font-family:'DM Mono',monospace;font-size:.62rem;color:var(--muted)">${new Date(h.timestamp).toLocaleString(S.lang==='de'?'de-CH':'en-GB')}</td>
          </tr>`;
        }).join(''):`<tr><td colspan="3" class="empty-state">${tr.histEmpty}</td></tr>`}</tbody>
      </table>
    </div>
  </div>`);
}

function viewSaved(c){
  const tr=t();
  const items=[...c.store.saved].sort((a,b)=>new Date(b.saved_at)-new Date(a.saved_at));
  return layout(`
  <div class="panel">
    <div class="panel-hd">
      <span class="panel-title">${tr.savedTitle}</span>
      <span class="panel-count">${items.length}</span>
    </div>
    ${items.length?`<ul class="saved-list">${items.map(s=>{
      const q=c.all.find(x=>x.id===s.quest_id);
      return`<li class="saved-item">
        <span>${esc(qTitle(q)||s.quest_id)}</span>
        <span class="saved-date">${new Date(s.saved_at).toLocaleDateString(S.lang==='de'?'de-CH':'en-GB')}</span>
      </li>`;
    }).join('')}</ul>`:`<div class="empty-state"><span class="empty-ico">♡</span>${tr.savedEmpty}</div>`}
  </div>`);
}

function viewSettings(c){
  const tr=t(); const ss=c.store.settings;
  return layout(`
  <div class="panel">
    <div class="panel-hd"><span class="panel-title">${tr.settingsTitle}</span></div>
    ${tr.settingRows.map(row=>`
    <div class="setting-row">
      <div class="setting-info">
        <span class="setting-lbl">${row.l}</span>
        <span class="setting-desc">${row.d}</span>
      </div>
      <label class="toggle">
        <input type="checkbox" data-action="toggle-setting" data-key="${row.k}"${ss[row.k]?' checked':''}>
        <span class="tslider"></span>
      </label>
    </div>`).join('')}
    <div style="margin-top:1.5rem">
      <button class="btn btn-danger" data-action="reset-storage">${tr.resetBtn}</button>
    </div>
  </div>`);
}

/* ──────────────────────────────────────────────
   MAIN RENDER
────────────────────────────────────────────── */
function render(){
  const app=document.getElementById('app');
  const c=buildCtx();
  let html='';
  if     (S.tab==='roulette')  html=viewPicker(c);
  else if(S.tab==='all')       html=viewAll(c);
  else if(S.tab==='create')    html=viewCreate(c);
  else if(S.tab==='history')   html=viewHistory(c);
  else if(S.tab==='saved')     html=viewSaved(c);
  else if(S.tab==='settings')  html=viewSettings(c);
  app.innerHTML=html;
  attachEvents(c);

  // Rebuild drum after render (only on picker tab, not while spinning)
  if(S.tab==='roulette' && !S.spinning){
    const pool=c.filtered.filter(q=>!c.store.settings.exclude_done_from_random||!c.dset.has(q.id));
    // Only build + show the drum if we already have a winner (= at least one spin happened)
    if(S.winId && pool.length){
      buildDrum(pool);
      const winnerIndex = pool.findIndex(q=>q.id===S.winId);
      if(winnerIndex >= 0) snapDrum(pool, winnerIndex);
    }
  }
}

/* ──────────────────────────────────────────────
   EVENTS
────────────────────────────────────────────── */
function attachEvents(c){

  /* Lang toggle */
  document.querySelectorAll('[data-action="lang"]').forEach(b=>b.addEventListener('click',()=>{
    S.lang = S.lang==='de'?'en':'de';
    sj(SK.lang, S.lang);
    render();
  }));

  /* Tabs */
  document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{
    S.tab=b.dataset.tab;
    if(S.tab!=='create')S.editId=null;
    render();
  }));

  /* Category pills */
  document.querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click',()=>{
    const cat=b.dataset.cat;
    const i=S.filters.cats.indexOf(cat);
    i===-1?S.filters.cats.push(cat):S.filters.cats.splice(i,1);
    render();
  }));

  /* Filters */
  document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('change',()=>{
    const k=el.dataset.filter;
    if(el.type==='checkbox') S.filters[k]=el.checked;
    else if(el.type==='number') S.filters[k]=Number(el.value);
    else S.filters[k]=el.value;
    render();
  }));

  /* Search */
  document.querySelectorAll('[data-action="search-all"]').forEach(el=>el.addEventListener('input',()=>{S.search=el.value;render();}));

  /* History filter */
  document.querySelectorAll('[data-action="hist-filter"]').forEach(el=>el.addEventListener('change',()=>{S.histFilter=el.value;render();}));

  /* ── SPIN ── */
  document.getElementById('spin-btn')?.addEventListener('click',()=>{
    const pool=c.filtered.filter(q=>!c.store.settings.exclude_done_from_random||!c.dset.has(q.id));
    if(!pool.length||S.spinning)return;

    // Avoid repeating the currently shown winner when alternatives exist.
    const eligible = (S.winId && pool.length>1) ? pool.filter(q=>q.id!==S.winId) : pool;
    const winnerIndexInEligible=Math.floor(Math.random()*eligible.length);
    const winner=eligible[winnerIndexInEligible];
    const winnerIndex=pool.findIndex(q=>q.id===winner.id);

    S.spinning=true;
    render(); // show spinning state

    // Rebuild drum and start spin
    const ok=buildDrum(pool);
    if(!ok){S.spinning=false;render();return;}

    // Small delay so DOM paints the drum strip before animation starts
    setTimeout(async()=>{
      await spinDrum(pool,winnerIndex);
      S.winId = winner.id;
      S.spinning=false;
      render();
    },30);
  });

  /* Done / Skip */
  document.querySelectorAll('[data-action="done"],[data-action="skip"]').forEach(b=>b.addEventListener('click',()=>{
    const s=getStore();
    patchStore({history:[...s.history,{quest_id:b.dataset.id,status:b.dataset.action,timestamp:iso()}]});
    render();
  }));

  /* Save */
  document.querySelectorAll('[data-action="save"]').forEach(b=>b.addEventListener('click',()=>{
    const s=getStore();
    patchStore({saved:[...s.saved,{quest_id:b.dataset.id,saved_at:iso()}]});
    render();
  }));

  /* Edit */
  document.querySelectorAll('[data-action="edit"]').forEach(b=>b.addEventListener('click',()=>{
    S.editId=b.dataset.id; S.tab='create'; render();
  }));

  /* Delete */
  document.querySelectorAll('[data-action="delete"]').forEach(b=>b.addEventListener('click',()=>{
    if(!confirm(t().confirmDelete))return;
    const s=getStore();
    if(!s.deleted.includes(b.dataset.id)){
      patchStore({deleted:[...s.deleted,b.dataset.id]});
      if(S.winId===b.dataset.id)S.winId=null;
      render();
    }
  }));

  /* Cancel form */
  document.querySelectorAll('[data-action="cancel"]').forEach(b=>b.addEventListener('click',()=>{
    S.tab='all'; S.editId=null; render();
  }));

  /* Settings toggles */
  document.querySelectorAll('[data-action="toggle-setting"]').forEach(cb=>cb.addEventListener('change',()=>{
    const s=getStore();
    patchStore({settings:{...s.settings,[cb.dataset.key]:cb.checked}});
    render();
  }));

  /* Reset */
  document.querySelectorAll('[data-action="reset-storage"]').forEach(b=>b.addEventListener('click',()=>{
    if(!confirm(t().confirmReset))return;
    Object.values(SK).forEach(k=>localStorage.removeItem(k));
    S.filters={cats:[],dur:'any',setting:'any',group:'any',lvl:1,done:true};
    S.winId=null; S.spinning=false;
    render();
  }));

  /* Reset done/skipped progress only */
  document.querySelectorAll('[data-action="reset-progress"]').forEach(b=>b.addEventListener('click',()=>{
    if(!confirm(t().confirmProgressReset))return;
    patchStore({history:[]});
    S.winId=null;
    render();
  }));

  /* Form submit */
  document.getElementById('quest-form')?.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=new FormData(e.target);
    const id=String(fd.get('id')||'').trim()||`custom-${crypto.randomUUID()}`;
    const titleDe=String(fd.get('title_de')||'').trim();
    const titleEn=String(fd.get('title_en')||'').trim();
    const instrDe=String(fd.get('instructions_de')||'').split('\n').map(s=>s.trim()).filter(Boolean);
    const instrEn=String(fd.get('instructions_en')||'').split('\n').map(s=>s.trim()).filter(Boolean);

    if(titleDe.length<3)        return alert(t().errTitle);
    const mn=Number(fd.get('duration_min')), mx=Number(fd.get('duration_max'));
    if(mn>mx)                   return alert(t().errDur);
    if(!instrDe.length)         return alert(t().errSteps);

    const payload={
      id,
      title_de:  titleDe,
      title_en:  titleEn||titleDe,
      description: String(fd.get('description')||'').trim(),
      category:  fd.get('category'),
      tags:      parseList(String(fd.get('tags')||'')),
      duration_min: mn,
      duration_max: mx,
      setting:   fd.get('setting'),
      group_mode:fd.get('group_mode'),
      adventure_level: Number(fd.get('adventure_level')),
      equipment: parseList(String(fd.get('equipment')||'')),
      constraints:{
        budget_max_chf: fd.get('budget_max_chf')?Number(fd.get('budget_max_chf')):undefined,
        weather_required: fd.get('weather_required')||'none',
      },
      instructions_de: instrDe,
      instructions_en: instrEn.length?instrEn:instrDe,
    };

    const s=getStore();
    const inBase=BASE_QUESTS.some(q=>q.id===id);
    const inCustom=s.custom.some(q=>q.id===id);
    if(!inBase&&!inCustom){
      patchStore({custom:[...s.custom,{...payload,created_at:iso(),source:'custom'}]});
    } else {
      upsertEdit(id,payload);
    }
    S.tab='all'; S.editId=null; render();
  });
}

/* ── BOOT ── */
render();
