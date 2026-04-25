const config = window.KET_CONFIG;

const STORAGE_KEYS = {
  progress: "ket_word_progress_v2",
  dailyStats: "ket_daily_stats_v2",
  profile: "ket_profile_v2"
};

const el = {
  dailyTarget: document.getElementById("dailyTarget"),
  dailyDone: document.getElementById("dailyDone"),
  dailyBar: document.getElementById("dailyBar"),
  dailyAccuracy: document.getElementById("dailyAccuracy"),
  dailyMix: document.getElementById("dailyMix"),
  dailyPoints: document.getElementById("dailyPoints"),
  masteredCount: document.getElementById("masteredCount"),
  totalWords: document.getElementById("totalWords"),
  streakDays: document.getElementById("streakDays"),
  badgeCount: document.getElementById("badgeCount"),
  promptTitle: document.getElementById("promptTitle"),
  promptMeta: document.getElementById("promptMeta"),
  hintArea: document.getElementById("hintArea"),
  spellingInput: document.getElementById("spellingInput"),
  feedback: document.getElementById("feedback"),
  celebrate: document.getElementById("celebrate"),
  startBtn: document.getElementById("startBtn"),
  hintBtn: document.getElementById("hintBtn"),
  submitBtn: document.getElementById("submitBtn"),
  nextBtn: document.getElementById("nextBtn"),
  badges: document.getElementById("badges"),
  wordList: document.getElementById("wordList"),
  wordConfigSummary: document.getElementById("wordConfigSummary")
};

const state = {
  progress: JSON.parse(localStorage.getItem(STORAGE_KEYS.progress) || "{}"),
  dailyStats: JSON.parse(localStorage.getItem(STORAGE_KEYS.dailyStats) || "{}"),
  profile: JSON.parse(localStorage.getItem(STORAGE_KEYS.profile) || "{\"points\":0,\"streak\":0,\"lastPracticeDate\":null,\"badges\":[]}"),
  today: getLocalDateString(),
  queue: [],
  queueMeta: [],
  current: null,
  currentHintLevel: 0,
  currentResolved: false
};

function getLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(dateStr, days) {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function persist() {
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(state.progress));
  localStorage.setItem(STORAGE_KEYS.dailyStats, JSON.stringify(state.dailyStats));
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(state.profile));
}

function getWordProgress(wordId) {
  if (!state.progress[wordId]) {
    state.progress[wordId] = {
      stage: 0,
      nextReview: state.today,
      correct: 0,
      wrong: 0,
      attempts: 0,
      mastered: false
    };
  }
  return state.progress[wordId];
}

function getTodayStat() {
  if (!state.dailyStats[state.today]) {
    state.dailyStats[state.today] = {
      attempted: 0,
      correct: 0,
      newDone: 0,
      reviewDone: 0,
      points: 0
    };
  }
  return state.dailyStats[state.today];
}

function buildDailyPlan() {
  const due = [];
  const newWords = [];

  config.words.forEach((word) => {
    const p = state.progress[word.id];
    if (!p || p.attempts === 0) {
      newWords.push(word);
      return;
    }
    if (!p.mastered && p.nextReview <= state.today) {
      due.push(word);
    }
  });

  const reviewPick = shuffle(due).slice(0, config.schedule.dailyReviewWords);
  const remaining = Math.max(0, config.schedule.maxDailyWords - reviewPick.length);
  const newPick = newWords.slice(0, Math.min(config.schedule.dailyNewWords, remaining));

  state.queue = [...reviewPick, ...newPick];
  state.queueMeta = state.queue.map((word) => ({ wordId: word.id, type: reviewPick.find((w) => w.id === word.id) ? "review" : "new" }));

  if (state.queue.length === 0) {
    state.queue = shuffle(config.words).slice(0, config.schedule.dailyNewWords);
    state.queueMeta = state.queue.map((word) => ({ wordId: word.id, type: "new" }));
  }
}

function renderWordConfig() {
  const grouped = config.words.reduce((acc, word) => {
    if (!acc[word.category]) acc[word.category] = [];
    acc[word.category].push(word);
    return acc;
  }, {});

  el.wordConfigSummary.innerHTML = `
    <p>总词数：<strong>${config.words.length}</strong>，每日新词：<strong>${config.schedule.dailyNewWords}</strong>，每日复习：<strong>${config.schedule.dailyReviewWords}</strong>，最多：<strong>${config.schedule.maxDailyWords}</strong></p>
  `;

  el.wordList.innerHTML = Object.entries(grouped)
    .map(([group, words]) => `
      <details class="word-group">
        <summary>${group}（${words.length}）</summary>
        <ul>${words.map((w) => `<li>${w.zh} - ${w.en}</li>`).join("")}</ul>
      </details>
    `)
    .join("");
}

function renderBadges() {
  const achieved = state.profile.badges;
  el.badges.innerHTML = config.rewards.badges
    .map((badge) => achieved.includes(badge.id)
      ? `<span class="badge">🏅 ${badge.name}</span>`
      : `<span class="badge">🔒 ${badge.name}（${badge.threshold}⭐）</span>`)
    .join("");
}

function renderStats() {
  const todayStat = getTodayStat();
  const done = todayStat.attempted;
  const target = state.queue.length || config.schedule.maxDailyWords;

  el.dailyTarget.textContent = String(target);
  el.dailyDone.textContent = String(Math.min(done, target));
  el.dailyBar.style.width = `${target === 0 ? 0 : Math.min(100, Math.round((done / target) * 100))}%`;

  const acc = todayStat.attempted === 0 ? 0 : Math.round((todayStat.correct / todayStat.attempted) * 100);
  el.dailyAccuracy.textContent = `${acc}%`;
  el.dailyMix.textContent = `${todayStat.newDone} / ${todayStat.reviewDone}`;
  el.dailyPoints.textContent = String(todayStat.points);

  const mastered = Object.values(state.progress).filter((p) => p.mastered).length;
  el.masteredCount.textContent = String(mastered);
  el.totalWords.textContent = String(config.words.length);
  el.streakDays.textContent = String(state.profile.streak || 0);
  el.badgeCount.textContent = String(state.profile.badges.length);
}

function getHintText(word, level) {
  const dynamicHints = [
    `这个词有 ${word.en.length} 个字母。`,
    `首字母是 ${word.en[0]}。`,
    `结尾字母是 ${word.en[word.en.length - 1]}。`
  ];
  const hintPool = [...(word.hints || []), ...dynamicHints];
  return hintPool[Math.min(level, hintPool.length - 1)];
}

function showCurrentWord() {
  if (state.queue.length === 0) {
    el.promptTitle.textContent = "🎉 今日计划完成！";
    el.promptMeta.textContent = "你已经完成今天的背诵任务，明天继续加油！";
    el.hintArea.classList.add("hidden");
    el.submitBtn.disabled = true;
    el.hintBtn.disabled = true;
    el.nextBtn.disabled = true;
    el.spellingInput.disabled = true;
    return;
  }

  state.current = state.queue[0];
  state.currentHintLevel = 0;
  state.currentResolved = false;
  el.spellingInput.value = "";
  el.spellingInput.disabled = false;

  const meta = state.queueMeta[0];
  const typeLabel = meta.type === "new" ? "🆕 新词" : "🔁 复习";
  el.promptTitle.textContent = `请拼写：${state.current.zh}`;
  el.promptMeta.textContent = `${typeLabel} | 分类：${state.current.category}`;
  el.feedback.textContent = "";
  el.feedback.className = "feedback";
  el.celebrate.textContent = "";

  el.hintArea.textContent = getHintText(state.current, 0);
  el.hintArea.classList.remove("hidden");

  el.hintBtn.disabled = false;
  el.submitBtn.disabled = false;
  el.nextBtn.disabled = true;
}

function updateStreakOnFirstAttempt() {
  if (state.profile.lastPracticeDate === state.today) return;

  const yesterday = addDays(state.today, -1);
  if (state.profile.lastPracticeDate === yesterday) {
    state.profile.streak += 1;
  } else {
    state.profile.streak = 1;
  }
  state.profile.lastPracticeDate = state.today;
}

function maybeUnlockBadges() {
  config.rewards.badges.forEach((badge) => {
    if (state.profile.points >= badge.threshold && !state.profile.badges.includes(badge.id)) {
      state.profile.badges.push(badge.id);
      el.celebrate.textContent = `🎊 解锁徽章：${badge.name}`;
    }
  });
}

function onCorrect(isFirstTry) {
  const todayStat = getTodayStat();
  const meta = state.queueMeta[0];
  const p = getWordProgress(state.current.id);

  p.attempts += 1;
  p.correct += 1;
  p.stage = Math.min(config.schedule.masteredStage, p.stage + 1);
  p.mastered = p.stage >= config.schedule.masteredStage;

  const interval = config.schedule.intervals[Math.min(p.stage - 1, config.schedule.intervals.length - 1)] || 1;
  p.nextReview = addDays(state.today, interval);

  todayStat.attempted += 1;
  todayStat.correct += 1;
  if (meta.type === "new") todayStat.newDone += 1;
  if (meta.type === "review") todayStat.reviewDone += 1;

  const gain = config.rewards.correctPoint + (isFirstTry ? config.rewards.firstTryBonus : 0);
  todayStat.points += gain;
  state.profile.points += gain;

  updateStreakOnFirstAttempt();
  maybeUnlockBadges();

  el.feedback.className = "feedback good";
  el.feedback.textContent = `✅ 太棒啦！正确答案是 ${state.current.en}（+${gain}⭐）`;
  el.celebrate.textContent = "✨ 继续保持，你是拼写小高手！";

  state.currentResolved = true;
  el.nextBtn.disabled = false;
  el.submitBtn.disabled = true;
  el.hintBtn.disabled = true;
  el.spellingInput.disabled = true;

  persist();
  renderStats();
  renderBadges();
}

function onWrong() {
  const p = getWordProgress(state.current.id);
  p.wrong += 1;
  p.attempts += 1;

  state.currentHintLevel += 1;
  el.hintArea.textContent = getHintText(state.current, state.currentHintLevel);
  el.hintArea.classList.remove("hidden");

  el.feedback.className = "feedback bad";
  el.feedback.textContent = "❌ 还不对哦，再想想看。你可以看提示后再试一次！";

  persist();
}

function handleSubmit() {
  if (!state.current || state.currentResolved) return;
  const input = el.spellingInput.value.trim().toLowerCase();
  if (!input) {
    el.feedback.className = "feedback bad";
    el.feedback.textContent = "请先输入拼写再提交。";
    return;
  }

  const answer = state.current.en.toLowerCase();
  const isFirstTry = state.currentHintLevel === 0;

  if (input === answer) {
    onCorrect(isFirstTry);
    return;
  }
  onWrong();
}

function handleNext() {
  if (!state.currentResolved) return;
  state.queue.shift();
  state.queueMeta.shift();
  showCurrentWord();
  renderStats();
}

function showHint() {
  if (!state.current || state.currentResolved) return;
  state.currentHintLevel += 1;
  el.hintArea.textContent = getHintText(state.current, state.currentHintLevel);
}

function startPractice() {
  buildDailyPlan();
  showCurrentWord();
  renderStats();
}

el.startBtn.addEventListener("click", startPractice);
el.submitBtn.addEventListener("click", handleSubmit);
el.nextBtn.addEventListener("click", handleNext);
el.hintBtn.addEventListener("click", showHint);
el.spellingInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSubmit();
  }
});

renderWordConfig();
renderBadges();
renderStats();
