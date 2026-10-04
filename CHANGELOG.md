# 版本紀錄 Changelog

格式參考 [Keep a Changelog](https://keepachangelog.com/)，版本號採用 [Semantic Versioning](https://semver.org/)。
Format based on Keep a Changelog; versions follow Semantic Versioning.

## [1.3.1] - 2026-10-04

### 修正 Fixed
- 「例行事項」的「下次」日期過了之後不會更新（例如每週一次的事一直顯示上週的日期）。現在每週確認時，會把所有已經過去的「下次」依規則往後推到下一次，不只有需要預約的週期事項。
  The "Next" date under Routines stayed on past dates (a weekly item kept showing last week). The weekly confirmation now moves every past "Next" date forward by its rule, not only the periodic items that need booking.

## [1.3.0] - 2026-10-04

### 新增 Added
- 「月曆」分頁：一次看五週，格子顯示每天的重點和忙碌程度，下方小標籤可以篩選類別（可複選），點一天從下面打開當天全部行程、左右滑換天。有連 Google 日曆時讀即時的日曆（連你自己建的活動也看得到），沒有就顯示頁面裡的行程。
  New Month tab: five weeks at a glance, with each day's key items and a busyness bar, category filter chips (multi-select), and a sheet with the day's full schedule that you can swipe through. It reads Google Calendar live when connected, including events you added yourself, and otherwise shows the planner's own items.
- 「今天」分頁：「現在」卡片（還剩幾分鐘、進度條）、今天進度、下一個截止日，以及今天的直線時間軸，藍線標出現在的位置。
  New Today tab: a Now card with minutes left and a progress bar, today's progress, the next deadline, and a vertical timeline with a line marking the current time.

### 變更 Changed
- 介面改成像手機 App：底部分頁列（今天、本週、月曆、截止日、更多），右下角「＋」按鈕打開「告訴 Claude」和「加截止日」。下週預覽、課堂訊息、例行事項和規則移到「更多」。
  The page now works like a phone app: a bottom tab bar (Today, Week, Month, Deadlines, More) and a "＋" button for Tell Claude and Add deadline. Next week, Classes, Routines and Rules moved under More.
- 「本週」改成上方一排日期、下方只顯示選到的那天，不用一直往下滑。
  The Week tab shows a row of dates with only the selected day below, so there's no long scroll.
- 新外觀：淡寶寶藍、柔和毛玻璃、系統字體、圓形打勾；類別改用小色點表示，通勤縮成一行小字。深色模式跟著裝置設定。
  New look: soft baby blue, light frosted glass, the system font and round checkmarks; categories are shown as small dots and commutes shrink to one line. Dark mode follows the device.

1.2.0 的使用者：安裝新版 skill 後，跟 Claude 說「更新我的週行程頁面」。有連 Google 日曆的話，第一次打開「月曆」時按允許，讓頁面讀取日曆。
Upgrading from 1.2.0: after installing the new skill, tell Claude "update my planner page". If you use Google Calendar, allow the page to read it the first time you open Month.

## [1.2.0] - 2026-10-04

### 新增 Added
- 頁面新增「下週」分頁：重點摘要（上課堂數、閱讀與專注時數、最滿的一天、每天量的小長條圖、要記得的事、上課進度），每天收合成一行，點開看細節。
  New Next week tab: a summary (classes, reading and focus hours, busiest day, hours-per-day chart, things not to forget, class topics), with each day collapsed to one line.
- 「全學期進度」改成三欄：日期、預定進度、實際進度。告訴 Claude 某堂課實際上了什麼，就會記在實際進度欄。
  The full course schedule now has three columns: date, planned topic, and what was actually covered, filled in when you tell Claude.
- 新設定 `weeklyAutoSync`：每週行程排好就直接寫進日曆，不用等確認（預設關閉）。
  New `weeklyAutoSync` setting writes the weekly plan straight to the calendar without waiting for confirmation (off by default).
- 打勾一律同步到日曆：打勾的項目在日曆加「✅」並取消提醒，取消打勾就拿掉。
  Every tick syncs to the calendar: ticked items get ✅ and lose their reminders; unticking reverses it.

### 變更 Changed
- 回答任何行程問題前，Claude 會先讀頁面最新的資料，包括「告訴 Claude」裡的所有留言。
  Before answering any schedule question, Claude reads the page's latest data, including every Tell Claude note.
- 已預約、時間確定的事，即使那一週還沒排，也會直接寫進日曆。
  Bookings with a fixed time go straight onto the calendar even if that week isn't planned yet.

1.1.0 的使用者：安裝新版 skill 後，跟 Claude 說「更新我的週行程頁面」就會加上「下週」分頁與實際進度欄；排程任務的提示詞也請 Claude 依新版 `references/scheduled-tasks.md` 更新。
Upgrading from 1.1.0: after installing the new skill, tell Claude "update my planner page" to get the Next week tab and the new column, and ask Claude to update your scheduled tasks from the new `references/scheduled-tasks.md`.

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
