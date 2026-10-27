/* Band estimates, AI objective feedback, dashboard analytics, and mock summaries. */
(function () {
  "use strict";

  const LISTENING_BANDS = [[39,9],[37,8.5],[35,8],[32,7.5],[30,7],[26,6.5],[23,6],[18,5.5],[16,5],[13,4.5],[10,4],[8,3.5],[6,3],[4,2.5],[2,2],[1,1.5],[0,1]];
  const ACADEMIC_READING_BANDS = [[39,9],[37,8.5],[35,8],[32,7.5],[30,7],[26,6.5],[23,6],[18,5.5],[16,5],[13,4.5],[11,4],[9,3.5],[6,3],[3,2.5],[1,2],[0,1]];
  const GENERAL_READING_BANDS = [[40,9],[39,8.5],[37,8],[36,7.5],[34,7],[32,6.5],[30,6],[27,5.5],[23,5],[19,4.5],[15,4],[12,3.5],[9,3],[6,2.5],[3,2],[1,1.5],[0,1]];
  const objectiveContextKey = "kryptonObjectiveContext";

  function estimateBand(skill, score, total, course) {
    if (!Number.isFinite(Number(score)) || !Number.isFinite(Number(total)) || Number(total) <= 0) return null;
    const scaled = Math.max(0, Math.min(40, Math.round(Number(score) / Number(total) * 40)));
    const table = skill === "listening" ? LISTENING_BANDS : course === "General Training" ? GENERAL_READING_BANDS : ACADEMIC_READING_BANDS;
    const row = table.find(function (item) { return scaled >= item[0]; });
    return row ? row[1] : 1;
  }

  function roundHalf(value) { return Math.round(value * 2) / 2; }
  function sessionBand(session) {
    const data = session.answer_data || {};
    const feedback = data.ai_feedback || {};
    const saved = Number(feedback.estimated_band ?? data.band_estimate);
    if (Number.isFinite(saved) && saved > 0) return saved;
    if ((session.module === "reading" || session.module === "listening") && session.total) {
      return estimateBand(session.module, session.score, session.total, data.course || "Academic");
    }
    return null;
  }

  function skillSummary(rows) {
    return SKILLS.map(function (skill) {
      const recent = rows.filter(function (session) { return session.module === skill; }).slice(0, 8);
      const bands = recent.map(sessionBand).filter(function (band) { return Number.isFinite(band); });
      const latest = bands.length ? bands[0] : null;
      const average = bands.length ? roundHalf(bands.reduce(function (sum, band) { return sum + band; }, 0) / bands.length) : null;
      const lastRaw = recent.find(function (session) { return session.total && session.score !== null; });
      return { skill: skill, latest: latest, average: average, attempts: recent.length, raw: lastRaw ? lastRaw.score + "/" + lastRaw.total : "" };
    });
  }

  function topMistakes(rows) {
    const totals = new Map();
    rows.filter(function (session) { return session.module === "reading" || session.module === "listening"; }).forEach(function (session) {
      const data = session.answer_data || {};
      (data.review || []).forEach(function (item) {
        if (item.selected === item.correct) return;
        const type = item.question_type || data.task_format || (session.module === "reading" ? "Reading questions" : "Listening questions");
        const key = session.module + "\u0000" + type;
        const entry = totals.get(key) || { skill: session.module, type: type, count: 0 };
        entry.count += 1;
        totals.set(key, entry);
      });
    });
    return Array.from(totals.values()).sort(function (a, b) { return b.count - a.count; }).slice(0, 4);
  }

  function coachingTips(rows) {
    const tips = [];
    rows.forEach(function (session) {
      const feedback = session.answer_data && session.answer_data.ai_feedback;
      (feedback && feedback.next_steps || []).forEach(function (tip) {
        if (tip && !tips.includes(tip)) tips.push(tip);
      });
    });
    return tips.slice(0, 4);
  }

  function progressPanel(rows, detailed) {
    const summary = skillSummary(rows);
    const target = Number(profile && profile.target_band) || 7;
    const cards = summary.map(function (item) {
      const label = SKILL_META[item.skill].label;
      const band = item.average === null ? "Not scored yet" : "Band " + item.average.toFixed(1);
      const width = item.average === null ? 0 : Math.min(100, item.average / 9 * 100);
      const raw = item.raw ? '<small class="coach-raw">Latest objective result: ' + esc(item.raw) + '</small>' : "";
      return '<article class="coach-skill-card"><div class="coach-skill-top"><span class="module-icon">' + SKILL_META[item.skill].icon + '</span><span>' + esc(label) + '</span></div><strong>' + esc(band) + '</strong><div class="coach-band-track" aria-label="' + esc(label + " band " + (item.average === null ? "not scored" : item.average)) + '"><span style="width:' + width + '%"></span></div><small>' + item.attempts + ' recent attempt' + (item.attempts === 1 ? "" : "s") + (item.average === null ? "" : " · target " + target.toFixed(1)) + '</small>' + raw + '</article>';
    }).join("");
    const weak = topMistakes(rows);
    const tips = coachingTips(rows);
    const weakMarkup = weak.length ? '<ul>' + weak.map(function (item) { return '<li><strong>' + esc(SKILL_META[item.skill].label) + ' · ' + esc(item.type) + '</strong><span>' + item.count + ' missed answer' + (item.count === 1 ? "" : "s") + '</span></li>'; }).join("") + '</ul>' : '<p class="coach-empty">Finish a Reading or Listening set to see the question types to practise next.</p>';
    const tipMarkup = tips.length ? '<ul>' + tips.map(function (tip) { return '<li>' + esc(tip) + '</li>'; }).join("") + '</ul>' : '<p class="coach-empty">AI coaching suggestions appear here after scored practice.</p>';
    return '<section class="coach-panel ' + (detailed ? "coach-panel-detailed" : "") + '"><div class="coach-panel-heading"><div><p class="eyebrow">YOUR IELTS PERFORMANCE</p><h2>' + (detailed ? "Bands, mistakes and next steps" : "Recent band estimates") + '</h2><p>Listening and Reading use approximate raw-score conversions. Writing and Speaking use AI practice estimates. None are official IELTS results.</p></div><span class="tag">' + rows.length + ' saved session' + (rows.length === 1 ? "" : "s") + '</span></div><div class="coach-skill-grid">' + cards + '</div><div class="coach-insight-grid"><article><p class="eyebrow">QUESTION TYPES TO REVIEW</p>' + weakMarkup + '</article><article><p class="eyebrow">AI COACH · NEXT STEPS</p>' + tipMarkup + '</article></div></section>';
  }

  const oldActivityMarkup = activityMarkup;
  activityMarkup = function (skill, task, inMock) {
    let html = oldActivityMarkup(skill, task, inMock);
    if (skill === "reading" || skill === "listening") {
      const note = '<div class="ai-consent objective-consent">After you finish, Krypton marks your answers, estimates a practice band, and sends missed-answer details securely for AI coaching. The estimate is for practice only.</div>';
      html = html.replace('<div class="runner-actions">', note + '<div class="runner-actions">');
      html = html.replace('data-action="submit-activity">Finish practice and save', 'data-action="submit-activity">Finish and see score');
      html = html.replace('data-action="submit-activity">Save and continue →', 'data-action="submit-activity">Score and continue →');
    }
    return html;
  };

  const oldRenderAiFeedbackCard = renderAiFeedbackCard;
  renderAiFeedbackCard = function (feedback) {
    if (feedback && (feedback.module === "reading" || feedback.module === "listening")) {
      const copy = Object.assign({}, feedback, { criteria: (feedback.criteria || []).map(function (item) { return Object.assign({}, item, { band: "" }); }) });
      const title = feedback.feedback_source === "raw-score-only" ? "KRYPTON " + feedback.module.toUpperCase() + " PRACTICE SCORE" : "KRYPTON " + feedback.module.toUpperCase() + " SCORE & AI COACH";
      return oldRenderAiFeedbackCard(copy)
        .replace("KRYPTON AI PRACTICE FEEDBACK", title)
        .replace("Indicative band estimate", "Practice band estimate")
        .replace(/<span>Estimated band <\/span>/g, "")
        .replace('<div class="ai-band"><strong>', '<div class="ai-band"><strong>');
    }
    return oldRenderAiFeedbackCard(feedback);
  };

  const oldRenderOverview = renderOverview;
  renderOverview = function () {
    oldRenderOverview();
    if (!currentUser) return;
    const anchor = root.querySelector(".plan-banner") || root.querySelector(".hero-row");
    if (anchor) anchor.insertAdjacentHTML("afterend", progressPanel(sessions, false));
  };

  const oldRenderHistory = renderHistory;
  renderHistory = function () {
    oldRenderHistory();
    if (currentUser) root.insertAdjacentHTML("beforeend", progressPanel(sessions, true));
  };

  function selectedAnswers(task) {
    const wrong = [];
    const answers = [];
    let score = 0;
    task.questions.forEach(function (question, index) {
      const selected = document.querySelector('input[name="q' + index + '"]:checked');
      const value = selected ? Number(selected.value) : null;
      answers.push(value);
      if (value === question.answer) score += 1;
      else wrong.push({
        question: question.q,
        question_type: question.type || task.question_type || task.format || task.level || task.title,
        selected: value === null ? "No answer" : question.options[value],
        correct_answer: question.options[question.answer],
        explanation: question.why || "Review the evidence in the passage or recording."
      });
    });
    return { score: score, total: task.questions.length, answers: answers, wrong: wrong };
  }

  function fallbackObjectiveFeedback(skill, band, context) {
    const types = Array.from(new Set(context.wrong.map(function (item) { return item.question_type; }))).slice(0, 3);
    const readingTips = [
      "For every answer, point to a sentence that proves it; do not rely on a familiar word alone.",
      "For True / False / Not Given, separate information that contradicts the passage from information the passage never states.",
      "Track paraphrases and synonyms between the question and the passage before choosing an option."
    ];
    const listeningTips = [
      "Preview the questions and predict the kind of detail you need before listening.",
      "Listen for corrections, contrast words and changed plans; the first detail mentioned may not be the final answer.",
      "Check spelling, names, numbers and word limits after each section."
    ];
    const tips = skill === "reading" ? readingTips : listeningTips;
    return {
      module: skill, feedback_source: "raw-score-only", estimated_band: band,
      criteria: [
        { name: skill === "reading" ? "Reading accuracy" : "Listening accuracy", band: "", feedback: context.wrong.length ? context.wrong.length + " answer(s) need review in this set." : "All answers were correct in this set." },
        { name: "Question-type strategy", band: "", feedback: types.length ? "Review: " + types.join(", ") + "." : "Keep using evidence and checking details consistently." }
      ],
      strengths: context.wrong.length ? [context.score + " of " + context.total + " answers were correct."] : ["You answered every question correctly."],
      next_steps: context.wrong.length ? tips.slice(0, 2) : ["Try a new set with a different topic and keep the same checking routine."],
      next_step: "Use the question explanations below, then retry a new set.", transcript: ""
    };
  }

  async function scoreObjectiveActivity(button, skill, task, inMock) {
    const result = selectedAnswers(task);
    const course = profile && profile.test_type || kryptonCourse || "Academic";
    const band = estimateBand(skill, result.score, result.total, course);
    const context = { skill: skill, course: course, format: task.format || task.level || task.title, score: result.score, total: result.total, band_estimate: band, wrong: result.wrong };
    const oldLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Scoring and saving…";
    kryptonAiFeedback = null;
    kryptonAiError = "";
    let feedback;
    try {
      const payload = {
        module: skill, course: course, task_type: context.format,
        prompt: task.title + (skill === "reading" ? " · Read the passage and answer the questions." : " · Listen to the recording and answer the questions."),
        response: "Objective score: " + result.score + " of " + result.total + ". Missed answers: " + result.wrong.length + ".",
        objective: { correct: result.score, total: result.total, band_estimate: band, wrong_answers: result.wrong.slice(0, 12) }
      };
      const scored = await db.functions.invoke("score-ielts-response", { body: payload });
      if (scored.error) throw scored.error;
      feedback = scored.data && scored.data.feedback;
      if (!feedback) throw new Error("No AI feedback returned.");
      feedback.module = skill;
      feedback.feedback_source = "raw-score-and-ai-coach";
      feedback.estimated_band = band;
      feedback.band_note = result.total < 40 ? "Short-set indicator scaled to 40 questions; full-test conversions vary by test version." : "Approximate raw-score conversion; test versions can vary.";
    } catch (error) {
      console.error("Objective AI coaching unavailable", error);
      feedback = fallbackObjectiveFeedback(skill, band, context);
      kryptonAiError = "AI coaching could not load just now. Your marked score and band estimate were still saved.";
    }
    window[objectiveContextKey] = {
      skill: skill, course: course, task_format: context.format,
      band_estimate: band, band_note: feedback.band_note || "Approximate practice estimate; short tasks are less reliable than a full test.",
      question_types: Array.from(new Set(task.questions.map(function (question) { return question.type || task.format || task.level || skill; }))),
      wrong: result.wrong
    };
    kryptonAiFeedback = feedback;
    try {
      button.textContent = oldLabel;
      await kryptonOriginalSubmitActivity();
    } finally {
      window[objectiveContextKey] = null;
    }
  }

  document.addEventListener("click", function (event) {
    const button = event.target.closest('[data-action="submit-activity"]');
    if (!button) return;
    const part = currentKryptonTask();
    if (!part || (part.skill !== "reading" && part.skill !== "listening") || !Array.isArray(part.task.questions)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    scoreObjectiveActivity(button, part.skill, part.task, Boolean(mockState)).catch(function (error) {
      console.error("Could not save objective practice", error);
      button.disabled = false;
      button.textContent = "Finish and see score";
    });
  }, true);

  const oldSaveSession = saveSession;
  saveSession = async function (skill, task, score, total, response, mockId) {
    const answer = Object.assign({}, response || {});
    const context = window[objectiveContextKey];
    if (context && context.skill === skill) {
      answer.course = context.course;
      answer.task_format = context.task_format;
      answer.band_estimate = context.band_estimate;
      answer.band_note = context.band_note;
      answer.question_types = context.question_types;
      answer.review = (answer.review || []).map(function (item, index) {
        return Object.assign({}, item, { question_type: task.questions[index] && (task.questions[index].type || task.format || task.level || skill) });
      });
    }
    const attemptKey = mockState && mockState.attemptKey;
    return oldSaveSession(skill, task, score, total, answer, attemptKey || mockId);
  };

  const oldStartMock = startMock;
  startMock = function (id) {
    const previous = mockState;
    oldStartMock(id);
    if (mockState && mockState !== previous && mockState.mock) {
      mockState.attemptKey = "run-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    }
  };

  function mockBands(rows) {
    return SKILLS.map(function (skill) {
      const sessionsForSkill = rows.filter(function (session) { return session.module === skill; });
      const bands = sessionsForSkill.map(sessionBand).filter(function (band) { return Number.isFinite(band); });
      return { skill: skill, band: bands.length ? roundHalf(bands.reduce(function (sum, band) { return sum + band; }, 0) / bands.length) : null, count: sessionsForSkill.length };
    });
  }

  const oldRenderMockSummary = renderMockSummary;
  renderMockSummary = function () {
    oldRenderMockSummary();
    if (!mockState || !mockState.attemptKey) return;
    const attemptRows = sessions.filter(function (session) { return session.mock_id === mockState.attemptKey; });
    const bands = mockBands(attemptRows);
    const valid = bands.filter(function (item) { return item.band !== null; });
    const overall = valid.length === 4 ? roundHalf(valid.reduce(function (sum, item) { return sum + item.band; }, 0) / 4) : null;
    const bandCards = bands.map(function (item) {
      return '<article class="mock-band-card"><span>' + esc(SKILL_META[item.skill].label) + '</span><strong>' + (item.band === null ? "Pending AI score" : "Band " + item.band.toFixed(1)) + '</strong><small>' + item.count + ' task' + (item.count === 1 ? "" : "s") + '</small></article>';
    }).join("");
    const tips = coachingTips(attemptRows);
    const mistakes = topMistakes(attemptRows);
    const advice = tips.length ? '<ul>' + tips.map(function (tip) { return '<li>' + esc(tip) + '</li>'; }).join("") + '</ul>' : '<p>Review the explanations on objective questions and the skill feedback saved in My progress.</p>';
    const mistakesMarkup = mistakes.length ? '<p class="mock-focus"><strong>Most missed:</strong> ' + mistakes.map(function (item) { return esc(SKILL_META[item.skill].label + " · " + item.type + " (" + item.count + ")"); }).join("; ") + '</p>' : "";
    root.insertAdjacentHTML("beforeend", '<section class="coach-panel mock-score-panel"><div class="coach-panel-heading"><div><p class="eyebrow">ESTIMATED MOCK RESULTS</p><h2>' + (overall === null ? "Section scores" : "Overall practice band " + overall.toFixed(1)) + '</h2><p>Listening and Reading use approximate answer-count conversions. Writing and Speaking use AI estimates. The official overall score is rounded to the nearest half band.</p></div><span class="tag">Practice estimate</span></div><div class="mock-band-grid">' + bandCards + '</div><div class="coach-insight-grid"><article><p class="eyebrow">WHAT TO IMPROVE</p>' + mistakesMarkup + advice + '</article><article><p class="eyebrow">NEXT PRACTICE</p><p>Use one suggestion now, then repeat the weakest skill section. Your saved module feedback is available in My progress.</p></article></div></section>');
  };
})();

