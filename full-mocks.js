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
    var eligible = PACKS[skill].filter(function (task) {
      return Array.isArray(task.questions) && (task.course === "Both" || task.course === course);
    });
    var sets = shuffle(eligible, random).slice(0, 13);
    var questions = [];
    var sourceText = [];
    sets.forEach(function (task, index) {
      sourceText.push((skill === "listening" ? "RECORDING " : "PASSAGE ") + String(index + 1).padStart(2, "0") + " · " + task.title + "\n" + (skill === "listening" ? task.transcript : task.passage));
      task.questions.forEach(function (question) {
        if (questions.length < 50) {
          questions.push(Object.assign({}, question, {
            q: (skill === "listening" ? "Recording " : "Passage ") + String(index + 1) + " · " + question.q
          }));
        }
      });
    });
    if (questions.length < 50) throw new Error("The original question bank needs at least 50 questions for this mock.");
    var label = skill === "listening" ? "Listening" : "Reading";
    var task = {
      id: "full-" + skill + "-" + number + "-" + Date.now(),
      course: course,
      title: label + " · 50 questions",
      level: "Full mock · " + label,
      format: "Full mock · " + label + " section",
      questions: questions
    };
    task[skill === "listening" ? "transcript" : "passage"] = sourceText.join("\n\n");
    return { skill: skill, task: task };
  }
  function makePerformanceSection(skill, course, part, random, number) {
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
    if (skill === "writing") task.time = part === 1 ? 20 : 40;
    return { skill: skill, task: task };
  }
  function buildFullMock(course, number, seed, isRandom) {
    var random = seededRandom(seed);
    var tasks = [
      makeQuestionSection("listening", course, random, number),
      makeQuestionSection("reading", course, random, number),
      makePerformanceSection("writing", course, 1, random, number),
      makePerformanceSection("writing", course, 2, random, number),
      makePerformanceSection("speaking", course, 1, random, number),
      makePerformanceSection("speaking", course, 2, random, number),
      makePerformanceSection("speaking", course, 3, random, number)
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
      '<section class="page-intro"><p class="eyebrow">100 ORIGINAL FULL MOCK TESTS · FREE</p><h1>Full mock test library</h1><p>Complete all four IELTS skills in one sitting. Choose from 100 numbered test forms or generate a fresh random form. Every attempt is free and can be repeated.</p></section>' +
      courseSwitchMarkup() +
      '<section class="mock-generator"><div><p class="eyebrow">COMPLETE FOUR-SKILL TEST</p><h2>100 full mock tests</h2><p>Each test has 50 Listening questions, 50 Reading questions, Writing Tasks 1 and 2, and Speaking Parts 1, 2 and 3. The content is original Krypton practice material, with no attempt limit.</p><div class="full-mock-count"><span>100 questions</span><span>2 writing tasks</span><span>3 speaking parts</span></div></div><div class="mock-generator-actions mock-library-actions"><label for="full-mock-number">Choose test number<select id="full-mock-number">' + options + '</select></label><button class="button button-outline" data-start-mock="complete-' + (kryptonCourse === "General Training" ? "general" : "academic") + '-selected">Start selected full mock</button><button class="button button-outline" data-start-mock="complete-' + (kryptonCourse === "General Training" ? "general" : "academic") + '-random">Start a fresh random mock</button></div></section>' +
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
        "Listen through the full recording playlist and answer all 50 questions. You can replay the recordings during practice."
      );
    }
    return html;
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
    var count = mockState.mock.extendedTasks.length;
    var timeGuide = ["30 minutes", "60 minutes", "20 minutes", "40 minutes", "4–5 minutes", "3–4 minutes", "4–5 minutes"][index] || "Timed practice";
    var label = part.skill === "writing" ? "Writing Task " + (index - 1) : part.skill === "speaking" ? "Speaking Part " + (index - 3) : SKILL_META[part.skill].label;
    var questionCount = part.task.questions ? part.task.questions.length + " questions" : "Performance task";
    root.innerHTML =
      '<section class="page-intro"><p class="eyebrow">' + esc(mockState.mock.type) + ' · COMPLETE MOCK TEST</p><h1>' + esc(mockState.mock.title) + '</h1><p>Section ' + (index + 1) + ' of ' + count + ' · ' + esc(label) + ' · ' + esc(questionCount) + ' · Suggested time: ' + timeGuide + '</p></section>' +
      '<article class="runner"><div class="runner-top"><span class="runner-step">SECTION ' + (index + 1) + ' / ' + count + ' · ' + esc(label.toUpperCase()) + '</span><span class="timer-pill">' + timeGuide + '</span></div>' +
      '<div class="info-strip">Full test sequence: Listening, Reading, Writing Task 1, Writing Task 2, and Speaking Parts 1–3. Your answers and responses are saved to your private student account as you finish each section.</div>' +
      activityMarkup(part.skill, part.task, true) + '</article>';
  };

  renderMockSummary = function () {
    if (!mockState) return;
    var rows = mockState.results || [];
    root.innerHTML =
      '<section class="page-intro"><p class="eyebrow">FULL MOCK TEST COMPLETE</p><h1>All seven sections are complete.</h1><p>Your objective results and written or speaking responses have been saved in My progress.</p></section>' +
      '<article class="card"><div class="card-head"><div><p class="eyebrow">' + esc(mockState.mock.title) + '</p><h2 class="card-title">Full test results</h2></div></div><div class="recent-list">' +
      rows.map(function (result) {
        return '<div class="recent-item"><span class="recent-badge">' + (SKILL_META[result.skill]?.icon || "✓") + '</span><span class="recent-info"><strong>' + esc(result.title) + '</strong><small>' + esc(SKILL_META[result.skill]?.label || result.skill) + '</small></span>' +
          (result.score !== null ? '<span class="score-chip">' + result.score + '/' + result.total + '</span>' : '<span class="score-chip">Saved</span>') + '</div>';
      }).join("") +
      '</div><div class="runner-actions"><small>Question scores are self-marked. AI writing and speaking scores are practice estimates, not official IELTS results.</small><button class="button button-primary" data-action="finish-mock">Back to mock test library</button></div></article>';
  };
})();