window.KET_CONFIG = {
  schedule: {
    dailyNewWords: 8,
    dailyReviewWords: 12,
    maxDailyWords: 20,
    intervals: [1, 2, 4, 7, 15],
    masteredStage: 5
  },
  rewards: {
    correctPoint: 5,
    firstTryBonus: 3,
    badges: [
      { id: "starter", name: "起步小勇士", threshold: 50 },
      { id: "focus", name: "专注小能手", threshold: 120 },
      { id: "star", name: "拼写小明星", threshold: 240 }
    ]
  },
  words: [
    { id: "w001", en: "Monday", zh: "星期一", category: "日期时间", hints: ["首字母是 M", "7个字母，以 day 结尾"] },
    { id: "w002", en: "Tuesday", zh: "星期二", category: "日期时间", hints: ["首字母是 T", "7个字母，以 day 结尾"] },
    { id: "w003", en: "Wednesday", zh: "星期三", category: "日期时间", hints: ["首字母是 W", "9个字母", "中间有 'nes'"] },
    { id: "w004", en: "Thursday", zh: "星期四", category: "日期时间", hints: ["首字母是 T", "8个字母", "中间有 'rs'"] },
    { id: "w005", en: "Friday", zh: "星期五", category: "日期时间", hints: ["首字母是 F", "6个字母，以 day 结尾"] },
    { id: "w006", en: "Saturday", zh: "星期六", category: "日期时间", hints: ["首字母是 S", "8个字母，以 day 结尾"] },
    { id: "w007", en: "Sunday", zh: "星期日", category: "日期时间", hints: ["首字母是 S", "6个字母，以 day 结尾"] },
    { id: "w008", en: "January", zh: "一月", category: "日期时间", hints: ["首字母是 J", "7个字母"] },
    { id: "w009", en: "February", zh: "二月", category: "日期时间", hints: ["首字母是 F", "8个字母", "中间有 'bru'"] },
    { id: "w010", en: "March", zh: "三月", category: "日期时间", hints: ["首字母是 M", "5个字母"] },
    { id: "w011", en: "April", zh: "四月", category: "日期时间", hints: ["首字母是 A", "5个字母"] },
    { id: "w012", en: "May", zh: "五月", category: "日期时间", hints: ["3个字母"] },
    { id: "w013", en: "June", zh: "六月", category: "日期时间", hints: ["首字母是 J", "4个字母"] },
    { id: "w014", en: "July", zh: "七月", category: "日期时间", hints: ["首字母是 J", "4个字母"] },
    { id: "w015", en: "August", zh: "八月", category: "日期时间", hints: ["首字母是 A", "6个字母"] },
    { id: "w016", en: "September", zh: "九月", category: "日期时间", hints: ["首字母是 S", "9个字母"] },
    { id: "w017", en: "October", zh: "十月", category: "日期时间", hints: ["首字母是 O", "7个字母"] },
    { id: "w018", en: "November", zh: "十一月", category: "日期时间", hints: ["首字母是 N", "8个字母"] },
    { id: "w019", en: "December", zh: "十二月", category: "日期时间", hints: ["首字母是 D", "8个字母"] },
    { id: "w020", en: "today", zh: "今天", category: "日期时间", hints: ["首字母是 t", "5个字母"] },
    { id: "w021", en: "tomorrow", zh: "明天", category: "日期时间", hints: ["首字母是 t", "8个字母"] },
    { id: "w022", en: "yesterday", zh: "昨天", category: "日期时间", hints: ["首字母是 y", "9个字母"] },
    { id: "w023", en: "week", zh: "周", category: "日期时间", hints: ["首字母是 w", "4个字母"] },
    { id: "w024", en: "month", zh: "月", category: "日期时间", hints: ["首字母是 m", "5个字母"] },
    { id: "w025", en: "year", zh: "年", category: "日期时间", hints: ["首字母是 y", "4个字母"] },

    { id: "w026", en: "school", zh: "学校", category: "校园生活", hints: ["首字母是 s", "6个字母"] },
    { id: "w027", en: "teacher", zh: "老师", category: "校园生活", hints: ["首字母是 t", "7个字母"] },
    { id: "w028", en: "student", zh: "学生", category: "校园生活", hints: ["首字母是 s", "7个字母"] },
    { id: "w029", en: "homework", zh: "家庭作业", category: "校园生活", hints: ["首字母是 h", "8个字母"] },
    { id: "w030", en: "library", zh: "图书馆", category: "校园生活", hints: ["首字母是 l", "7个字母"] },

    { id: "w031", en: "family", zh: "家庭", category: "人物关系", hints: ["首字母是 f", "6个字母"] },
    { id: "w032", en: "friend", zh: "朋友", category: "人物关系", hints: ["首字母是 f", "6个字母"] },
    { id: "w033", en: "parents", zh: "父母", category: "人物关系", hints: ["首字母是 p", "7个字母"] },
    { id: "w034", en: "brother", zh: "兄弟", category: "人物关系", hints: ["首字母是 b", "7个字母"] },
    { id: "w035", en: "sister", zh: "姐妹", category: "人物关系", hints: ["首字母是 s", "6个字母"] },

    { id: "w036", en: "holiday", zh: "假期", category: "活动出行", hints: ["首字母是 h", "7个字母"] },
    { id: "w037", en: "travel", zh: "旅行", category: "活动出行", hints: ["首字母是 t", "6个字母"] },
    { id: "w038", en: "visit", zh: "拜访", category: "活动出行", hints: ["首字母是 v", "5个字母"] },
    { id: "w039", en: "park", zh: "公园", category: "活动出行", hints: ["首字母是 p", "4个字母"] },
    { id: "w040", en: "museum", zh: "博物馆", category: "活动出行", hints: ["首字母是 m", "6个字母"] },

    { id: "w041", en: "happy", zh: "开心的", category: "情绪描述", hints: ["首字母是 h", "5个字母"] },
    { id: "w042", en: "excited", zh: "兴奋的", category: "情绪描述", hints: ["首字母是 e", "7个字母"] },
    { id: "w043", en: "tired", zh: "疲倦的", category: "情绪描述", hints: ["首字母是 t", "5个字母"] },
    { id: "w044", en: "interesting", zh: "有趣的", category: "情绪描述", hints: ["首字母是 i", "11个字母"] },
    { id: "w045", en: "important", zh: "重要的", category: "情绪描述", hints: ["首字母是 i", "9个字母"] }
  ]
};
