const wordBank = {
  nouns: [
    "school", "teacher", "friend", "family", "holiday", "homework", "weekend", "book", "food", "sport",
    "weather", "birthday", "party", "city", "shop", "park", "movie", "music", "computer", "bus"
  ],
  verbs: [
    "go", "come", "play", "study", "watch", "visit", "help", "start", "finish", "enjoy",
    "want", "need", "like", "love", "buy", "take", "meet", "travel", "cook", "clean"
  ],
  adjectives: [
    "happy", "excited", "tired", "easy", "difficult", "important", "delicious", "beautiful", "interesting", "busy"
  ],
  connectors: [
    "and", "but", "because", "so", "then", "after", "before", "when", "first", "finally"
  ]
};

const irregularPast = {
  go: "went",
  come: "came",
  buy: "bought",
  take: "took",
  meet: "met"
};

const irregularPlural = {
  family: "families",
  city: "cities"
};

const sentenceTemplates = [
  { q: "I ___ my homework after school.", answer: "finish", options: ["finish", "finishes", "finished"] },
  { q: "We went to the park ___ it was sunny.", answer: "because", options: ["because", "but", "before"] },
  { q: "My birthday party was very ___.", answer: "exciting", options: ["exciting", "excite", "excitedly"] },
  { q: "She ___ a new book yesterday.", answer: "bought", options: ["buy", "bought", "buys"] }
];

const collocations = [
  ["do", "homework"],
  ["have", "breakfast"],
  ["play", "football"],
  ["watch", "a movie"],
  ["take", "a bus"]
];

const state = {
  mode: null,
  done: Number(localStorage.getItem("doneCount") || 0),
  streak: Number(localStorage.getItem("streakCount") || 0),
  lastCheckin: localStorage.getItem("lastCheckin") || null,
  current: null,
  answered: false
};

const modeConfigs = [
  { key: "spelling", label: "拼写检查" },
  { key: "past", label: "动词过去式" },
  { key: "plural", label: "名词复数" },
  { key: "sentence", label: "造句/选择" },
  { key: "matching", label: "组词配对" }
];

const doneCountEl = document.getElementById("doneCount");
const streakCountEl = document.getElementById("streakCount");
const checkinBtn = document.getElementById("checkinBtn");
const modeButtonsEl = document.getElementById("modeButtons");
const exerciseTitleEl = document.getElementById("exerciseTitle");
const exerciseHintEl = document.getElementById("exerciseHint");
const exerciseBodyEl = document.getElementById("exerciseBody");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const wordGridEl = document.getElementById("wordGrid");

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getLocalDateString(baseDate = new Date()) {
  const date = new Date(baseDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function updateDashboard() {
  doneCountEl.textContent = state.done;
  streakCountEl.textContent = state.streak;
}

function renderWordBank() {
  const labels = {
    nouns: "名词（写作常用）",
    verbs: "动词（写作常用）",
    adjectives: "形容词",
    connectors: "连接词"
  };

  wordGridEl.innerHTML = Object.entries(wordBank)
    .map(([group, words]) => `
      <article class="word-group">
        <h3>${labels[group]}</h3>
        <ul>${words.map((w) => `<li>${w}</li>`).join("")}</ul>
      </article>
    `)
    .join("");
}

function renderModes() {
  modeButtonsEl.innerHTML = modeConfigs
    .map((m) => `<button class="mode-btn ${state.mode === m.key ? "active" : ""}" data-mode="${m.key}">${m.label}</button>`)
    .join("");

  modeButtonsEl.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.mode = btn.dataset.mode;
      renderModes();
      nextQuestion();
    });
  });
}

function markAnswer(correct, tip = "") {
  if (state.answered) return;
  state.answered = true;
  state.done += 1;
  localStorage.setItem("doneCount", String(state.done));
  updateDashboard();

  feedbackEl.className = correct ? "good" : "bad";
  feedbackEl.textContent = correct ? "✅ 正确！" : `❌ 再试试。${tip}`;
  lockExercise();
  nextBtn.classList.remove("hidden");
}

function lockExercise() {
  exerciseBodyEl.querySelectorAll("input, button").forEach((el) => {
    el.disabled = true;
  });
}

function getPast(word) {
  if (irregularPast[word]) return irregularPast[word];
  if (word.endsWith("e")) return `${word}d`;
  return `${word}ed`;
}

function getPlural(word) {
  if (irregularPlural[word]) return irregularPlural[word];
  if (word.endsWith("y")) return `${word.slice(0, -1)}ies`;
  return `${word}s`;
}

function buildSpelling() {
  const word = randomItem([...wordBank.nouns, ...wordBank.verbs, ...wordBank.adjectives]);
  const hidden = word.slice(0, 1) + "_".repeat(word.length - 2) + word.slice(-1);
  state.current = { answer: word };

  exerciseTitleEl.textContent = "拼写检查";
  exerciseHintEl.textContent = `请根据提示拼出完整单词：${hidden}`;
  exerciseBodyEl.innerHTML = `
    <label>你的答案：<input id="answerInput" type="text" autocomplete="off" /></label>
    <button id="submitBtn" type="button">提交</button>
  `;

  document.getElementById("submitBtn").addEventListener("click", () => {
    const value = document.getElementById("answerInput").value.trim().toLowerCase();
    markAnswer(value === state.current.answer, `正确拼写是 ${state.current.answer}`);
  });
  document.getElementById("answerInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      document.getElementById("submitBtn").click();
    }
  });
}

function buildPast() {
  const word = randomItem(wordBank.verbs);
  state.current = { answer: getPast(word) };

  exerciseTitleEl.textContent = "动词过去式";
  exerciseHintEl.textContent = `请写出动词 ${word} 的过去式`;
  exerciseBodyEl.innerHTML = `
    <label>过去式：<input id="answerInput" type="text" autocomplete="off" /></label>
    <button id="submitBtn" type="button">提交</button>
  `;

  document.getElementById("submitBtn").addEventListener("click", () => {
    const value = document.getElementById("answerInput").value.trim().toLowerCase();
    markAnswer(value === state.current.answer, `正确答案是 ${state.current.answer}`);
  });
  document.getElementById("answerInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      document.getElementById("submitBtn").click();
    }
  });
}

function buildPlural() {
  const word = randomItem(wordBank.nouns);
  state.current = { answer: getPlural(word) };

  exerciseTitleEl.textContent = "名词复数";
  exerciseHintEl.textContent = `请写出名词 ${word} 的复数形式`;
  exerciseBodyEl.innerHTML = `
    <label>复数：<input id="answerInput" type="text" autocomplete="off" /></label>
    <button id="submitBtn" type="button">提交</button>
  `;

  document.getElementById("submitBtn").addEventListener("click", () => {
    const value = document.getElementById("answerInput").value.trim().toLowerCase();
    markAnswer(value === state.current.answer, `正确答案是 ${state.current.answer}`);
  });
  document.getElementById("answerInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      document.getElementById("submitBtn").click();
    }
  });
}

function buildSentence() {
  const q = randomItem(sentenceTemplates);
  state.current = { answer: q.answer };

  exerciseTitleEl.textContent = "造句/选择";
  exerciseHintEl.textContent = q.q;
  exerciseBodyEl.innerHTML = `
    <div class="choice-list">
      ${q.options.map((option) => `<button class="choice-btn" data-value="${option}">${option}</button>`).join("")}
    </div>
  `;

  exerciseBodyEl.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.value;
      markAnswer(selected === state.current.answer, `正确答案是 ${state.current.answer}`);
    });
  });
}

function buildMatching() {
  const pair = randomItem(collocations);
  const rightWords = [pair[1], ...collocations.filter((c) => c[1] !== pair[1]).slice(0, 2).map((c) => c[1])]
    .sort(() => Math.random() - 0.5);

  state.current = { answer: pair[1] };
  exerciseTitleEl.textContent = "组词配对";
  exerciseHintEl.textContent = `请选择与 "${pair[0]}" 搭配最常见的词组`;
  exerciseBodyEl.innerHTML = `
    <div class="choice-list">
      ${rightWords.map((w) => `<button class="choice-btn" data-value="${w}">${pair[0]} ${w}</button>`).join("")}
    </div>
  `;

  exerciseBodyEl.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.value;
      markAnswer(selected === state.current.answer, `常见搭配是 ${pair[0]} ${state.current.answer}`);
    });
  });
}

function nextQuestion() {
  state.answered = false;
  feedbackEl.textContent = "";
  feedbackEl.className = "";
  nextBtn.classList.add("hidden");

  if (state.mode === "spelling") return buildSpelling();
  if (state.mode === "past") return buildPast();
  if (state.mode === "plural") return buildPlural();
  if (state.mode === "sentence") return buildSentence();
  if (state.mode === "matching") return buildMatching();
}

checkinBtn.addEventListener("click", () => {
  const today = getLocalDateString();

  if (state.lastCheckin === today) {
    feedbackEl.textContent = "今天已经打卡过啦，继续做题巩固吧！";
    feedbackEl.className = "good";
    return;
  }

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = getLocalDateString(yesterdayDate);
  state.streak = state.lastCheckin === yesterday ? state.streak + 1 : 1;
  state.lastCheckin = today;

  localStorage.setItem("streakCount", String(state.streak));
  localStorage.setItem("lastCheckin", state.lastCheckin);

  updateDashboard();
  feedbackEl.textContent = "打卡成功！明天继续加油 💪";
  feedbackEl.className = "good";
});

nextBtn.addEventListener("click", nextQuestion);

updateDashboard();
renderWordBank();
renderModes();
