# KET 拼写乐园（7 月底考试冲刺）

这是一个给孩子用的 KET 单词拼写打卡网页，核心目标是：

- 看中文拼英文（主交互）
- 每日新词 + 旧词复习（艾宾浩斯记忆曲线）
- 每日统计 + 总体进度 + 激励徽章

## 项目结构

- `index.html`：页面结构
- `styles.css`：儿童友好可视化样式
- `word-config.js`：单词和学习计划配置（可扩展）
- `app.js`：核心逻辑（出题、提示、统计、复习计划、奖励）

## 高频词配置（可扩展）

所有词汇都在 `word-config.js`，按分类组织并可随时扩展。

当前重点新增了**日期时间高频词**：
- 星期：Monday ~ Sunday
- 月份：January ~ December
- 时间词：today, tomorrow, yesterday, week, month, year

你可以直接在 `word-config.js` 里修改：
- `dailyNewWords`：每天新词数
- `dailyReviewWords`：每天复习词数
- `maxDailyWords`：每天最多学习词数
- `intervals`：艾宾浩斯复习间隔（默认 `1,2,4,7,15` 天）

## 主要交互流程（拼写）

1. 显示中文释义（例如“星期三”）
2. 孩子输入英文拼写
3. 可点击“提示一下”获取更多提示
4. 拼错后会自动给更多提示
5. 拼对后显示奖励并可进入下一个单词

## 统计与激励

- **每日统计**：完成数、正确率、新词/复习、当日得分
- **总体进度**：累计掌握词数、连续学习天数
- **激励机制**：积分 + 徽章墙

## 本地运行

```bash
cd /workspace/lele_ket
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 推送到 GitHub

```bash
cd /workspace/lele_ket
bash scripts/push_to_github.sh
```

如果提示没有 `origin`，先执行：

```bash
git remote add origin <你的仓库URL>
git push -u origin <当前分支名>
```
