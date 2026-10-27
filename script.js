const skillData = {
  listening: {
    title: "Listening · Catch the detail",
    heading: "A change of plan",
    label: "TRANSCRIPT DRILL",
    intro: "Read the short conversation, then answer the question. In a full listening session, try listening once before checking a transcript.",
    passage: "MAYA: Are we still meeting at the library at two?\nLEO: I called them this morning. The study room is being painted, so it’s closed today.\nMAYA: Oh, that’s a shame. Should we try the café near the station?\nLEO: It gets noisy after lunch. There’s a quiet room at the community centre, and it’s free.\nMAYA: Great. Let’s meet there at half past two, then.",
    question: "Where will Maya and Leo meet?",
    options: ["At the library", "At a café near the station", "At the community centre"],
    answer: 2,
    explanation: "They change the plan because the library room is closed and agree to meet at the community centre."
  },
  reading: {
    title: "Reading · Find the main idea",
    heading: "Why urban trees matter",
    label: "SHORT READING",
    intro: "Read the passage and choose the best answer. Look for the central point rather than matching only one word.",
    passage: "City trees do more than make streets attractive. Their shade can lower surface temperatures on hot days, while leaves catch some airborne particles. Trees also create routes for birds and insects through built-up areas. These benefits depend on thoughtful planning: young trees need care, and species must suit local conditions. For city planners, the challenge is to treat trees as useful infrastructure and protect them over the long term.",
    question: "What is the passage mainly about?",
    options: ["The history of city parks", "The benefits of urban trees and the need to plan for them", "How birds choose nesting sites"],
    answer: 1,
    explanation: "The passage describes several benefits and stresses that planning and long-term care matter."
  },
  writing: {
    title: "Writing · Build a clear response",
    heading: "Take a position, then support it",
    label: "IELTS TASK 2 · PRACTICE PROMPT",
    prompt: "Some people think public transport should be free in cities. To what extent do you agree or disagree? Give reasons and include examples from your own knowledge or experience.",
    intro: "Write a short outline or begin your response. Aim for a clear position, two supporting ideas, and a relevant example.",
    placeholder: "My position is…\n\nFirst, …\n\nFor example, …",
  },
  speaking: {
    title: "Speaking · Tell a focused story",
    heading: "Describe a place you enjoy visiting",
    label: "PART 2 · CUE CARD",
    prompt: "Describe a place you enjoy visiting. You should say where it is, when you go there, what you do there, and explain why you enjoy it.",
    points: ["Where the place is", "When you usually visit", "What you do there", "Why it matters to you"],
    intro: "Use the timer to prepare for one minute, then speak for up to two minutes. Record a few notes after you finish.",
    placeholder: "Notes to remember: a detail, a feeling, a short story…",
  }
};
const storageKey = "krypton-ielts-progress-v1";
let progress = loadProgress();
let timerInterval = null;
let timerSeconds = 0;
let timerMode = "";

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    return { minutes: Number(saved.minutes) || 0, sessions: Number(saved.sessions) || 0, days: Array.isArray(saved.days) ? saved.days : [], completed: saved.completed || {} };
  } catch {
    return { minutes: 0, sessions: 0, days: [], completed: {} };
  }
}
function saveProgress() { localStorage.setItem(storageKey, JSON.stringify(progress)); }
function localDateKey(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" })[ch]);
}
function renderProgress() {
  const minutes = progress.minutes;
  document.querySelector("#minutes-stat").innerHTML = `${minutes}<span> min</span>`;
  document.querySelector("#sessions-stat").textContent = progress.sessions;
  const todayMinutes = progress.completed[localDateKey()] || 0;
  document.querySelector("#goal-progress").textContent = Math.min(todayMinutes, 30);
  document.querySelector("#goal-bar").style.width = `${Math.min(todayMinutes / 30 * 100, 100)}%`;
  document.querySelector("#goal-message").textContent = todayMinutes >= 30 ? "Daily goal reached — nice work!" : "30 minutes a day is a great start";
  const days = [...new Set(progress.days)].sort().reverse();
  let streak = 0;
  const checkDate = new Date();
  if (days[0] !== localDateKey(checkDate)) checkDate.setDate(checkDate.getDate() - 1);
  while (days.includes(localDateKey(checkDate))) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
  document.querySelector("#streak-value").textContent = `${streak} ${streak === 1 ? "day" : "days"}`;
  renderWeek();
}
function renderWeek() {
  const container = document.querySelector("#week-row");
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const labels = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  container.innerHTML = labels.map((label, index) => {
    const date = new Date(start); date.setDate(start.getDate() + index);
    const key = localDateKey(date);
    const classes = ["day-chip", progress.days.includes(key) ? "done" : "", key === localDateKey() ? "today" : ""].filter(Boolean).join(" ");
    return `<div class="${classes}"><strong>${label}</strong>${date.getDate()}</div>`;
  }).join("");
}
function renderActivity(skill) {
  const data = skillData[skill] || skillData.listening;
  document.querySelector("#practice-title").textContent = data.title;
  document.querySelector("#activity-content").innerHTML = makeActivity(skill, data);
  document.querySelectorAll(".module-tab").forEach(tab => {
    const selected = tab.dataset.skill === skill;
    tab.classList.toggle("selected", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
}
function makeActivity(skill, data) {
  if (skill === "listening" || skill === "reading") {
    const isListening = skill === "listening";
    return `<div class="activity">
      <div><p class="prompt-label">${data.label}</p><h3>${data.heading}</h3><p>${data.intro}</p>
        ${isListening ? `<button class="secondary-btn" id="transcript-toggle" type="button">Show transcript</button><div class="passage transcript" id="passage">${escapeHtml(data.passage).replace(/\n/g, "<br>")}</div>` : `<div class="passage">${escapeHtml(data.passage)}</div>`}
      </div>
      <div class="answer-card"><p>${data.question}</p><div class="choice-list">${data.options.map((option, index) => `<button class="choice" type="button" data-choice="${index}">${String.fromCharCode(65 + index)}. ${escapeHtml(option)}</button>`).join("")}</div><p class="feedback" id="feedback" aria-live="polite"></p></div>
    </div>`;
  }
  if (skill === "writing") {
    return `<div class="activity">
      <div><p class="prompt-label">${data.label}</p><h3>${data.heading}</h3><p>${data.intro}</p><div class="prompt-box">${escapeHtml(data.prompt)}</div></div>
      <div><textarea class="text-area" id="writing-response" placeholder="${escapeHtml(data.placeholder)}" aria-label="Your writing response"></textarea><div class="writing-meta"><span id="word-count">0 words</span><span>Draft stays in this browser</span></div><div class="action-row"><button class="primary-btn" id="save-writing" type="button">Save draft</button><button class="secondary-btn" id="complete-writing" type="button">Finish 5 min practice</button></div></div>
    </div>`;
  }
  return `<div class="activity">
    <div><p class="prompt-label">${data.label}</p><h3>${data.heading}</h3><p>${data.intro}</p><div class="prompt-box">${escapeHtml(data.prompt)}</div><ul class="cue-points">${data.points.map(point => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div>
    <div class="answer-card"><p>One minute to prepare</p><div class="timer-face" id="timer-face">01:00</div><div class="action-row"><button class="primary-btn" id="timer-start" type="button">Start preparation</button><button class="secondary-btn" id="timer-reset" type="button">Reset</button></div><p class="inline-note">When the timer ends, speak for up to two minutes. Add a few notes below.</p><textarea class="text-area" id="speaking-notes" placeholder="${escapeHtml(data.placeholder)}" aria-label="Speaking practice notes" style="min-height:75px"></textarea><div class="action-row" style="margin-top:9px"><button class="secondary-btn" id="complete-speaking" type="button">Finish practice</button></div></div>
  </div>`;
}
function showToast(message) {
  const toast = document.querySelector("#toast"); toast.textContent = message; toast.classList.add("show");
  window.clearTimeout(showToast.timeout); showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}
function completeSession(skill, minutes = 5) {
  progress.minutes += minutes; progress.sessions += 1;
  const today = localDateKey();
  progress.days = [...new Set([...progress.days, today])];
  progress.completed[today] = (progress.completed[today] || 0) + minutes;
  saveProgress(); renderProgress(); showToast(`${skill} practice saved — ${minutes} minutes added.`);
}
function startTimer(button, seconds, mode) {
  window.clearInterval(timerInterval);
  timerSeconds = seconds; timerMode = mode;
  const face = document.querySelector("#timer-face");
  const startButton = document.querySelector("#timer-start");
  const update = () => {
    if (!face) return;
    face.textContent = `${String(Math.floor(timerSeconds / 60)).padStart(2,"0")}:${String(timerSeconds % 60).padStart(2,"0")}`;
    if (timerSeconds <= 0) {
      window.clearInterval(timerInterval); timerInterval = null;
      if (startButton) startButton.textContent = "Start again";
      showToast(mode === "prepare" ? "Preparation time is up. Your speaking time starts now." : "Speaking time is complete.");
      return;
    }
    timerSeconds -= 1;
  };
  update();
  timerInterval = window.setInterval(update, 1000);
  button.textContent = "Restart timer";
}
function onPracticeClick(event) {
  const skillButton = event.target.closest("[data-skill]");
  if (skillButton) {
    const skill = skillButton.dataset.skill;
    renderActivity(skill);
    document.querySelector("#practice-room").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (event.target.id === "transcript-toggle") {
    const passage = document.querySelector("#passage");
    const visible = passage.classList.toggle("visible");
    event.target.textContent = visible ? "Hide transcript" : "Show transcript";
    return;
  }
  const choice = event.target.closest("[data-choice]");
  if (choice) {
    const data = skillData[document.querySelector(".module-tab.selected").dataset.skill];
    const selected = Number(choice.dataset.choice);
    document.querySelectorAll(".choice").forEach(item => item.disabled = true);
    choice.classList.add(selected === data.answer ? "correct" : "incorrect");
    if (selected !== data.answer) document.querySelectorAll(".choice")[data.answer].classList.add("correct");
    document.querySelector("#feedback").textContent = selected === data.answer ? `Correct. ${data.explanation}` : `Not quite. ${data.explanation}`;
    completeSession(document.querySelector(".module-tab.selected").textContent, 5);
    return;
  }
  if (event.target.id === "save-writing") {
    const value = document.querySelector("#writing-response").value;
    localStorage.setItem("krypton-ielts-writing-draft", value);
    showToast("Draft saved in this browser.");
    return;
  }
  if (event.target.id === "complete-writing") { completeSession("Writing", 5); return; }
  if (event.target.id === "complete-speaking") { completeSession("Speaking", 5); return; }
  if (event.target.id === "timer-start") {
    const mode = timerMode === "prepare" ? "speak" : "prepare";
    const seconds = mode === "prepare" ? 60 : 120;
    startTimer(event.target, seconds, mode);
    event.target.textContent = mode === "prepare" ? "Restart preparation" : "Start 2-minute speaking";
    return;
  }
  if (event.target.id === "timer-reset") {
    window.clearInterval(timerInterval); timerInterval = null; timerMode = "";
    const face = document.querySelector("#timer-face"); if (face) face.textContent = "01:00";
    const startButton = document.querySelector("#timer-start"); if (startButton) startButton.textContent = "Start preparation";
  }
}
document.addEventListener("click", onPracticeClick);
document.addEventListener("input", event => {
  if (event.target.id === "writing-response") {
    const count = event.target.value.trim().split(/\s+/).filter(Boolean).length;
    document.querySelector("#word-count").textContent = `${count} ${count === 1 ? "word" : "words"}`;
  }
});
document.addEventListener("click", event => {
  if (event.target.id !== "practice-title" && event.target.closest(".skill-card")) {
    const skill = event.target.closest(".skill-card").dataset.skill; renderActivity(skill);
  }
});
document.querySelector("#today-label").textContent = new Intl.DateTimeFormat(undefined, { weekday:"long", month:"short", day:"numeric" }).format(new Date()).toUpperCase();
renderActivity("listening");
renderProgress();
const savedDraft = localStorage.getItem("krypton-ielts-writing-draft");
document.addEventListener("click", event => {
  if (event.target.dataset.skill === "writing" && savedDraft) {
    window.setTimeout(() => { const input = document.querySelector("#writing-response"); if (input && !input.value) input.value = savedDraft; }, 0);
  }
});
