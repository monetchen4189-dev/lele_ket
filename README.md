# KET 单词拼写打卡网站（7 月底考试冲刺版）

这是一个面向孩子的 KET 词汇打卡网页，核心目标是：

1. **高频词拼写检查**
2. **写作常见词形变化**（动词过去式、名词复数）
3. **基础写作能力**（组词、选择、句子填空）

## 高频词挑选思路

本项目内置了 KET 写作中最常出现的主题词（学校、家庭、活动、城市、出行等）和连接词。

- 名词（20）: school, teacher, friend, family, holiday, homework, weekend, book, food, sport, weather, birthday, party, city, shop, park, movie, music, computer, bus
- 动词（20）: go, come, play, study, watch, visit, help, start, finish, enjoy, want, need, like, love, buy, take, meet, travel, cook, clean
- 形容词（10）: happy, excited, tired, easy, difficult, important, delicious, beautiful, interesting, busy
- 连接词（10）: and, but, because, so, then, after, before, when, first, finally

> 建议：先确保这些词「看见会写」，再做句子迁移，最后做写作任务（邮件/明信片/便条）。

## 已实现练习形式

- 拼写检查（输入正确单词）
- 动词过去式
- 名词复数
- 造句/选择题
- 组词配对（collocation）
- 每日打卡与连续天数统计（localStorage）
- 题目提交后自动锁定，避免重复点击导致重复计数
- 输入题支持回车提交

## 如何运行

这是纯前端静态页面，无需安装依赖。

```bash
# 在项目目录执行
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 如何把代码 push 到 GitHub

如果你看到“代码没有 push 上去”，通常是本地仓库还没配置 `origin`，或者没有执行 push。

### 手动命令（推荐）

```bash
git branch --show-current
git remote -v

# 如果没有 origin，先添加
git remote add origin <你的仓库URL>

# 推送当前分支（首次要 -u）
git push -u origin <当前分支名>
```

### 一键脚本

```bash
bash scripts/push_to_github.sh
```

脚本会自动检查 `origin` 是否存在：
- 如果未配置，会提示你先执行 `git remote add origin ...`
- 如果已配置，会直接推送当前分支

## GitHub Pages 部署与访问

项目已添加自动部署工作流：`.github/workflows/deploy-pages.yml`。

> 当前工作流已改为：监听所有分支 push，但只在“仓库默认分支”上执行 deploy，避免分支名不一致导致不触发。

### 一次性设置（仓库管理员）

1. 打开仓库 **Settings → Pages**。
2. 在 **Build and deployment** 里选择 **Source = GitHub Actions**。
3. 确认仓库默认分支（Default branch）正确，并把最新提交 push 到该默认分支。

### 一般多久能 ready？

- 首次部署通常 **2~10 分钟**。
- 偶发队列拥堵时可能到 **15 分钟左右**。
- 每次后续更新通常 **1~5 分钟**。

### 现在“还没 access”的常见原因

- 仓库是 **Private**：访问者需要仓库权限；免费计划下 private repo 的 Pages 可能受限。
- 还没在 Settings 里把 Source 设为 **GitHub Actions**。
- workflow 只监听了 `main`，但仓库默认分支不是 `main`（例如 `master` 或 `work`）。
- Actions workflow 失败（可在 **Actions** 页查看 `Deploy static site to GitHub Pages`）。
- 访问 URL 错误：应为
  `https://<username>.github.io/<repo-name>/`


### 本地一键自检（推荐）

```bash
bash scripts/check_pages_setup.sh
```

这个脚本会检查：
- 关键文件是否存在
- Pages workflow 关键步骤是否齐全
- `app.js` 语法是否通过
- 并给出 Pages 访问失败的下一步排查建议

### 快速自查

1. Actions 页是否出现绿色 ✅ `Deploy to GitHub Pages`。
2. Settings → Pages 里是否显示 `Your site is live at ...`。
3. 确认默认分支（Default branch）与 workflow 触发分支一致。
4. 使用无痕窗口访问一次，排除缓存。

## 适合用什么工具实现？

### 1) 当前阶段（最快上线）
- **HTML + CSS + JavaScript（当前方案）**
- 优势：开发快、部署简单、几乎零成本（可直接放 GitHub Pages / Netlify）

### 2) 下一阶段（需要账号与数据统计）
- **前端**: React / Vue
- **后端**: Supabase（数据库 + 登录）或 Firebase
- 适合做：班级排名、错词本、多设备同步

### 3) AI 增强阶段（可选）
- 接入语音朗读（TTS）与语音拼写检查（ASR）
- 接入 LLM 做「句子润色 + 错误解释」

## 面向 7 月底 KET 的节奏建议（8 周）

- 周 1-2：高频词拼写 + 过去式/复数
- 周 3-4：搭配 + 句子填空
- 周 5-6：主题写作（My weekend / My best friend / Holiday plan）
- 周 7-8：整套限时训练 + 错词回炉
