/* IELTS response formats and real practice countdowns. */
(function () {
  "use strict";
  var typeNames = {
    "multiple-choice":"Multiple choice",
    "multiple-choice-multiple":"Multiple choice · choose all that apply",
    "short-answer":"Short answer",
    "sentence-completion":"Sentence completion",
    "summary-completion":"Summary completion",
    "table-completion":"Table completion",
    "flow-chart-completion":"Flow-chart completion",
    "form-note-completion":"Form / note completion",
    "diagram-labelling":"Diagram labelling",
    "list-selection":"Pick from a list",
    "matching":"Matching",
    "matching-information":"Matching information",
    "matching-features":"Matching features",
    "matching-headings":"Matching headings",
    "matching-sentence-endings":"Matching sentence endings",
    "true-false-not-given":"True / False / Not Given",
    "yes-no-not-given":"Yes / No / Not Given"
  };
  var visualStyle = document.createElement("style");
  visualStyle.textContent = ".ielts-timer{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:1rem 0;padding:1rem 1.2rem;border:1px solid #dbe5f2;border-radius:16px;background:#f5f9ff}.ielts-timer-face{display:block;font-size:1.55rem;font-variant-numeric:tabular-nums;color:#102b52}.ielts-timer-status{display:block;color:#64748b}.ielts-timer-controls{display:flex;gap:.5rem}.ielts-question-group{margin:1.1rem 0}.ielts-question-group>h3{margin:.3rem 0 .7rem;color:#1b365f;font-size:1rem}.ielts-question-group-items{display:grid;gap:.7rem}.ielts-q-head{display:flex;align-items:center;gap:.6rem;margin-bottom:.65rem}.ielts-q-number{display:grid;place-items:center;width:1.8rem;height:1.8rem;border-radius:50%;background:#e9f2ff;color:#1456a0;font-weight:700}.ielts-q-type{padding:.25rem .6rem;border-radius:99px;background:#eef2f7;color:#45546a;font-size:.76rem;font-weight:700}.ielts-question-prompt{display:block;margin-bottom:.8rem}.ielts-text-answer,.ielts-select-answer{width:100%;max-width:32rem;min-height:2.8rem;padding:.7rem .8rem;border:1px solid #b9c8dc;border-radius:10px;background:#fff;font:inherit}.ielts-format-guide{margin:.6rem 0;color:#58677d;font-size:.9rem}.ielts-legacy-answer{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@media(max-width:560px){.ielts-timer{align-items:flex-start;flex-direction:column}.ielts-timer-controls{width:100%}.ielts-timer-controls button{flex:1}}";
  document.head.appendChild(visualStyle);
  var timerStates = Object.create(null);
  var timerInterval = null;
  var activeTimerKey = null;
  var timerMessageShown = Object.create(null);

  function normalizedType(value) {
    var key = String(value || "multiple-choice").toLowerCase().trim()
      .replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    var aliases = {
      "mcq":"multiple-choice","multiple-choice-single-answer":"multiple-choice",
      "multiple-choice-multiple-answers":"multiple-choice-multiple",
      "tfng":"true-false-not-given","true-false-not-given":"true-false-not-given",
      "ynng":"yes-no-not-given","diagram-label":"diagram-labelling",
      "diagram-completion":"diagram-labelling","pick-from-a-list":"list-selection",
      "pick-from-list":"list-selection","matching-paragraph-information":"matching-information",
      "matching-paragraph-info":"matching-information","sentence-ending":"matching-sentence-endings"
    };
    return aliases[key] || key;
  }
  function questionType(task, question, index) {
    var explicit = question.questionType || question.question_type || question.type ||
      (task.questionTypes && task.questionTypes[index]) || task.questionType || task.question_type;
    if (explicit) return normalizedType(explicit);
    var format = String(task.format || "");
    var match = format.match(/short answer|sentence completion|summary completion|table completion|flow.chart completion|true.false.not.given|matching headings|matching information/i);
    if (match) return normalizedType(match[0]);
    // Existing original Reading and Listening banks contain MC answer keys. Mix in
    // short-answer items so learners practise both response styles with those keys.
    return index % 2 === 1 && (task.questions && task.questions.length > 1)
      ? "short-answer" : "multiple-choice";
  }
  function typeLabel(type) { return typeNames[type] || "Short answer"; }
  function answerOptions(question, type) {
    if ((type === "true-false-not-given" || type === "yes-no-not-given") &&
        !Array.isArray(question.options) && typeof question.answer !== "number") {
      return type === "true-false-not-given" ? ["TRUE","FALSE","NOT GIVEN"] : ["YES","NO","NOT GIVEN"];
    }
    return Array.isArray(question.options) ? question.options : [];
  }
  function questionMarkup(question, index, type) {
    var options = answerOptions(question, type);
    var title = esc(question.q || question.prompt || "Choose the best answer.");
    var header = '<div class="ielts-q-head"><span class="ielts-q-number">' + (index + 1) +
      '</span><span class="ielts-q-type">' + esc(typeLabel(type)) + '</span></div>';
    var controls = "";
    if (type === "short-answer" || type === "sentence-completion" ||
        type === "summary-completion" || type === "table-completion" ||
        type === "flow-chart-completion" || type === "form-note-completion" ||
        type === "diagram-labelling") {
      var prompt = type === "short-answer" ? "Type your answer" :
        type === "sentence-completion" ? "Complete the sentence" :
        type === "summary-completion" ? "Complete the summary" :
        type === "table-completion" ? "Enter the missing table information" :
        type === "flow-chart-completion" ? "Enter the missing step" :
        type === "form-note-completion" ? "Enter the missing detail" : "Enter the diagram label";
      controls = '<label class="ielts-answer-label"><span class="sr-only">' + prompt + '</span>' +
        '<input class="ielts-text-answer" type="text" data-answer-text="' + index +
        '" autocomplete="off" placeholder="' + prompt + '" aria-label="' + prompt + '"></label>' +
        '<div class="ielts-legacy-answer" aria-hidden="true">' + options.map(function (_, optionIndex) {
          return '<input type="radio" name="q' + index + '" value="' + optionIndex + '">';
        }).join("") + '</div>';
    } else {
      var multiple = type === "multiple-choice-multiple";
      var selectType = ["list-selection","matching","matching-information","matching-features",
        "matching-headings","matching-sentence-endings"].indexOf(type) >= 0;
      if (selectType) {
        controls = '<label class="ielts-answer-label"><span class="sr-only">Choose a match</span><select class="ielts-select-answer" data-answer-select="' + index + '"><option value="">Choose an answer</option>' +
          options.map(function (option, optionIndex) { return '<option value="' + optionIndex + '">' + esc(option) + '</option>'; }).join("") +
          '</select></label>' + hiddenOptions(index, options);
      } else {
        if (!options.length && (type === "true-false-not-given" || type === "yes-no-not-given")) {
          options = answerOptions(question, type);
        }
        controls = '<div class="option-list">' + options.map(function (option, optionIndex) {
          return '<label class="option-label"><input type="' + (multiple ? "checkbox" : "radio") +
            '" name="q' + index + '" value="' + optionIndex + '"><span>' + esc(option) + '</span></label>';
        }).join("") + '</div>';
      }
    }
    return '<div class="question-box ielts-question-box" data-question-index="' + index + '">' +
      header + '<strong class="ielts-question-prompt">' + title + '</strong>' + controls + '</div>';
  }
  function hiddenOptions(index, options) {
    return '<div class="ielts-legacy-answer" aria-hidden="true">' + options.map(function (_, optionIndex) {
      return '<input type="radio" name="q' + index + '" value="' + optionIndex + '">';
    }).join("") + '</div>';
  }
  function formatQuestionList(part, list) {
    if (!part || !Array.isArray(part.task.questions) || !list) return;
    var groups = Object.create(null), order = [];
    part.task.questions.forEach(function (question, index) {
      var type = questionType(part.task, question, index);
      question.__kryptonQuestionType = type;
      if (!groups[type]) { groups[type] = []; order.push(type); }
      groups[type].push(questionMarkup(question, index, type));
    });
    list.innerHTML = order.map(function (type) {
      return '<section class="ielts-question-group"><h3>' + esc(typeLabel(type)) + '</h3>' +
        '<div class="ielts-question-group-items">' + groups[type].join("") + '</div></section>';
    }).join("");
    var guide = document.createElement("p");
    guide.className = "ielts-format-guide";
    guide.textContent = order.length > 1
      ? "Questions are grouped by response format. Complete each group before moving to the next."
      : "Answer each question in the format shown below.";
    list.parentNode.insertBefore(guide, list);
  }
  function moduleFor(part) {
    if (!part) return "reading";
    return part.skill || "reading";
  }
  function writingTaskNumber(task) {
    var value = String((task && task.title || "") + " " + (task && task.level || "") + " " + (task && task.format || ""));
    return /task\s*1\b/i.test(value) ? 1 : /task\s*2\b/i.test(value) ? 2 : 0;
  }
  function durationSeconds(part, mock) {
    var skill = moduleFor(part), task = part && part.task || {};
    if (mock) {
      if (skill === "listening") return 30 * 60;
      if (skill === "reading") return 60 * 60;
      if (skill === "writing") return (writingTaskNumber(task) === 1 ? 20 : 40) * 60;
      if (skill === "speaking") return 14 * 60;
    }
    if (skill === "listening") return Math.max(1, Number(task.time) || 6) * 60;
    if (skill === "reading") return Math.max(1, Number(task.time) || 10) * 60;
    if (skill === "writing") return (writingTaskNumber(task) === 1 ? 20 : writingTaskNumber(task) === 2 ? 40 : Number(task.time) || 20) * 60;
    if (skill === "speaking") return Math.max(1, Number(task.time) || 3) * 60;
    return 10 * 60;
  }
  function timerKey(part, mock) {
    var task = part && part.task || {}, skill = moduleFor(part);
    if (mock && mockState && mockState.mock) {
      var attempt = mockState.attemptKey || mockState.mock.id || "mock";
      return attempt + ":" + skill + (skill === "writing" ? ":" + writingTaskNumber(task) : "");
    }
    return "practice:" + skill + ":" + (task.id || "activity");
  }
  function currentPart(mock) {
    if (mock && typeof currentMockTask === "function") return currentMockTask();
    return activeActivity;
  }
  function ensureTimer(part, mock) {
    var key = timerKey(part, mock), now = Date.now();
    if (key !== activeTimerKey) {
      if (timerInterval) clearInterval(timerInterval);
      activeTimerKey = key;
      if (!timerStates[key]) timerStates[key] = {remaining:durationSeconds(part, mock), running:true,last:now};
      else if (timerStates[key].running) timerStates[key].last = now;
    }
    return timerStates[key];
  }
  function clockText(seconds) {
    seconds = Math.max(0, Math.ceil(seconds));
    return String(Math.floor(seconds / 60)).padStart(2,"0") + ":" + String(seconds % 60).padStart(2,"0");
  }
  function timerMarkup(part, mock) {
    var state = ensureTimer(part, mock), skill = moduleFor(part);
    var label = skill === "listening" ? "Listening time" :
      skill === "reading" ? "Reading time" :
      skill === "writing" ? "Writing time" : "Speaking time";
    return '<section class="ielts-timer" data-ielts-timer="' + esc(activeTimerKey) + '" aria-live="polite">' +
      '<div><span class="eyebrow">' + label + '</span><strong class="ielts-timer-face">' + clockText(state.remaining) +
      '</strong><small class="ielts-timer-status">' + (state.running ? "Timer running" : "Timer paused") +
      '</small></div><div class="ielts-timer-controls"><button type="button" class="audio-btn" data-ielts-timer-action="' +
      (state.running ? "pause" : "resume") + '">' + (state.running ? "Pause" : "Resume") +
      '</button><button type="button" class="audio-btn" data-ielts-timer-action="reset">Reset</button></div></section>';
  }
  function updateTimerFace() {
    if (!activeTimerKey || !timerStates[activeTimerKey]) return;
    var state = timerStates[activeTimerKey];
    if (state.running) {
      var now = Date.now();
      state.remaining = Math.max(0, state.remaining - Math.max(0, now - state.last) / 1000);
      state.last = now;
      if (state.remaining <= 0) {
        state.running = false;
        if (!timerMessageShown[activeTimerKey]) {
          timerMessageShown[activeTimerKey] = true;
          if (typeof toast === "function") toast("Time is up. You can still submit your answers.");
        }
      }
    }
    var timer = document.querySelector("[data-ielts-timer]");
    if (!timer || timer.dataset.ieltsTimer !== activeTimerKey) return;
    var face = timer.querySelector(".ielts-timer-face");
    var status = timer.querySelector(".ielts-timer-status");
    var button = timer.querySelector('[data-ielts-timer-action="pause"],[data-ielts-timer-action="resume"]');
    if (face) face.textContent = clockText(state.remaining);
    if (status) status.textContent = state.running ? "Timer running" : state.remaining ? "Timer paused" : "Time is up";
    if (button) {
      button.dataset.ieltsTimerAction = state.running ? "pause" : "resume";
      button.textContent = state.running ? "Pause" : "Resume";
      if (!state.remaining) button.disabled = true;
    }
  }
  function enhanceRendered(mock) {
    var part = currentPart(mock);
    if (!part || !part.task) return;
    if (["reading","listening"].indexOf(part.skill) >= 0) {
      formatQuestionList(part, document.querySelector(".question-list"));
    }
    var actions = document.querySelector(".runner-actions");
    if (actions) actions.insertAdjacentHTML("beforebegin", timerMarkup(part, mock));
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimerFace, 1000);
  }

  var baseRenderActivity = renderActivity;
  renderActivity = function () {
    baseRenderActivity();
    if (!mockState) enhanceRendered(false);
  };
  var baseRenderMockStep = renderMockStep;
  renderMockStep = function () {
    baseRenderMockStep();
    if (mockState && currentMockTask()) enhanceRendered(true);
  };

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-ielts-timer-action]");
    if (!button || !activeTimerKey || !timerStates[activeTimerKey]) return;
    var state = timerStates[activeTimerKey], action = button.dataset.ieltsTimerAction;
    if (action === "pause") { updateTimerFace(); state.running = false; }
    else if (action === "resume" && state.remaining > 0) { state.running = true; state.last = Date.now(); }
    else if (action === "reset") {
      var part = currentPart(Boolean(mockState));
      state.remaining = durationSeconds(part, Boolean(mockState));
      state.running = true; state.last = Date.now(); timerMessageShown[activeTimerKey] = false;
    }
    var face = document.querySelector(".ielts-timer-face");
    var status = document.querySelector(".ielts-timer-status");
    var toggle = document.querySelector('[data-ielts-timer-action="pause"],[data-ielts-timer-action="resume"]');
    if (face) face.textContent = clockText(state.remaining);
    if (status) status.textContent = state.running ? "Timer running" : "Timer paused";
    if (toggle) { toggle.dataset.ieltsTimerAction = state.running ? "pause" : "resume"; toggle.textContent = state.running ? "Pause" : "Resume"; }
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest('[data-action="submit-activity"]')) return;
    var part = currentPart(Boolean(mockState));
    if (!part || !part.task || !Array.isArray(part.task.questions)) return;
    part.task.questions.forEach(function (question, index) {
      var type = questionType(part.task, question, index);
      if (["short-answer","sentence-completion","summary-completion","table-completion",
        "flow-chart-completion","form-note-completion","diagram-labelling"].indexOf(type) < 0) return;
      var text = document.querySelector('[data-answer-text="' + index + '"]');
      var radios = Array.from(document.querySelectorAll('input[type="radio"][name="q' + index + '"]'));
      radios.forEach(function (radio) { radio.checked = false; });
      var normalized = String(text && text.value || "").trim().replace(/\s+/g," ").toLowerCase();
      var options = answerOptions(question, type);
      var match = options.findIndex(function (option) {
        return String(option).trim().replace(/\s+/g," ").toLowerCase() === normalized;
      });
      if (match >= 0 && radios[match]) radios[match].checked = true;
    });
  }, true);

  document.addEventListener("change", function (event) {
    var select = event.target.closest("[data-answer-select]");
    if (!select) return;
    var index = select.dataset.answerSelect;
    var radios = Array.from(document.querySelectorAll('input[type="radio"][name="q' + index + '"]'));
    radios.forEach(function (radio) { radio.checked = radio.value === select.value && select.value !== ""; });
  });
})();
