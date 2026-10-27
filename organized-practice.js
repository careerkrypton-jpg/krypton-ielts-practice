/* Krypton IELTS topic-first practice and sectional mock navigation. */
(function () {
  var orgState = { skill: null, section: null, topic: null, visual: "all" };
  var activityReturnContext = null;
  var mockReturnContext = null;
  function copyOrgState() {
    return {skill:orgState.skill,section:orgState.section,topic:orgState.topic,visual:orgState.visual};
  }
  var priorStartActivityForBack = startActivity;
  startActivity = function(skill,id,mockId) {
    activityReturnContext = {view:currentView,state:copyOrgState()};
    if (activityReturnContext.view !== "practice") activityReturnContext.state = {skill:null,section:null,topic:null,visual:"all"};
    priorStartActivityForBack(skill,id,mockId);
  };
  var priorStartMockForBack = startMock;
  startMock = function(id) {
    mockReturnContext = {view:currentView,state:copyOrgState()};
    priorStartMockForBack(id);
  };
  var partNames = {
    listening: {
      "1": "Everyday conversation",
      "2": "Social monologue",
      "3": "Academic discussion",
      "4": "Academic lecture"
    },
    reading: {"1":"Passage 1","2":"Passage 2","3":"Passage 3"},
    writing: {"1":"Task 1","2":"Task 2"}
  };
  var visualNames = {bar:"Bar charts",line:"Line graphs",pie:"Pie charts",table:"Tables",map:"Maps",process:"Process diagrams"};
  var visualLabels = {bar:"Bar chart",line:"Line graph",pie:"Pie chart",table:"Table",map:"Map",process:"Process diagram"};

  function visibleTasks(skill) {
    return (PACKS[skill] || []).filter(function (task) { return skill === "listening" || skill === "speaking" || !task.course || task.course === "Both" || task.course === kryptonCourse; });
  }
  function readingSectionGroups() {
    var groups = [[],[],[]], count = 0;
    visibleTasks("reading").forEach(function (task) {
      var match = (String(task.level || "") + " " + String(task.format || "")).match(/(?:passage|section)\s*([1-3])/i);
      var section = match ? Number(match[1]) : (count++ % 3) + 1;
      groups[section - 1].push(task);
    });
    return groups;
  }
  function partNumber(skill, task) {
    var label = String(task.level || "") + " " + String(task.format || "");
    var match = skill === "listening" ? label.match(/Part\s*([1-4])/i) : null;
    return match ? Number(match[1]) : 0;
  }
  function writingTaskNumber(task) {
    var match = String(task.level || "") + " " + String(task.format || "");
    var found = match.match(/Task\s*([12])/i);
    return found ? Number(found[1]) : 0;
  }
  function cleanSpeakingTopic(task) {
    return String(task.title || "").replace(/^Speaking\s+(?:practice\s*\d*|topic)\s*·\s*/i, "").trim();
  }
  function speakingTopics() {
    var seen = Object.create(null), topics = [];
    (PACKS.speaking || []).forEach(function (task) {
      var name = cleanSpeakingTopic(task);
      if (!name) return;
      var key = name.toLowerCase();
      if (!seen[key]) { seen[key] = true; topics.push(name); }
    });
    ["a memorable journey","a useful skill","a local celebration","a piece of technology"].forEach(function (name) {
      var key = name.toLowerCase();
      if (!seen[key]) { seen[key] = true; topics.push(name); }
    });
    return topics.sort(function (a,b) { return a.localeCompare(b); });
  }
  function taskTopic(task) { return String(task.topic || task.title || task.format || "Practice topic"); }
  function partCard(skill, n, count, descriptor) {
    return '<button class="org-part-card" type="button" data-org-section="' + esc(String(n)) + '"><span class="org-part-number">' + (skill === "writing" ? "TASK " : skill === "reading" ? "PASSAGE " : "PART ") + n + '</span><strong>' + esc(descriptor) + '</strong><small>' + count + ' practice sets</small><span class="org-card-arrow">Explore →</span></button>';
  }
  function taskCard(skill, task, description) {
    var detail = task.questions && task.questions.length ? task.questions.length + " questions" : (task.time || 3) + " min";
    var format = task.format || task.level || SKILL_META[skill].label;
    var badge = skill === "writing" && task.visual ? '<span class="visual-kind-badge">' + esc(visualLabels[task.visual.type] || "Illustration") + '</span>' : "";
    return '<article class="lesson-card organized-task-card org-task-card"><div class="lesson-meta"><span>' + esc(format) + '</span><span class="tag">' + esc(task.course || "Both") + '</span>' + badge + '</div><h3>' + esc(task.title || "Practice set") + '</h3><p>' + esc(description || task.hint || "Original IELTS-style practice with answer review.") + '</p><div class="lesson-bottom"><small>' + esc(detail) + '</small><button class="button button-primary" type="button" data-org-start-task="' + esc(task.id) + '" data-org-skill="' + esc(skill) + '">Start practice →</button></div></article>';
  }
  function backBar(title, target) {
    return '<div class="org-backbar"><button type="button" class="text-button" data-org-back="' + target + '">← Back</button><span>' + esc(title) + '</span></div>';
  }
  function practiceBackLabel(context) {
    var state = context && context.state;
    if (!context || context.view !== "practice" || !state || !state.skill) return "All practice modules";
    if (state.topic) return "Speaking topic: " + state.topic;
    if (state.section) {
      if (state.skill === "listening") return "Listening Part " + state.section + " sets";
      if (state.skill === "reading") return "Reading Passage " + state.section + " sets";
      return "Writing Task " + state.section + " sets";
    }
    return SKILL_META[state.skill].label + " module";
  }
  function runnerBackMarkup(context) {
    var toPractice = !!(context && context.view === "practice");
    var label = toPractice ? practiceBackLabel(context) : "Mock test studio";
    return '<div class="org-runner-back"><button type="button" class="text-button" data-org-runner-back="' + (toPractice ? "practice" : "mocks") + '">← Back to ' + esc(label) + '</button></div>';
  }
  function addRunnerBack(context) {
    if (root && root.firstElementChild) root.insertAdjacentHTML("afterbegin",runnerBackMarkup(context));
  }
  var backNavigationBaseRenderActivity = renderActivity;
  renderActivity = function() {
    backNavigationBaseRenderActivity();
    if (activeActivity && !mockState) addRunnerBack(activityReturnContext);
  };

  function moduleCard(skill) {
    var count = visibleTasks(skill).length;
    var desc = skill === "listening" ? "Four parts · everyday conversations, announcements, discussions and lectures"
      : skill === "reading" ? "Three passage sections · choose Academic or General Training"
      : skill === "writing" ? "Task 1 visuals or letters · Task 2 essays"
      : "Topic-based examiner practice · Parts 1, 2 and 3";
    return '<button class="org-module-card" type="button" data-org-open-skill="' + skill + '"><span class="org-module-icon">' + esc(SKILL_META[skill].icon) + '</span><span class="eyebrow">' + esc(SKILL_META[skill].label.toUpperCase()) + '</span><strong>' + esc(SKILL_META[skill].label) + '</strong><small>' + esc(desc) + '</small><span class="tag">' + count + ' practice sets</span><b>Open module →</b></button>';
  }
  function renderSkillHome(skill) {
    var tasks = visibleTasks(skill);
    if (skill === "speaking") {
      var topics = speakingTopics();
      return '<section class="org-topic-grid">' + topics.map(function (topic) {
        return '<button type="button" class="org-topic-card" data-org-open-topic="' + esc(topic) + '"><span class="eyebrow">SPEAKING TOPIC</span><strong>' + esc(topic) + '</strong><small>Part 1 interview · Part 2 cue card · Part 3 discussion</small><b>Open topic →</b></button>';
      }).join("") + '</section>';
    }
    if (skill === "listening") {
      return '<section class="org-part-grid">' + [1,2,3,4].map(function (n) {
        var items = tasks.filter(function (task) { return partNumber(skill, task) === n; });
        return partCard(skill, n, items.length, partNames.listening[n]);
      }).join("") + '</section>';
    }
    if (skill === "reading") {
      var bySection = readingSectionGroups();
      return '<section class="org-part-grid">' + bySection.map(function (items,i) {
        return partCard(skill, i + 1, items.length, partNames.reading[i + 1]);
      }).join("") + '</section>';
    }
    if (skill === "writing") {
      var academic = kryptonCourse === "Academic";
      var task1 = tasks.filter(function (task) { return writingTaskNumber(task) === 1; });
      var task2 = tasks.filter(function (task) { return writingTaskNumber(task) === 2; });
      var task1Label = academic ? "Charts, maps and processes" : "Letters and everyday writing";
      return '<section class="org-part-grid">' + partCard(skill, 1, task1.length, task1Label) + partCard(skill, 2, task2.length, "Essay questions") + '</section><div class="org-format-note">' + (academic ? "Academic Task 1 includes bar charts, line graphs, pie charts, tables, maps and process diagrams." : "General Training Task 1 focuses on formal, semi-formal and informal letters.") + '</div>';
    }
    return "";
  }
  function renderSectionTopics(skill, section) {
    var tasks = visibleTasks(skill), filtered = [];
    if (skill === "listening") filtered = tasks.filter(function (task) { return partNumber(skill, task) === Number(section); });
    else if (skill === "reading") filtered = readingSectionGroups()[Number(section)-1] || [];
    else if (skill === "writing") filtered = tasks.filter(function (task) { return writingTaskNumber(task) === Number(section); });
    if (skill === "writing" && Number(section) === 1 && kryptonCourse === "Academic") {
      var types = Array.from(new Set(filtered.map(function (task) { return task.visual && task.visual.type; }).filter(Boolean)));
      var controls = '<div class="org-filter-row"><button type="button" class="filter-pill ' + (orgState.visual==="all"?"selected":"") + '" data-org-visual="all">All Task 1</button>' + types.map(function (type) {
        return '<button type="button" class="filter-pill ' + (orgState.visual===type?"selected":"") + '" data-org-visual="' + esc(type) + '">' + esc(visualNames[type] || type) + '</button>';
      }).join("") + '</div>';
      if (orgState.visual !== "all") filtered = filtered.filter(function (task) { return task.visual && task.visual.type === orgState.visual; });
      return controls + '<section class="org-topic-grid org-task-grid">' + filtered.map(function (task) { return taskCard(skill,task,(task.visual && visualNames[task.visual.type] || "Academic Task 1") + " · describe key features, comparisons and trends."); }).join("") + '</section>';
    }
    return '<section class="org-topic-grid org-task-grid">' + filtered.map(function (task) {
      var description = skill === "listening" ? "Part " + section + " · " + partNames.listening[section] + " · Listen, answer, then review explanations."
        : skill === "reading" ? "Passage section " + section + " · Read the text, find evidence, and review explanations."
        : "Writing Task " + section + (section === "1" ? " · practise a clear overview and accurate details." : " · develop a position with reasons and examples.");
      return taskCard(skill, task, description);
    }).join("") + '</section>';
  }
  function speakingFlowTask(topic, part) {
    var built = window.kryptonBuildSpeakingInterview(topic, 0, part || 0);
    var task = built.task;
    task.speakingFlow.topic = topic;
    var existing = PACKS.speaking.find(function (item) { return item.id === task.id; });
    if (!existing) PACKS.speaking.push(task);
    return task;
  }
  function startSpeaking(topic, part) {
    var task = speakingFlowTask(topic, part);
    orgState.skill = "speaking"; orgState.topic = topic; orgState.section = null;
    startActivity("speaking", task.id);
  }
  function fullModuleCTA(skill) {
    var label = SKILL_META[skill].label;
    if (skill === "speaking") {
      return '<section class="org-full-practice"><div><p class="eyebrow">COMPLETE SPEAKING INTERVIEW</p><h2>Practise all three parts together</h2><p>Choose a topic, then complete Part 1, the Part 2 cue card, and the connected Part 3 discussion in one interview.</p></div><div class="org-full-practice-controls"><label for="org-full-speaking-topic">Interview topic<select id="org-full-speaking-topic">' + speakingTopics().map(function(topic){return '<option value="' + esc(topic) + '">' + esc(topic) + '</option>';}).join("") + '</select></label><button class="button button-primary" type="button" data-org-full-module="speaking">Start full interview →</button></div></section>';
    }
    var details = skill === "listening" ? "Complete Parts 1–4 in order · 40 questions · about 30 minutes."
      : skill === "reading" ? "Complete all 3 passages in order · 40 questions · 60 minutes."
      : "Complete Task 1 and Task 2 in order · 60 minutes total.";
    return '<section class="org-full-practice"><div><p class="eyebrow">COMPLETE ' + esc(label.toUpperCase()) + ' PRACTICE</p><h2>Practise the whole module</h2><p>' + esc(details) + ' Your responses and practice score are saved together.</p></div><button class="button button-primary" type="button" data-org-full-module="' + esc(skill) + '">Start full ' + esc(label) + ' practice →</button></section>';
  }

  renderLibrary = function () {
    if (!orgState.skill) {
      root.innerHTML = '<section class="page-intro"><p class="eyebrow">ALL FOUR SKILLS · FREE</p><h1>IELTS practice</h1><p>Choose a module, then select the part, passage or topic you want to practise. Your Academic or General Training pathway stays in one place.</p></section>' + courseSwitchMarkup() + '<section class="org-module-grid">' + SKILLS.map(moduleCard).join("") + '</section><div class="note-banner">Krypton questions are original practice content based on public IELTS formats. Practice estimates are not official IELTS results.</div>';
      return;
    }
    var skill = orgState.skill;
    var label = SKILL_META[skill].label;
    if (skill === "speaking" && orgState.topic) {
      var flow = window.kryptonBuildSpeakingInterview(orgState.topic, 0, 0).task.speakingFlow;
      var parts = [
        {n:1,title:"Part 1 · Interview",desc:"Five short questions about familiar topics."},
        {n:2,title:"Part 2 · Cue card",desc:"One minute to prepare, then speak for up to two minutes."},
        {n:3,title:"Part 3 · Discussion",desc:"Four wider questions connected to your cue-card topic."}
      ];
      root.innerHTML = '<section class="page-intro"><p class="eyebrow">SPEAKING TOPIC</p><h1>' + esc(orgState.topic) + '</h1><p>Practise one part on its own, or complete the three-part interview in order. You can hear each examiner question, record your response, and request an AI practice estimate.</p></section>' + courseSwitchMarkup() + backBar("All speaking topics","skill") + '<div class="org-topic-actions"><button class="button button-primary" type="button" data-org-start-full-speaking>Start full interview · Parts 1–3 →</button></div><section class="org-part-grid">' + parts.map(function (part) {
        return '<article class="org-part-card org-part-static"><span class="org-part-number">PART ' + part.n + '</span><strong>' + esc(part.title) + '</strong><small>' + esc(part.desc) + '</small><button class="button button-outline" type="button" data-org-start-speaking="' + part.n + '">Practise Part ' + part.n + ' →</button></article>';
      }).join("") + '</section>';
      return;
    }
    if (orgState.section) {
      var title = skill === "listening" ? "Part " + orgState.section + " · " + partNames.listening[orgState.section]
        : skill === "reading" ? "Passage " + orgState.section + " · practice sets"
        : "Writing " + partNames.writing[orgState.section];
      root.innerHTML = '<section class="page-intro"><p class="eyebrow">' + esc(label.toUpperCase()) + ' · PRACTICE SETS</p><h1>' + esc(title) + '</h1><p>Choose a topic below to start a focused practice set.</p></section>' + courseSwitchMarkup() + backBar(label + " sections","skill") + renderSectionTopics(skill,orgState.section);
      return;
    }
    root.innerHTML = '<section class="page-intro"><p class="eyebrow">PRACTICE MODULE</p><h1>' + esc(label) + '</h1><p>' + esc(SKILL_META[skill].description) + '</p></section>' + courseSwitchMarkup() + backBar("All four modules","modules") + fullModuleCTA(skill) + renderSkillHome(skill);
  };

  function renderOrgMocks() {
    var options = Array.from({length:100},function(_,index){return '<option value="'+(index+1)+'">Full Mock Test '+String(index+1).padStart(3,"0")+'</option>';}).join("");
    var topics = speakingTopics();
    root.innerHTML =
      '<section class="page-intro"><p class="eyebrow">STRUCTURED PRACTICE · FREE</p><h1>Mock test studio</h1><p>Choose a single-skill sectional mock or take a complete four-skill IELTS practice test. Every mock follows the module flow and keeps your results together.</p></section>' +
      courseSwitchMarkup() +
      '<section class="org-mock-block"><div class="section-head"><div><p class="eyebrow">SECTIONAL MOCKS</p><h2>Practise one module</h2><p>Choose Listening, Reading, Writing or Speaking. The mock follows that skill’s real test parts.</p></div></div><div class="org-mock-grid">' +
      '<button class="org-mock-card" type="button" data-org-sectional="listening"><span class="eyebrow">4 PARTS · 40 QUESTIONS</span><strong>Listening mock</strong><small>Parts 1–4 · 30 minutes</small><b>Start full Listening mock →</b></button>' +
      '<button class="org-mock-card" type="button" data-org-sectional="reading"><span class="eyebrow">3 PASSAGES · 40 QUESTIONS</span><strong>Reading mock</strong><small>' + esc(kryptonCourse) + ' · 60 minutes</small><b>Start full Reading mock →</b></button>' +
      '<button class="org-mock-card" type="button" data-org-sectional="writing"><span class="eyebrow">TASK 1 + TASK 2</span><strong>Writing mock</strong><small>20 minutes then 40 minutes</small><b>Start full Writing mock →</b></button>' +
      '<div class="org-mock-card org-speaking-mock"><span class="eyebrow">PARTS 1–3 · 11–14 MIN</span><strong>Speaking mock</strong><label for="org-mock-topic">Interview topic</label><select id="org-mock-topic">' + topics.map(function(topic){return '<option value="' + esc(topic) + '">' + esc(topic) + '</option>';}).join("") + '</select><button class="button button-primary" type="button" data-org-sectional="speaking">Start full Speaking mock →</button></div>' +
      '</div></section>' +
      '<section class="org-full-mock"><div><p class="eyebrow">COMPLETE IELTS FORMAT</p><h2>Full mock test</h2><p>Listening 4 parts · Reading 3 passages · Writing Tasks 1 and 2 · Speaking Parts 1, 2 and 3. Estimated bands and AI feedback are practice guidance, not official IELTS scores.</p></div><div class="org-full-mock-controls"><label for="full-mock-number">Choose a test<select id="full-mock-number">' + options + '</select></label><button class="button button-outline" type="button" data-start-mock="complete-' + (kryptonCourse === "General Training" ? "general" : "academic") + '-selected">Start selected full mock →</button><button class="button button-primary" type="button" data-start-mock="complete-' + (kryptonCourse === "General Training" ? "general" : "academic") + '-random">Create fresh mock →</button></div></section>' +
      '<div class="info-strip"><strong>IELTS practice timings:</strong> Listening 30 minutes · Reading 60 minutes · Writing 60 minutes · Speaking 11–14 minutes. Content is original Krypton practice material.</div>';
  }
  renderMocks = renderOrgMocks;

  function beginSectionalMock(skill) {
    if (!requireLogin()) return;
    mockReturnContext = {view:currentView,state:copyOrgState()};
    var tasks = [], now = Date.now(), random = Math.floor(Math.random() * 1000000000);
    if (skill === "listening" || skill === "reading") {
      var built = window.kryptonBuildMockQuestionSection(skill, kryptonCourse, Math.random ? Math.random() * 100000 : now, random);
      tasks = [built];
    } else if (skill === "writing") {
      [1,2].forEach(function(number){
        var pool = visibleTasks("writing").filter(function(task){return writingTaskNumber(task)===number;});
        if (!pool.length) throw new Error("No Writing Task " + number + " practice is available for this pathway.");
        var task = pool[Math.floor(Math.random()*pool.length)];
        tasks.push({skill:"writing",task:Object.assign({},task,{id:"sectional-writing-"+number+"-"+now,title:"Writing Task "+number+" · "+task.title,level:kryptonCourse+" · Task "+number,time:number===1?20:40})});
      });
    } else {
      var topic = document.querySelector("#org-mock-topic")?.value || speakingTopics()[0];
      tasks = [window.kryptonBuildSpeakingInterview(topic, now, 0)];
    }
    var id = "sectional-" + skill + "-" + now;
    mockState = {mock:{id:id,title:kryptonCourse+" "+SKILL_META[skill].label+" sectional mock",type:kryptonCourse,sectional:true,extendedTasks:tasks},index:0,results:[],attemptKey:id};
    activeActivity = null; activeSkill = skill; currentView = "activity";
    document.querySelectorAll(".nav-link").forEach(function(nav){nav.classList.remove("active");});
    document.querySelector("#crumb-title").textContent = "SECTIONAL MOCK";
    renderMockStep();
  }
  var baseMockStep = renderMockStep;
  renderMockStep = function () {
    if (!mockState?.mock?.sectional) {
      baseMockStep();
      if (mockState && mockState.mock) addRunnerBack(mockReturnContext);
      return;
    }
    var current = currentMockTask();
    if (!current) { renderMockSummary(); return; }
    activityStartedAt = Date.now();
    var skill = current.skill, task = current.task, step = mockState.index + 1, total = mockState.mock.extendedTasks.length;
    var detail = skill === "writing" ? "Writing Task " + step + " of 2" : skill === "speaking" ? "Speaking Parts 1–3" : skill === "listening" ? "Listening Parts 1–4" : "Reading Passages 1–3";
    var duration = skill === "writing" ? (step === 1 ? "20 minutes" : "40 minutes") : skill === "speaking" ? "11–14 minutes" : skill === "listening" ? "30 minutes" : "60 minutes";
    root.innerHTML = '<section class="page-intro"><p class="eyebrow">' + esc(kryptonCourse) + ' · SECTIONAL MOCK</p><h1>' + esc(mockState.mock.title) + '</h1><p>' + esc(detail) + ' · ' + step + ' of ' + total + '</p></section><nav class="org-mock-progress" aria-label="Mock progress">' + mockState.mock.extendedTasks.map(function(item,index){return '<span class="' + (index===mockState.index?'active':index<mockState.index?'complete':'') + '"><b>' + (index+1) + '</b>' + esc(item.skill==="writing"?"Task "+(index+1):SKILL_META[item.skill].label) + '</span>';}).join("") + '</nav><article class="runner"><div class="runner-top"><span class="runner-step">' + esc(detail.toUpperCase()) + '</span><span class="timer-pill">' + duration + '</span></div>' + activityMarkup(skill,task,true) + '</article>';
    addRunnerBack(mockReturnContext);
  };
  var baseMockSummary = renderMockSummary;
  renderMockSummary = function () {
    if (!mockState?.mock?.sectional) { baseMockSummary(); return; }
    var rows = mockState.results || [];
    var savedRows = sessions.filter(function(session){return session.mock_id===mockState.attemptKey;});
    root.innerHTML = '<section class="page-intro"><p class="eyebrow">SECTIONAL MOCK COMPLETE</p><h1>' + esc(mockState.mock.title) + ' complete</h1><p>Your responses have been saved to My progress. Objective scores are raw practice accuracy; Writing and Speaking feedback is an AI estimate.</p></section><article class="card"><div class="recent-list">' + rows.map(function(row,index){var saved=savedRows.find(function(session){return session.activity_id===mockState.mock.extendedTasks[index]?.task.id;});var feedback=saved?.answer_data?.ai_feedback?.feedback;var mark=row.score!==null?row.score+"/"+row.total+" correct":feedback?"AI band "+Number(feedback.estimated_band).toFixed(1):"Response saved";return '<div class="recent-item"><span class="recent-badge">' + esc(SKILL_META[row.skill]?.icon||"✓") + '</span><span class="recent-info"><strong>' + esc(row.skill==="writing"?"Writing Task "+(index+1):SKILL_META[row.skill].label) + '</strong><small>' + esc(row.title) + '</small></span><span class="score-chip">' + esc(mark) + '</span></div>';}).join("") + '</div><div class="runner-actions"><small>To review detailed feedback or try another module, open My progress or the mock test studio.</small><button class="button button-outline" type="button" data-action="leave-sectional-mock">Back to mock test studio</button></div></article>';
  };

  function flowPartMarkup(part, title, questions, bullets) {
    return '<section class="org-speaking-part"><div class="org-speaking-part-head"><span class="org-part-number">PART ' + part + '</span><div><h3>' + esc(title) + '</h3><p>' + (part===1?"Five short questions · familiar topic":part===2?"One cue card · 1 minute preparation · speak up to 2 minutes":"Four wider follow-up questions · linked to Part 2") + '</p></div></div>' +
      (bullets ? '<div class="org-cue-card"><strong>' + esc(bullets.title) + '</strong><button type="button" class="audio-btn org-hear-question" data-org-hear="' + esc(bullets.title + " " + bullets.bullets.join(". ")) + '" aria-label="Hear cue card">▶ Hear cue card</button><ul>' + bullets.bullets.map(function(item){return '<li>' + esc(item) + '</li>';}).join("") + '</ul><div class="transcript-controls"><button type="button" class="audio-btn" data-action="start-speaking-timer">Start 1-minute preparation</button><span class="timer-pill" id="speaking-timer">01:00 preparation</span></div></div>' :
        '<ol class="org-examiner-questions">' + questions.map(function(question,index){return '<li><span>' + esc(question) + '</span><button type="button" class="audio-btn org-hear-question" data-org-hear="' + esc(question) + '" aria-label="Hear question ' + (index+1) + '">▶ Hear</button></li>';}).join("") + '</ol>') + '</section>';
  }
  var baseActivityMarkup = activityMarkup;
  activityMarkup = function (skill, task, inMock) {
    if (skill !== "speaking" || !task.speakingFlow) return baseActivityMarkup(skill,task,inMock);
    var flow = task.speakingFlow, selected = Number(flow.activePart) || 0, sections = [];
    if (!selected || selected === 1) sections.push(flowPartMarkup(1,"Interview",flow.part1));
    if (!selected || selected === 2) sections.push(flowPartMarkup(2,"Long turn",[],flow.cueCard));
    if (!selected || selected === 3) sections.push(flowPartMarkup(3,"Discussion",flow.part3));
    var title = selected ? "Part " + selected + " response" : "Answers for all three parts";
    return '<div class="org-speaking-runner"><div class="org-speaking-flow">' + sections.join("") + '</div><aside class="org-speaking-answer"><p class="eyebrow">' + (selected?"YOUR RESPONSE":"FULL INTERVIEW RESPONSE") + '</p><h3>' + esc(title) + '</h3><p>Use “Hear” to play an examiner prompt. Record your answers in order or type them below. For a full interview, keep your Part 2 story connected to the Part 3 discussion.</p><textarea class="text-answer" id="student-response" placeholder="Speak your answers in order, or type answers with labels such as Part 1, Question 1…" aria-label="Speaking interview response"></textarea><div class="word-count"><span id="word-count">0 words</span><span>Your recording is sent for transcription only when you choose AI score.</span></div><div class="ai-consent"><strong>Optional microphone recording.</strong> Start once, answer the prompts in order, then stop before scoring. AI feedback is indicative practice guidance, not an official IELTS result.</div><div class="recording-panel"><button class="audio-btn" type="button" data-action="krypton-record-start">● Record answer</button><button class="audio-btn" type="button" data-action="krypton-record-stop" disabled>■ Stop recording</button><button class="audio-btn" type="button" data-action="krypton-record-clear">Remove recording</button><span class="recording-status" id="krypton-recording-status">No recording yet. You can type your answers instead.</span></div><div class="runner-actions"><small>AI feedback uses your transcript and cannot assess pronunciation.</small><button class="button button-primary" data-action="submit-activity">' + (inMock?"AI score and continue →":"AI score and save →") + '</button></div></aside></div>';
  };

  document.addEventListener("click", function (event) {
    var runnerBack = event.target.closest("[data-org-runner-back]");
    if (runnerBack) {
      event.preventDefault(); event.stopImmediatePropagation();
      var destination = runnerBack.dataset.orgRunnerBack;
      if (destination === "practice") {
        var returnContext = mockState ? mockReturnContext : activityReturnContext;
        orgState = returnContext && returnContext.view === "practice"
          ? returnContext.state
          : {skill:null,section:null,topic:null,visual:"all"};
        setView("practice");
      } else {
        setView("mocks");
      }
      return;
    }
    var practiceNav = event.target.closest('[data-view="practice"]');
    if (practiceNav) { orgState = {skill:null,section:null,topic:null,visual:"all"}; return; }
    var openSkill = event.target.closest("[data-org-open-skill]");
    if (openSkill) {
      event.preventDefault(); event.stopImmediatePropagation();
      orgState = {skill:openSkill.dataset.orgOpenSkill,section:null,topic:null,visual:"all"};
      setView("practice"); return;
    }
    var oldOpenSkill = event.target.closest("[data-open-skill]");
    if (oldOpenSkill) {
      event.preventDefault(); event.stopImmediatePropagation();
      orgState = {skill:oldOpenSkill.dataset.openSkill,section:null,topic:null,visual:"all"};
      setView("practice"); return;
    }
    var openSection = event.target.closest("[data-org-section]");
    if (openSection) {
      event.preventDefault(); event.stopImmediatePropagation();
      orgState.section = openSection.dataset.orgSection; orgState.topic = null; orgState.visual = "all";
      renderLibrary(); return;
    }
    var openTopic = event.target.closest("[data-org-open-topic]");
    if (openTopic) {
      event.preventDefault(); event.stopImmediatePropagation();
      orgState.topic = openTopic.dataset.orgOpenTopic; renderLibrary(); return;
    }
    var back = event.target.closest("[data-org-back]");
    if (back) {
      event.preventDefault(); event.stopImmediatePropagation();
      if (back.dataset.orgBack === "modules") orgState = {skill:null,section:null,topic:null,visual:"all"};
      else {orgState.section=null;orgState.topic=null;orgState.visual="all";}
      renderLibrary(); return;
    }
    var fullModule = event.target.closest("[data-org-full-module]");
    if (fullModule) {
      event.preventDefault(); event.stopImmediatePropagation();
      var fullSkill = fullModule.dataset.orgFullModule;
      if (fullSkill === "speaking") {
        var fullTopic = document.querySelector("#org-full-speaking-topic")?.value || speakingTopics()[0];
        startSpeaking(fullTopic,0);
      } else {
        try { beginSectionalMock(fullSkill); } catch(error) { console.error(error); toast(error.message || "This full practice is not ready yet."); }
      }
      return;
    }
    var visual = event.target.closest("[data-org-visual]");
    if (visual) { event.preventDefault();event.stopImmediatePropagation();orgState.visual=visual.dataset.orgVisual;renderLibrary();return; }
    var speaking = event.target.closest("[data-org-start-speaking]");
    if (speaking) { event.preventDefault();event.stopImmediatePropagation();startSpeaking(orgState.topic,Number(speaking.dataset.orgStartSpeaking));return; }
    var fullSpeaking = event.target.closest("[data-org-start-full-speaking]");
    if (fullSpeaking) { event.preventDefault();event.stopImmediatePropagation();startSpeaking(orgState.topic,0);return; }
    var startTask = event.target.closest("[data-org-start-task]");
    if (startTask) { event.preventDefault();event.stopImmediatePropagation();startActivity(startTask.dataset.orgSkill,startTask.dataset.orgStartTask);return; }
    var sectional = event.target.closest("[data-org-sectional]");
    if (sectional) {
      event.preventDefault();event.stopImmediatePropagation();
      try { beginSectionalMock(sectional.dataset.orgSectional); } catch(error) { console.error(error);toast(error.message||"This sectional mock is not ready yet."); }
      return;
    }
    var hear = event.target.closest("[data-org-hear]");
    if (hear) { event.preventDefault();event.stopImmediatePropagation();speak(hear.dataset.orgHear);return; }
    var leave = event.target.closest('[data-action="leave-sectional-mock"]');
    if (leave && mockState?.mock?.sectional) { event.preventDefault();event.stopImmediatePropagation();mockState=null;setView("mocks"); }
  }, true);

  document.addEventListener("input", function(event) {
    if (event.target && event.target.id === "student-response") {
      var count = event.target.value.trim().split(/\s+/).filter(Boolean).length;
      var node = document.querySelector("#word-count");
      if (node) node.textContent = count + " " + (count===1?"word":"words");
    }
  });
  if (currentView === "practice") renderLibrary();
})();
