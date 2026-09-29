# 版本紀錄 Changelog

格式參考 [Keep a Changelog](https://keepachangelog.com/)，版本號採用 [Semantic Versioning](https://semver.org/)。
Format based on Keep a Changelog; versions follow Semantic Versioning.

## [1.1.0] - 2026-09-29

### 新增 Added
- 截止日與「告訴 Claude」中還沒處理的留言可以在頁面直接刪除；按兩下才會刪，避免誤觸。刪除不留痕跡，並一併移除週行程裡的截止日連結。
  Deadlines and unhandled "Tell Claude" notes can be deleted on the page, with a tap-twice confirmation. Deletions leave no trace and also unlink the deadline from weekly items.
- Claude 排程時以資料庫現況為準：已刪除的截止日若已寫進日曆，下次檢查時一併清掉對應的活動與準備時段。
  Claude treats the database as the source of truth: if a deleted deadline was already on the calendar, the next check removes its events and prep blocks.
- 「本週」分頁把今天放最上面，已經過去的日子移到最下面。
  This week shows today first and moves past days to the bottom.

1.0.0 的使用者：安裝新版 skill 後，跟 Claude 說「更新我的週行程頁面」就會套用這些頁面改動。
Upgrading from 1.0.0: after installing the new skill, tell Claude "update my planner page" to get these page changes.

## [1.0.0] - 2026-09-29

第一個公開版本。First public release.

### 新增 Added
- 每週確認、週中臨時插入、「現在該做什麼」、提前完成補位、課程進度變動五種情境，加上第一次設定。
  Scenarios: weekly check-in, mid-week additions, "what should I do now", early-finish backfill, course schedule changes, plus first-time setup.
- 快速設定（4 題）與完整設定兩種流程。Quick (4 questions) and full setup.
- 週行程頁面：現在該做、本週、截止日、例行事項、課堂訊息、告訴 Claude、規則；本週與截止日打勾雙向同步。
  Planner page with Right now, This week, Deadlines, Routines, Classes, Tell Claude and Rules; ticks sync both ways between This week and Deadlines.
- 頁面中英雙語介面，依 `settings.language` 切換。English and Chinese page UI via `settings.language`.
- 依 IANA 時區計算時間，支援夏令時間。Time computed from the IANA time zone, with daylight saving support.
- Google 日曆寫入、分類顏色與提醒。Google Calendar events with category colors and reminders.
- 「改日曆前先問我」設定（`confirmBeforeCalendar`）。"Ask me before changing my calendar" setting.
- 中文版與英文版 skill、完整使用教學、範例頁面。Chinese and English editions, full guides, demo pages.
