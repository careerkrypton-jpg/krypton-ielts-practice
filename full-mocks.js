/* Full-length original Krypton IELTS mock library. */
(function () {
  var selectedTestNumber = 1;
  var priorCurrentMockTask = currentMockTask;
  currentMockTask = function () {
    if (mockState && mockState.mock && mockState.mock.extendedTasks) {
      return mockState.mock.extendedTasks[mockState.index] || null;
    }
    return priorCurrentMockTask();
  };

  function seededRandom(seed) {
    var state = (Number(seed) >>> 0) || 1;
    return function () {
      state += 0x6D2B79F5;
      var t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(items, random) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }
  function choose(items, random) {
    if (!items.length) throw new Error("The practice library is missing a required original task.");
    return items[Math.floor(random() * items.length)];
  }
  function makeQuestionSection(skill, course, random, number) {
    if (typeof random !== "function") random = seededRandom(random);
    var eligible = PACKS[skill].filter(function (task) {
      return Array.isArray(task.questions) && task.questions.length && (task.course === "Both" || task.course === course);
    });
    var targets = skill === "listening" ? [5, 5, 5, 5] : [5, 5, 5];
    var questions = [];
    var sourceText = [];
    var used = Object.create(null);
    targets.forEach(function (target, sectionIndex) {
      var sectionNumber = sectionIndex + 1;
      var pool = skill === "listening"
        ? eligible.filter(function (task) {
            return Number((String(task.format || "") + " " + String(task.level || "")).match(/Part\s*([1-4])/i)?.[1]) === sectionNumber;
          })
        : eligible.slice();
      pool = shuffle(pool.filter(function (task) { return !used[task.id]; }), random);
      var sectionCount = 0;
      var sectionSources = [];
      pool.forEach(function (task) {
        if (sectionCount >= target) return;
        used[task.id] = true;
        var remaining = target - sectionCount;
        var selectedQuestions = task.questions.slice(0, remaining);
        if (!selectedQuestions.length) return;
        sectionSources.push(task.title + "\n" + (skill === "listening" ? task.transcript || "" : task.passage || ""));
        selectedQuestions.forEach(function (question) {
          questions.push(Object.assign({}, question, {
            q: (skill === "listening" ? "Part " + sectionNumber : "Passage " + sectionNumber) + " · " + question.q
          }));
        });
        sectionCount += selectedQuestions.length;
      });
      if (sectionCount < target) {
        throw new Error("The original " + skill + " bank needs at least " + target + " questions for section " + sectionNumber + ".");
      }
      sourceText.push((skill === "listening" ? "PART " : "PASSAGE ") + sectionNumber + "\n" + sectionSources.join("\n\n"));
    });
    var label = skill === "listening" ? "Listening" : "Reading";
    var task = {
      id: "full-" + skill + "-" + number + "-" + Date.now(),
      course: course,
      title: label + " · " + questions.length + " questions",
      level: "Full mock · " + label,
      format: "Full mock · " + label + " section",
      questions: questions,
      time: skill === "listening" ? 30 : 60,
      sectionCount: targets.length,\n      sections: sectionData,\n      questionSections: sectionData
    };
    task[skill === "listening" ? "transcript" : "passage"] = sourceText.join("\n\n");
    return { skill: skill, task: task };
  }
  function makePerformanceSection(skill, course, part, random, number, speakingTopic) {
    var pool = PACKS[skill].filter(function (task) {
      if (skill === "writing") {
        return (task.course === course || task.course === "Both") && String(task.level || "").indexOf("Task " + part) >= 0;
      }
      return String(task.level || "").indexOf("Part " + part) === 0;
    });
    var picked = choose(pool, random);
    var task = Object.assign({}, picked, {
      id: "full-" + skill + "-" + number + "-" + part + "-" + Date.now(),
      title: picked.title,
      level: skill === "writing" ? course + " · Task " + part : "Speaking · Part " + part,
      format: skill === "writing" ? "Full mock · Writing Task " + part : "Full mock · Speaking Part " + part
    });
    if (skill === "writing") {
      task.time = part === 1 ? 20 : 40;
    } else {
      task.title = "Speaking topic · " + speakingTopic;
      task.prompt = part === 1
        ? "Let’s talk about " + speakingTopic + ". What do you enjoy about it? How often does it come up in your life? Has your experience changed over time? Give a reason or example for each answer."
        : part === 2
        ? "Describe " + speakingTopic + ". You should say what it is or who is involved, when you experienced it, what happened, and explain why it is important to you."
        : "Let’s discuss " + speakingTopic + " more broadly. Why do people have different experiences related to this? How might attitudes or access change in the future? What could communities or institutions do to help?";
      task.hint = part === 2
        ? "Use the one-minute preparation timer, then speak for up to two minutes. Keep this topic connected to your Part 1 and Part 3 discussion."
        : "Answer the questions in complete thoughts and support your ideas with a reason, comparison, or specific example from the same topic.";
      task.time = part === 2 ? 3 : 4;
    }
    return { skill: skill, task: task };
  }
  function makeSpeakingInterview(topic, number, activePart) {
    var cleanTopic = String(topic || "a meaningful experience").trim();
    var part1 = [
      "Do you enjoy " + cleanTopic + "? Why or why not?",
      "When did you first become interested in " + cleanTopic + "?",
      "How often do you spend time thinking about or experiencing it?",
      "Do you usually experience it alone or with other people?",
      "Would you like to experience more of it in the future? Why?"
    ];
    var cueCard = {
      title: "Describe " + cleanTopic + ".",
      bullets: ["when or where it happened", "who was involved", "what you did or experienced", "why it was meaningful to you"]
    };
    var part3 = [
      "How can people's experiences of " + cleanTopic + " differ across generations?",
      "What factors make it easier or harder for people to experience it?",
      "How have technology or social changes influenced it?",
      "What changes do you expect in the future, and why?"
    ];
    var selected = activePart ? Number(activePart) : 0;
    var promptParts = selected === 1
      ? ["Part 1 — answer each short interview question: " + part1.join(" ")]
      : selected === 2
        ? ["Part 2 — respond to this cue card: " + cueCard.title + " You should say " + cueCard.bullets.join(", ") + "."]
        : selected === 3
          ? ["Part 3 — discuss the wider topic: " + part3.join(" ")]
          : [
              "Part 1 — answer each short interview question: " + part1.join(" "),
              "Part 2 — respond to this cue card: " + cueCard.title + " You should say " + cueCard.bullets.join(", ") + ".",
              "Part 3 — discuss the wider topic: " + part3.join(" ")
            ];
    var prompt = "IELTS Speaking practice topic: " + cleanTopic + "\n\n" + promptParts.join("\n\n");
    return {
      skill: "speaking",
      task: {
        id: "speaking-interview-" + String(cleanTopic).toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + (selected || "all") + "-" + number,
        course: "Both",
        title: "Speaking topic · " + cleanTopic,
        level: "Speaking · " + (selected ? "Part " + selected : "Parts 1–3"),
        format: "Speaking · " + (selected ? "Part " + selected : "Full 3-part interview"),
        time: selected === 2 ? 3 : selected ? 5 : 14,
        prompt: prompt,
        hint: selected === 2 ? "Take one minute to prepare, then speak for up to two minutes." : "Answer naturally, extend each answer with a reason or example, and keep your Part 2 and Part 3 ideas connected.",
        speakingFlow: {topic:cleanTopic, part1:part1, cueCard:cueCard, part3:part3, activePart:selected}
      }
    };
  }
  window.kryptonBuildMockQuestionSection = makeQuestionSection;
  window.kryptonBuildSpeakingInterview = makeSpeakingInterview;

  function buildFullMock(course, number, seed, isRandom) {
    var random = seededRandom(seed);
    var topicNames = Array.from(new Set(PACKS.speaking.map(function (task) {
      var title = String(task.title || "");
      var separator = title.indexOf(" · ");
      return separator >= 0 ? title.slice(separator + 3) : title;
    }).filter(Boolean)));
    var speakingTopic = choose(topicNames, random);
    var tasks = [
      makeQuestionSection("listening", course, random, number),
      makeQuestionSection("reading", course, random, number),
      makePerformanceSection("writing", course, 1, random, number),
      makePerformanceSection("writing", course, 2, random, number),
      makeSpeakingInterview(speakingTopic, number, 0)
    ];
    var title = (course === "Academic" ? "Academic" : "General Training") +
      (isRandom ? " Fresh Full Mock" : " Full Mock Test " + String(number).padStart(3, "0"));
    return { id: "full-" + course.toLowerCase().replace(" ", "-") + "-" + seed, title: title, type: course, fullLength: true, extendedTasks: tasks };
  }
  renderMocks = function () {
    var options = Array.from({ length: 100 }, function (_, index) {
      var n = index + 1;
      return '<option value="' + n + '"' + (n === selectedTestNumber ? " selected" : "") + '>Full Mock Test ' + String(n).padStart(3, "0") + '</option>';
    }).join("");
    root.innerHTML =
      '<section class="page-intro"><p class="eyebrow">200 ORIGINAL FULL MOCK FORMS · FREE</p><h1>Full mock test library</h1><p>Complete all four IELTS skills in one sitting. Choose from 100 numbered Academic forms and 100 General Training forms, or generate a fresh random form. Every attempt is free and can be repeated.</p></section>' +
      courseSwitchMarkup() +
      '<section class="mock-generator"><div><p class="eyebrow">COMPLETE FOUR-SKILL TEST</p><h2>200 full mock forms</h2><p>Each test has 20 Listening questions across four parts, 15 Reading questions across three passages, Writing Tasks 1 and 2, and one connected Speaking interview with Parts 1–3. The content is original Krypton practice material, with no attempt limit.</p><div class="full-mock-count"><span>35 scored questions</span><span>2 writing tasks</span><span>3 speaking parts</span></div></div><div class="mock-generator-actions mock-library-actions"><label for="full-mock-number">Choose test number<select id="full-mock-number">' + options + '</select></label><button class="button button-outline" data-start-mock="complete-' + (kryptonCourse === "General Training" ? "general" : "academic") + '-selected">Start selected full mock</button><button class="button button-outline" data-start-mock="complete-' + (kryptonCourse === "General Training" ? "general" : "academic") + '-random">Start a fresh random mock</button></div></section>' +
      '<div class="info-strip"><strong>Suggested timing:</strong> Listening 30 minutes · Reading 60 minutes · Writing 60 minutes · Speaking 11–14 minutes. These are original learning simulations and are not official IELTS papers.</div>' +
      '<div class="note-banner">The supplied books are not copied into this public app. The mock tests use original questions written for Krypton and follow common IELTS task formats.</div>';
  };

  var priorStartMock = startMock;
  startMock = function (id) {
    var match = String(id).match(/^complete-(academic|general)-(selected|random)$/);
    if (!match) {
      priorStartMock(id);
      return;
    }
    if (!requireLogin()) return;
    var course = match[1] === "general" ? "General Training" : "Academic";
    var isRandom = match[2] === "random";
    var number = isRandom ? 0 : selectedTestNumber;
    var seed = isRandom ? Date.now() : number + (course === "Academic" ? 84001 : 193007);
    try {
      kryptonCourse = course;
      mockState = { mock: buildFullMock(course, number, seed, isRandom), index: 0, results: [] };
      activeActivity = null;
      activeSkill = "listening";
      currentView = "activity";
      document.querySelectorAll(".nav-link").forEach(function (nav) { nav.classList.remove("active"); });
      document.querySelector("#crumb-title").textContent = "FULL MOCK TEST";
      renderMockStep();
    } catch (error) {
      console.error(error);
      toast(error.message || "This full mock could not be assembled.");
    }
  };

  document.addEventListener("change", function (event) {
    if (event.target && event.target.id === "full-mock-number") selectedTestNumber = Number(event.target.value) || 1;
  });

  var priorActivityMarkup = activityMarkup;
  activityMarkup = function (skill, task, inMock) {
    var html = priorActivityMarkup(skill, task, inMock);
    if (inMock && mockState && mockState.mock && mockState.mock.fullLength && skill === "listening") {
      html = html.replace(
        "Play the short recording, then answer the questions. You can replay it during practice.",
        "Listen through the four-part recording playlist and answer all 40 questions. You can replay the recordings during practice."
      );
    }
    return html;
  };

  function moduleDetails(index) {
    if (index === 0) return { number: 1, title: "Listening", task: "Listening Parts 1–4", taskNumber: 1, taskTotal: 1 };
    if (index === 1) return { number: 2, title: "Reading", task: "Reading Passages 1–3", taskNumber: 1, taskTotal: 1 };
    if (index === 2 || index === 3) return { number: 3, title: "Writing", task: "Writing Task " + (index - 1), taskNumber: index - 1, taskTotal: 2 };
    return { number: 4, title: "Speaking", task: "Speaking Parts 1–3", taskNumber: 1, taskTotal: 1 };
  }
  function mockModuleNav(activeNumber) {
    var labels = ["Listening", "Reading", "Writing", "Speaking"];
    return '<nav class="mock-module-nav" aria-label="Mock test modules">' + labels.map(function (label, index) {
      var number = index + 1;
      return '<span class="mock-module-step ' + (number === activeNumber ? "active" : number < activeNumber ? "complete" : "") + '"><b>' + number + '</b>' + label + '</span>';
    }).join("") + '</nav>';
  }
  function nextTaskTitle(index) {
    if (index === 1) return "Reading";
    if (index === 2) return "Writing Task 1";
    if (index === 3) return "Writing Task 2";
    if (index === 4) return "Speaking Parts 1–3";
    return "the next section";
  }
  window.kryptonShowMockCheckpoint = function () {
    if (!mockState || !mockState.mock || !mockState.mock.fullLength) return;
    var completed = mockState.mock.extendedTasks[mockState.index - 1];
    var done = moduleDetails(mockState.index - 1);
    var next = moduleDetails(mockState.index);
    var saved = mockState.results[mockState.results.length - 1];
    var moduleMarkup = mockModuleNav(next.number);
    var scoreMarkup = saved && saved.score !== null ? '<span class="score-chip">' + saved.score + '/' + saved.total + ' correct</span>' : '<span class="score-chip">Response saved</span>';
    root.innerHTML =
      '<section class="page-intro"><p class="eyebrow">' + esc(mockState.mock.type) + ' · MODULE ' + done.number + ' COMPLETE</p><h1>' + esc(done.task) + ' complete</h1><p>' + esc(done.title) + ' module · ' + esc(done.task) + ' is saved. Continue within the same mock test when you are ready.</p></section>' +
      moduleMarkup +
      '<article class="card mock-checkpoint"><div class="card-head"><div><p class="eyebrow">YOUR PROGRESS</p><h2 class="card-title">' + esc(done.title) + ' module</h2></div>' + scoreMarkup + '</div>' +
      '<div class="mock-checkpoint-body"><span class="mock-checkpoint-icon">✓</span><div><strong>' + esc(done.task) + ' saved</strong><p>Next in your full mock: <b>' + esc(nextTaskTitle(mockState.index)) + '</b>' + (next.number === done.number ? ' · continuing in the same ' + esc(done.title) + ' module' : ' · next module: ' + esc(next.title)) + '.</p></div></div>' +
      '<div class="runner-actions"><small>Your answers are saved after each task.</small><button class="button button-outline" data-org-runner-back="mocks">Back to mock test studio</button><button class="button button-primary" data-action="continue-full-mock">Continue to ' + esc(nextTaskTitle(mockState.index)) + ' →</button></div></article>';
  };

  renderMockStep = function () {
    if (!mockState) return;
    var part = currentMockTask();
    if (!part) {
      renderMockSummary();
      return;
    }
    activityStartedAt = Date.now();
    var index = mockState.index;
    var details = moduleDetails(index);
    var count = mockState.mock.extendedTasks.length;
    var timeGuide = ["30 minutes", "60 minutes", "20 minutes", "40 minutes", "11–14 minutes"][index] || "Timed practice";
    var questionCount = part.task.speakingFlow ? "Speaking interview · Parts 1–3" : part.task.questions ? part.task.questions.length + " questions" : "Performance task";
    root.innerHTML =
      '<section class="page-intro"><p class="eyebrow">' + esc(mockState.mock.type) + ' · FULL MOCK TEST</p><h1>' + esc(mockState.mock.title) + '</h1><p>Module ' + details.number + ' of 4 · ' + esc(details.title) + ' · ' + esc(details.task) + ' (' + details.taskNumber + ' of ' + details.taskTotal + ') · ' + esc(questionCount) + ' · Suggested time: ' + timeGuide + '</p></section>' +
      mockModuleNav(details.number) +
      '<article class="runner"><div class="runner-top"><span class="runner-step">MODULE ' + details.number + ' / 4 · ' + esc(details.title.toUpperCase()) + ' · ' + esc(details.task.toUpperCase()) + ' ' + details.taskNumber + '/' + details.taskTotal + '</span><span class="timer-pill">' + timeGuide + '</span></div>' +
      '<div class="info-strip">Complete the tasks in order. Writing Task 1 leads to Writing Task 2 in the same module; Speaking Parts 1–3 stay together in the Speaking module.</div>' +
      '<div class="mock-subtask-progress"><span>Task ' + details.taskNumber + ' of ' + details.taskTotal + ' in ' + esc(details.title) + '</span><span>' + (index + 1) + ' of ' + count + ' mock tasks</span></div>' +
      activityMarkup(part.skill, part.task, true) + '</article>';
  };

  document.addEventListener("click", function (event) {
    var button = event.target.closest('[data-action="continue-full-mock"]');
    if (!button || !mockState || !mockState.mock || !mockState.mock.fullLength) return;
    event.preventDefault();
    if (mockState.index >= mockState.mock.extendedTasks.length) renderMockSummary();
    else renderMockStep();
  });

  renderMockSummary = function () {
    if (!mockState) return;
    var rows = mockState.results || [];
    var skillLabels = ["Listening · Parts 1–4", "Reading · Passages 1–3", "Writing Task 1", "Writing Task 2", "Speaking · Parts 1–3"];
    root.innerHTML =
      '<section class="page-intro"><p class="eyebrow">FULL MOCK TEST COMPLETE</p><h1>All four modules are complete.</h1><p>You finished the Listening, Reading, Writing, and Speaking modules. Each task result was saved in My progress.</p></section>' +
      mockModuleNav(5) +
      '<article class="card"><div class="card-head"><div><p class="eyebrow">' + esc(mockState.mock.title) + '</p><h2 class="card-title">Full test results</h2></div></div><div class="recent-list">' +
      rows.map(function (result, index) {
        return '<div class="recent-item"><span class="recent-badge">' + (SKILL_META[result.skill]?.icon || "✓") + '</span><span class="recent-info"><strong>' + esc(skillLabels[index] || result.title) + '</strong><small>' + esc(result.title) + '</small></span>' +
          (result.score !== null ? '<span class="score-chip">' + result.score + '/' + result.total + '</span>' : '<span class="score-chip">Saved</span>') + '</div>';
      }).join("") +
      '</div><div class="runner-actions"><small>Question scores are self-marked. AI writing and speaking scores are practice estimates, not official IELTS results.</small><button class="button button-primary" data-action="finish-mock">Back to mock test library</button></div></article>';
  };

  /* One-page IELTS practice library, grouped by the task structure in each skill. */
  var kryptonPracticeSequence = null;
  renderLibrary = function () {
    var skills = SKILLS;
    var partNames = {1:"Interview",2:"Cue card",3:"Discussion"};
    function category(skill, task) {
      if (skill === "writing") {
        var match = String(task.level || "").match(/Task\s*(1|2)/i);
        return match ? "Task " + match[1] : "Writing practice";
      }
      if (skill === "reading") return task.title;
      return task.title.replace(/^Speaking practice\s*(?:\d+\s*)?·\s*/i, "").replace(/^Speaking topic\s*·\s*/i, "").trim().toLowerCase();
    }
    function startButton(skill, task, sequence) {
      return '<button class="button button-primary" data-start-skill="' + esc(skill) + '" data-task="' + esc(task.id) + '"' +
        (sequence ? ' data-topic-sequence="' + esc(sequence) + '"' : '') + '>Start practice</button>';
    }
    function taskCard(skill, task, detail, sequence) {
      var description = skill === "listening" ? "Listen to the recording, then answer and review the explanations." : skill === "reading" ? "Read the passage or text, answer the questions, then review the explanations." : task.hint || "Develop your answer and support it with relevant detail.";
      var duration = task.questions && task.questions.length ? task.questions.length + " questions" : (task.time || 3) + " min";
      return '<article class="lesson-card organized-task-card"><div class="lesson-meta"><span>' + esc(task.format || task.level || "Practice") + '</span><span class="tag">' + esc(task.course || "Both") + '</span></div><h3>' + esc(task.title) + '</h3><p>' + esc(description) + '</p><div class="lesson-bottom"><small>' + esc(detail || duration) + (detail ? " · " + duration : "") + '</small>' + startButton(skill, task, sequence || "") + '</div></article>';
    }
    function groupedDetails(title, tasks, skill, detailForTask, open) {
      return '<details class="practice-group"' + (open ? ' open' : '') + '><summary><span><strong>' + esc(title) + '</strong><small>' + tasks.length + ' practice ' + (tasks.length === 1 ? 'set' : 'sets') + '</small></span><span class="topic-open-label">Open section →</span></summary><div class="topic-task-list">' + tasks.map(function (task) { return taskCard(skill, task, detailForTask ? detailForTask(task) : "", ""); }).join("") + '</div></details>';
    }
    function readingKey(task) {
      var course = task.course || "Academic";
      var format = String(task.format || "Reading practice").replace(/^Academic\s*·\s*|^General Training\s*·\s*/i, "").replace(/^Academic\s+passage/i, "Passage").replace(/^General Training\s+/i, "").trim();
      return course + " · " + (format || (course === "Academic" ? "Passages" : "Everyday texts"));
    }
    function speakingPart(task) {
      var match = String(task.level || task.format || "").match(/Part\s*([1-3])/i);
      return match ? Number(match[1]) : 1;
    }
    function ensureSpeakingTopics(tasks) {
      var groups = {};
      tasks.forEach(function (task) { var topic = category("speaking", task); (groups[topic] = groups[topic] || []).push(task); });
      Object.keys(groups).forEach(function (topic, index) {
        var present = {};
        groups[topic].forEach(function (task) { present[speakingPart(task)] = true; });
        [1, 2, 3].forEach(function (part) {
          if (present[part]) return;
          var prompt = part === 1
            ? "Answer these questions about " + topic + ": What comes to mind when you think about it? How often do you experience it? Has your experience changed over time?"
            : part === 2
              ? "Describe " + topic + ". You should say what it is, when or where you experienced it, who was involved, and explain why it was meaningful to you."
              : "Why is " + topic + " important to people? How can experiences differ between generations? What changes might happen in the future?";
          var fallback = {id:"topic-fallback-" + index + "-part-" + part,course:"Both",title:"Speaking practice · " + topic,level:"Part " + part + " · " + partNames[part],format:"Speaking · Part " + part,time:part===1?4:part===2?3:5,prompt:prompt,hint:part===1?"Answer naturally, add a reason, and give one short example.":part===2?"Use the one-minute preparation timer, then speak for up to two minutes.":"Explain your view, compare perspectives, and support your answer with an example."};
          tasks.push(fallback);
          groups[topic].push(fallback);
          present[part] = true;
        });
      });
      var existing = new Set(PACKS.speaking.map(function (task) { return task.id; }));
      tasks.forEach(function (task) { if (!existing.has(task.id)) { PACKS.speaking.push(task); existing.add(task.id); } });
      return groups;
    }
    var sections = skills.map(function (skill) {
      var tasks = (PACKS[skill] || []);
      var heading = SKILL_META[skill].label;
      var content = "", groups = {}, groupOrder = [];
      if (skill === "speaking") {
        groups = ensureSpeakingTopics(tasks);
        content = Object.keys(groups).sort(function (a, b) { return a.localeCompare(b); }).map(function (topic, index) {
          var group = groups[topic].slice().sort(function (a, b) { return speakingPart(a) - speakingPart(b); });
          var sequence = "speaking-topic-" + index;
          var uniqueParts = [];
          [1, 2, 3].forEach(function (part) { var task = group.find(function (item) { return speakingPart(item) === part; }); if (task) uniqueParts.push(task); });
          return '<details class="topic-group"><summary><span><strong>' + esc(topic) + '</strong><small>Part 1 · Interview &nbsp; Part 2 · Cue card &nbsp; Part 3 · Discussion</small></span><span class="topic-open-label">Open topic →</span></summary><div class="topic-task-list">' +
            uniqueParts.map(function (task, partIndex) {
              return '<article class="lesson-card topic-task-card"><div class="lesson-meta"><span>' + esc(partNames[partIndex + 1]) + '</span><span class="tag">Part ' + (partIndex + 1) + '</span></div><h3>Part ' + (partIndex + 1) + '</h3><p>' + esc(task.hint || "Answer with a reason and a specific example.") + '</p><div class="lesson-bottom"><small>' + (task.time || 3) + ' min</small>' + startButton(skill, task, sequence) + '</div></article>';
            }).join("") + '</div></details>';
        }).join("");
      } else if (skill === "listening") {
        tasks.forEach(function (task) { var match = String(task.format || task.level || "").match(/Part\s*([1-4])/i); var key = match ? "Part " + match[1] : "Other listening practice"; (groups[key] = groups[key] || []).push(task); });
        groupOrder = ["Part 1", "Part 2", "Part 3", "Part 4", "Other listening practice"].filter(function (key) { return groups[key]; });
        content = groupOrder.map(function (key) { return groupedDetails(key + " · " + ({"Part 1":"Everyday conversation","Part 2":"A speech or announcement","Part 3":"Academic discussion","Part 4":"Lecture"}[key] || "More practice"), groups[key], skill, function (task) { return task.format || "Listening"; }); }).join("");
      } else if (skill === "reading") {
        tasks.forEach(function (task) { var key = readingKey(task); (groups[key] = groups[key] || []).push(task); });
        groupOrder = Object.keys(groups).sort(function (a, b) { return (a.indexOf("Academic")===0?0:1)-(b.indexOf("Academic")===0?0:1) || a.localeCompare(b); });
        content = groupOrder.map(function (key) { return groupedDetails(key, groups[key], skill, function (task) { return task.level || task.format || "Reading"; }); }).join("");
      } else {
        tasks.forEach(function (task) { var match = String(task.level || "").match(/Task\s*(1|2)/i); var taskNo = match ? "Task " + match[1] : "Writing practice"; var visualGroup = task.visual ? ({bar:"Bar charts",line:"Line graphs",pie:"Pie charts",table:"Data tables",map:"Maps",process:"Process diagrams"})[task.visual.type] : ""; var key = (task.course || "Academic") + " · " + taskNo + (visualGroup ? " · " + visualGroup : ""); (groups[key] = groups[key] || []).push(task); });
        groupOrder = ["Academic · Task 1", "Academic · Task 2", "General Training · Task 1", "General Training · Task 2", "Academic · Writing practice", "General Training · Writing practice"].filter(function (key) { return groups[key]; }).concat(Object.keys(groups).filter(function (key) { return key.indexOf(" · Task 1 · ") >= 0; }).sort());
        content = groupOrder.map(function (key) { return groupedDetails(key, groups[key], skill, function (task) { return task.format || task.level || "Writing"; }); }).join("");
      }
      var sectionCount = skill === "speaking" ? Object.keys(groups).length + " speaking topics" : tasks.length + " practice sets";
      return '<section class="practice-module-section" id="module-' + skill + '"><div class="practice-module-heading"><div><p class="eyebrow">MODULE ' + esc(heading.toUpperCase()) + '</p><h2>' + esc(heading) + '</h2><p>' + (skill === "speaking" ? 'Open a topic to practise Parts 1, 2 and 3 in sequence.' : skill === "writing" ? 'Task 1 includes illustrated bar charts, line graphs, pie charts, tables, maps and process diagrams. Open a task to view the illustration. Task 2 essays are listed separately.' : skill === "listening" ? 'Choose a section of the test, then select a practice set.' : 'Browse Academic passages and General Training texts by task type.') + '</p></div><span class="tag">' + sectionCount + '</span></div><div class="topic-list organized-groups">' + content + '</div></section>';
    }).join("");
    root.innerHTML = '<section class="page-intro practice-intro"><p class="eyebrow">ALL FOUR SKILLS · FREE PRACTICE</p><h1>IELTS practice</h1><p>Listening, Reading, Writing and Speaking stay together on one page. Choose a skill to jump to its sections; every task remains available without a subscription.</p></section><nav class="module-jump" aria-label="Jump to a practice skill">' + SKILLS.map(function (skill) { return '<a class="filter-pill" href="#module-' + skill + '">' + SKILL_META[skill].label + '<span>↓</span></a>'; }).join("") + '</nav>' + sections + '<div class="note-banner">Krypton practice uses original questions designed around public IELTS task formats. It does not reproduce official Cambridge, British Council, or IDP question banks.</div>';
  };

  var priorRenderPracticeResult = renderResult;
  renderResult = function (skill, task, score, total, response) {
    priorRenderPracticeResult(skill, task, score, total, response);
    var sequence = kryptonPracticeSequence;
    if (!sequence || sequence.skill !== skill || sequence.tasks[sequence.index]?.id !== task.id) return;
    if (sequence.index + 1 < sequence.tasks.length) {
      var nextTask = sequence.tasks[sequence.index + 1];
      root.insertAdjacentHTML("beforeend", '<article class="card topic-next-card"><p class="eyebrow">SAME SPEAKING TOPIC</p><h2>Continue to ' + esc((String(nextTask.level || "").match(/Part\s*\d/i) || ["the next part"])[0]) + '</h2><p>' + esc(sequence.topic) + '</p><button class="button button-primary" data-action="continue-topic-practice">Continue to next part →</button></article>');
    } else {
      root.insertAdjacentHTML("beforeend", '<article class="card topic-next-card"><p class="eyebrow">TOPIC COMPLETE</p><h2>You finished this Speaking topic</h2><p>Choose another topic to keep practising.</p><button class="button button-outline" data-action="back-to-practice-topics">Back to Speaking topics</button></article>');
      kryptonPracticeSequence = null;
    }
  };
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-start-skill][data-topic-sequence]");
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    var topicTasks = Array.from(button.closest(".topic-task-list").querySelectorAll("[data-start-skill]"));
    var ids = topicTasks.map(function (item) { return item.dataset.task; });
    var topic = button.closest(".topic-group").querySelector("summary strong").textContent;
    var tasks = ids.map(function (id) { return PACKS.speaking.find(function (task) { return task.id === id; }); }).filter(Boolean);
    kryptonPracticeSequence = { skill: "speaking", tasks: tasks, index: Math.max(0, ids.indexOf(button.dataset.task)), topic: topic };
    startActivity("speaking", button.dataset.task);
  }, true);
  document.addEventListener("click", function (event) {
    var next = event.target.closest('[data-action="continue-topic-practice"]');
    if (next && kryptonPracticeSequence) {
      event.preventDefault();
      kryptonPracticeSequence.index += 1;
      startActivity("speaking", kryptonPracticeSequence.tasks[kryptonPracticeSequence.index].id);
      return;
    }
    var back = event.target.closest('[data-action="back-to-practice-topics"]');
    if (back) {
      event.preventDefault();
      setView("practice");
      selectedFilter = "speaking";
      renderLibrary();
    }
  }, true);

})();

